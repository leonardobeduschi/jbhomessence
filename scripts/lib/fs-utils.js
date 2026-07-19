const fs = require('fs');
const path = require('path');

function ensureDirectoryExists(dirPath) {
  const absolutePath = path.resolve(dirPath);
  if (!fs.existsSync(absolutePath)) {
    fs.mkdirSync(absolutePath, { recursive: true });
    console.log(`✔ Diretório criado: ${absolutePath}`);
  }
}

function saveFile(filePath, content) {
  const absolutePath = path.resolve(filePath);
  fs.writeFileSync(absolutePath, content, 'utf8');
  console.log(`  Arquivo salvo: ${absolutePath}`);
  return absolutePath;
}

function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

module.exports = { ensureDirectoryExists, saveFile, slugify };
