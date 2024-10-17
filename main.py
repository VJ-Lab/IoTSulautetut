import network
import time
import machine
import urequests

SSID = 'sipilanmaeki_mesh_Wi-Fi5'
PASSWORD = 'xxxx'

def connect_to_wifi():
    wlan = network.WLAN(network.STA_IF)
    wlan.active(True)
    wlan.connect(SSID, PASSWORD)
    
    while not wlan.isconnected():
        print("Connecting...")
        time.sleep(1)

    print("Connected", wlan.ifconfig())

connect_to_wifi()

def floating_duck():
    pot = machine.ADC(26)
    potValue = pot.read_u16()
    full_bucket = 32000
    empty_bucket = 50800
    bucket_status = (empty_bucket - potValue) / (empty_bucket - full_bucket) * 10
    liters = round(bucket_status, 1)
    return liters

while True:
    try:
        water_in_bucket = floating_duck()
        thingspeak_http = f'https://api.thingspeak.com/update?api_key=MAK29ZJ63741FKRP&field1={water_in_bucket}'
        print(water_in_bucket)
        response = urequests.get(thingspeak_http)
        response.close()
        time.sleep(1)
    except Exception as e:
        print("Error:", e)
