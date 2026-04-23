import { chromium } from 'playwright';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '../..');

const experiments = [
  { name: 'forlorn',        url: 'https://xcodedave.github.io/experiments/forlorn/',       wait: 4000 },
  { name: 'sevenbillion',   url: 'https://xcodedave.github.io/experiments/sevenbillion/',  wait: 2000 },
  { name: 'swift-voxel',    url: 'https://xcodedave.github.io/experiments/swift-voxel/',  wait: 4000 },
  { name: 'flight',         url: 'https://xcodedave.github.io/experiments/flight/',        wait: 10000 },
  { name: 'avd-to-lottie',  url: 'https://xcodedave.github.io/experiments/avd-to-lottie/', wait: 4000 },
  { name: 'screech',        url: 'https://xcodedave.github.io/experiments/screech/',       wait: 4000 },
];

const browser = await chromium.launch({
  channel: 'chrome',
  headless: false,
  args: [
    '--enable-unsafe-webgpu',
    '--ignore-gpu-blocklist',
  ],
});

for (const { name, url, wait } of experiments) {
  console.log(`Capturing ${name}...`);
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1280, height: 800 });

  try {
    await page.goto(url, { waitUntil: 'load', timeout: 30000 });
    await page.waitForTimeout(wait);

    const outPath = path.join(repoRoot, 'experiments', name, 'preview.png');
    await page.screenshot({ path: outPath, type: 'png' });
    console.log(`  Saved -> ${outPath}`);
  } catch (err) {
    console.error(`  Failed: ${err.message}`);
  } finally {
    await page.close();
  }
}

await browser.close();
console.log('Done.');
