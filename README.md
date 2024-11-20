# Kohomittari

Rakennetaan kodin tarvikkeista kohomittari joka kertoo veden määrän 10 L ämpärissä.​

Potentiometrin arvot muutetaan litroiksi

### Nopea kuva kytkennästä:

![potentiometerkoho](https://github.com/user-attachments/assets/6647c384-5240-4866-985d-0af7fd529971)

Potentiometriin rakennettiin vipu jonka toisessa päässä on kelluva kumiankka ja toisessa päässä vastapaino jotta naru jolla kumiankka on kiinnitetty, pysyy kireänä.

![vipu](https://github.com/user-attachments/assets/36abab1d-e377-4863-95e4-d5990e74cc51)

![kuva](https://github.com/user-attachments/assets/4ed3ae08-a868-407a-89be-3a3e3ec0125f)

Linkki videoesitykseen

https://www.youtube.com/watch?v=R_TpAHw-vdo

### Asennusohjeet:
1. Tee kytkennät kuvan pohjalta
2. Askartele vipu ja kiinnitä se potentiometriin.
3. Lataa ja muokkaa koodia. Erityisesti joudut vaihtamaan mihin tukiasemaan se ottaa yhteyttä laitekoodista. Tarvitset myös databasen ja joudut muokkaamaan minne API koodi ottaa yhteyttä, jotta voit tehdä haut ja lähettää tietoa oikein.
4. Lisää main.py Raspberry pi pico W:hen.
5. Jos olet tehnyt oikeat muokkaukset ja annat pi pico W:lle virtaan, laitteen pitäisi toimia oikein.
6. Frontend koodi on tehty hakemaan esimerkin API:lta ja databasesta, joten näitä pitää muokata oman käyttötarkoituksen perusteella.

### Huomioitavaa/Virhearviot:​

Potentiometri hyvin herkkä, vaikea löytää tasaista "nolla-arvoa".  Joka kerta kun ämpäri tyhjeni, täytyi nolla-arvo asettaa koodiin uudestaan. Tämä johtui siitä, että kumiankkaa roikkuu narun päässä ja asettuu joka kerta eri tavalla ämpärin pohjalle.​

Arvo heittelee 0.1-0.3.​

LEDin syttyy/sammuu viiveellä, johtuen responsen odottelusta APIlta. 1-2sek.​

Potentiometriä tuettiin jatkokehittelyssä, koska se heilui kytkentälevyssä. Kolvaus piirilevyyn olisi ollut paras vaihtoehto.
