import network
import utime
import machine
import urequests
import json
import onewire
import ds18x20
import uasyncio as asyncio

SSID = 'xx'
PASSWORD = 'xx'
switch = machine.Pin(14, machine.Pin.IN, machine.Pin.PULL_DOWN)
led = machine.Pin(16, machine.Pin.OUT)
temp_pin = machine.Pin(15)
temp_sensor = ds18x20.DS18X20(onewire.OneWire(temp_pin))
max_liters = 9.9
PORT = 8080


def connect_to_wifi():
    global addr
    wlan = network.WLAN(network.STA_IF)
    wlan.active(True)
    wlan.connect(SSID, PASSWORD)

    while not wlan.isconnected():
        print("Yhdistetään...")
        utime.sleep(1)
    addr = wlan.ifconfig()[0]
    print("Yhdistetty verkkoon", addr)
    return addr

async def handle_client(reader, writer):
    global max_liters
    try:
        request = await reader.read(1024)
        print(f"Request: {request.decode('utf-8')}")  
        headers = "HTTP/1.1 200 OK\r\nContent-Type: application/json\r\n"
        headers += "Access-Control-Allow-Origin: *\r\n"
        headers += "Access-Control-Allow-Methods: GET, POST\r\n"
        headers += "Access-Control-Allow-Headers: Content-Type\r\n\r\n"

        if b"GET /temp" in request:
            try:
                temp_sensor.convert_temp()
                await asyncio.sleep(1)
                temp = temp_sensor.read_temp(roms[0])
                print(f"Lämpötila: {temp:.2f} °C")
                response = headers + f'{{"temperature": {temp:.2f}}}'
            except Exception as e:
                print(f"Lämpötilan luvussa virhe: {e}")
                response = headers + '{"error": "Lämpötilan luvussa virhe"}'

        elif b"POST /set-liters" in request:
            try:
                body = request.split(b"\r\n\r\n")[1]
                data = json.loads(body.decode("utf-8"))
                await asyncio.sleep(1)
                max_liters = float(data.get("liters", max_liters))
                print(f"Kynnysarvo päivitetty: {max_liters} litraa")
                response = headers + '{"message": "Litramäärä päivitetty"}'
            except Exception as e:
                print(f"Litramäärän päivityksessä virhe: {e}")
                response = headers + '{"error": "Virhe datan käsittelyssä"}'

        else:
            response = headers + '{"error": "Väärä request"}'

        await writer.awrite(response)
    except Exception as e:
        print(f"Virhe käsittelyssä: {e}")
    finally:
        await writer.aclose()

async def web_server(addr):
    global PORT
    server = await asyncio.start_server(handle_client, addr, PORT)
    print(f"Serveri pyörii osoitteessa http://{addr}:{PORT}")
    await server.wait_closed()

async def floating_duck():
    while True:
        pot = machine.ADC(26)
        potValue = pot.read_u16()
        full_bucket = 32450
        empty_bucket = 48600
        bucket_status = (empty_bucket - potValue) / (empty_bucket - full_bucket) * 10
        liters = round(bucket_status, 1)

        print(f"Ämpäri: {liters} litraa")
        global max_liters

        if switch.value() or liters >= max_liters:
            led.value(True)
            print("Ämpäri täysi!")
        else:
            led.value(False)

        url = 'https://kohoankka2.azurewebsites.net/post_litrat'
        headers = {'Content-Type': 'application/json'}
        data = {
            "Litra": liters
        }
        try:
            response = urequests.post(url, headers=headers, data=json.dumps(data))
            response.close()
        except Exception as e:
            print("Virhe, ei voitu lähettää dataa:", e)

        await asyncio.sleep(1)

async def main():
    ip_address = connect_to_wifi()
    global roms
    global addr
    roms = temp_sensor.scan()
    if len(roms) == 0:
        print("Virhe: DS18B20-anturia ei löydy!")
        return
    addr = str(ip_address)
    asyncio.create_task(web_server(addr))
    await floating_duck()

asyncio.run(main())
