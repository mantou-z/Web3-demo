import { DEMO_SEED_DATA, getCategoryContentConfig } from '../config/contentRuntimeConfigReadable.js';
import { db } from '../utils/supabase.js';
import { getCardImageByIndex, getMedalImageByIndex } from '../utils/localImages.js';

const DEMO_WALLET = process.env.DEMO_WALLET_ADDRESS || '0xDemo000000000000000000000000000000000001';

export async function seedDemoDataIfEnabled() {
  const enabled = process.env.LOAD_DEMO_DATA === 'true';

  if (!enabled) return;

  const user = await db.getOrCreateUser(DEMO_WALLET);
  await db.clearUserData(user.id);

  const savedOres = [];
  for (const ore of DEMO_SEED_DATA.ores) {
    const savedOre = await db.createOre(user.id, ore.rawInput, ore.refinedData);
    savedOres.push(savedOre);
  }

  const savedCards = [];
  for (const card of DEMO_SEED_DATA.cards) {
    const config = getCategoryContentConfig(card.categoryId);
    const imageUrl = getCardImageByIndex(config.assetFolder, card.imageIndex || 0)
      || 'https://placehold.co/400x600/1a1a2e/8b5cf6?text=Card';

    const consumedOreIds = card.oreIndexes.map((oreIndex) => savedOres[oreIndex]?.id).filter(Boolean);
    const savedCard = await db.createCard(user.id, card.title, imageUrl, consumedOreIds);
    savedCards.push(savedCard);
  }

  const medalConfig = getCategoryContentConfig(DEMO_SEED_DATA.medal.categoryId);
  const medalImageUrl = getMedalImageByIndex(medalConfig.assetFolder, DEMO_SEED_DATA.medal.imageIndex || 0)
    || 'https://placehold.co/400x400/1a1a2e/gold?text=Medal';

  await db.createMedal(
    user.id,
    DEMO_SEED_DATA.medal.title,
    DEMO_SEED_DATA.medal.description,
    medalImageUrl,
    DEMO_SEED_DATA.medal.tokenId,
    savedCards.map((card) => card.id),
  );

  console.log(`[demo-seed] Loaded demo data for ${DEMO_WALLET}: ${DEMO_SEED_DATA.ores.length} ores, ${DEMO_SEED_DATA.cards.length} cards, 1 medal`);
}
