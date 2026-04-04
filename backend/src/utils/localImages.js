import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CARDS_DIR = path.join(__dirname, '../../public/images/cards');
const MEDALS_DIR = path.join(__dirname, '../../public/images/medals');

const CARDS_PREFIX = '/images/cards/';
const MEDALS_PREFIX = '/images/medals/';

const IMAGE_EXTENSIONS = ['.png', '.jpg', '.jpeg', '.webp', '.svg'];

function getRandomImageFromDirectory(baseDir, basePrefix, category = null) {
  try {
    const targetDir = category ? path.join(baseDir, category) : baseDir;
    const files = fs.readdirSync(targetDir).filter(f =>
      IMAGE_EXTENSIONS.includes(path.extname(f).toLowerCase())
    );

    if (files.length === 0) return null;

    const file = files[Math.floor(Math.random() * files.length)];
    return category
      ? `${basePrefix}${encodeURIComponent(category)}/${file}`
      : `${basePrefix}${file}`;
  } catch {
    return null;
  }
}

export function getRandomCardImage(category = null) {
  return getRandomImageFromDirectory(CARDS_DIR, CARDS_PREFIX, category);
}

export function getRandomMedalImage(category = null) {
  return getRandomImageFromDirectory(MEDALS_DIR, MEDALS_PREFIX, category);
}
