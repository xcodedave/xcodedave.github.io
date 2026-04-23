import { chromium } from 'playwright';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '../..');

const experiments = [
  { name: 'forlorn',        url: 'https://xcodedave.github.io/experiments/forlorn/' },
  { name: 'sevenbillion',   url: 'https://xcodedave.github.io/experiments/sevenbillion/' },
  { name: 'swift-voxel',    url: 'https://xcodedave.github.io/experiments/swift-voxel/' },
  { name: 'flight',         url: 'https://xcodedave.github.io/experiments/flight/' },
  { name: 'avd-to-lottie',  url: 'https://xcodedave.github.io/experiments/avd-to-lottie/' },
  { name: 'screech',        url: 'https://xcodedave.github.io/experiments/screech/' },
];

const browser = await chromium.launch({
  headless: false,
  args: [
    '--enable-unsafe-webgpu',
    '--enable-features=Vulkan,UseSkiaRenderer',
    '--disable-web-security',
  ],
});

for (const { name, url } of experiments) {
  console.log(`Capturing ${name}...`);
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1280, height: 800 });

  try {
    await page.goto(url, { waitUntil: 'load', timeout: 30000 });
    await page.waitForTimeout(4000);

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
