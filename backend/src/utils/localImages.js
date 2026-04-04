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

function getImagesFromDirectory(baseDir, basePrefix, category = null) {
  try {
    const targetDir = category ? path.join(baseDir, category) : baseDir;
    const files = fs.readdirSync(targetDir).filter(f =>
      IMAGE_EXTENSIONS.includes(path.extname(f).toLowerCase())
    ).sort((left, right) => left.localeCompare(right));

    return files.map((file) => (
      category
        ? `${basePrefix}${encodeURIComponent(category)}/${file}`
        : `${basePrefix}${file}`
    ));
  } catch {
    return [];
  }
}

export function getRandomCardImage(category = null) {
  const images = getImagesFromDirectory(CARDS_DIR, CARDS_PREFIX, category);
  if (images.length === 0) return null;
  return images[Math.floor(Math.random() * images.length)];
}

export function getRandomMedalImage(category = null) {
  const images = getImagesFromDirectory(MEDALS_DIR, MEDALS_PREFIX, category);
  if (images.length === 0) return null;
  return images[Math.floor(Math.random() * images.length)];
}

export function getCardImageByIndex(category = null, index = 0) {
  const images = getImagesFromDirectory(CARDS_DIR, CARDS_PREFIX, category);
  if (images.length === 0) return null;
  return images[index % images.length];
}

export function getMedalImageByIndex(category = null, index = 0) {
  const images = getImagesFromDirectory(MEDALS_DIR, MEDALS_PREFIX, category);
  if (images.length === 0) return null;
  return images[index % images.length];
}
