# Growth Forge - Agent Development Guide

Guidelines for AI agents working on this project.

## Project Structure

```
growth-forge/
├── frontend/           # Next.js 14 (App Router) + TypeScript
│   └── src/
│       ├── app/        # Pages (dashboard/, goal/, forge/, inventory/)
│       ├── components/ # Reusable components (Navbar, Providers)
│       ├── config/     # wagmi.ts config
│       ├── hooks/      # Custom hooks
│       ├── utils/      # Utility functions
│       └── contracts/  # Contract ABIs (empty, to be added)
├── contracts/          # Solidity smart contracts (Foundry)
│   ├── src/           # GrowthForge, OreNFT, CardNFT, MedalNFT
│   ├── test/          # Tests (currently empty)
│   └── script/        # Deployment scripts
└── PRD.md             # Product requirements
```

---

## Build / Test Commands

### Frontend

```bash
npm run dev        # Development server
npm run build      # Production build
npm run start      # Production server
npm run lint       # ESLint
```

### Smart Contracts (Foundry)

```bash
forge test                    # Run all tests
forge test --match-test <name>  # Single test
forge test -vvv               # Verbose output for debugging
forge build                   # Build contracts
forge fmt                     # Format code
forge snapshot                # Gas snapshot
```

---

## Code Style Guidelines

### TypeScript / Frontend

**File Structure**
- Components: `PascalCase.tsx` (e.g., `Navbar.tsx`, `Providers.tsx`)
- Pages: `page.tsx` in route directories
- Hooks: `useXxx.ts` naming convention

**Imports**
- Use path aliases: `@/*` maps to `./src/*`
- Order: React → external libs → internal → styles
- Always include `'use client'` directive for client components

```typescript
'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAccount } from 'wagmi'
import { ConnectButton } from '@rainbow-me/rainbowkit'
```

**Props & Types**
- Use inline interfaces for component props
- Leverage TypeScript strict mode
- Define types for complex data structures

```typescript
function Component({
  onClose,
  onCreate,
}: {
  onClose: () => void
  onCreate: (goal: { name: string; description: string }) => void
}) { ... }
```

**State Management**
- Use `useState` for local state
- Use wagmi hooks for wallet state: `useAccount()`, `useConnect()`, `useDisconnect()`
- Mock data for development (see `mockGoals`, `mockOres` patterns)

**Animations**
- Use framer-motion for all animations
- Common patterns: `AnimatePresence`, `motion.div`, `whileHover`, `whileTap`
- Exit animations with `initial`, `animate`, `exit` props

**Tailwind CSS**
Custom classes in `globals.css`:
- `.btn-magical` - Primary gradient button
- `.input-magical` - Styled input field
- `.card-magical` - Card with shadow effects
- `.progress-magical` - Progress bar container
- `.particles-bg` - Background gradient effect

Color scheme:
- `primary.purple` (#8B5CF6), `primary.blue` (#3B82F6)
- Ore types: `Wisdom` (blue), `Will` (red), `Creation` (yellow), `Connection` (green)

---

### Solidity / Contracts

**Naming**
- Contracts: `PascalCase` (e.g., `GrowthForge`, `OreNFT`)
- Functions: `PascalCase` (e.g., `createGoal`, `mintOre`)
- Events: `PastTense` (e.g., `GoalCreated`, `OreMinted`)
- Enums: values in `PascalCase` (e.g., `Active`, `Completed`)

**Style**
- Use `pragma solidity ^0.8.20`
- Import OpenZeppelin from `@openzeppelin/contracts/`
- Use `require()` with descriptive error messages
- Emit events for all state changes
- Use `calldata` for external function parameters when possible
- Use `memory` for return values

**Error Handling**
```solidity
require(bytes(_name).length > 0, "Name required");
require(goal.status == GoalStatus.Active, "Goal not active");
require(msg.sender == forgeEngine, "Not authorized");
```

**Access Control**
- Use `Ownable` from OpenZeppelin
- Pattern: `forgeEngine` address for authorized callers
- Check: `msg.sender == forgeEngine || msg.sender == owner()`

**Contract Pattern**
```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

contract GrowthForge is Ownable {
    enum GoalStatus { Active, Completed, Abandoned }

    event GoalCreated(uint256 indexed goalId, address indexed owner, string name);

    function createGoal(...) external returns (uint256) {
        require(bytes(_name).length > 0, "Name required");
        // Emit event for state changes
        emit GoalCreated(newGoalId, msg.sender, _name);
    }
}
```

---

## Wallet Integration

- Config: `src/config/wagmi.ts`
- Providers: Wrap with `WagmiProvider`, `QueryClientProvider`, `RainbowKitProvider`
- Hooks: `useAccount()`, `useConnect()`, `useDisconnect()`
- Chains: mainnet, sepolia configured

---

## Quick Reference

| Task | Command |
|------|---------|
| Frontend dev | `cd frontend && npm run dev` |
| Run all tests | `cd contracts && forge test` |
| Run single test | `cd contracts && forge test --match-test <testName>` |
| Build contracts | `cd contracts && forge build` |
| Format contracts | `cd contracts && forge fmt` |
| Lint frontend | `cd frontend && npm run lint` |

---

## Important Notes

1. **No Cursor/Copilot rules** - Project has no `.cursorrules` or copilot instructions
2. **Tests are empty** - `contracts/test/` directory is empty; add tests using Foundry
3. **Mock data pattern** - Frontend uses mock data for development
4. **Chinese UI** - Interface text is in Chinese; maintain consistency
5. **NFT Contracts** - Three NFT types: OreNFT, CardNFT, MedalNFT
