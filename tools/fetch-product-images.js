// Har bir mahsulot uchun Openverse API'dan bepul/CC-litsenziyali (NC'siz) rasm
// tanlab, prod-<id>.jpg ga konvertatsiya qiladi. Rasm sarlavhasi/tavsifi mahsulotga
// mos kelmasa — placeholder qoladi. Mualliflik CREDITS.md ga yoziladi.

const fs = require('fs');
const path = require('path');
const sharp = require(path.join(__dirname, '../frontend/node_modules/sharp'));

const productsPath = path.join(__dirname, '../frontend/src/data/products.js');
const raw = fs.readFileSync(productsPath, 'utf8');
let arrString = raw.substring(
    raw.indexOf('export const products = ') + 'export const products = '.length,
    raw.indexOf('// Kategoriyalar')
).trim();
if (arrString.endsWith(';')) arrString = arrString.slice(0, -1);
const products = JSON.parse(arrString);

// Kategoriya bo'yicha: qidiruv termi va relevance kalit so'zlar (kichik harfda)
const CATEGORY = {
    motors:     { term: 'motor', keywords: ['stepper', 'nema', 'servo', '28byj', 'sg90', 'mg90', 'mg996', 'l298n', 'l293d', 'mx1508', 'dc motor', '28byj-48'] },
    arduino:    { term: 'arduino', keywords: ['arduino', 'raspberry pi', 'esp32', 'esp8266', 'atmega', 'attiny', 'avr', 'uno', 'nano', 'mega'] },
    sensors:    { term: 'sensor', keywords: ['hc-sr04', 'hc-sr501', 'hc-sr', 'dht11', 'mq-2', 'mq-3', 'mq-4', 'mq-5', 'mq-7', 'mq-135', 'mpu6050', 'lm393', 'tcs230', 'vl53l0', '2y0a', 'ultrasonic', 'pir', 'tcrt5000', 'touch sensor', 'water sensor', 'soil', 'flame', 'infrared', 'gyroscope', 'accelerometer', 'temperature sensor', 'humidity'] },
    modules:    { term: 'module', keywords: ['l298n', 'l293d', 'rc522', 'mp3', 'ds3231', 'nrf24', 'sim800', 'sim900', 'w1209', 'xl4016', 'relay', 'buzzer', 'bluetooth', 'wifi', 'joystick', 'keypad', 'lcd', 'oled', 'rtc', 'rfid', 'gsm', 'gps', 'wireless', 'camera', 'gas sensor', 'lcd display'] },
    kits:       { term: 'kit', keywords: ['kit', 'starter', 'robot', 'robotic', 'car', 'bundle', 'parts'] },
    cables:     { term: 'jumper wire', keywords: ['jumper', 'usb', 'wire', 'cable', 'breadboard'] },
    power:      { term: 'battery', keywords: ['battery', 'adapter', 'charger', '18650', '9v', 'power supply', 'power bank', 'lithium'] },
    tools:      { term: 'soldering iron', keywords: ['solder', 'iron', 'multimeter', 'plier', 'cutter', 'tweezer', 'flux', 'soldering'] },
    accessories:{ term: 'electronic components', keywords: ['breadboard', 'led', 'resistor', 'capacitor', 'transistor', 'diode', 'crystal', 'header', 'switch', 'button', 'board', 'prototype', 'pin', 'socket', 'ic', 'microcontroller'] },
    robots:     { term: 'robot kit', keywords: ['robot', 'kit', 'car', 'robotic', 'arm'] }
};

const outDir = path.join(__dirname, '../frontend/public/images/products');
const USER_AGENT = 'RoboSaleProductImages/1.0 (+https://robosale.pages.dev; contact@robosale.pages.dev)';
const stripHtml = (s) => String(s || '').replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// Qidiruv so'rovlari varianti
function queryVariants(product) {
    const cat = CATEGORY[product.category] || { term: 'electronic components' };
    const clean = product.name.replace(/[^A-Za-z0-9\- ]/g, ' ').replace(/\s+/g, ' ').trim();
    const variants = [
        `${clean} ${cat.term}`,
        clean
    ];
    // model tokenlari (ragamlari bolganlar)
    const model = (product.name.match(/[A-Za-z0-9.\-]*\d[A-Za-z0-9.\-]*/g) || []).slice(0, 3).join(' ');
    if (model.length >= 3) variants.unshift(`${model} ${cat.term}`);
    return [...new Set(variants)].filter((v) => v.trim().length >= 3);
}

// Litsenziya tijorat uchun mos kelishi kerak (NC = foydasiz)
const licenseOk = (lic) => {
    const l = String(lic || '').toLowerCase();
    return l && !l.includes('nc') && !['no known copyright'].includes(l);
};

// Rasm matni mahsulotga mos kelishi kerak
const isRelevant = (product, item) => {
    const hay = `${item.title || ''} ${item.description || ''} ${(item.tags || []).join(' ')}`.toLowerCase();
    const keywords = (CATEGORY[product.category] || {}).keywords || [];
    return keywords.some((k) => hay.includes(k));
};

async function searchOpenverse(query) {
    const url = 'https://api.openverse.org/v1/images/?' + new URLSearchParams({
        q: query,
        page_size: '8'
    });
    const res = await fetch(url, { headers: { 'User-Agent': USER_AGENT } });
    if (!res.ok) throw new Error('Openverse HTTP ' + res.status);
    const data = await res.json();
    return data.results || [];
}

(async () => {
    const failures = [];
    const credits = [];
    let done = 0;

    for (const p of products) {
        let chosen = null;

        for (const query of queryVariants(p)) {
            let results;
            try {
                results = await searchOpenverse(query);
            } catch (error) {
                console.log(`  qidiruv xatosi (${query}): ${error.message}`);
                continue;
            }

            const candidates = (results || []).filter((item) =>
                licenseOk(item.license) &&
                Number(item.width) >= 400 &&
                item.url &&
                isRelevant(p, item)
            );

            if (candidates.length > 0) {
                chosen = candidates[0];
                break;
            }
            await sleep(700);
        }

        if (!chosen) {
            failures.push(`#${p.id} ${p.name}`);
            console.log(`NO RESULT: #${p.id} ${p.name}`);
            continue;
        }

        try {
            const res = await fetch(chosen.url, { headers: { 'User-Agent': USER_AGENT } });
            if (!res.ok) throw new Error('Image HTTP ' + res.status);
            const contentType = (res.headers.get('content-type') || '').toLowerCase();
            if (!contentType.startsWith('image/')) throw new Error('content-type: ' + contentType);

            const buf = Buffer.from(await res.arrayBuffer());
            await sharp(buf, { density: 300 })
                .resize({ width: 800, withoutEnlargement: true })
                .flatten({ background: '#ffffff' })
                .jpeg({ quality: 85 })
                .toFile(path.join(outDir, `prod-${p.id}.jpg`));

            credits.push(`prod-${p.id}.jpg | ${p.name} | ${stripHtml(chosen.title)} | Muallif: ${stripHtml(chosen.creator || '-')} | Litsenziya: ${chosen.license} | Manba: ${chosen.provider || 'Openverse'}`);
            done += 1;
            console.log(`OK (${done}/${products.length}): #${p.id} ${p.name} -> ${stripHtml(chosen.title).slice(0, 70)}`);
        } catch (error) {
            failures.push(`#${p.id} ${p.name} (${error.message})`);
            console.error(`FAIL: #${p.id} ${p.name} -> ${error.message}`);
        }

        await sleep(700);
    }

    const creditsMd = [
        '# Rasm manbalari (Openverse / CC-litsenziyali)',
        '',
        'Barcha yangi rasmlar Openverse orqali olingan CC-litsenziyali rasmlar (CC-BY / CC0 / PDM).',
        'NC (No Commercial) litsenziyali rasmlar foydalanilmagan.',
        '',
        'file | mahsulot | manba fayl | muallif | litsenziya | manba',
        '---|---|---|---|---|---',
        ...credits
    ].join('\n') + '\n';

    fs.writeFileSync(path.join(outDir, 'CREDITS.md'), creditsMd);

    console.log('\n=================================');
    console.log(`Haqiqiy rasm qo'yildi: ${done}/${products.length}`);
    console.log(`Placeholder qoldi (${failures.length}):`);
    failures.forEach((f) => console.log('  ' + f));
})().catch((e) => { console.error('FATAL:', e); process.exit(1); });
