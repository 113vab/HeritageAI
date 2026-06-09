/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs');
const path = require('path');
const https = require('https');
const urlModule = require('url');

const dir = path.join(__dirname, 'public', 'images', 'heritage');

// Recreate directory to start fresh
if (fs.existsSync(dir)) {
  fs.readdirSync(dir).forEach(file => {
    fs.unlinkSync(path.join(dir, file));
  });
  console.log('Cleared existing images directory.');
} else {
  fs.mkdirSync(dir, { recursive: true });
}

// Candidates of full Unsplash CDN Photo IDs (with unix timestamp + hex slug)
const candidates = {
  'taj-mahal': [
    '1564507592333-c60657eea523',
    '1548013146-72479768bada',
    '1592635196078-9fdc757f27f4'
  ],
  'hampi': [
    '1600100397608-f010e47fa188',
    '1588537651034-724e5485f812',
    '1616843413587-9e3a37f7bbd8'
  ],
  'qutub-minar': [
    '1620127252536-03bdfcf6d5c3',
    '1599932971217-10777508cf31',
    '1582510003544-4d00b7f74220'
  ],
  'red-fort': [
    '1585506942613-282a087cd330',
    '1589308078059-be1415eab4c3'
  ],
  'ajanta-caves': [
    '1608958415712-cb4fa34f199b',
    '1596176530529-78163a4f7af2'
  ],
  'ellora-caves': [
    '1590050752117-238cb0fb12b1',
    '1608958415712-cb4fa34f199b'
  ],
  'konark-sun-temple': [
    '1599839619424-dfb7914f6b21',
    '1604580864964-0462f5d5b1a8'
  ],
  'khajuraho': [
    '1629814234054-d368e7d23d8c',
    '1612443425576-9cf17d230303'
  ],
  'fatehpur-sikri': [
    '1601999109332-542b18dbec57',
    '1590050752117-238cb0fb12b1'
  ],
  'sanchi-stupa': [
    '1623947477610-850f38b1f8fa',
    '1582236968032-1598cc0fa5b6'
  ],
  'western-ghats': [
    '1588615419957-bf66d53c6b4b',
    '1611001716885-b3402558a62b'
  ],
  'great-living-chola-temples': [
    '1582510003544-4d00b7f74220',
    '1600100397608-f010e47fa188'
  ],
  'kaziranga-national-park': [
    '1528127269322-539801943592',
    '1540979388789-6eca280b497f'
  ],
  'rani-ki-vav': [
    '1604580864964-0462f5d5b1a8',
    '1629814234054-d368e7d23d8c'
  ],
  'hill-forts-rajasthan': [
    '1599661046289-e31897846e41',
    '1603262110263-fb0112e7cc33'
  ],
  'sundarbans': [
    '1616137422495-1e9e46e2aa77',
    '1540979388789-6eca280b497f'
  ],
  'mahabodhi-temple': [
    '1596176530529-78163a4f7af2',
    '1590050752117-238cb0fb12b1',
    '1540979388789-6eca280b497f'
  ],
  'humayuns-tomb': [
    '1599932971217-10777508cf31',
    '1582510003544-4d00b7f74220'
  ],
  'jantar-mantar': [
    '1603262110263-fb0112e7cc33',
    '1477587458883-471a5ed94245'
  ],
  'nalanda': [
    '1628155930542-3c7a64e2c833',
    '1596176530529-78163a4f7af2'
  ]
};

// Download logic with browser User-Agent
function download(targetUrl, filename) {
  return new Promise((resolve, reject) => {
    function get(u) {
      const parsedUrl = urlModule.parse(u);
      const options = {
        hostname: parsedUrl.hostname,
        path: parsedUrl.path,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'image/avif,image/webp,image/apng,image/*,*/*;q=0.8'
        }
      };

      https.get(options, (response) => {
        if (response.statusCode === 301 || response.statusCode === 302) {
          get(response.headers.location);
          return;
        }
        if (response.statusCode !== 200) {
          reject(new Error(`HTTP ${response.statusCode}`));
          return;
        }
        
        const file = fs.createWriteStream(filename);
        response.pipe(file);
        file.on('finish', () => {
          file.close();
          resolve();
        });
      }).on('error', (err) => {
        fs.unlink(filename, () => {});
        reject(err);
      });
    }
    get(targetUrl);
  });
}

async function run() {
  console.log('Force-downloading fresh monument images...');
  const sizeMap = {}; // Maps size in bytes -> ID of monument
  let errorsCount = 0;

  for (const [id, ids] of Object.entries(candidates)) {
    const filename = path.join(dir, `${id}.jpg`);
    let success = false;

    console.log(`\nProcessing: "${id}"`);

    for (const photoId of ids) {
      // Direct public CDN URL for high resolution format
      const url = `https://images.unsplash.com/photo-${photoId}?auto=format&fit=crop&q=80&w=800`;
      try {
        console.log(`- Trying Unsplash photo-ID: ${photoId}`);
        await download(url, filename);

        if (fs.existsSync(filename)) {
          const size = fs.statSync(filename).size;

          // 1. Verify size is not tiny (not an error page)
          if (size < 5000) {
            console.log(`  [REJECT] File size too small (${size} bytes) - likely placeholder.`);
            fs.unlinkSync(filename);
            continue;
          }

          // 2. Verify it is not a duplicate size of an already downloaded image
          if (sizeMap[size]) {
            console.log(`  [REJECT] Duplicate file size detected: ${size} bytes (same as ${sizeMap[size]}).`);
            fs.unlinkSync(filename);
            continue;
          }

          // 3. Success! Mark size in registry
          console.log(`  [ACCEPT] Saved successfully (${size} bytes).`);
          sizeMap[size] = id;
          success = true;
          break;
        }
      } catch (e) {
        console.log(`  [FAIL] Failed: ${e.message}`);
      }
    }

    if (!success) {
      console.error(`  [CRITICAL] All candidate downloads failed or returned duplicates for "${id}"!`);
      errorsCount++;
    }
  }

  console.log('\n--- Final Summary ---');
  console.log(`Total unique files downloaded: ${fs.readdirSync(dir).length}/20`);
  console.log(`Process ended with ${errorsCount} failures.`);
  
  if (errorsCount > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

run();
