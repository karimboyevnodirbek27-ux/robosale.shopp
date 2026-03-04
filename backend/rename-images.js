const fs = require('fs');
const path = require('path');

// Mahsulot nomlari va ularning rasm nomlari
const productImages = {
    'arduino-uno-r3': 'product-1766728731912-411943083.jpg',
    'arduino-nano-v3': 'product-1766728738714-131483395.jpg',
    'arduino-mega-2560': 'product-1766728745337-77615184.jpg',
    'hc-sr04-ultrasonic': 'product-1766589455698-739082972.jpg',
    'dht11-sensor': 'product-1766595757665-479776675.jpg',
    'pir-sensor': 'product-1766595742622-387550096.jpg',
    'mg996r-servo': 'product-1766595708577-427384616.jpg',
    'dc-motor-l298n': 'product-1766595659774-855936687.jpg',
    'nema-17-stepper': 'product-1766595621125-708823350.jpg',
    '4wd-robot-car': 'product-1766589021091-277925590.jpg',
    'robot-arm-6dof': 'product-1766595604623-221114855.jpg',
    'spider-robot': 'product-1766595566963-708426713.jpg',
    'bmp180-barometer': 'product-1766595522971-357296582.jpg',
    'vl53l0x-laser': 'product-1766589455698-739082972.jpg',
    'tft-display': 'product-1766595495750-76654761.jpg',
    'arduino-mini': 'product-1766728835051-452705891.jpg',
    'arduino-pro-micro': 'product-1766595440126-749589134.jpg',
    'cnc-shield': 'product-1766595410338-67637876.jpg',
    'payalnik-coair-v900': 'product-1766588638631-311136437.jpg',
    'lcd-1602-blue': 'product-1766595390338-785558806.jpg',
    'xl4016-converter': 'product-1766595276560-280943708.jpg',
    'lcd-12864': 'product-1766595244477-424368712.jpg',
    'xhm-452-termostat': 'product-1766595228844-538433362.jpg',
    'lm7805-regulator': 'product-1766595210940-131768979.jpg',
    'push-button-set': 'product-1766595179742-754580283.jpg',
    'hx711-loadcell': 'product-1766595166849-687601839.jpg',
    'breadboard-800': 'product-1766595153343-258995762.jpg',
    'attiny13': 'product-1766595137872-720479783.jpg',
    'i2c-module': 'product-1766595104856-69617293.jpg',
    'ir-led-lm393': 'product-1766595058617-819858705.jpg',
    'rotary-encoder': 'product-1766594995023-927584642.jpg',
    'pca9685-servo': 'product-1766594980922-461892572.jpg',
    'dht21-sensor': 'product-1766595757665-479776675.jpg',
    'dht22-sensor': 'product-1766595757665-479776675.jpg',
    'mpu6050': 'product-1766594953175-413982894.jpg',
    'ethernet-w5100': 'product-1766594934365-650531288.jpg',
    'arduino-leonardo': 'product-1766594917897-971234002.jpg',
    'nano-shield': 'product-1766594880816-661114778.jpg',
    '18650-battery': 'product-1766594716062-97938.jpg',
    'dc-motor-180rpm': 'metal-gear-motor.png',
    'yellow-wheels': 'product-1766589021091-277925590.jpg',
    'motor-shield-l293d': 'product-1766594659583-67093123.jpg',
    'sg90-servo': 'product-1766594637707-617268932.jpg',
    'stm32-blue-pill': 'product-1766594621522-398543987.jpg',
    'aht15-sensor': 'product-1766595757665-479776675.jpg',
    'relay-1ch': 'product-1766594605651-881740182.jpg',
    'relay-2ch': 'product-1766594586341-752698542.jpg',
    'relay-4ch': 'product-1766594543587-624076936.jpg',
    'esp8266-wifi': 'product-1766587782688-861888767.jpg',
    'esp32-cam': 'product-1766587654079-38172941.jpg',
    'lcd-1602-green': 'product-1766595390338-785558806.jpg',
    'mx1508-driver': 'product-1766594526224-361060664.jpg',
    'arduino-uno-smd': 'product-1766728731912-411943083.jpg',
    'jumper-papa-papa-20': 'product-1766594506914-19424548.jpg',
    'jumper-papa-mama-20': 'product-1766594489920-25149283.jpg',
    'jumper-mama-mama-20': 'product-1766594472243-913487938.jpg',
    'jumper-papa-papa-10': 'product-1766594506914-19424548.jpg',
    'jumper-papa-mama-10': 'product-1766594489920-25149283.jpg',
    'jumper-mama-mama-10': 'product-1766594472243-913487938.jpg',
    'sim800l-gsm': 'product-1766591515470-585329481.jpg'
};

const uploadsDir = path.join(__dirname, 'uploads');

// Har bir rasm uchun
Object.entries(productImages).forEach(([newName, oldFile]) => {
    const oldPath = path.join(uploadsDir, oldFile);
    const ext = path.extname(oldFile);
    const newPath = path.join(uploadsDir, `${newName}${ext}`);
    
    if (fs.existsSync(oldPath)) {
        // Agar yangi nomdagi fayl allaqachon bo'lsa, o'chiramiz
        if (fs.existsSync(newPath) && newPath !== oldPath) {
            fs.unlinkSync(newPath);
        }
        // Faylni qayta nomlaymiz
        if (newPath !== oldPath) {
            fs.renameSync(oldPath, newPath);
            console.log(`✓ ${oldFile} → ${newName}${ext}`);
        }
    } else {
        console.log(`⚠ Topilmadi: ${oldFile}`);
    }
});

console.log('\n✅ Rasm nomlari yangilandi!');
