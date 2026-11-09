const fs = require('fs');
const path = require('path');
const { createCanvas } = require('canvas');

const rawProducts = [
  { name: "Qadamli motor NEMA 17", price: 80000, category: "motors", desc: "3D-printer va CNC uskunalar uchun NEMA 17 qadamli (stepper) motor, 1.7A." },
  { name: "Servo motor TowerPro MG90S", price: 27000, category: "motors", desc: "Metal tishli servo motor TowerPro MG90S. Aylanish burchagi 180 daraja." },
  { name: "Servo motor MG996R", price: 45000, category: "motors", desc: "Metal tishli baquvvat servo motor MG996R, 2 ta podshipnikli." },
  { name: "Servo motor TowerPro SG90", price: 19000, category: "motors", desc: "Mini servo motor SG90. Aylanish burchagi 180 daraja." },
  { name: "DC motor Sumo Robot 12V/24V", price: 78000, category: "motors", desc: "Sumo robotlar uchun maxsus metal reduktorli DC motor." },
  { name: "Motor Arduino 3-8V", price: 10000, category: "motors", desc: "Arduino loyihalari uchun reduktorli motor. 180 aylanish/daq." },
  { name: "L shaklidagi Motor 3-8V", price: 11000, category: "motors", desc: "Arduino uchun G/L shaklidagi reduktorli motor." },
  { name: "Motor g'ildiragi", price: 8000, category: "accessories", desc: "Reduktorli motorlar uchun rezina g'ildirak (ballon)." },
  { name: "Metal reduktorli motor", price: 35000, category: "motors", desc: "Yuqori sifatli metal reduktorli motor." },
  { name: "IR Chiziq sensori", price: 10000, category: "sensors", desc: "Qora chiziqni kuzatuvchi infraqizil (IR) sensor." },
  { name: "Qadamli motor 28BYJ-48", price: 20000, category: "motors", desc: "ULN2003 drayveri bilan birga 4-fazali qadamli motor 5V." },
  { name: "XL4016 DC-DC step-down", price: 45000, category: "modules", desc: "DC-DC kuchlanishni tushiruvchi modul. 8A, kirish 4-38V, chiqish 1.25-36V." },
  { name: "L298N Motor drayver", price: 24000, category: "motors", desc: "Arduino uchun qadamli va DC motor drayveri L298N." },
  { name: "PIR Harakat sensori HC-SR501", price: 15000, category: "sensors", desc: "Infraqizil harakat sensori (0-7m, 110 daraja)." },
  { name: "Maket platasi SYB-170", price: 5000, category: "accessories", desc: "Arduino uchun 170 nuqtali oq maket platasi (Breadboard)." },
  { name: "Maket platasi 400", price: 8000, category: "accessories", desc: "400 nuqtali maket platasi (Breadboard)." },
  { name: "Maket platasi 800", price: 16000, category: "accessories", desc: "800 nuqtali katta maket platasi (Breadboard)." },
  { name: "Motor shield L293D", price: 27000, category: "motors", desc: "Arduino uchun 4 ta DC yoki 2 ta qadamli motor boshqaruvchi shield." },
  { name: "HC-SR04 Ultratovush sensori", price: 15000, category: "sensors", desc: "Masofani o'lchovchi ultratovush sensori (2-400 sm)." },
  { name: "Bluetooth HC-05/06", price: 50000, category: "modules", desc: "Arduino uchun Bluetooth moduli." },
  { name: "Rele 5V", price: 5000, category: "modules", desc: "5V bitta kanalli rele moduli." },
  { name: "ESP32-CAM moduli", price: 110000, category: "arduino", desc: "OV2640 kamerali Wi-Fi va Bluetooth ESP32 platasi." },
  { name: "VL53L0X Lazer datchik", price: 43000, category: "sensors", desc: "ToF texnologiyali lazer masofa o'lchash sensori." },
  { name: "Sharp 2Y0A21 IR sensor", price: 45000, category: "sensors", desc: "Infraqizil nurlar yordamida masofani aniq o'lchovchi sensor." },
  { name: "LCD shield module v arduino", price: 15000, category: "modules", desc: "Arduino uchun LCD shield moduli." },
  { name: "RFID moduli RC522", price: 28000, category: "modules", desc: "RFID kartalarni o'qish va yozish moduli." },
  { name: "W1209 Termostat 12V", price: 35000, category: "modules", desc: "Haroratni nazorat qiluvchi raqamli termostat." },
  { name: "TCRT5000 5-kanalli sensor", price: 34000, category: "sensors", desc: "Chiziqni kuzatish uchun 5 kanalli infraqizil modul." },
  { name: "Suv sensori (Water sensor)", price: 8000, category: "sensors", desc: "Suv sathini o'lchovchi sensor." },
  { name: "Faol Buzzer (Active)", price: 3000, category: "modules", desc: "Arduino uchun 5V faol ovoz chiqaruvchi modul." },
  { name: "Sust Buzzer (Passive)", price: 3000, category: "modules", desc: "Arduino uchun 5V passiv ovoz chiqaruvchi modul." },
  { name: "Svetodiodlar to'plami 5mm", price: 300, category: "accessories", desc: "5mm qizil, ko'k, oq, yashil, sariq svetodiodlar (10 dona)." },
  { name: "Maket platasi HC-02", price: 7000, category: "accessories", desc: "Kavsharlash uchun teshikli maket platasi HC-02." },
  { name: "Maket platasi HC-03", price: 4500, category: "accessories", desc: "Kavsharlash uchun teshikli maket platasi HC-03." },
  { name: "Joystik moduli", price: 12000, category: "modules", desc: "Arduino uchun 2 o'qli joystik moduli." },
  { name: "Klaviatura 4x4 (Matritsali)", price: 15000, category: "modules", desc: "Arduino uchun 16 tugmali membrana klaviatura." },
  { name: "Mini MP3 Player DF", price: 21000, category: "modules", desc: "SD kartadan ovoz fayllarini o'qib beruvchi MP3 modul." },
  { name: "DS3231 RTC moduli", price: 18000, category: "modules", desc: "Haqiqiy vaqtni ko'rsatuvchi (RTC) soat moduli." },
  { name: "ESP8266 UART-WiFi", price: 23000, category: "arduino", desc: "Internet of Things loyihalari uchun ESP8266 Wi-Fi ko'prigi." },
  { name: "Wi-Fi modul ESP8266", price: 24000, category: "arduino", desc: "Asosiy Wi-Fi modul ESP8266." },
  { name: "Arduino Uno (DIP)", price: 65000, category: "arduino", desc: "DIP korpusli standart Arduino Uno R3 platasi." },
  { name: "Arduino Uno", price: 55000, category: "arduino", desc: "SMD korpusli Arduino Uno platasi." },
  { name: "Arduino Mega 2560", price: 120000, category: "arduino", desc: "Ko'p pinli yirik loyihalar uchun Arduino Mega platasi." },
  { name: "Arduino Lilypad", price: 45000, category: "arduino", desc: "Kiyimga tikiladigan Arduino Lilypad platasi." },
  { name: "Arduino Nano", price: 45000, category: "arduino", desc: "Kompakt o'lchamdagi Arduino Nano platasi." },
  { name: "Arduino Mini", price: 35000, category: "arduino", desc: "Kichik va ixcham Arduino Mini platasi." },
  { name: "Arduino Leonardo", price: 70000, category: "arduino", desc: "USB qurilma (sichqoncha, klaviatura) bo'la oladigan Arduino platasi." },
  { name: "Raspberry Pi 3 Model B", price: 650000, category: "arduino", desc: "Mikrokompyuter Raspberry Pi 3 Model B." },
  { name: "LCD 1602 Displey (Ko'k/Yashil)", price: 20000, category: "modules", desc: "16x2 matnli LCD displey moduli." },
  { name: "LCD 1602 Tugmali", price: 27000, category: "modules", desc: "Boshqaruv tugmalari bor LCD 1602 displey shield'i." },
  { name: "MQ-2 Gaz sensori", price: 23000, category: "sensors", desc: "Tutun va yonuvchi gazlarni (metan, propan) aniqlovchi datchik." },
  { name: "MQ-3 Spirt sensori", price: 23000, category: "sensors", desc: "Havo tarkibidagi alkogol bug'larini aniqlovchi datchik." },
  { name: "MQ-4 Metan sensori", price: 23000, category: "sensors", desc: "Tabiiy gaz va metan uchun yuqori sezgirlikdagi datchik." },
  { name: "MQ-5 Gaz sensori", price: 23000, category: "sensors", desc: "Suyultirilgan gazlarni aniqlovchi MQ-5 datchigi." },
  { name: "MQ-7 Is gazi sensori", price: 23000, category: "sensors", desc: "Is gazi (CO) ni aniqlovchi datchik." },
  { name: "MQ-135 Havo sifati sensori", price: 23000, category: "sensors", desc: "Havodagi zararli gazlar (ammiak, benzol, tutun) ni aniqlovchi datchik." },
  { name: "Jumper Simlar Erkak-Erkak (40 dona)", price: 12000, category: "cables", desc: "20 sm uzunlikdagi erkak-erkak (Papa-Papa) ulovchi simlar (40 ta)." },
  { name: "Jumper Simlar Erkak-Urg'ochi (40 dona)", price: 12000, category: "cables", desc: "20 sm uzunlikdagi erkak-urg'ochi (Papa-Mama) ulovchi simlar." },
  { name: "Jumper Simlar Urg'ochi-Urg'ochi (40 dona)", price: 12000, category: "cables", desc: "20 sm uzunlikdagi urg'ochi-urg'ochi (Mama-Mama) ulovchi simlar." },
  { name: "Jumper Simlar Erkak-Erkak 10sm", price: 12000, category: "cables", desc: "10 sm uzunlikdagi qisqa erkak-erkak ulovchi simlar." },
  { name: "Jumper Simlar Erkak-Urg'ochi 10sm", price: 12000, category: "cables", desc: "10 sm uzunlikdagi qisqa erkak-urg'ochi ulovchi simlar." },
  { name: "Jumper Simlar Urg'ochi-Urg'ochi 10sm", price: 12000, category: "cables", desc: "10 sm uzunlikdagi qisqa urg'ochi-urg'ochi ulovchi simlar." },
  { name: "SIM800L GSM Moduli", price: 70000, category: "modules", desc: "Arduino bilan uyali aloqa (SMS/Qo'ng'iroq) uchun GSM modul." },
  { name: "SIM900A GSM/GPRS Moduli", price: 110000, category: "modules", desc: "Keng imkoniyatli UART SIM900A GSM/GPRS moduli." },
  { name: "Infraqizil Pult", price: 5000, category: "modules", desc: "IR qabul qiluvchiga ega Arduino uchun pult." },
  { name: "Sharikli g'ildirak", price: 6000, category: "accessories", desc: "Robotlar uchun 360 daraja aylanadigan sharikli g'ildirak." },
  { name: "TCS230(3200) Rang sensori", price: 60000, category: "sensors", desc: "Ranglarni farqlovchi optik datchik moduli." },
  { name: "Potensiometr (Mono)", price: 3000, category: "modules", desc: "Buraluvchan rezistor (5k, 10k yoki 15k Om)." },
  { name: "Potensiometr (Stereo)", price: 3000, category: "modules", desc: "Stereo buraluvchan rezistor (5k, 10k, 15k Om)." },
  { name: "Rele 1-Kanalli 5V", price: 9000, category: "modules", desc: "Arduino uchun 1-kanalli rele moduli." },
  { name: "Rele 2-Kanalli 5V", price: 17000, category: "modules", desc: "Arduino uchun 2-kanalli rele moduli." },
  { name: "Rele 3-Kanalli 5V", price: 35000, category: "modules", desc: "Arduino uchun 3 yoki 4-kanalli rele moduli." },
  { name: "1-xonalik 7-segment displey", price: 4500, category: "modules", desc: "Raqamlarni ko'rsatish uchun 1 xonali displey." },
  { name: "2-xonalik 7-segment displey", price: 5000, category: "modules", desc: "Raqamlarni ko'rsatish uchun 2 xonali displey." },
  { name: "3-xonalik 7-segment displey", price: 6000, category: "modules", desc: "Raqamlarni ko'rsatish uchun 3 xonali displey." },
  { name: "4-xonalik 7-segment displey", price: 8000, category: "modules", desc: "Raqamlarni ko'rsatish uchun 4 xonali displey." },
  { name: "MAX7219 LED Matritsa", price: 27000, category: "modules", desc: "Arduino uchun 8x8 nuqtali LED matritsa moduli." },
  { name: "Ovoz sensori", price: 15000, category: "sensors", desc: "Ovoz va shovqin darajasini aniqlovchi datchik." },
  { name: "NRF24L01+PA+LNA Radio modul", price: 32000, category: "modules", desc: "2.4GHz da 1100 metrgacha ishlovchi simsiz radio modul." },
  { name: "USB TTL Programmatr", price: 25000, category: "tools", desc: "UART/TTL orqali qurilmalarni dasturlash uchun USB modul." },
  { name: "Kavsharlagich (Payalnik)", price: 55000, category: "tools", desc: "Elektronika ishlari uchun standart kavsharlagich." },
  { name: "Li-Ion Zaryadnik 3.7V", price: 30000, category: "power", desc: "18650 akkumulyatorlari uchun maxsus zaryadlash qurilmasi." },
  { name: "Power Bank Modul", price: 40000, category: "power", desc: "Tashqi quvvat manbai modul qismi." },
  { name: "Klemmnik", price: 2500, category: "accessories", desc: "Simlarni ulash uchun vinta klemmnik blok." },
  { name: "L1117 Stabilizator", price: 1500, category: "modules", desc: "Voltaj regulyatori mikrosxemasi." },
  { name: "Barmoq izi sensori", price: 270000, category: "sensors", desc: "Biometrik xavfsizlik uchun barmoq izini aniqlovchi modul." },
  { name: "Metal reduktorli g'ildirak moduli", price: 52000, category: "motors", desc: "G'ildirak va metal reduktorli motor to'plami." },
  { name: "Suv sathi sensori", price: 10000, category: "sensors", desc: "Suv miqdori va yog'ingarchilikni aniqlovchi oddiy sensor." },
  { name: "Yurak urish (Puls) sensori", price: 17000, category: "sensors", desc: "Yurak pulsini o'lchovchi Arduino datchigi." },
  { name: "Tugma (Button)", price: 300, category: "modules", desc: "Kichik takt tugmachasi." },
  { name: "Tugma (Katta)", price: 800, category: "modules", desc: "Yirikroq takt tugmachasi." },
  { name: "Raspberry Pi korpusi", price: 22000, category: "accessories", desc: "Raspberry Pi platasini himoya qiluvchi korpus." },
  { name: "Arduino Uno korpusi", price: 15000, category: "accessories", desc: "Arduino Uno platasini himoya qiluvchi shaffof korpus." },
  { name: "Arduino Mega korpusi", price: 17000, category: "accessories", desc: "Arduino Mega uchun himoya korpusi." },
  { name: "Kavsharlagich uchlari (Nasatka)", price: 7000, category: "tools", desc: "Payalnik uchun almashtiriladigan turli uchlar to'plami." },
  { name: "Kavsharlagich podstavkasi", price: 8000, category: "tools", desc: "Payalnikni qo'yish uchun prujinali podstavka." },
  { name: "Tekstolit (Mis qoplamali plata)", price: 30000, category: "accessories", desc: "O'z platangizni tayyorlash uchun mis qoplamali tekstolit." },
  { name: "Fomiks A4", price: 6000, category: "accessories", desc: "Loyiha maketlarini yasash uchun yumshoq fomiks qog'ozi." },
  { name: "Svetodiodlar (Har xil) 5mm", price: 200, category: "accessories", desc: "Har xil rangli LED svetodiodlar." },
  { name: "RGB Svetodiod 5mm", price: 3000, category: "accessories", desc: "Uch xil (Qizil, Yashil, Ko'k) rangda yonuvchi LED." },
  { name: "IR Svetodiod", price: 2000, category: "accessories", desc: "Infraqizil nurlatuvchi diod." },
  { name: "IR Qabul qilgich", price: 3000, category: "accessories", desc: "Infraqizil nurni qabul qiluvchi sensor." },
  { name: "Fotorezistor", price: 3000, category: "sensors", desc: "Yorug'lik darajasiga qarab qarshiligini o'zgartiruvchi datchik." },
  { name: "Kvars 16MHz", price: 2000, category: "accessories", desc: "Mikrokontrollerlar uchun 16MHz kvars rezonatori." },
  { name: "Rezistorlar", price: 200, category: "accessories", desc: "Har xil qarshilikdagi rezistorlar." },
  { name: "Pin headerlar (Taroq)", price: 2000, category: "cables", desc: "Arduino va modullar uchun erkak va urg'ochi taroq pinlar." },
  { name: "USB kabel (Arduino Uno)", price: 5000, category: "cables", desc: "Arduino Uno platasini kompyuterga ulash uchun kabel." },
  { name: "USB kabel (Arduino Nano)", price: 5000, category: "cables", desc: "Arduino Nano uchun Mini-USB/Micro-USB kabel." },
  { name: "USB kabel (Arduino Mini)", price: 5000, category: "cables", desc: "Mikrokontrollerlar uchun USB kabel." },
  { name: "USB uzaytirgich (Papa-Mama)", price: 7000, category: "cables", desc: "USB ulanish masofasini uzaytirish uchun kabel." },
  { name: "Qalay (Olovo)", price: 4000, category: "tools", desc: "Kavsharlash uchun qalay o'rami." },
  { name: "Qalay (1 metr)", price: 3000, category: "tools", desc: "1 metr uzunlikdagi qalay." },
  { name: "Kanifol (Flux)", price: 3000, category: "tools", desc: "Sifatli kavsharlash uchun kanifol yordamchisi." },
  { name: "Kavsharlagich (Pro)", price: 45000, category: "tools", desc: "Sifatli va qizish harorati baland kavsharlagich." },
  { name: "To'pponchasimon Kavsharlagich", price: 60000, category: "tools", desc: "Pistolet shaklidagi qulay kavsharlagich." },
  { name: "Quvvat bloki 5V/12V", price: 25000, category: "power", desc: "Qurilmalarni tok bilan ta'minlovchi adapter blok." },
  { name: "Impulsli Quvvat bloki", price: 100000, category: "power", desc: "Sanoat tipidagi yuqori tokli impulsli quvvat manbai." },
  { name: "Multimetr", price: 40000, category: "tools", desc: "Tok kuchlanishi, qarshilik o'lchovchi tester." },
  { name: "Multimetr (Kichik)", price: 35000, category: "tools", desc: "Kompakt o'lchamdagi raqamli multimetr tester." },
  { name: "Teshikli plata", price: 7000, category: "accessories", desc: "Katta o'lchamdagi teshikli tekstolit plata." },
  { name: "Teshikli plata (Kichik)", price: 4500, category: "accessories", desc: "Kichikroq o'lchamdagi teshikli plata." },
  { name: "DVD Motor", price: 5000, category: "motors", desc: "DVD disklarni aylantiruvchi kichik motor." },
  { name: "Arduino shtekeri", price: 3000, category: "cables", desc: "Arduino'ni batareyaga yoki blokpitaniyaga ulash uchligi." },
  { name: "Krona batareya shtekeri", price: 3000, category: "cables", desc: "9V Krona batareyalar uchun ulovchi klemmali sim." },
  { name: "Batareya qutisi (3x AA)", price: 4000, category: "power", desc: "Uchta barmoqcha (AA) batareya joylashtirish qutisi." },
  { name: "Batareya qutisi (2x 18650)", price: 3000, category: "power", desc: "Ikkita 18650 akkumulyator uchun quti." },
  { name: "Batareya qutisi (3x 18650)", price: 6000, category: "power", desc: "Uchta 18650 akkumulyator uchun quti." },
  { name: "Batareya qutisi (1x 18650)", price: 2000, category: "power", desc: "Bitta 18650 akkumulyator uchun quti." },
  { name: "Akfix Yelim", price: 35000, category: "tools", desc: "Robot qismlarini mustahkam yopishtirish uchun Akfix yelimi." },
  { name: "Atmega 8 Mikrokontroller", price: 12000, category: "arduino", desc: "8 Kbayt xotirali 8-razryadli mikrokontroller." },
  { name: "Atmega 328 Mikrokontroller", price: 18000, category: "arduino", desc: "Arduino Uno'ning asosi bo'lgan 32 KB xotirali chip." },
  { name: "Attiny Mikrokontroller", price: 9000, category: "arduino", desc: "Kompakt dasturlanuvchi mikrokontroller." },
  { name: "ULN2803APG Drayver", price: 5000, category: "modules", desc: "Motorlar va relelarni boshqarish uchun darlington yig'masi." },
  { name: "Tranzistorlar", price: 500, category: "accessories", desc: "Signalni kuchaytiruvchi bipolyar tranzistor." },
  { name: "Kondensator 220", price: 500, category: "accessories", desc: "Keramik yoki elektrolitik kondensator." },
  { name: "Quvvat Tranzistorlari", price: 2000, category: "accessories", desc: "Yuqori tokda ishlovchi tranzistor." },
  { name: "Kavsharlash kislotasi", price: 3000, category: "tools", desc: "Murakkab sirtlarni kavsharlashda ishlatiladigan suyuqlik." },
  { name: "Mikrosxema qutichasi (Podushka)", price: 2000, category: "accessories", desc: "Mikrokontroller chiplarini (Atmega) plataga o'rnatish soketi." },
  { name: "MPU6050 Gyro/Akselerometr", price: 25000, category: "sensors", desc: "3 o'qli giroskop va akselerometr moduli." },
  { name: "LM393 To'siq sensori", price: 10000, category: "sensors", desc: "Yaqin masofadagi to'siqlarni aniqlovchi infraqizil sensor." },
  { name: "DHT11 Harorat va Namlik (Modul)", price: 15000, category: "sensors", desc: "Qulay ulash imkoniyati bor DHT11 sensori." },
  { name: "DHT11 Datchik", price: 12000, category: "sensors", desc: "Oddiy ko'rinishdagi harorat va namlik sensori." },
  { name: "Yoqib-o'chirgich (Switch)", price: 5000, category: "modules", desc: "Qurilmalarni yoqib-o'chirish tugmasi." },
  { name: "Yoqib-o'chirgich (Kichik)", price: 3000, category: "modules", desc: "Kichik hajmli yoqish/o'chirish tugmachasi." },
  { name: "Kabel va ulagichlar bilan yoqish tugmasi", price: 65000, category: "modules", desc: "Tayyor sim va ulagichlari ulangan batareya knopkasi." },
  { name: "Tok o'tkazgich adapter (Papa-Mama)", price: 3000, category: "cables", desc: "Quvvat simini ulash uchun aylanma adapter." },
  { name: "Adapter shtekerlari", price: 3000, category: "cables", desc: "Turli xil moslamalarga mos shteker uchliklari." },
  { name: "MX1508 Motor drayver", price: 13000, category: "motors", desc: "Ikki DC motor yoki qadamli motorni boshqaruvchi drayver (L298N analogi)." },
  { name: "Tuproq namligi sensori", price: 11000, category: "sensors", desc: "Tuproq qanchalik nam ekanligini o'lchovchi datchik." },
  { name: "Krona batareya 9V", price: 4000, category: "power", desc: "Loyiha uchun 9V kuchlanishli Krona batareyasi." },
  { name: "AA Batareya 1.5V", price: 2000, category: "power", desc: "Standart qalamcha batareya." },
  { name: "18650 Akkumulyator 3.7V", price: 16000, category: "power", desc: "Zaryad oluvchi litiy-ion 18650 akkumulyator batareyasi." },
  { name: "Ombur (Plaskogubsi)", price: 20000, category: "tools", desc: "Elektronika ustasi asbobi: ombur." },
  { name: "Sim qirqish omburi (Kusachka)", price: 35000, category: "tools", desc: "Simlarni toza va qulay qirqish uchun maxsus asbob." },
  { name: "Pinset", price: 20000, category: "tools", desc: "Mayda detallarni ushlash uchun uchlik." },
  { name: "Arduino NANO V3.0 Shield", price: 20000, category: "arduino", desc: "Arduino Nano platasini kengaytirib ulash uchun qulay shield." },
  { name: "Robot Konstruktor To'plami", price: 300000, category: "kits", desc: "Yog'ochdan yasalgan korpusli ajoyib robot konstruktor." },
  { name: "Arduino Boshlang'ich To'plami (Starter Kit)", price: 170000, category: "kits", desc: "Elektronika asoslarini o'rganuvchilar uchun mo'ljallangan boshlang'ich yig'ma." },
  { name: "Arduino Kengaytirilgan Kit To'plami", price: 350000, category: "kits", desc: "Katta ko'lamli loyihalar uchun Arduino sensor va modullari to'plami." },
  { name: "Murakkab Robototexnika To'plami", price: 350000, category: "kits", desc: "Ilg'or darajadagi loyihalar tayyorlashga mos robototexnika to'plami." },
  { name: "Simsiz Robot Mashina To'plami", price: 400000, category: "kits", desc: "Pult va ilova orqali boshqariladigan simsiz mashina yig'ish to'plami." }
];

async function run() {
  const uploadsDir = path.join(__dirname, '..', 'frontend', 'public', 'images', 'products');
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  const finalProducts = [];
  const colors = [
    ['#1A2980', '#26D0CE'],
    ['#FF416C', '#FF4B2B'],
    ['#4776E6', '#8E54E9'],
    ['#11998e', '#38ef7d'],
    ['#000000', '#434343'],
    ['#f12711', '#f5af19'],
    ['#654ea3', '#eaafc8'],
    ['#00b09b', '#96c93d']
  ];

  for (let i = 0; i < rawProducts.length; i++) {
    const item = rawProducts[i];
    const id = i + 1;
    const imageName = 'prod-' + id + '.jpg';
    const imagePath = path.join(uploadsDir, imageName);

    // Generate Beautiful Canvas Image
    const width = 600;
    const height = 600;
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');

    // Select random gradient
    const gradientColors = colors[i % colors.length];
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, gradientColors[0]);
    gradient.addColorStop(1, gradientColors[1]);
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Draw tech patterns (grid)
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 2;
    for (let x = 0; x <= width; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y <= height; y += 40) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Add overlay box
    ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
    ctx.fillRect(50, 150, 500, 300);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.strokeRect(50, 150, 500, 300);

    // Add Icon / Symbol
    const icons = { 'motors': '⚙️', 'sensors': '📡', 'modules': '🧩', 'arduino': '🎛️', 'tools': '🛠️', 'accessories': '📦', 'power': '🔋', 'cables': '🔌', 'kits': '🤖' };
    const icon = icons[item.category] || '💡';
    ctx.font = '80px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(icon, width / 2, 230);

    // Add text
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 36px Arial';
    
    // Wrap text function
    const words = item.name.split(' ');
    let line = '';
    let y = 320;
    for(let n = 0; n < words.length; n++) {
      let testLine = line + words[n] + ' ';
      let metrics = ctx.measureText(testLine);
      let testWidth = metrics.width;
      if (testWidth > 460 && n > 0) {
        ctx.fillText(line, width / 2, y);
        line = words[n] + ' ';
        y += 45;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, width / 2, y);

    const buffer = canvas.toBuffer('image/jpeg', { quality: 0.9 });
    fs.writeFileSync(imagePath, buffer);

    finalProducts.push({
      id: id,
      name: item.name,
      description: item.desc,
      price: item.price,
      oldPrice: Math.round(item.price * 1.2), // Add a 20% discount illusion
      category: item.category,
      image: '/images/products/' + imageName,
      rating: Number((Math.random() * (5.0 - 4.2) + 4.2).toFixed(1)),
      reviews: Math.floor(Math.random() * 200) + 10,
      stock: Math.floor(Math.random() * 100) + 5,
      featured: id <= 12 || item.category === 'kits'
    });
  }

  // Update products.js
  const jsContent = "// Mahsulotlar ma'lumotlari - Barcha mahsulotlar kiritilgan\n" +
    "export const products = " + JSON.stringify(finalProducts, null, 2) + ";\n\n" +
    "// Kategoriyalar\n" +
    "export const categories = [\n" +
    "  { id: 'arduino', name: 'Arduino & MCU', icon: '🎛️', description: 'Arduino Uno, Nano, ESP32, ESP8266' },\n" +
    "  { id: 'sensors', name: 'Sensorlar', icon: '📡', description: 'Ultrasonic, PIR, IR, Temperature, Gas' },\n" +
    "  { id: 'motors', name: 'Motorlar & Drayverlar', icon: '⚙️', description: 'DC, Servo, Stepper, L298N' },\n" +
    "  { id: 'modules', name: 'Modullar', icon: '🧩', description: 'RFID, Relay, Buzzer, LCD, Bluetooth' },\n" +
    "  { id: 'kits', name: 'Robot Kitlar', icon: '🤖', description: 'Starter kits, Smart car, Line follower' },\n" +
    "  { id: 'power', name: 'Quvvat & Adapterlar', icon: '🔋', description: 'Battery, Power module, Adapter' },\n" +
    "  { id: 'cables', name: 'Kabel & Ulagichlar', icon: '🔌', description: 'Jumper wires, Breadboard' },\n" +
    "  { id: 'tools', name: 'Asbob-uskunalar', icon: '🛠️', description: 'Payalnik, tester va boshqalar' },\n" +
    "  { id: 'accessories', name: 'Aksessuarlar', icon: '📦', description: 'Korpusi, g\\'ildiraklar, vintlar' }\n" +
    "];\n\n" +
    "// Narxni formatlash\n" +
    "export const formatPrice = (price) => {\n" +
    "  return new Intl.NumberFormat('uz-UZ').format(price) + ' so\\'m';\n" +
    "};\n";

  const productsJsPath = path.join(__dirname, '..', 'frontend', 'src', 'data', 'products.js');
  fs.writeFileSync(productsJsPath, jsContent);
  console.log('✅ Barcha mahsulotlar muvaffaqiyatli yuklandi, rasmlar generatsiya qilindi va products.js yangilandi!');
}

run();
