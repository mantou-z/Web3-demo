import {
  CATEGORY_CONTENT_CONFIG,
  CATEGORY_ORDER,
  DIMENSION_MAP,
  getCategoryContentConfig,
} from '../config/contentRuntimeConfigReadable.js';
import {
  buildConfiguredCardDescription,
  buildConfiguredMedalDescription,
  hashText,
  pickByHash,
  selectFromList,
} from '../utils/contentHelpers.js';

function scoreCategory(input, keywords) {
  return keywords.reduce((score, keyword) => (input.includes(keyword) ? score + 1 : score), 0);
}

function splitInputToFragments(input) {
  return input
    .split(/[\u3002\uff01\uff1f!?\n\r\uff1b;,\uff0c]/)
    .map((fragment) => fragment.trim())
    .filter(Boolean);
}

function buildOreText(fragment, categoryId) {
  const config = getCategoryContentConfig(categoryId);
  const hash = hashText(fragment);
  const prefix = pickByHash(config.orePrefixes, hash);
  const suffix = pickByHash(config.oreSuffixes, hash, 3);
  const core = fragment.length > 18 ? `${fragment.slice(0, 18)}...` : fragment;

  return `${prefix}${suffix}\uff1a${core}`;
}

export function classifyInput(input) {
  const scored = CATEGORY_ORDER.map((categoryId) => ({
    categoryId,
    score: scoreCategory(input, CATEGORY_CONTENT_CONFIG[categoryId].keywords),
  }));

  scored.sort((left, right) => right.score - left.score);

  return scored[0] && scored[0].score > 0 ? scored[0].categoryId : 'growth';
}

export function extractLocalOres(input) {
  const categoryId = classifyInput(input);
  const config = getCategoryContentConfig(categoryId);
  const dimension = DIMENSION_MAP[categoryId];
  const fragments = splitInputToFragments(input);
  const chosenFragments = (fragments.length > 0 ? fragments : [input]).slice(0, 3);

  const ores = chosenFragments.map((fragment, index) => ({
    id: index + 1,
    text: buildOreText(fragment, categoryId),
    dimension,
    score: 3 + (hashText(`${fragment}-${index}`) % 3),
    category: config.label,
    categoryId,
    assetCategory: config.assetFolder,
  }));

  return { category: config.label, categoryId, assetCategory: config.assetFolder, ores };
}

export function buildLocalCardContent(ores) {
  const categoryId = ores[0]?.refined_data?.categoryId || ores[0]?.categoryId || 'growth';
  const config = getCategoryContentConfig(categoryId);
  const seedText = ores.map((ore) => ore.id).join('-');

  return {
    category: config.label,
    categoryId,
    assetCategory: config.assetFolder,
    cardTitle: selectFromList(config.cardTitles, seedText),
    imagePrompt: `${config.label} themed fantasy card`,
    description: buildConfiguredCardDescription(categoryId, seedText),
  };
}

export function buildLocalMedalContent(cards, existingMedal = null) {
  const sourceText = cards.map((card) => card.title).join('|');
  const categoryId = classifyInput(sourceText);
  const config = getCategoryContentConfig(categoryId);
  const titleSeed = existingMedal ? `${sourceText}-evolved` : sourceText;

  return {
    category: config.label,
    categoryId,
    assetCategory: config.assetFolder,
    medalTitle: existingMedal
      ? selectFromList(config.medalTitles, titleSeed)
      : selectFromList(config.medalTitles, titleSeed),
    medalDescription: buildConfiguredMedalDescription(categoryId, titleSeed),
    imagePrompt: `${config.label} themed sacred medal`,
  };
}
