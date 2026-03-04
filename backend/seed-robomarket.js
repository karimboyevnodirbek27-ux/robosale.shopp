const mongoose = require('mongoose');
require('dotenv').config();

const Product = require('./models/Product');

const products = [
    // ==================== ARDUINO PLATALARI ====================
    {
        name: "Arduino Uno R3",
        description: "Arduino Uno R3 - eng mashhur mikrokontroller platasi. ATmega328P protsessori, 14 ta digital pin, 6 ta analog pin.",
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
        description: "Kichik o'lchamli mikrokontroller. ATmega328P protsessori, USB Mini-B. Kompakt loyihalar uchun.",
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
        description: "Kengaytirilgan mikrokontroller. ATmega2560 protsessori, 54 ta digital pin, 16 ta analog pin.",
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
        name: "ESP8266 NodeMCU",
        description: "ESP8266 ESP-12E WiFi moduli. 80MHz, 4MB Flash. IoT loyihalar uchun arzon va kuchli variant.",
        price: 45000,
        oldPrice: 55000,
        category: "arduino",
        image: "/uploads/nodemcu-esp8266.jpg",
        rating: 4.8,
        reviews: 234,
        inStock: true,
        stockCount: 150,
        featured: true
    },
    {
        name: "ESP32 DevKit V1",
        description: "ESP32 WiFi va Bluetooth. Dual core 240MHz, 4MB Flash. Kuchli IoT loyihalar uchun.",
        price: 85000,
        oldPrice: 100000,
        category: "arduino",
        image: "/uploads/esp32-devkit.jpg",
        rating: 4.9,
        reviews: 267,
        inStock: true,
        stockCount: 100,
        featured: true
    },
    {
        name: "ESP32 CAM",
        description: "ESP32 WiFi kamera moduli. OV2640 2MP kamera, WiFi va Bluetooth. Video streaming va foto uchun.",
        price: 125000,
        oldPrice: 145000,
        category: "arduino",
        image: "/uploads/esp32-cam.jpg",
        rating: 4.9,
        reviews: 198,
        inStock: true,
        stockCount: 60,
        featured: true
    },
    {
        name: "Raspberry Pi Pico",
        description: "Raspberry Pi RP2040 mikrokontroller. Dual core ARM Cortex-M0+, 264KB RAM. MicroPython va C++.",
        price: 85000,
        oldPrice: 100000,
        category: "arduino",
        image: "/uploads/raspberry-pi-pico.jpg",
        rating: 4.8,
        reviews: 178,
        inStock: true,
        stockCount: 80,
        featured: true
    },
    {
        name: "Raspberry Pi Pico W",
        description: "Raspberry Pi Pico WiFi va Bluetooth bilan. RP2040, 2.4GHz WiFi. IoT loyihalar uchun.",
        price: 115000,
        category: "arduino",
        image: "/uploads/raspberry-pi-pico-w.jpg",
        rating: 4.8,
        reviews: 134,
        inStock: true,
        stockCount: 60,
        featured: true
    },
    {
        name: "STM32 Blue Pill",
        description: "STM32F103C8T6 ARM Cortex-M3. 72MHz, 64KB Flash, 20KB RAM. Yuqori unumdorlik uchun.",
        price: 68000,
        category: "arduino",
        image: "/uploads/stm32-blue-pill.jpg",
        rating: 4.8,
        reviews: 156,
        inStock: true,
        stockCount: 80,
        featured: true
    },
    {
        name: "STM32 Black Pill",
        description: "STM32F411CEU6 ARM Cortex-M4. 100MHz, 512KB Flash, 128KB RAM. DSP va FPU qo'llab-quvvatlaydi.",
        price: 95000,
        oldPrice: 115000,
        category: "arduino",
        image: "/uploads/stm32-black-pill.jpg",
        rating: 4.9,
        reviews: 89,
        inStock: true,
        stockCount: 50,
        featured: true
    },
