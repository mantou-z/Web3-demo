export const CATEGORY_ORDER = ['knowledge', 'exercise', 'growth'];

export const DIMENSION_MAP = {
  knowledge: 'Wisdom',
  exercise: 'Will',
  growth: 'Creation',
};

export const CATEGORY_CONTENT_CONFIG = {
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
    cardDescriptions: [
      '\u8fd9\u5f20\u5361\u7247\u8bb0\u5f55\u4e86\u4f60\u5728{label}\u65b9\u5411\u4e0a\u79ef\u7d2f\u51fa\u7684\u9636\u6bb5\u6027\u6210\u679c\u3002',
      '\u4f60\u628a\u96f6\u6563\u7684\u7406\u89e3\u6536\u675f\u6210\u4e86\u53ef\u56de\u671b\u7684{label}\u8282\u70b9\u3002',
      '\u8fd9\u662f\u4e00\u6bb5\u5c5e\u4e8e{label}\u6210\u957f\u7684\u6e05\u6670\u7559\u75d5\u3002',
    ],
    medalTitles: ['\u667a\u8bc6\u4e4b\u8bc1', '\u6c42\u77e5\u4e4b\u5370', '\u6d1e\u89c1\u5fbd\u7ae0', '\u660e\u7406\u4e4b\u51a0', '\u5b66\u8bc6\u89c9\u7ae0'],
    medalDescriptions: [
      '\u4f60\u5c06\u6301\u7eed\u6c42\u7d22\u51dd\u6210\u53ef\u88ab\u770b\u89c1\u7684\u5149\u3002\u8fd9\u679a\u5fbd\u7ae0\u6765\u81ea\u4f60\u5728{label}\u65b9\u5411\u4e0a\u7684\u6301\u7eed\u6295\u5165\u3002',
      '\u4e00\u6b21\u6b21\u7406\u89e3\u4e0e\u603b\u7ed3\uff0c\u6700\u7ec8\u6c89\u6dc0\u6210\u4e86\u8fd9\u679a{label}\u5fbd\u7ae0\u3002',
    ],
    generatedCardImage: { mode: 'hash', indices: [0, 1, 2] },
    generatedMedalImage: { mode: 'hash', indices: [0, 1, 2] },
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
    cardDescriptions: [
      '\u8fd9\u5f20\u5361\u7247\u89c1\u8bc1\u4e86\u4f60\u5728{label}\u65b9\u5411\u4e0a\u7684\u7a33\u5b9a\u63a8\u8fdb\u3002',
      '\u91cd\u590d\u7684\u7ec3\u4e60\u88ab\u7194\u6210\u4e86\u5c5e\u4e8e\u4f60\u7684{label}\u6210\u679c\u3002',
      '\u4f60\u628a\u4e00\u6b21\u6b21\u51fa\u6c57\u4e0e\u575a\u6301\uff0c\u7559\u6210\u4e86{label}\u8282\u70b9\u3002',
    ],
    medalTitles: ['\u6bc5\u884c\u4e4b\u8bc1', '\u953b\u4f53\u4e4b\u5370', '\u70ed\u8840\u5fbd\u7ae0', '\u6052\u6bc5\u4e4b\u51a0', '\u8dc3\u52a8\u89c9\u7ae0'],
    medalDescriptions: [
      '\u4f60\u628a\u53cd\u590d\u575a\u6301\u7194\u94f8\u6210\u4e86\u6e05\u6670\u53ef\u89c1\u7684\u529b\u91cf\u3002\u8fd9\u679a\u5fbd\u7ae0\u6765\u81ea\u4f60\u5728{label}\u65b9\u5411\u4e0a\u7684\u6301\u7eed\u6295\u5165\u3002',
      '\u6bcf\u4e00\u6b21\u8bad\u7ec3\u90fd\u6ca1\u6709\u6d88\u5931\uff0c\u5b83\u4eec\u6c47\u805a\u6210\u4e86\u8fd9\u679a{label}\u5fbd\u7ae0\u3002',
    ],
    generatedCardImage: { mode: 'hash', indices: [0, 1, 2] },
    generatedMedalImage: { mode: 'hash', indices: [0, 1, 2] },
  },
  growth: {
    label: '\u6210\u957f',
    assetFolder: '\u6210\u957f',
    keywords: [
      '\u6210\u957f', '\u8ba1\u5212', '\u76ee\u6807', '\u4e60\u60ef', '\u884c\u52a8', '\u7a81\u7834', '\u6539\u53d8', '\u575a\u6301', '\u6267\u884c', '\u5b8c\u6210',
      '\u6548\u7387', '\u7ba1\u7406', '\u6c9f\u901a', '\u8868\u8fbe', '\u751f\u6d3b', '\u6574\u7406', '\u5bb6\u52a1', '\u5b9e\u8df5', '\u9879\u76ee', '\u5408\u4f5c',
      '\u793e\u4ea4', '\u5206\u4eab', '\u4e60\u60ef\u517b\u6210', '\u53cd\u601d', '\u60c5\u7eea', '\u81ea\u6211',
    ],
    orePrefixes: ['\u65b0\u751f', '\u8715\u53d8', '\u6c89\u6dc0', '\u8fdc\u5fd7', '\u6052\u5fc3'],
    oreSuffixes: ['\u788e\u6676', '\u7075\u5c51', '\u523b\u7247', '\u5fae\u8292', '\u4e4b\u5c18'],
    cardTitles: ['\u6210\u957f\u4e4b\u8bc1', '\u8715\u53d8\u523b\u5370', '\u8fdc\u5fd7\u7bc7\u7ae0', '\u81ea\u7701\u624e\u8bb0', '\u8fdb\u9636\u91cc\u7a0b\u7891'],
    cardDescriptions: [
      '\u8fd9\u5f20\u5361\u7247\u8bb0\u5f55\u4e86\u4f60\u5728{label}\u65b9\u5411\u4e0a\u7684\u771f\u5b9e\u63a8\u8fdb\u3002',
      '\u4f60\u628a\u5177\u4f53\u884c\u52a8\u6c89\u6dc0\u6210\u4e86\u4e00\u4e2a\u6e05\u6670\u7684{label}\u8282\u70b9\u3002',
      '\u4e00\u6bb5\u7a33\u5b9a\u7684\u81ea\u6211\u63a8\u8fdb\uff0c\u88ab\u4fdd\u5b58\u5728\u8fd9\u5f20{label}\u5361\u7247\u91cc\u3002',
    ],
    medalTitles: ['\u6210\u957f\u4e4b\u8bc1', '\u8715\u53d8\u4e4b\u5370', '\u8fdc\u5fd7\u5fbd\u7ae0', '\u81ea\u6301\u4e4b\u51a0', '\u8fdb\u9636\u89c9\u7ae0'],
    medalDescriptions: [
      '\u4f60\u628a\u4e00\u6b21\u6b21\u5177\u4f53\u884c\u52a8\u6c89\u6dc0\u6210\u4e86\u771f\u6b63\u7684\u6539\u53d8\u3002\u8fd9\u679a\u5fbd\u7ae0\u6765\u81ea\u4f60\u5728{label}\u65b9\u5411\u4e0a\u7684\u6301\u7eed\u6295\u5165\u3002',
      '\u90a3\u4e9b\u6ca1\u6709\u4e2d\u65ad\u7684\u52aa\u529b\uff0c\u6700\u7ec8\u6c47\u6210\u4e86\u8fd9\u679a{label}\u5fbd\u7ae0\u3002',
    ],
    generatedCardImage: { mode: 'hash', indices: [0, 1, 2] },
    generatedMedalImage: { mode: 'hash', indices: [0, 1, 2] },
  },
};

export const DEMO_SEED_DATA = {
  ores: [
    {
      rawInput: '\u5b8c\u6210\u7b97\u6cd5\u8bfe\u7a0b\u590d\u76d8\u5e76\u6574\u7406\u4e86\u4e8c\u53c9\u6811\u7b14\u8bb0',
      refinedData: {
        id: 1,
        text: '\u6d1e\u89c1\u5fae\u5149\uff1a\u5b8c\u6210\u7b97\u6cd5\u8bfe\u7a0b\u590d\u76d8',
        dimension: 'Wisdom',
        score: 5,
        category: '\u77e5\u8bc6',
        categoryId: 'knowledge',
        assetCategory: '\u77e5\u8bc6',
      },
    },
    {
      rawInput: '\u9605\u8bfb\u4e86\u4e00\u7ae0\u4ea7\u54c1\u8bbe\u8ba1\u4e66\u5e76\u8f93\u51fa\u4e86\u5173\u952e\u6846\u67b6',
      refinedData: {
        id: 2,
        text: '\u542f\u660e\u6676\u7802\uff1a\u63d0\u70bc\u4ea7\u54c1\u8bbe\u8ba1\u6846\u67b6',
        dimension: 'Wisdom',
        score: 4,
        category: '\u77e5\u8bc6',
        categoryId: 'knowledge',
        assetCategory: '\u77e5\u8bc6',
      },
    },
    {
      rawInput: '\u6668\u8dd13\u516c\u91cc\u5e76\u5b8c\u6210\u62c9\u4f38\u8bad\u7ec3',
      refinedData: {
        id: 3,
        text: '\u8dc3\u52a8\u7075\u6838\uff1a\u6668\u8dd1\u4e09\u516c\u91cc',
        dimension: 'Will',
        score: 4,
        category: '\u8fd0\u52a8',
        categoryId: 'exercise',
        assetCategory: '\u8fd0\u52a8',
      },
    },
    {
      rawInput: '\u5b8c\u6210\u5168\u8eab\u529b\u91cf\u8bad\u7ec3\u5e76\u8bb0\u5f55\u52a8\u4f5c\u8868\u73b0',
      refinedData: {
        id: 4,
        text: '\u71c3\u5fc3\u4e4b\u706b\uff1a\u5b8c\u6210\u529b\u91cf\u8bad\u7ec3',
        dimension: 'Will',
        score: 5,
        category: '\u8fd0\u52a8',
        categoryId: 'exercise',
        assetCategory: '\u8fd0\u52a8',
      },
    },
    {
      rawInput: '\u63a8\u8fdb\u4e2a\u4eba\u9879\u76ee\u8ba1\u5212\u5e76\u6574\u7406\u4e86\u4e0b\u5468\u884c\u52a8\u6e05\u5355',
      refinedData: {
        id: 5,
        text: '\u8fdc\u5fd7\u5fae\u8292\uff1a\u63a8\u8fdb\u4e2a\u4eba\u9879\u76ee\u8ba1\u5212',
        dimension: 'Creation',
        score: 4,
        category: '\u6210\u957f',
        categoryId: 'growth',
        assetCategory: '\u6210\u957f',
      },
    },
  ],
  cards: [
    {
      title: '\u542f\u660e\u7bc7\u7ae0',
      categoryId: 'knowledge',
      imageIndex: 0,
      oreIndexes: [0, 1],
    },
    {
      title: '\u70ed\u8840\u7bc7\u7ae0',
      categoryId: 'exercise',
      imageIndex: 0,
      oreIndexes: [2, 3],
    },
    {
      title: '\u8fdb\u9636\u91cc\u7a0b\u7891',
      categoryId: 'growth',
      imageIndex: 0,
      oreIndexes: [4],
    },
  ],
  medal: {
    title: '\u8fdb\u9636\u89c9\u7ae0',
    description: '\u8fd9\u679a\u52cb\u7ae0\u89c1\u8bc1\u4e86\u4f60\u5728\u77e5\u8bc6\u3001\u8fd0\u52a8\u4e0e\u6210\u957f\u4e09\u6761\u8f68\u8ff9\u4e0a\u540c\u6b65\u63a8\u8fdb\u7684\u7a33\u5b9a\u6295\u5165\u3002',
    categoryId: 'growth',
    imageIndex: 0,
    tokenId: 1,
  },
};

export function getCategoryContentConfig(categoryId = 'growth') {
  return CATEGORY_CONTENT_CONFIG[categoryId] || CATEGORY_CONTENT_CONFIG.growth;
}
