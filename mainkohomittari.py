
import machine
import time

pot = machine.ADC(26)

while True:
    potValue = pot.read_u16()
    if potValue <= 29000:
        print('Ämpäri täysi.')
    elif 29001 < potValue < 40000:
        print('Ämpäri on täyttymässä.')
    elif potValue > 40001:
        print('Ämpäri on tyhjä.')
    time.sleep(0.5)
