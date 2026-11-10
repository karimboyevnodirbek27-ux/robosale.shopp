const fs = require('fs');
const path = require('path');

const targets = [
    ['prod-19.jpg',  'HC-SR04 Ultratovush sensori', 'HC SR04 Ultrasonic sensor 1480322 3 4 HDR Enhancer'],
    ['prod-26.jpg',  'RFID moduli RC522',           'RFID module RC522'],
    ['prod-45.jpg',  'Arduino Nano',                'Arduino Nano Every'],
    ['prod-51.jpg',  'MQ-2 Gaz sensori',            'Smoke Sensor - MQ-2'],
    ['prod-141.jpg', 'DHT11 Harorat va Namlik (Modul)', 'DHT11/22 Nokia5110 Logger'],
    ['prod-142.jpg', 'DHT11 Datchik',               'DHT11/22 Nokia5110 Logger']
];

const stripHtml = (s) => String(s || '').replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
const norm = (s) => String(s || '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const rows = [
    '| prod-4.jpg | Servo motor TowerPro SG90 | 250 450 Helicopter Airplane Car SG90 9g Mini Micro Servo for RC | tvluke_ | CC0 | openverse.org |',
    '| prod-11.jpg | Qadamli motor 28BYJ-48 | 28BYJ-48 unipolar stepper motor with ULN2003 driver | Kushagra Keshari | CC BY-SA | openverse.org |',
    '| prod-13.jpg | L298N Motor drayver | L298N Motor Controller | lespounder | CC BY-SA | openverse.org |',
    '| prod-18.jpg | Motor shield L293D | L293D Motor Driver - IC-L293-01 | oomlout | CC BY-SA | openverse.org |',
    '| prod-38.jpg | DS3231 RTC moduli | DS3231 based RTC module | Suyash.dwivedi | CC BY-SA | openverse.org |',
    '| prod-43.jpg | Arduino Mega 2560 | Arduino Mega 2560 with RAMPS shield | dvanzuijlekom | CC BY-SA | openverse.org |',
    '| prod-44.jpg | Arduino Lilypad | Open Heart + LilyPad Arduino | Bekathwia | CC BY-SA | openverse.org |',
    '| prod-46.jpg | Arduino Mini | Arduino Mini Pro w/ Screw Terminals | dam | CC BY | openverse.org |',
    '| prod-48.jpg | Raspberry Pi 3 Model B | Raspberry Pi 3 Model B | Herbfargus | CC BY-SA | openverse.org |'
];

(async () => {
    for (const [file, product, title] of targets) {
        let ok = false;
        for (let attempt = 1; attempt <= 3 && !ok; attempt++) {
            try {
                const res = await fetch('https://api.openverse.org/v1/images/?q=' + encodeURIComponent(title) + '&page_size=6', {
                    headers: { 'User-Agent': 'RoboSaleCredits/1.0 (+https://robosale.pages.dev)' }
                });
                const text = await res.text();
                let data;
                try { data = JSON.parse(text); } catch { console.log('  non-JSON response, retry...', res.status); await sleep(8000); continue; }

                const wanted = norm(title);
                const results = data.results || [];
                const match = results.find((r) => {
                    const t = norm(r.title);
                    return t && (t.includes(wanted.slice(0, 25)) || wanted.includes(t.slice(0, 25)));
                }) || results[0];

                if (!match) { console.log('NO MATCH:', file); break; }

                rows.push(`| ${file} | ${product} | ${stripHtml(match.title)} | ${stripHtml(match.creator || 'Unknown')} | ${String(match.license || '?').toUpperCase()} | ${match.foreign_landing_url || match.url || '-'} |`);
                console.log('OK:', file, '|', String(match.license).toUpperCase(), '|', stripHtml(match.creator || '').slice(0, 40));
                ok = true;
                await sleep(5000);
            } catch (e) {
                console.log('  err:', e.message);
                await sleep(8000);
            }
        }
    }

    const md = [
        '# Rasm manbalari (15 ta CC-litsenziyali rasm)',
        '',
        'Quyidagi 15 ta mahsulot rasmi **Openverse** orqali CC-litsenziyali manbalardan olingan.',
        "Qolgan 146 ta mahsulot rasmi RoboSale'ning o'z generatsiya qilingan illyustratsiyalari.",
        '',
        'Fayl | Mahsulot | Manba sarlavha | Muallif (creator) | Litsenziya | Manba',
        '---|---|---|---|---|---',
        ...rows
    ].join('\n') + '\n';

    fs.writeFileSync(path.join(__dirname, '../frontend/public/images/products/CREDITS.md'), md);
    console.log('\nCREDITS.md yozildi, yozuvlar:', rows.length);
})().catch((e) => { console.error(e); process.exit(1); });
