import sharp from 'sharp';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

const publicDir = './public';

const svgIcon = `
<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <rect width="512" height="512" fill="#000000"/>
  <text x="50%" y="55%" font-family="Arial" font-size="180" fill="#C9A84C" text-anchor="middle" dominant-baseline="middle" font-style="italic" font-weight="bold">NH</text>
</svg>
`;

async function generateIcons() {
    try {
        console.log('Generating PWA icons...');

        const buffer = Buffer.from(svgIcon);

        // Generate 512x512
        await sharp(buffer)
            .resize(512, 512)
            .png()
            .toFile(join(publicDir, 'icon-512.png'));
        console.log('Created icon-512.png');

        // Generate 192x192
        await sharp(buffer)
            .resize(192, 192)
            .png()
            .toFile(join(publicDir, 'icon-192.png'));
        console.log('Created icon-192.png');

        console.log('PWA icons generated successfully!');
    } catch (error) {
        console.error('Error generating icons:', error);
    }
}

generateIcons();
