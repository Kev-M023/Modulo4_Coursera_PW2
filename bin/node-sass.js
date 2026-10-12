#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const sass = require('sass');

const args = process.argv.slice(2);
let outDir = 'css';
let inDir = 'css';

for (let i = 0; i < args.length; i++) {
  if (args[i] === '-o' && args[i + 1]) {
    outDir = args[i + 1].replace(/\/+$/, '');
    i++;
  } else if (!args[i].startsWith('-')) {
    inDir = args[i].replace(/\/+$/, '');
  }
}

if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

if (fs.existsSync(inDir)) {
  const files = fs.readdirSync(inDir).filter(f => f.endsWith('.scss') && !f.startsWith('_'));
  files.forEach(file => {
    const src = path.join(inDir, file);
    const dest = path.join(outDir, file.replace(/\.scss$/, '.css'));
    const result = sass.compile(src, { style: 'expanded' });
    fs.writeFileSync(dest, result.css);
    console.log(`Compilado exitosamente: ${src} => ${dest}`);
  });
}
