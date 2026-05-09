const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const generateIcons = async () => {
    const dir = path.join(__dirname, '../public/icons');
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }

    const color = '#00d4ff';

    // 192x192
    await sharp({
        create: {
            width: 192,
            height: 192,
            channels: 4,
            background: color
        }
    })
        .png()
        .toFile(path.join(dir, 'icon-192x192.png'));

    // 512x512
    await sharp({
        create: {
            width: 512,
            height: 512,
            channels: 4,
            background: color
        }
    })
        .png()
        .toFile(path.join(dir, 'icon-512x512.png'));

    console.log('Icons generated successfully.');
}

generateIcons();
