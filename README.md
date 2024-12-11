# Kohomittari

Rakennetaan kodin tarvikkeista kohomittari joka kertoo veden määrän 10 L ämpärissä.​

Potentiometrin arvot muutetaan litroiksi

### Nopea kuva Versio 1 kytkennästä:

![potentiometerkoho](https://github.com/user-attachments/assets/6647c384-5240-4866-985d-0af7fd529971)

### Nopea kuva Versio 2 kytkennästä:

![Jokin2_bb](https://github.com/user-attachments/assets/4d209aef-99ec-482c-a97b-7a1e286db01e)

### Nopea kuva Versio 3 kytkennästä:

![Jokin3_bb](https://github.com/user-attachments/assets/bb32ab23-70f7-4447-9211-f9e03c79c12f)

Potentiometriin rakennettiin vipu jonka toisessa päässä on kelluva kumiankka ja toisessa päässä vastapaino jotta naru jolla kumiankka on kiinnitetty, pysyy kireänä.

![vipu](https://github.com/user-attachments/assets/36abab1d-e377-4863-95e4-d5990e74cc51)

![kuva](https://github.com/user-attachments/assets/4ed3ae08-a868-407a-89be-3a3e3ec0125f)

### Kuva kokonaisuudesta:

![kuvakohoankkakokonaisuus](https://github.com/user-attachments/assets/f4612aba-3709-4098-b84d-447e66007b25)

Linkki videoesitykseen

Versio 1

https://www.youtube.com/watch?v=R_TpAHw-vdo

Versio 2

https://www.youtube.com/watch?v=YFwMKVr-zrs

Versio 3 ei löydy kuin demo video

https://youtu.be/qWaQ7QKZF84

### Asennusohjeet:
1. Tee kytkennät kuvan pohjalta
2. Askartele vipu ja kiinnitä se potentiometriin.
3. Lataa ja muokkaa koodia. Erityisesti joudut vaihtamaan mihin tukiasemaan se ottaa yhteyttä laitekoodista. Tarvitset myös tietokannan ja joudut muokkaamaan minne API koodi ottaa yhteyttä, jotta voit tehdä haut ja lähettää tietoa oikein.
4. Lisää main.py Raspberry pi pico W:hen.
5. Jos olet tehnyt oikeat muokkaukset ja annat pi pico W:lle virtaan, laitteen pitäisi toimia oikein.
6. Frontend koodi on tehty hakemaan esimerkin API:lta ja tietokannasta, joten näitä pitää muokata oman käyttötarkoituksen perusteella.

### Huomioitavaa/Virhearviot:​

Potentiometri hyvin herkkä, vaikea löytää tasaista "nolla-arvoa".  Joka kerta kun ämpäri tyhjeni, täytyi nolla-arvo asettaa koodiin uudestaan. Tämä johtui siitä, että kumiankkaa roikkuu narun päässä ja asettuu joka kerta eri tavalla ämpärin pohjalle.​

Arvo heittelee 0.1-0.3.​

LEDin syttyy/sammuu viiveellä, johtuen responsen odottelusta APIlta.​ Viive 1-2sek.​

Potentiometriä tuettiin jatkokehittelyssä, koska se heilui kytkentälevyssä. Kolvaus piirilevyyn olisi ollut paras vaihtoehto.​

VSCode ja Git yhteistyö oli jokseenkin haastavaa. Workflow tuomintaan laittaminen muuttui hankalaksi, sillä Git repo ja Azure mihin kaikki oltiin tallennettu oli eri henkilöiden nimen alle tehty. Tämän takia tällä hetkellä on 2 versiota samasta frontendistä käynnissä.

Databasen aikamääre aiheutti enemmän haasteita kun hyötyä. Sen muokkaaminen vertailtavaan muotoon oli työn takana.
