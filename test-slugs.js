/* eslint-disable @typescript-eslint/no-require-imports */
const https = require('https');

const slugs = {
  'khajuraho': 'EnOCVg-jt2X',
  'sanchi-stupa': 'GbzQ_UO-7p5',
  'rani-ki-vav': 'EdtAYndQtGv',
  'mahabodhi-temple': 'E9hHnQ7MV0G',
  'humayuns-tomb': 'FPxZ5jDWFJy'
};

function test(slug) {
  return new Promise((resolve) => {
    const url = `https://images.unsplash.com/photo-${slug}?auto=format&fit=crop&q=80&w=800`;
    https.get(url, (res) => {
      resolve({ slug, statusCode: res.statusCode, size: res.headers['content-length'] });
    }).on('error', (err) => {
      resolve({ slug, error: err.message });
    });
  });
}

async function run() {
  console.log('Testing Unsplash CDN alphanumeric slugs...');
  for (const [name, slug] of Object.entries(slugs)) {
    const res = await test(slug);
    console.log(`- ${name} (${slug}): Status=${res.statusCode || res.error} | Content-Length=${res.size || 'N/A'}`);
  }
}

run();
