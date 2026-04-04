# Backend Demo Seed Log

## What Was Added

The backend now supports auto-loading a demo dataset on startup.

Seeded showcase data:

- 5 ores
- 3 cards
- 1 medal

These records are category-aware and use the existing local asset folders so they present well without requiring AI generation.

## Updated Files

- `D:\works\hackathon\backend\src\services\demoSeed.js`
- `D:\works\hackathon\backend\src\utils\localImages.js`
- `D:\works\hackathon\backend\src\utils\supabase.js`
- `D:\works\hackathon\backend\src\index.js`
- `D:\works\hackathon\backend\.env`
- `D:\works\hackathon\backend\.env.example`

## New Env Switches

Add these in backend env:

```env
LOAD_DEMO_DATA=false
DEMO_WALLET_ADDRESS=0xDemo000000000000000000000000000000000001
```

Meaning:

- `LOAD_DEMO_DATA=true`
  The backend will automatically clear the demo wallet's old data and reload the showcase dataset every time it starts.
- `LOAD_DEMO_DATA=false`
  The backend will start normally with no automatic demo seed.
- `DEMO_WALLET_ADDRESS`
  The wallet address that should receive the showcase data.

## Important Usage Note

To actually see the seeded ores, cards, and medal in the frontend, set `DEMO_WALLET_ADDRESS` to the wallet address you plan to connect in the frontend.

If the backend seeds data for one wallet but the frontend connects to another wallet, the showcase data will not appear.

## Seed Content Design

The seeded content is intentionally balanced across the three local categories:

- Knowledge
- Exercise
- Growth

Result layout:

- 2 knowledge ores
- 2 exercise ores
- 1 growth ore
- 1 knowledge card
- 1 exercise card
- 1 growth card
- 1 growth medal linked to the three cards

## Startup Behavior

When `LOAD_DEMO_DATA=true`:

1. Backend starts
2. Demo wallet user is created or loaded
3. Existing demo data for that wallet is cleared
4. 5 ores are inserted
5. 3 cards are inserted
6. 1 medal is inserted

This avoids duplicate demo records across restarts.
