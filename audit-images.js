/* eslint-disable @typescript-eslint/no-require-imports, @typescript-eslint/no-unused-vars */
const fs = require('fs');
const path = require('path');

const databaseFile = path.join(__dirname, 'src', 'data', 'heritageSites.ts');
const imagesDir = path.join(__dirname, 'public', 'images', 'heritage');

if (!fs.existsSync(databaseFile)) {
  console.error('[ERROR] Database file not found at: ' + databaseFile);
  process.exit(1);
}

if (!fs.existsSync(imagesDir)) {
  console.error('[ERROR] Images directory not found at: ' + imagesDir);
  process.exit(1);
}

const content = fs.readFileSync(databaseFile, 'utf8');

// Strip TypeScript import and export statements to get clean JSON
const jsonStart = content.indexOf('[');
const jsonEnd = content.lastIndexOf(']') + 1;

if (jsonStart === -1 || jsonEnd === 0) {
  console.error('[ERROR] Could not locate array structure in database file.');
  process.exit(1);
}

const jsonString = content.substring(jsonStart, jsonEnd);
let sitesList = [];
try {
  sitesList = JSON.parse(jsonString);
} catch (e) {
  console.log('Failed to parse as JSON. Trying eval fallback...');
  try {
    // If there are trailing commas or unquoted keys, eval will work
    sitesList = eval(jsonString);
  } catch (evalErr) {
    console.error('[ERROR] Failed to parse database content:', evalErr.message);
    process.exit(1);
  }
}

console.log('--- Database Image Audit ---');
console.log(`Successfully parsed ${sitesList.length} sites from database.\n`);

const physicalFiles = fs.readdirSync(imagesDir).map(file => file.toLowerCase());
console.log(`Physical files in public/images/heritage (${physicalFiles.length} files):`);
console.log(JSON.stringify(physicalFiles, null, 2));
console.log('\n----------------------------\n');

let failuresCount = 0;
const matchedFiles = new Set();
const duplicateImages = {};

sitesList.forEach((site) => {
  console.log(`Site ID: "${site.id}" | Name: "${site.name}"`);
  console.log(`  Mapped Path: "${site.image}"`);
  
  // 1. Check if path format is correct
  if (!site.image.startsWith('/images/heritage/')) {
    console.error(`  [FAIL] Image path "${site.image}" is not starting with "/images/heritage/"`);
    failuresCount++;
  }

  const filename = path.basename(site.image).toLowerCase();
  
  // 2. Check if file exists physically
  const exists = physicalFiles.includes(filename);
  if (!exists) {
    console.error(`  [FAIL] Physical file not found in public/images/heritage: "${filename}"`);
    failuresCount++;
  } else {
    matchedFiles.add(filename);
    const filePath = path.join(imagesDir, filename);
    const size = fs.statSync(filePath).size;
    if (size < 100) {
      console.error(`  [FAIL] Physical file "${filename}" is too small (${size} bytes) or empty.`);
      failuresCount++;
    } else {
      console.log(`  [OK] Physical file exists and is valid (${size} bytes).`);
    }
  }

  // 3. Check for duplicates/incorrect mappings
  if (duplicateImages[site.image]) {
    duplicateImages[site.image].push(site.id);
  } else {
    duplicateImages[site.image] = [site.id];
  }
});

console.log('\n--- Duplicate Mapping Check ---');
Object.entries(duplicateImages).forEach(([img, mappedIds]) => {
  if (mappedIds.length > 1) {
    console.warn(`  [FAIL] Duplicate mapping: Path "${img}" is mapped to multiple IDs: ${mappedIds.join(', ')}`);
    failuresCount++;
  } else {
    console.log(`  [OK] Path "${img}" mapped uniquely to "${mappedIds[0]}"`);
  }
});

console.log('\n--- Unused Physical Files Check ---');
const unusedFiles = physicalFiles.filter(file => !matchedFiles.has(file));
if (unusedFiles.length > 0) {
  console.warn(`  [WARN] Unused physical files in directory: ${unusedFiles.join(', ')}`);
} else {
  console.log('  [OK] No unused physical files in public/images/heritage.');
}

console.log(`\nAudit completed. Total failures found: ${failuresCount}`);

if (failuresCount > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
