import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { getCategoryContentConfig } from '../config/contentRuntimeConfigReadable.js';
import { hashText } from './contentHelpers.js';

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

export function getConfiguredCardImage(categoryId, seedText = '') {
  const config = getCategoryContentConfig(categoryId);
  const strategy = config.generatedCardImage || { mode: 'random', indices: [] };
  const category = config.assetFolder;

  if (strategy.mode === 'index') {
    return getCardImageByIndex(category, strategy.index || 0);
  }

  if (strategy.mode === 'hash' && Array.isArray(strategy.indices) && strategy.indices.length > 0) {
    const hash = hashText(seedText || categoryId);
    const pickedIndex = strategy.indices[hash % strategy.indices.length];
    return getCardImageByIndex(category, pickedIndex);
  }

  return getRandomCardImage(category);
}

export function getConfiguredMedalImage(categoryId, seedText = '') {
  const config = getCategoryContentConfig(categoryId);
  const strategy = config.generatedMedalImage || { mode: 'random', indices: [] };
  const category = config.assetFolder;

  if (strategy.mode === 'index') {
    return getMedalImageByIndex(category, strategy.index || 0);
  }

  if (strategy.mode === 'hash' && Array.isArray(strategy.indices) && strategy.indices.length > 0) {
    const hash = hashText(seedText || categoryId);
    const pickedIndex = strategy.indices[hash % strategy.indices.length];
    return getMedalImageByIndex(category, pickedIndex);
  }

  return getRandomMedalImage(category);
}
