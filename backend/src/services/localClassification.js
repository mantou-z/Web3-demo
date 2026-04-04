const CATEGORY_CONFIG = {
  knowledge: {
    label: '\u77e5\u8bc6',
    assetFolder: '\u77e5\u8bc6',
    keywords: [
      '\u5b66\u4e60', '\u8bfb\u4e66', '\u9605\u8bfb', '\u8bfe\u7a0b', '\u7b14\u8bb0', '\u77e5\u8bc6', '\u7406\u89e3', '\u7814\u7a76', '\u8bba\u6587', '\u7b97\u6cd5',
      '\u601d\u8003', '\u5206\u6790', '\u603b\u7ed3', '\u590d\u76d8', '\u8bad\u7ec3\u8425', '\u4f5c\u4e1a', '\u8003\u8bd5', '\u8bb0\u5fc6', '\u5199\u4f5c', '\u82f1\u8bed',
      '\u6570\u5b66', '\u7269\u7406', '\u7f16\u7a0b', '\u4ee3\u7801', '\u5f00\u53d1', '\u8c03\u8bd5', '\u6280\u672f',
    ],
    orePrefixes: ['\u542f\u660e', '\u6d1e\u89c1', '\u6c42\u7d22', '\u660e\u7406', '\u8bc6\u6d77'],
    oreSuffixes: ['\u788e\u6676', '\u7075\u5c51', '\u5fae\u5149', '\u68f1\u7247', '\u4e4b\u7802'],
    cardTitles: ['\u77e5\u8bc6\u4e4b\u8bc1', '\u6c42\u7d22\u523b\u5370', '\u6d1e\u89c1\u624e\u8bb0', '\u542f\u660e\u7bc7\u7ae0', '\u601d\u8fa8\u91cc\u7a0b\u7891'],
    medalTitles: ['\u667a\u8bc6\u4e4b\u8bc1', '\u6c42\u77e5\u4e4b\u5370', '\u6d1e\u89c1\u5fbd\u7ae0', '\u660e\u7406\u4e4b\u51a0', '\u5b66\u8bc6\u89c9\u7ae0'],
    medalDescriptionPrefix: '\u4f60\u5c06\u6301\u7eed\u6c42\u7d22\u51dd\u6210\u53ef\u88ab\u770b\u89c1\u7684\u5149\u3002',
  },
  exercise: {
    label: '\u8fd0\u52a8',
    assetFolder: '\u8fd0\u52a8',
    keywords: [
      '\u8fd0\u52a8', '\u8dd1\u6b65', '\u5065\u8eab', '\u8bad\u7ec3', '\u953b\u70bc', '\u745c\u4f3d', '\u9a91\u884c', '\u6e38\u6cf3', '\u7fbd\u6bdb\u7403', '\u7bee\u7403',
      '\u8db3\u7403', '\u529b\u91cf', '\u8010\u529b', '\u4f53\u80fd', '\u51cf\u8102', '\u589e\u808c', '\u62c9\u4f38', '\u6b65\u6570', '\u65e9\u8d77', '\u4f5c\u606f',
      '\u6668\u8dd1', '\u722c\u5c71', '\u6563\u6b65', '\u4fef\u5367\u6491', '\u6df1\u8e72', '\u8df3\u7ef3',
    ],
    orePrefixes: ['\u71c3\u5fc3', '\u75be\u884c', '\u94c1\u610f', '\u8dc3\u52a8', '\u8109\u51b2'],
    oreSuffixes: ['\u788e\u6676', '\u7075\u6838', '\u5fae\u5149', '\u523b\u7247', '\u4e4b\u706b'],
    cardTitles: ['\u8fd0\u52a8\u4e4b\u8bc1', '\u8010\u529b\u523b\u5370', '\u70ed\u8840\u7bc7\u7ae0', '\u81ea\u5f8b\u91cc\u7a0b\u7891', '\u529b\u91cf\u624e\u8bb0'],
    medalTitles: ['\u6bc5\u884c\u4e4b\u8bc1', '\u953b\u4f53\u4e4b\u5370', '\u70ed\u8840\u5fbd\u7ae0', '\u6052\u6bc5\u4e4b\u51a0', '\u8dc3\u52a8\u89c9\u7ae0'],
    medalDescriptionPrefix: '\u4f60\u628a\u53cd\u590d\u575a\u6301\u7194\u94f8\u6210\u4e86\u6e05\u6670\u53ef\u89c1\u7684\u529b\u91cf\u3002',
  },
  growth: {
    label: '\u6210\u957f',
    assetFolder: '\u6210\u957f',
    keywords: [
      '\u6210\u957f', '\u8ba1\u5212', '\u76ee\u6807', '\u4e60\u60ef', '\u884c\u52a8', '\u7a81\u7834', '\u6539\u53d8', '\u575a\u6301', '\u6267\u884c', '\u5b8c\u6210',
      '\u6548\u7387', '\u7ba1\u7406', '\u6c9f\u901a', '\u8868\u8fbe', '\u751f\u6d3b', '\u6574\u7406', '\u5bb6\u52a1', '\u5b9e\u8df5', '\u9879\u76ee', '\u5408\u4f5c',
      '\u793e\u4ea4', '\u5206\u4eab', '\u4e60\u60ef\u517b\u6210', '\u53cd\u601d', '\u60c5\u7eea', '\u81ea\u6211',
    ],
    orePrefixes: ['\u65b0\u751f', '\u8734\u53d8', '\u6c89\u6dc0', '\u8fdc\u5fd7', '\u6052\u5fc3'],
    oreSuffixes: ['\u788e\u6676', '\u7075\u5c51', '\u523b\u7247', '\u5fae\u8292', '\u4e4b\u5c18'],
    cardTitles: ['\u6210\u957f\u4e4b\u8bc1', '\u8734\u53d8\u523b\u5370', '\u8fdc\u5fd7\u7bc7\u7ae0', '\u81ea\u7701\u624e\u8bb0', '\u8fdb\u9636\u91cc\u7a0b\u7891'],
    medalTitles: ['\u6210\u957f\u4e4b\u8bc1', '\u8734\u53d8\u4e4b\u5370', '\u8fdc\u5fd7\u5fbd\u7ae0', '\u81ea\u6301\u4e4b\u51a0', '\u8fdb\u9636\u89c9\u7ae0'],
    medalDescriptionPrefix: '\u4f60\u628a\u4e00\u6b21\u6b21\u5177\u4f53\u884c\u52a8\u6c89\u6dc0\u6210\u4e86\u771f\u6b63\u7684\u6539\u53d8\u3002',
  },
};

const CATEGORY_ORDER = ['knowledge', 'exercise', 'growth'];

const DIMENSION_MAP = {
  knowledge: 'Wisdom',
  exercise: 'Will',
  growth: 'Creation',
};

function scoreCategory(input, keywords) {
  return keywords.reduce((score, keyword) => (input.includes(keyword) ? score + 1 : score), 0);
}

function hashText(text) {
  let hash = 0;

  for (let index = 0; index < text.length; index += 1) {
    hash = (hash * 31 + text.charCodeAt(index)) >>> 0;
  }

  return hash;
}

function pickByHash(list, hash, shift = 0) {
  if (!Array.isArray(list) || list.length === 0) {
    return '';
  }

  const normalizedHash = shift > 0 ? (hash >>> shift) : hash;
  return list[normalizedHash % list.length] || list[0];
}

function splitInputToFragments(input) {
  return input
    .split(/[\u3002\uff01\uff1f!?\n\r\uff1b;,\uff0c]/)
    .map((fragment) => fragment.trim())
    .filter(Boolean);
}

function buildOreText(fragment, categoryId) {
  const config = CATEGORY_CONFIG[categoryId] || CATEGORY_CONFIG.growth;
  const hash = hashText(fragment);
  const prefix = pickByHash(config.orePrefixes, hash);
  const suffix = pickByHash(config.oreSuffixes, hash, 3);
  const core = fragment.length > 18 ? `${fragment.slice(0, 18)}...` : fragment;

  return `${prefix}${suffix}\uff1a${core}`;
}

function selectFromList(list, seedText) {
  return pickByHash(list, hashText(seedText));
}

export function classifyInput(input) {
  const scored = CATEGORY_ORDER.map((categoryId) => ({
    categoryId,
    score: scoreCategory(input, CATEGORY_CONFIG[categoryId].keywords),
  }));

  scored.sort((left, right) => right.score - left.score);

  return scored[0] && scored[0].score > 0 ? scored[0].categoryId : 'growth';
}

export function extractLocalOres(input) {
  const categoryId = classifyInput(input);
  const config = CATEGORY_CONFIG[categoryId];
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
  const config = CATEGORY_CONFIG[categoryId];

  return {
    category: config.label,
    categoryId,
    assetCategory: config.assetFolder,
    cardTitle: selectFromList(config.cardTitles, ores.map((ore) => ore.id).join('-')),
    imagePrompt: `${config.label} themed fantasy card`,
    description: `\u8fd9\u5f20\u5361\u7247\u8bb0\u5f55\u4e86\u4f60\u5728${config.label}\u65b9\u5411\u4e0a\u7d2f\u79ef\u51fa\u7684\u9636\u6bb5\u6027\u6210\u679c\u3002`,
  };
}

export function buildLocalMedalContent(cards, existingMedal = null) {
  const sourceText = cards.map((card) => card.title).join('|');
  const categoryId = classifyInput(sourceText);
  const config = CATEGORY_CONFIG[categoryId];

  return {
    category: config.label,
    categoryId,
    assetCategory: config.assetFolder,
    medalTitle: existingMedal
      ? selectFromList(config.medalTitles, `${sourceText}-evolved`)
      : selectFromList(config.medalTitles, sourceText),
    medalDescription: `${config.medalDescriptionPrefix} \u8fd9\u679a\u5fbd\u7ae0\u6765\u81ea\u4f60\u5728${config.label}\u65b9\u5411\u4e0a\u7684\u6301\u7eed\u6295\u5165\u3002`,
    imagePrompt: `${config.label} themed sacred medal`,
  };
}
