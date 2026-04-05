import { getCategoryContentConfig } from '../config/contentRuntimeConfigReadable.js';

export function hashText(text) {
  let hash = 0;

  for (let index = 0; index < text.length; index += 1) {
    hash = (hash * 31 + text.charCodeAt(index)) >>> 0;
  }

  return hash;
}

export function pickByHash(list, hash, shift = 0) {
  if (!Array.isArray(list) || list.length === 0) {
    return '';
  }

  const normalizedHash = shift > 0 ? (hash >>> shift) : hash;
  return list[normalizedHash % list.length] || list[0];
}

export function selectFromList(list, seedText) {
  return pickByHash(list, hashText(seedText));
}

export function fillTemplate(template, params) {
  return template.replace(/\{(\w+)\}/g, (_, key) => `${params[key] ?? ''}`);
}

export function buildConfiguredCardDescription(categoryId, seedText) {
  const config = getCategoryContentConfig(categoryId);
  const template = selectFromList(config.cardDescriptions, seedText);
  return fillTemplate(template, { label: config.label });
}

export function buildConfiguredMedalDescription(categoryId, seedText) {
  const config = getCategoryContentConfig(categoryId);
  const template = selectFromList(config.medalDescriptions, seedText);
  return fillTemplate(template, { label: config.label });
}
