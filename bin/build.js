#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const sass = require('sass');

const rootDir = path.resolve(__dirname, '..');
const distDir = path.join(rootDir, 'distri');

console.log('Iniciando proceso de build para producción en distri...');

// 1. Limpieza de distri
if (fs.existsSync(distDir)) {
  fs.rmSync(distDir, { recursive: true, force: true });
}
fs.mkdirSync(distDir, { recursive: true });
fs.mkdirSync(path.join(distDir, 'css'), { recursive: true });
fs.mkdirSync(path.join(distDir, 'js'), { recursive: true });
fs.mkdirSync(path.join(distDir, 'img'), { recursive: true });
fs.mkdirSync(path.join(distDir, 'fonts'), { recursive: true });

// 2. Compilar SCSS
console.log('Compilando SCSS...');
const scssFile = path.join(rootDir, 'css', 'styles.scss');
const cssOutputFile = path.join(rootDir, 'css', 'styles.css');
const distCssFile = path.join(distDir, 'css', 'styles.css');

const compiled = sass.compile(scssFile, { style: 'compressed' });
fs.writeFileSync(cssOutputFile, compiled.css);
fs.writeFileSync(distCssFile, compiled.css);
console.log('SCSS compilado a CSS (comprimido para producción).');

// 3. Copiar HTML
console.log('Copiando archivos HTML...');
fs.copyFileSync(path.join(rootDir, 'index.html'), path.join(distDir, 'index.html'));

// 4. Copiar JS
console.log('Copiando archivos JS...');
const jsFiles = fs.readdirSync(path.join(rootDir, 'js')).filter(f => f.endsWith('.js'));
jsFiles.forEach(file => {
  fs.copyFileSync(path.join(rootDir, 'js', file), path.join(distDir, 'js', file));
});

// 5. Copiar Imágenes
console.log('Copiando imágenes...');
const imgFiles = fs.readdirSync(path.join(rootDir, 'img'));
imgFiles.forEach(file => {
  fs.copyFileSync(path.join(rootDir, 'img', file), path.join(distDir, 'img', file));
});

// 6. Copiar fuentes de Open Iconic
console.log('Copiando fuentes de Open Iconic...');
const openIconicFonts = path.join(rootDir, 'node_modules', 'open-iconic', 'font', 'fonts');
if (fs.existsSync(openIconicFonts)) {
  const fontFiles = fs.readdirSync(openIconicFonts);
  fontFiles.forEach(file => {
    fs.copyFileSync(path.join(openIconicFonts, file), path.join(distDir, 'fonts', file));
  });
}

// 7. Copiar dependencias esenciales (bootstrap, jquery, popper, open-iconic css) para que distri sea 100% autocontenido
console.log('Copiando dependencias vendor a distri...');
const vendorDest = path.join(distDir, 'node_modules');
fs.mkdirSync(vendorDest, { recursive: true });

function copyRecursiveSync(src, dest) {
  const exists = fs.existsSync(src);
  const stats = exists && fs.statSync(src);
  const isDirectory = exists && stats.isDirectory();
  if (isDirectory) {
    if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
    fs.readdirSync(src).forEach(childItemName => {
      copyRecursiveSync(path.join(src, childItemName), path.join(dest, childItemName));
    });
  } else if (exists) {
    fs.copyFileSync(src, dest);
  }
}

// Copiar paquetes requeridos
['bootstrap/dist', 'jquery/dist', 'popper.js/dist', 'open-iconic/font'].forEach(pkg => {
  const srcPkg = path.join(rootDir, 'node_modules', pkg);
  const destPkg = path.join(vendorDest, pkg);
  if (fs.existsSync(srcPkg)) {
    copyRecursiveSync(srcPkg, destPkg);
  }
});

console.log('¡Build de producción finalizado con éxito en distri!');
