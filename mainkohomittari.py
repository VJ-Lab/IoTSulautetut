import machine
import time

pot = machine.ADC(26)

while True:
    potValue = pot.read_u16()
    if potValue < 32000:
        print('Ämpäri täysi.')
    elif 30001 < potValue < 49000:
        print('Ämpäri on täyttymässä.')
    else:
        print('Ämpäri on tyhjä.')
    time.sleep(0.5)
