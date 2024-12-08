import network
import utime
import machine
import urequests
import json
import onewire
import ds18x20
import uasyncio as asyncio

SSID = 'sipilanmaeki_mesh'
PASSWORD = 'tessaelisabet21'
switch = machine.Pin(14, machine.Pin.IN, machine.Pin.PULL_DOWN)
led = machine.Pin(16, machine.Pin.OUT)
temp_pin = machine.Pin(15)
temp_sensor = ds18x20.DS18X20(onewire.OneWire(temp_pin))
max_liters = 9.9

def connect_to_wifi():
    wlan = network.WLAN(network.STA_IF)
    wlan.active(True)
    wlan.connect(SSID, PASSWORD)

    while not wlan.isconnected():
        print("Yhdistetään...")
        utime.sleep(1)
    addr = wlan.ifconfig()[0]
    print("Yhdistetty verkkoon, IP-osoite:", addr)

async def floating_duck():
    global max_liters
    while True:
        pot = machine.ADC(26)
        potValue = pot.read_u16()
        full_bucket = 32450
        empty_bucket = 48600
        bucket_status = (empty_bucket - potValue) / (empty_bucket - full_bucket) * 10
        liters = round(bucket_status, 1)

        print(f"Ämpäri: {liters} litraa")

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

async def measure_temperature():
    global roms
    while True:
        temp_sensor.convert_temp()
        await asyncio.sleep(1)
        for rom in roms:
            temp = float(temp_sensor.read_temp(rom))
            print(f"Lämpötila: {temp} °C")
            url = 'https://kohoankka2.azurewebsites.net/post_temp'
            headers = {'Content-Type': 'application/json'}
            data = {
                "temperature": temp
            }
            try:
                response = urequests.post(url, headers=headers, data=json.dumps(data))
                response.close()
            except Exception as e:
                print("Virhe, ei voitu lähettää lämpötilaa:", e)

        await asyncio.sleep(4)

async def update_max_liters():
    global max_liters
    while True:
        url = 'https://kohoankka2.azurewebsites.net/get_max'
        try:
            response = urequests.get(url)
            if response.status_code == 200:
                data = response.json()
                new_max_liters = data.get("maxLiters")
                if new_max_liters is not None and new_max_liters != max_liters:
                    print(f"max_liters päivitetty: {new_max_liters}")
                    max_liters = new_max_liters
            else:
                print("Virhe get_max-kutsussa:", response.status_code)
        except Exception as e:
            print("Virhe haettaessa max_liters-arvoa:", e)

        await asyncio.sleep(5)

async def main():
    connect_to_wifi()
    global roms
    roms = temp_sensor.scan()
    if len(roms) == 0:
        print("Virhe: DS18B20-anturia ei löydy!")
        return

    await asyncio.gather(
        floating_duck(),
        measure_temperature(),
        update_max_liters()
    )
    
asyncio.run(main())