import sharp from 'sharp';
import fs from 'fs';

async function processLogo(inputPath: string, outputPath: string) {
  const image = sharp(inputPath);
  const metadata = await image.metadata();
  const width = metadata.width!;
  const height = metadata.height!;

  // Get raw RGBA buffer
  const raw = await image.ensureAlpha().raw().toBuffer();
  
  // Flood fill from outer borders (all 4 corners and perimeter)
  // A pixel is considered outside background if it is connected to the perimeter
  // and its luminance or max(r,g,b) < 30
  const visited = new Uint8Array(width * height);
  const queue: number[] = [];

  function isBackgroundPixel(idx: number): boolean {
    const r = raw[idx * 4];
    const g = raw[idx * 4 + 1];
    const b = raw[idx * 4 + 2];
    // Outer background is pure black or very dark near black
    return r < 35 && g < 35 && b < 35;
  }

  // Push all border pixels that are dark
  for (let x = 0; x < width; x++) {
    const topIdx = x;
    const botIdx = (height - 1) * width + x;
    if (isBackgroundPixel(topIdx)) {
      visited[topIdx] = 1;
      queue.push(topIdx);
    }
    if (isBackgroundPixel(botIdx)) {
      visited[botIdx] = 1;
      queue.push(botIdx);
    }
  }

  for (let y = 0; y < height; y++) {
    const leftIdx = y * width;
    const rightIdx = y * width + (width - 1);
    if (!visited[leftIdx] && isBackgroundPixel(leftIdx)) {
      visited[leftIdx] = 1;
      queue.push(leftIdx);
    }
    if (!visited[rightIdx] && isBackgroundPixel(rightIdx)) {
      visited[rightIdx] = 1;
      queue.push(rightIdx);
    }
  }

  // BFS
  let head = 0;
  while (head < queue.length) {
    const curr = queue[head++];
    const cx = curr % width;
    const cy = Math.floor(curr / width);

    // Set alpha to 0 for background
    raw[curr * 4 + 3] = 0;

    const neighbors = [
      cy > 0 ? (cy - 1) * width + cx : -1,
      cy < height - 1 ? (cy + 1) * width + cx : -1,
      cx > 0 ? cy * width + (cx - 1) : -1,
      cx < width - 1 ? cy * width + (cx + 1) : -1,
    ];

    for (const n of neighbors) {
      if (n !== -1 && !visited[n]) {
        visited[n] = 1;
        if (isBackgroundPixel(n)) {
          queue.push(n);
        }
      }
    }
  }

  // Save as transparent PNG
  await sharp(raw, {
    raw: {
      width,
      height,
      channels: 4,
    },
  })
    .png()
    .toFile(outputPath);

  console.log(`Saved transparent logo: ${outputPath} (${width}x${height})`);
}

async function main() {
  await processLogo(
    'c:/Users/Zakar/Documents/Web_Dev/DzPrimeAcademy/frontend/public/images/dzprime-logo-amber.jpg',
    'c:/Users/Zakar/Documents/Web_Dev/DzPrimeAcademy/frontend/public/images/dzprime-logo-amber.png'
  );
  await processLogo(
    'c:/Users/Zakar/Documents/Web_Dev/DzPrimeAcademy/frontend/public/images/dzprime-logo-blue.jpg',
    'c:/Users/Zakar/Documents/Web_Dev/DzPrimeAcademy/frontend/public/images/dzprime-logo-blue.png'
  );
}

main().catch(console.error);
