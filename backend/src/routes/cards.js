import { Router } from 'express';
import { db } from '../utils/supabase.js';
import { refineOres, generateCardImage } from '../services/openai.js';

const router = Router();

// Refine ores into a card
router.post('/refine', async (req, res) => {
  try {
    const { walletAddress, oreIds } = req.body;

    if (!walletAddress || !oreIds || oreIds.length === 0) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const user = await db.getOrCreateUser(walletAddress);

    // Get ore details
    const allOres = await db.getOresByUser(user.id);
    const selectedOres = allOres.filter(o => oreIds.includes(o.id));

    if (selectedOres.length === 0) {
      return res.status(400).json({ error: 'No valid ores found' });
    }

    // Refine ores using AI
    const refinement = await refineOres(selectedOres);

    // Generate card image
    const imageUrl = await generateCardImage(refinement.imagePrompt);

    // Create card
    const card = await db.createCard(
      user.id,
      refinement.cardTitle,
      imageUrl,
      oreIds
    );

    // Consume the ores
    await db.consumeOres(oreIds);

    res.json({
      success: true,
      card,
      refinement
    });
  } catch (error) {
    console.error('Error refining ores:', error);
    res.status(500).json({ error: 'Failed to refine ores' });
  }
});

// Get user's cards
router.get('/:walletAddress', async (req, res) => {
  try {
    const { walletAddress } = req.params;

    const user = await db.getOrCreateUser(walletAddress);
    const cards = await db.getCardsByUser(user.id);

    res.json({
      success: true,
      cards
    });
  } catch (error) {
    console.error('Error fetching cards:', error);
    res.status(500).json({ error: 'Failed to fetch cards' });
  }
});

export default router;
