const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const QUALITY = 75;
const WEBP_QUALITY = 70;
const DIR = path.resolve(__dirname, '..', 'src', 'assets', 'images');

async function optimizeFile(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const baseName = path.basename(filePath, ext);
  const stats = fs.statSync(filePath);

  if (stats.size < 2048 || baseName.startsWith('placeholder')) {
    return;
  }

  if (ext === '.webp') return;

  const img = sharp(filePath);
  const webpPath = path.join(DIR, `${baseName}.webp`);

  try {
    if (ext === '.jpg' || ext === '.jpeg') {
      await img.jpeg({ quality: QUALITY, mozjpeg: true }).toFile(filePath + '.tmp');
      fs.renameSync(filePath + '.tmp', filePath);
    } else if (ext === '.png') {
      await img.png({ quality: QUALITY, palette: true }).toFile(filePath + '.tmp');
      fs.renameSync(filePath + '.tmp', filePath);
    }

    await img.webp({ quality: WEBP_QUALITY }).toFile(webpPath);

    const newSize = (fs.statSync(filePath).size / 1024).toFixed(1);
    const webpSize = (fs.statSync(webpPath).size / 1024).toFixed(1);

    console.log(`  ${baseName}${ext}  ${(stats.size/1024).toFixed(1)}KB → ${newSize}KB / ${webpSize}KB (WebP)`);
  } catch (err) {
    console.error(`  ✗ ${baseName}${ext}: ${err.message}`);
  }
}

async function main() {
  console.log('\n🔧 Optimizing images...\n');

  function walk(dir) {
    let results = [];
    for (const entry of fs.readdirSync(dir)) {
      const full = path.join(dir, entry);
      if (fs.statSync(full).isDirectory()) {
        results = results.concat(walk(full));
      } else {
        const ext = path.extname(full).toLowerCase();
        if (['.jpg', '.jpeg', '.png'].includes(ext)) {
          results.push(full);
        }
      }
    }
    return results;
  }
  const files = walk(DIR);

  if (files.length === 0) {
    console.log('  No images in src/assets/images/');
    return;
  }

  for (const file of files) {
    await optimizeFile(file);
  }

  console.log('\n✅ Done!');
}

main().catch(console.error);
