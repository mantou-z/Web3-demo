import { db } from '../utils/supabase.js';
import { getCardImageByIndex, getMedalImageByIndex } from '../utils/localImages.js';

const DEMO_WALLET = process.env.DEMO_WALLET_ADDRESS || '0xDemo000000000000000000000000000000000001';

const demoOres = [
  {
    rawInput: '完成算法课程复盘并整理了二叉树笔记',
    refinedData: {
      id: 1,
      text: '洞见微光：完成算法课程复盘',
      dimension: 'Wisdom',
      score: 5,
      category: '知识',
      categoryId: 'knowledge',
      assetCategory: '知识',
    },
  },
  {
    rawInput: '阅读了一章产品设计书并输出了关键框架',
    refinedData: {
      id: 2,
      text: '启明晶砂：提炼产品设计框架',
      dimension: 'Wisdom',
      score: 4,
      category: '知识',
      categoryId: 'knowledge',
      assetCategory: '知识',
    },
  },
  {
    rawInput: '晨跑3公里并完成拉伸训练',
    refinedData: {
      id: 3,
      text: '跃动灵核：晨跑三公里',
      dimension: 'Will',
      score: 4,
      category: '运动',
      categoryId: 'exercise',
      assetCategory: '运动',
    },
  },
  {
    rawInput: '完成全身力量训练并记录动作表现',
    refinedData: {
      id: 4,
      text: '燃心之火：完成力量训练',
      dimension: 'Will',
      score: 5,
      category: '运动',
      categoryId: 'exercise',
      assetCategory: '运动',
    },
  },
  {
    rawInput: '推进个人项目计划并整理了下周行动清单',
    refinedData: {
      id: 5,
      text: '远志微芒：推进个人项目计划',
      dimension: 'Creation',
      score: 4,
      category: '成长',
      categoryId: 'growth',
      assetCategory: '成长',
    },
  },
];

const demoCards = [
  {
    title: '启明篇章',
    assetCategory: '知识',
    oreIndexes: [0, 1],
  },
  {
    title: '热血篇章',
    assetCategory: '运动',
    oreIndexes: [2, 3],
  },
  {
    title: '进阶里程碑',
    assetCategory: '成长',
    oreIndexes: [4],
  },
];

const demoMedal = {
  title: '进阶觉章',
  description: '这枚勋章见证了你在知识、运动与成长三条轨迹上同步推进的稳定投入。',
  assetCategory: '成长',
  tokenId: 1,
};

export async function seedDemoDataIfEnabled() {
  const enabled = process.env.LOAD_DEMO_DATA === 'true';

  if (!enabled) {
    return;
  }

  const user = await db.getOrCreateUser(DEMO_WALLET);
  await db.clearUserData(user.id);

  const savedOres = [];
  for (const ore of demoOres) {
    const savedOre = await db.createOre(user.id, ore.rawInput, ore.refinedData);
    savedOres.push(savedOre);
  }

  const savedCards = [];
  for (const [index, card] of demoCards.entries()) {
    const imageUrl = getCardImageByIndex(card.assetCategory, index)
      || 'https://placehold.co/400x600/1a1a2e/8b5cf6?text=Card';

    const consumedOreIds = card.oreIndexes
      .map((oreIndex) => savedOres[oreIndex]?.id)
      .filter(Boolean);

    const savedCard = await db.createCard(user.id, card.title, imageUrl, consumedOreIds);
    savedCards.push(savedCard);
  }

  const medalImageUrl = getMedalImageByIndex(demoMedal.assetCategory, 0)
    || 'https://placehold.co/400x400/1a1a2e/gold?text=Medal';

  await db.createMedal(
    user.id,
    demoMedal.title,
    demoMedal.description,
    medalImageUrl,
    demoMedal.tokenId,
    savedCards.map((card) => card.id),
  );

  console.log(`[demo-seed] Loaded demo data for ${DEMO_WALLET}: 5 ores, 3 cards, 1 medal`);
}
