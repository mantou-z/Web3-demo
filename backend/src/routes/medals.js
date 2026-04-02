import { Router } from 'express';
import { db } from '../utils/supabase.js';
import { awakenMedal, generateMedalImage } from '../services/openai.js';

const router = Router();

// Awaken cards into a medal
router.post('/awaken', async (req, res) => {
  try {
    const { walletAddress, cardIds, existingMedalId } = req.body;

    if (!walletAddress || !cardIds || cardIds.length === 0) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const user = await db.getOrCreateUser(walletAddress);

    // Get card details
    const allCards = await db.getCardsByUser(user.id);
    const selectedCards = allCards.filter(c => cardIds.includes(c.id));

    if (selectedCards.length === 0) {
      return res.status(400).json({ error: 'No valid cards found' });
    }

    // Get existing medal if evolving
    let existingMedal = null;
    if (existingMedalId) {
      const allMedals = await db.getMedalsByUser(user.id);
      existingMedal = allMedals.find(m => m.id === existingMedalId);
    }

    // Generate medal content using AI
    const medalContent = await awakenMedal(selectedCards, existingMedal);

    // Generate medal image
    const imageUrl = await generateMedalImage(medalContent.imagePrompt);

    let medal;
    const parentIds = existingMedal
      ? [...(existingMedal.parent_ids || []), ...cardIds]
      : cardIds;

    if (existingMedal) {
      // Evolve existing medal
      medal = await db.updateMedal(existingMedalId, {
        title: medalContent.medalTitle,
        description: medalContent.medalDescription,
        image_url: imageUrl,
        parent_ids: parentIds
      });
    } else {
      // Create new medal
      medal = await db.createMedal(
        user.id,
        medalContent.medalTitle,
        medalContent.medalDescription,
        imageUrl,
        null, // tokenId will be set after on-chain mint
        parentIds
      );
    }

    // Consume the cards
    await db.consumeCards(cardIds);

    res.json({
      success: true,
      medal,
      medalContent
    });
  } catch (error) {
    console.error('Error awakening medal:', error);
    res.status(500).json({ error: 'Failed to awaken medal' });
  }
});

// Update medal token ID after on-chain mint
router.post('/:medalId/mint', async (req, res) => {
  try {
    const { medalId } = req.params;
    const { tokenId } = req.body;

    if (!tokenId && tokenId !== 0) {
      return res.status(400).json({ error: 'Missing token ID' });
    }

    const medal = await db.updateMedal(medalId, { token_id: tokenId });

    res.json({
      success: true,
      medal
    });
  } catch (error) {
    console.error('Error updating medal:', error);
    res.status(500).json({ error: 'Failed to update medal' });
  }
});

// Get user's medals
router.get('/:walletAddress', async (req, res) => {
  try {
    const { walletAddress } = req.params;

    const user = await db.getOrCreateUser(walletAddress);
    const medals = await db.getMedalsByUser(user.id);

    res.json({
      success: true,
      medals
    });
  } catch (error) {
    console.error('Error fetching medals:', error);
    res.status(500).json({ error: 'Failed to fetch medals' });
  }
});

export default router;
