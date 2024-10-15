import machine
import time
import urequests

sensor = machine.ADC(26)
fixed_resistance = 5110 #OHM
voltage_inn = 3.3
meter_wire = #metrin resistanssi


def prox_sensor():
    sensorValue = sensor.read_u16() 
    voltage_out = (sensorValue / 65535) * voltage_inn
    resistance = fixed_resistance * (voltage_inn / voltage_out - 1)
    return resistance

while True:
    try:
        wire_resistance = prox_sensor()
        distance = wire_resistance / meter_wire
        dist_cent = distance * 100
        print('distance is', distance, 'centimeters')
        #thingspeak_http = f'https://api.thingspeak.com/update?api_key=TÄHÄN APIKEY JA OIKEA FIELD&field1={dist}'
        #response = urequests.get(thingspeak_http)
        #response.close()
        time.sleep(1)
    except Exception as e:
        print("Error:", e)
