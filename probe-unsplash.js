/* eslint-disable @typescript-eslint/no-require-imports */
const https = require('https');

const candidates = {
  'khajuraho': [
    '1629814234054-d368e7d23d8c',
    '1612443425576-9cf17d230303',
    '1626621341517-bbf3d9990a23', // from search
    '1612443425576-9cf17d230303',
    '1566843413587-9e3a37f7bbd8'
  ],
  'sanchi-stupa': [
    '1623947477610-850f38b1f8fa',
    '1582236968032-1598cc0fa5b6',
    '1544989164-3294a974b7b7',
    '1606293926075-69a00dbfde81',
    '1507729346519-1558c2ef4fa3'
  ],
  'rani-ki-vav': [
    '1604580864964-0462f5d5b1a8',
    '1629814234054-d368e7d23d8c',
    '1599661046289-e31897846e41',
    '1616843413587-9e3a37f7bbd8',
    '1588537651034-724e5485f812'
  ],
  'mahabodhi-temple': [
    '1596176530529-78163a4f7af2',
    '1590050752117-238cb0fb12b1',
    '1540979388789-6eca280b497f',
    '1548013146-72479768bada',
    '1592635196078-9fdc757f27f4'
  ],
  'humayuns-tomb': [
    '1599932971217-10777508cf31',
    '1582510003544-4d00b7f74220',
    '1560448204-e02f11c3d0e2', // from search
    '1599932971217-10777508cf31',
    '1582510003544-4d00b7f74220'
  ]
};

function test(photoId) {
  return new Promise((resolve) => {
    const url = `https://images.unsplash.com/photo-${photoId}?auto=format&fit=crop&q=80&w=800`;
    const options = {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    };
    https.get(url, options, (res) => {
      resolve({ photoId, statusCode: res.statusCode, size: res.headers['content-length'] });
    }).on('error', (err) => {
      resolve({ photoId, error: err.message });
    });
  });
}

async function run() {
  console.log('Probing Unsplash CDN for candidates...');
  for (const [name, ids] of Object.entries(candidates)) {
    console.log(`\nCandidates for "${name}":`);
    for (const photoId of ids) {
      const res = await test(photoId);
      console.log(`  - ID: ${photoId} | Status: ${res.statusCode || res.error} | Content-Length: ${res.size || 'N/A'}`);
    }
  }
}

run();
