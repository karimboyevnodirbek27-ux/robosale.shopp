// CREDITS.md'ni Openverse ma'lumotlari asosida hosil qiladi.

const fs = require('fs');
const path = require('path');

const targets = [
    ['prod-4.jpg',   'Servo motor TowerPro SG90',           '250 450 Helicopter Airplane Car SG90 9g Mini Micro Servo for RC'],
    ['prod-11.jpg',  'Qadamli motor 28BYJ-48',              '28BYJ-48 unipolar stepper motor with ULN2003 driver'],
    ['prod-13.jpg',  'L298N Motor drayver',                 'L298N Motor Controller'],
    ['prod-18.jpg',  'Motor shield L293D',                  'L293D Motor Driver - IC-L293-01'],
    ['prod-19.jpg',  'HC-SR04 Ultratovush sensori',         'HC SR04 Ultrasonic sensor 1480322 3 4 HDR Enhancer'],
    ['prod-26.jpg',  'RFID moduli RC522',                   'RFID module RC522'],
    ['prod-38.jpg',  'DS3231 RTC moduli',                   'DS3231 based RTC module'],
    ['prod-43.jpg',  'Arduino Mega 2560',                   'Arduino Mega 2560 with RAMPS shield'],
    ['prod-44.jpg',  'Arduino Lilypad',                     'Open Heart + LilyPad Arduino'],
    ['prod-45.jpg',  'Arduino Nano',                        'Arduino Nano Every'],
    ['prod-46.jpg',  'Arduino Mini',                        'Arduino Mini Pro w/ Screw Terminals'],
    ['prod-48.jpg',  'Raspberry Pi 3 Model B',              'Raspberry Pi 3 Model B'],
    ['prod-51.jpg',  'MQ-2 Gaz sensori',                    'Smoke Sensor - MQ-2'],
    ['prod-141.jpg', 'DHT11 Harorat va Namlik (Modul)',     'DHT11/22 Nokia5110 Logger'],
    ['prod-142.jpg', 'DHT11 Datchik',                       'DHT11/22 Nokia5110 Logger']
];

const stripHtml = (s) => String(s || '').replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
const norm = (s) => String(s || '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

(async () => {
    const rows = [];

    for (const [file, product, title] of targets) {
        try {
            const res = await fetch('https://api.openverse.org/v1/images/?q=' + encodeURIComponent(title) + '&page_size=10', {
                headers: { 'User-Agent': 'RoboSaleProductImages/1.0 (+https://robosale.pages.dev)' }
            });
            const data = await res.json();
            const wanted = norm(title);
            const results = data.results || [];

            // Sarlavha bo'yicha mosini topish; topilmasa birinchisini olamiz
            let match = results.find((r) => {
                const t = norm(r.title);
                return t && (t.includes(wanted.slice(0, 25)) || wanted.includes(t.slice(0, 25)));
            }) || results[0];

            if (!match) {
                rows.push(`| ${file} | ${product} | ${title} | Openverse'da topilmadi | - | - |`);
                console.log('NO MATCH:', file);
                continue;
            }

            const author = stripHtml(match.creator || 'Unknown');
            const license = match.license ? String(match.license).toUpperCase() : 'Unknown';
            const source = match.foreign_landing_url || match.url || '-';

            rows.push(`| ${file} | ${product} | ${stripHtml(match.title)} | ${author} | ${license} | ${source} |`);
            console.log('OK:', file, '->', stripHtml(match.title).slice(0, 60), '|', license, '|', author.slice(0, 40));
            await sleep(700);
        } catch (error) {
            rows.push(`| ${file} | ${product} | ${title} | xato: ${error.message} | - | - |`);
            console.log('ERR:', file, error.message);
        }
    }

    const md = [
        '# Rasm manbalari (15 ta CC-litsenziyali rasm)',
        '',
        'Quyidagi 15 ta mahsulot rasmi **Openverse** orqali CC-litsenziyali manbalardan olingan.',
        "Qolgan 146 ta mahsulot rasmi RoboSale'ning o'z generatsiya qilingan illyustratsiyalari.",
        '',
        'Fayl | Mahsulot | Manba sarlavha | Muallif (creator) | Litsenziya | Manba havolasi',
        '---|---|---|---|---|---',
        ...rows
    ].join('\n') + '\n';

    fs.writeFileSync(path.join(__dirname, '../frontend/public/images/products/CREDITS.md'), md);
    console.log('\nCREDITS.md yozildi.');
})().catch((e) => { console.error(e); process.exit(1); });
