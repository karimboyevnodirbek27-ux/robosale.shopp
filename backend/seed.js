const mongoose = require('mongoose');
require('dotenv').config();

const Product = require('./models/Product');

const products = [
    // ==================== ARDUINO VA MIKROKONTROLLERLAR ====================
    {
        name: "Arduino Uno R3",
        description: "Arduino Uno R3 - eng mashhur mikrokontroller platasi. ATmega328P protsessori, 14 ta digital pin, 6 ta analog pin. Yangi boshlovchilar va professional loyihalar uchun ideal.",
        price: 150000,
        oldPrice: 180000,
        category: "arduino",
        image: "/uploads/arduino-uno-r3.jpg",
        rating: 4.9,
        reviews: 156,
        inStock: true,
        stockCount: 50,
        featured: true
    },
    {
        name: "Arduino Nano V3",
        description: "Kichik o'lchamli mikrokontroller. ATmega328P protsessori, USB Mini-B. Kompakt loyihalar uchun mukammal tanlov.",
        price: 75000,
        oldPrice: 90000,
        category: "arduino",
        image: "/uploads/arduino-nano-v3.jpg",
        rating: 4.8,
        reviews: 89,
        inStock: true,
        stockCount: 100,
        featured: true
    },
    {
        name: "Arduino Mega 2560",
        description: "Kengaytirilgan mikrokontroller. ATmega2560 protsessori, 54 ta digital pin, 16 ta analog pin. Ko'p sonli pinlar va katta xotira kerak bo'lgan loyihalar uchun.",
        price: 220000,
        category: "arduino",
        image: "/uploads/arduino-mega-2560.jpg",
        rating: 4.7,
        reviews: 67,
        inStock: true,
        stockCount: 30,
        featured: false
    },
    {
        name: "Arduino Mini",
        description: "Eng kichik Arduino plata. ATmega328P protsessori, kompakt o'lcham 30x18mm. Kompakt loyihalar uchun mukammal.",
        price: 55000,
        category: "arduino",
        image: "/uploads/arduino-mini.jpg",
        rating: 4.6,
        reviews: 67,
        inStock: true,
        stockCount: 80,
        featured: false
    },
    {
        name: "Arduino Pro Micro",
        description: "ATmega32U4 asosidagi mikrokontroller. USB HID qo'llab-quvvatlaydi (klaviatura, sichqoncha). 5V/16MHz versiya.",
        price: 85000,
        category: "arduino",
        image: "/uploads/arduino-pro-micro.jpg",
        rating: 4.7,
        reviews: 52,
        inStock: true,
        stockCount: 60,
        featured: true
    },
    {
        name: "Arduino Leonardo",
        description: "ATmega32U4 asosidagi Arduino. USB HID qo'llab-quvvatlaydi (klaviatura, sichqoncha emulyatsiyasi). Original Arduino sifati.",
        price: 145000,
        category: "arduino",
        image: "/uploads/arduino-leonardo.jpg",
        rating: 4.7,
        reviews: 56,
        inStock: true,
        stockCount: 35,
        featured: false
    },
    {
        name: "Arduino UNO R3 SMD",
        description: "Arduino UNO SMD versiyasi. ATmega328P SMD korpusda. Barqaror va ishonchli, professional loyihalar uchun.",
        price: 135000,
        category: "arduino",
        image: "/uploads/arduino-uno-r3.jpg",
        rating: 4.8,
        reviews: 134,
        inStock: true,
        stockCount: 55,
        featured: false
    },
    {
        name: "STM32 Blue Pill",
        description: "STM32F103C8T6 ARM Cortex-M3 mikrokontroller platasi. 72MHz, 64KB Flash, 20KB RAM. Yuqori unumdorlik kerak bo'lgan loyihalar uchun.",
        price: 68000,
        category: "arduino",
        image: "/uploads/stm32-blue-pill.jpg",
        rating: 4.8,
        reviews: 67,
        inStock: true,
        stockCount: 45,
        featured: true
    },
    {
        name: "ESP8266 WiFi Module",
        description: "ESP8266 ESP-01 WiFi moduli. 80MHz protsessor, WiFi 802.11 b/g/n. IoT loyihalar uchun ideal arzon variant.",
        price: 38000,
        category: "arduino",
        image: "/uploads/esp8266-wifi.jpg",
        rating: 4.8,
        reviews: 189,
        inStock: true,
        stockCount: 120,
        featured: true
    },
    {
        name: "ESP32 CAM WiFi Camera",
        description: "ESP32 WiFi kamera moduli. OV2640 2MP kamera, WiFi va Bluetooth. Video streaming, foto surat, IoT loyihalar uchun.",
        price: 125000,
        oldPrice: 145000,
        category: "arduino",
        image: "/uploads/esp32-cam.jpg",
        rating: 4.9,
        reviews: 145,
        inStock: true,
        stockCount: 40,
        featured: true
    },
    {
        name: "Ethernet Shield W5100",
        description: "Arduino uchun Ethernet moduli. W5100 chip, 10/100Mbps. Internet ulanishi kerak bo'lgan loyihalar uchun.",
        price: 125000,
        category: "arduino",
        image: "/uploads/ethernet-w5100.jpg",
        rating: 4.6,
        reviews: 34,
        inStock: true,
        stockCount: 25,
        featured: false
    },
    {
        name: "Nano Shield",
        description: "Arduino Nano uchun kengaytirish platasi. USB Mini-B, power jack, Grove connector. Qulay ulanish uchun.",
        price: 28000,
        category: "arduino",
        image: "/uploads/nano-shield.jpg",
        rating: 4.5,
        reviews: 78,
        inStock: true,
        stockCount: 90,
        featured: false
    },
    {
        name: "ATtiny13 Mikrokontroller",
        description: "Kichik 8-bitli AVR mikrokontroller. 1KB Flash, 64B RAM. Oddiy va arzon loyihalar uchun.",
        price: 12000,
        category: "arduino",
        image: "/uploads/attiny13.jpg",
        rating: 4.4,
        reviews: 23,
        inStock: true,
        stockCount: 100,
        featured: false
    },
    {
        name: "SIM800L GSM Moduli",
        description: "Arduino uchun GSM/GPRS moduli. SMS yuborish, qo'ng'iroq qilish, internet ulanishi. IoT va masofadan boshqarish uchun ideal.",
        price: 95000,
        oldPrice: 115000,
        category: "arduino",
        image: "/uploads/sim800l-gsm.jpg",
        rating: 4.7,
        reviews: 89,
        inStock: true,
        stockCount: 35,
        featured: true
    },
    
    // ==================== SENSORLAR ====================
    {
        name: "HC-SR04 Ultratovush Sensori",
        description: "Masofani o'lchash uchun ultratovush sensori. 2cm - 400cm oralig'ida ishlaydi, 3° burchak. Robot va avtomobil loyihalar uchun.",
        price: 25000,
        oldPrice: 30000,
        category: "sensors",
        image: "/uploads/hc-sr04-ultrasonic.jpg",
        rating: 4.6,
        reviews: 234,
        inStock: true,
        stockCount: 200,
        featured: true
    },
    {
        name: "DHT11 Harorat va Namlik Sensori",
        description: "Harorat va namlikni o'lchash uchun sensor. Harorat: 0-50°C (±2°C), namlik: 20-90% (±5%). IoT loyihalar uchun ideal.",
        price: 18000,
        category: "sensors",
        image: "/uploads/dht11-sensor.jpg",
        rating: 4.5,
        reviews: 178,
        inStock: true,
        stockCount: 150,
        featured: false
    },
    {
        name: "DHT22 Harorat Sensori",
        description: "Professional darajadagi harorat va namlik sensori. AM2302. Harorat: -40-80°C (±0.5°C), namlik: 0-100% (±2%).",
        price: 68000,
        oldPrice: 82000,
        category: "sensors",
        image: "/uploads/dht22-sensor.jpg",
        rating: 4.8,
        reviews: 89,
        inStock: true,
        stockCount: 60,
        featured: true
    },
    {
        name: "PIR Harakat Sensori",
        description: "Infraqizil harakat sensori. 3-7 metr masofa, 110° burchak. Xavfsizlik tizimlari va avtomatik yoritish uchun.",
        price: 28000,
        category: "sensors",
        image: "/uploads/pir-sensor.jpg",
        rating: 4.4,
        reviews: 92,
        inStock: true,
        stockCount: 80,
        featured: false
    },
    {
        name: "MPU6050 Akselerometr",
        description: "6-o'qli akselerometr va giroskop. 3 ta akselerometr, 3 ta giroskop o'qi. Dron, robot, balansirovka loyihalar uchun.",
        price: 38000,
        category: "sensors",
        image: "/uploads/mpu6050.jpg",
        rating: 4.7,
        reviews: 112,
        inStock: true,
        stockCount: 80,
        featured: true
    },
    {
        name: "BMP180 Barometr",
        description: "Atmosfera bosimi va haroratni o'lchash sensori. 300-1100 hPa, ±0.12 hPa aniqlik. Ob-havo stantsiyalari uchun ideal.",
        price: 38000,
        category: "sensors",
        image: "/uploads/bmp180-barometer.jpg",
        rating: 4.5,
        reviews: 34,
        inStock: true,
        stockCount: 50,
        featured: false
    },
    {
        name: "VL53L0X Lazer Sensori",
        description: "Yuqori aniqlikdagi lazer masofani o'lchash sensori. ToF (Time of Flight) texnologiyasi, 2m gacha o'lchaydi. ±3mm aniqlik.",
        price: 68000,
        category: "sensors",
        image: "/uploads/vl53l0x-sensor.jpg",
        rating: 4.7,
        reviews: 28,
        inStock: true,
        stockCount: 40,
        featured: true
    },
    {
        name: "TFT Sensor Displey 2.8",
        description: "Rangli TFT displey sensorli ekran bilan. 2.8 dyuym, 320x240 piksel. ILI9341 driver, SPI interfeys.",
        price: 125000,
        category: "sensors",
        image: "/uploads/tft-display.jpg",
        rating: 4.6,
        reviews: 45,
        inStock: true,
        stockCount: 25,
        featured: false
    },
    {
        name: "LCD 1602 Blue I2C",
        description: "16x2 belgilik ko'k LCD displey. I2C moduli bilan (faqat 4 ta pin ulanadi). 5V, oq yozuv ko'k fonda.",
        price: 42000,
        category: "sensors",
        image: "/uploads/lcd-1602-blue.jpg",
        rating: 4.5,
        reviews: 156,
        inStock: true,
        stockCount: 100,
        featured: false
    },
    {
        name: "LCD 1602 Green",
        description: "16x2 belgilik yashil LCD displey. Klassik dizayn, qora yozuv yashil fonda. I2C moduli opsiyonel.",
        price: 38000,
        category: "sensors",
        image: "/uploads/lcd-1602-green.jpg",
        rating: 4.5,
        reviews: 123,
        inStock: true,
        stockCount: 90,
        featured: false
    },
    {
        name: "LCD 12864 Grafik",
        description: "128x64 piksel grafik LCD displey. ST7920 driver, parallel va SPI interfeys. Diagramma va grafikalar chiqarish uchun.",
        price: 82000,
        category: "sensors",
        image: "/uploads/lcd-12864.jpg",
        rating: 4.7,
        reviews: 34,
        inStock: true,
        stockCount: 35,
        featured: false
    },
    {
        name: "HX711 Tenzodatchik",
        description: "Og'irlik sensori moduli. 24-bit ADC, 80SPS. Elektron tarozi uchun ideal. 5V quvvat, 2 ta kanal.",
        price: 32000,
        category: "sensors",
        image: "/uploads/hx711-loadcell.jpg",
        rating: 4.6,
        reviews: 78,
        inStock: true,
        stockCount: 60,
        featured: false
    },
    {
        name: "MQ-2 Gaz Sensori",
        description: "Gaz va tutun sensori. LPG, propan, butan, metan, vodorod, tutun aniqlash. Xavfsizlik tizimlari uchun.",
        price: 22000,
        category: "sensors",
        image: "/uploads/mq2-sensor.jpg",
        rating: 4.6,
        reviews: 145,
        inStock: true,
        stockCount: 100,
        featured: false
    },
    {
        name: "MQ-135 Havo Sifati",
        description: "Havo sifati sensori. NH3, NOx, spirt, benzol, CO2, tutun aniqlash. Ekologiya va monitoring loyihalar uchun.",
        price: 28000,
        category: "sensors",
        image: "/uploads/mq135-sensor.jpg",
        rating: 4.7,
        reviews: 112,
        inStock: true,
        stockCount: 85,
        featured: false
    },
    {
        name: "Soil Moisture Sensor",
        description: "Tuproq namligi sensori. O'simliklar avtomatik sug'orish tizimi uchun. Analog va digital chiqish. Oltin qoplama kontaktlar.",
        price: 15000,
        category: "sensors",
        image: "/uploads/soil-moisture.jpg",
        rating: 4.5,
        reviews: 167,
        inStock: true,
        stockCount: 120,
        featured: false
    },
    {
        name: "IR LED LM393 Sensori",
        description: "Infraqizil to'siq sensori. LM393 komparator, 2-30cm masofa. Chiziq kuzatish va to'siq aniqlash uchun.",
        price: 15000,
        category: "sensors",
        image: "/uploads/ir-led-lm393.jpg",
        rating: 4.4,
        reviews: 56,
        inStock: true,
        stockCount: 90,
        featured: false
    },
    {
        name: "Rotary Encoder",
        description: "Aylanma enkoder moduli. 20 impuls/aylanish, tugma bosish funksiyasi. Menyu navigatsiyasi va sozlash uchun.",
        price: 22000,
        category: "sensors",
        image: "/uploads/rotary-encoder.jpg",
        rating: 4.5,
        reviews: 45,
        inStock: true,
        stockCount: 70,
        featured: false
    },
    {
        name: "Color Sensor TCS3200",
        description: "Rang sensori. TCS3200 moduli, ranglarni aniqlash va o'lchash. Fotodiodlar massivi, dasturlash filtr. Robot sortirovka uchun.",
        price: 45000,
        category: "sensors",
        image: "/uploads/tcs3200-color.jpg",
        rating: 4.7,
        reviews: 67,
        inStock: true,
        stockCount: 55,
        featured: true
    },
    {
        name: "Fingerprint Sensor R305",
        description: "Barmoq izi sensori. R305 optik sensor, 162 ta barmoq izi saqlash. UART interfeys, Arduino va RFID access control uchun.",
        price: 185000,
        oldPrice: 220000,
        category: "sensors",
        image: "/uploads/r305-fingerprint.jpg",
        rating: 4.8,
        reviews: 89,
        inStock: true,
        stockCount: 30,
        featured: true
    },
    {
        name: "GPS Module NEO-6M",
        description: "GPS moduli. NEO-6M chip, antennasi bilan. Kenglik, uzunlik, balandlik, vaqt ma'lumotlari. Tracker va navigatsiya loyihalar uchun.",
        price: 85000,
        oldPrice: 100000,
        category: "sensors",
        image: "/uploads/neo6m-gps.jpg",
        rating: 4.7,
        reviews: 123,
        inStock: true,
        stockCount: 45,
        featured: true
    },
    {
        name: "XHM 452 Termostat",
        description: "Raqamli termostat moduli. Haroratni boshqarish, -50°C dan 110°C gacha. Inkubator, akvarium, isitish tizimlari uchun.",
        price: 62000,
        category: "sensors",
        image: "/uploads/xhm-452-termostat.jpg",
        rating: 4.5,
        reviews: 28,
        inStock: true,
        stockCount: 45,
        featured: false
    },
    {
        name: "LM7805 Voltage Regulator",
        description: "5V kuchlanish regulyatori. TO-220 korpus, 1.5A maksimal tok. Barqaror quvvat manbai uchun.",
        price: 5000,
        category: "sensors",
        image: "/uploads/lm7805-regulator.jpg",
        rating: 4.4,
        reviews: 89,
        inStock: true,
        stockCount: 200,
        featured: false
    },
    {
        name: "XL4016 Step-Down Converter",
        description: "Yuqori quvvatli DC-DC konverter. 4-40V kirish, 1.25-35V chiqish, 8A gacha. LED driver va quvvat manbai uchun.",
        price: 52000,
        category: "sensors",
        image: "/uploads/xl4016-converter.jpg",
        rating: 4.6,
        reviews: 42,
        inStock: true,
        stockCount: 55,
        featured: false
    },
    {
        name: "Push Button Set",
        description: "Turli rangli tugmalar to'plami. 12mm diametr, 5 rang (qizil, yashil, ko'k, sariq, oq). 20 dona.",
        price: 12000,
        category: "sensors",
        image: "/uploads/push-button-set.jpg",
        rating: 4.3,
        reviews: 67,
        inStock: true,
        stockCount: 150,
        featured: false
    },
    {
        name: "Relay 5V 1 Channel",
        description: "5V 1 kanalli rele moduli. 250VAC/10A, optoizolyatsiya. Yuqori kuchlanishli qurilmalarni boshqarish uchun.",
        price: 15000,
        category: "sensors",
        image: "/uploads/relay-1ch.jpg",
        rating: 4.5,
        reviews: 89,
        inStock: true,
        stockCount: 100,
        featured: false
    },
    {
        name: "Relay 5V 2 Channel",
        description: "5V 2 kanalli rele moduli. 250VAC/10A har bir kanal, optoizolyatsiya. Ikki qurilmani mustaqil boshqarish.",
        price: 28000,
        category: "sensors",
        image: "/uploads/relay-2ch.jpg",
        rating: 4.5,
        reviews: 67,
        inStock: true,
        stockCount: 80,
        featured: false
    },
    {
        name: "Relay 5V 4 Channel",
        description: "5V 4 kanalli rele moduli. 250VAC/10A har bir kanal, optoizolyatsiya. Ko'p qurilmalarni boshqarish uchun.",
        price: 42000,
        category: "sensors",
        image: "/uploads/relay-4ch.jpg",
        rating: 4.6,
        reviews: 78,
        inStock: true,
        stockCount: 60,
        featured: false
    },
    
    // ==================== MOTORLAR VA DRAYVERLAR ====================
    {
        name: "MG996R Servo Motor",
        description: "Kuchli servo motor metal tishli. 11kg·sm moment, 0.17s/60° tezlik. Robot qo'llari, RC mashinalar uchun.",
        price: 85000,
        oldPrice: 100000,
        category: "motors",
        image: "/uploads/mg996r-servo.jpg",
        rating: 4.8,
        reviews: 145,
        inStock: true,
        stockCount: 60,
        featured: true
    },
    {
        name: "Tower Pro SG90 Servo",
        description: "Mini servo motor plastik tishli. 1.6kg·sm moment, 9g vazn. Engil loyihalar va o'rganish uchun ideal.",
        price: 28000,
        category: "motors",
        image: "/uploads/sg90-servo.jpg",
        rating: 4.6,
        reviews: 234,
        inStock: true,
        stockCount: 150,
        featured: true
    },
    {
        name: "DC Motor + L298N Driver",
        description: "DC motor va drayveri to'plami. 2 ta DC motor yoki 1 ta stepper motor, 2A maksimal. Robot mashinalar uchun ideal.",
        price: 120000,
        category: "motors",
        image: "/uploads/dc-motor-l298n.jpg",
        rating: 4.7,
        reviews: 112,
        inStock: true,
        stockCount: 40,
        featured: false
    },
    {
        name: "Stepper Motor NEMA 17",
        description: "Yuqori aniqlikdagi stepper motor. 1.8°/qadam, 1.2A, 40N·cm moment. 3D printer va CNC uchun.",
        price: 145000,
        category: "motors",
        image: "/uploads/nema-17-stepper.jpg",
        rating: 4.9,
        reviews: 78,
        inStock: true,
        stockCount: 25,
        featured: false
    },
    {
        name: "CNC Shield + Driver",
        description: "CNC mashinalar uchun shield va drayver to'plami. A4988 drayverlar bilan, Arduino Uno uchun. 4 ta motor boshqarish.",
        price: 95000,
        category: "motors",
        image: "/uploads/cnc-shield.jpg",
        rating: 4.8,
        reviews: 38,
        inStock: true,
        stockCount: 30,
        featured: false
    },
    {
        name: "PCA9685 Servo Kontroller",
        description: "16 kanalli PWM servo drayver. I2C interfeys, 5V quvvat. Ko'p sonli servolarni boshqarish uchun ideal.",
        price: 52000,
        category: "motors",
        image: "/uploads/pca9685-servo.jpg",
        rating: 4.8,
        reviews: 67,
        inStock: true,
        stockCount: 40,
        featured: true
    },
    {
        name: "Motor Shield L293D",
        description: "Arduino uchun motor drayver shield. 4 ta DC motor yoki 2 ta stepper, 600mA har bir kanal. Qulay ulanish.",
        price: 68000,
        category: "motors",
        image: "/uploads/motor-shield-l293d.jpg",
        rating: 4.7,
        reviews: 78,
        inStock: true,
        stockCount: 50,
        featured: false
    },
    {
        name: "DC Motor 3-8V 180RPM",
        description: "Tishli reduktorli DC motor. 3-8V, 180 aylanish/daq, 6mm val. Robot mashinalari uchun optimal.",
        price: 28000,
        category: "motors",
        image: "/uploads/dc-motor-180rpm.png",
        rating: 4.6,
        reviews: 145,
        inStock: true,
        stockCount: 100,
        featured: false
    },
    {
        name: "MX1508 Motor Driver",
        description: "Dual H-bridge motor drayver. 2 ta DC motor, 1.5A har bir kanal. Kompakt dizayn, kichik robotlar uchun.",
        price: 22000,
        category: "motors",
        image: "/uploads/mx1508-driver.jpg",
        rating: 4.5,
        reviews: 56,
        inStock: true,
        stockCount: 70,
        featured: false
    },
    
    // ==================== ROBOT KITLAR ====================
    {
        name: "4WD Robot Mashinasi Kit",
        description: "4 g'ildirakli robot mashinasi to'plami. Metal shassi, 4 ta DC motor, L298N drayver, batareya uyasi. Arduino bilan boshqarish.",
        price: 450000,
        oldPrice: 520000,
        category: "robots",
        image: "/uploads/4wd-robot-car.jpg",
        rating: 4.9,
        reviews: 89,
        inStock: true,
        stockCount: 15,
        featured: true
    },
    {
        name: "Robot Qo'l 6 DOF",
        description: "6 darajali erkinlikka ega robot qo'l. 6 ta MG996R servo motor, metal shassi. Yuk ko'tarish 1kg. 3D打印 va CNC uchun.",
        price: 680000,
        category: "robots",
        image: "/uploads/robot-arm-6dof.jpg",
        rating: 4.8,
        reviews: 45,
        inStock: true,
        stockCount: 10,
        featured: true
    },
    {
        name: "Spider Robot Kit",
        description: "8 oyoqli o'rgimchak robot to'plami. 12 ta servo motor, Arduino Nano, Bluetooth. Murakkab harakatlar va yurish uchun.",
        price: 950000,
        category: "robots",
        image: "/uploads/spider-robot.jpg",
        rating: 4.7,
        reviews: 23,
        inStock: false,
        stockCount: 0,
        featured: false
    },
    {
        name: "Yellow Robot Wheels",
        description: "Sariq robot g'ildiraklari. 65mm diametr, rezina qoplama. 2 dona, DC motor uchun. 4WD robot mashinalar uchun.",
        price: 18000,
        category: "robots",
        image: "/uploads/yellow-wheels.jpg",
        rating: 4.5,
        reviews: 89,
        inStock: true,
        stockCount: 120,
        featured: false
    },
    
    // ==================== ASBOBLAR ====================
    {
        name: "Payalnik Coair V900",
        description: "Professional payalnik stantsiyasi. 900W, harorat sozlash 200-480°C. LCD displey, anti-statik. SMD komponentlar uchun.",
        price: 280000,
        oldPrice: 350000,
        category: "tools",
        image: "/uploads/payalnik-coair-v900.jpg",
        rating: 4.9,
        reviews: 89,
        inStock: true,
        stockCount: 15,
        featured: true
    },
    {
        name: "Breadboard 800",
        description: "800 nuqtali maket platasi. 165x55x10mm, yopishqoq orqa tomon. Prototiplash va test uchun ideal.",
        price: 38000,
        category: "tools",
        image: "/uploads/breadboard-800.jpg",
        rating: 4.7,
        reviews: 134,
        inStock: true,
        stockCount: 80,
        featured: false
    },
    {
        name: "18650 Battery Holder",
        description: "18650 batareya uyasi. 1, 2, 3, 4 slot variantlari. Nikel plitalar, simlar bilan. Powerbank va robot uchun.",
        price: 12000,
        category: "tools",
        image: "/uploads/18650-battery.jpg",
        rating: 4.4,
        reviews: 123,
        inStock: true,
        stockCount: 150,
        featured: false
    },
    {
        name: "Jumper Simlar Papa-Papa 20cm 40ta",
        description: "40 ta erkak-erkak (Male-Male) ulovchi simlar. Arduino va breadboard uchun ideal. Uzunligi 20cm, turli ranglar.",
        price: 22000,
        category: "tools",
        image: "/uploads/jumper-papa-papa-20.jpg",
        rating: 4.6,
        reviews: 89,
        inStock: true,
        stockCount: 100,
        featured: false
    },
    {
        name: "Jumper Simlar Papa-Mama 20cm 40ta",
        description: "40 ta erkak-urg'ochi (Male-Female) ulovchi simlar. Sensorlarni Arduino'ga ulash uchun qulay. Uzunligi 20cm.",
        price: 22000,
        category: "tools",
        image: "/uploads/jumper-papa-mama-20.jpg",
        rating: 4.7,
        reviews: 112,
        inStock: true,
        stockCount: 100,
        featured: false
    },
    {
        name: "Jumper Simlar Mama-Mama 20cm 40ta",
        description: "40 ta urg'ochi-urg'ochi (Female-Female) ulovchi simlar. Modullarni bir-biriga ulash uchun. Uzunligi 20cm.",
        price: 22000,
        category: "tools",
        image: "/uploads/jumper-mama-mama-20.jpg",
        rating: 4.6,
        reviews: 78,
        inStock: true,
        stockCount: 100,
        featured: false
    },
    {
        name: "Jumper Simlar Papa-Papa 10cm 40ta",
        description: "40 ta erkak-erkak (Male-Male) ulovchi simlar. Kompakt ulanishlar uchun. Uzunligi 10cm, turli ranglar.",
        price: 18000,
        category: "tools",
        image: "/uploads/jumper-papa-papa-10.jpg",
        rating: 4.5,
        reviews: 67,
        inStock: true,
        stockCount: 120,
        featured: false
    },
    {
        name: "Jumper Simlar Papa-Mama 10cm 40ta",
        description: "40 ta erkak-urg'ochi (Male-Female) ulovchi simlar. Qisqa masofadagi ulanishlar uchun. Uzunligi 10cm.",
        price: 18000,
        category: "tools",
        image: "/uploads/jumper-papa-mama-10.jpg",
        rating: 4.5,
        reviews: 56,
        inStock: true,
        stockCount: 120,
        featured: false
    },
    {
        name: "Jumper Simlar Mama-Mama 10cm 40ta",
        description: "40 ta urg'ochi-urg'ochi (Female-Female) ulovchi simlar. Kompakt loyihalar uchun. Uzunligi 10cm.",
        price: 18000,
        category: "tools",
        image: "/uploads/jumper-mama-mama-10.jpg",
        rating: 4.5,
        reviews: 45,
        inStock: true,
        stockCount: 120,
        featured: false
    },
    {
        name: "I2C Module LCD",
        description: "LCD displeylar uchun I2C adapter moduli. PCF8574 chip, faqat 4 ta pin ulanadi. Potensiometr kontrast uchun.",
        price: 18000,
        category: "sensors",
        image: "/uploads/i2c-module.jpg",
        rating: 4.5,
        reviews: 89,
        inStock: true,
        stockCount: 120,
        featured: false
    },
];

const seedProducts = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB connected...');

        // Clear existing products
        await Product.deleteMany({});
        console.log('Products cleared...');

        // Insert new products
        await Product.insertMany(products);
        console.log(`Products seeded successfully! ${products.length} ta mahsulot.`);

        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

seedProducts();
