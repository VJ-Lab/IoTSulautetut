import network
import utime
import machine
import urequests
import json

SSID = 'sipilanmaeki_mesh'
PASSWORD = 'tessaelisabet21'
switch = machine.Pin(14, machine.Pin.IN, machine.Pin.PULL_DOWN)
led = machine.Pin(16, machine.Pin.OUT)

def connect_to_wifi():
    wlan = network.WLAN(network.STA_IF)
    wlan.active(True)
    wlan.connect(SSID, PASSWORD)

    while not wlan.isconnected():
        print("Yhdistetään...")
        utime.sleep(1)

    print("Yhdistetty verkkoon", wlan.ifconfig())

connect_to_wifi()

def floating_duck():
    pot = machine.ADC(26)
    potValue = pot.read_u16()
    full_bucket = 32450
    empty_bucket = 48600
    bucket_status = (empty_bucket - potValue) / (empty_bucket - full_bucket) * 10
    liters = round(bucket_status, 1)
    return liters

while True:
    try:
        water_in_bucket = floating_duck()
        print(water_in_bucket)
        url = 'https://kohoankka2.azurewebsites.net/post_litrat'
        headers = {'Content-Type': 'application/json'}
        data = {
             "Litra": water_in_bucket
        }
        response = urequests.post(url, headers=headers, data=json.dumps(data))
        response.close()
        if switch.value() or water_in_bucket >= float(9.9):
                led.value(True)
                print("Ämpäri täysi!")
        else:
                led.value(False)
    except Exception as e:
        print("Error:", e)

