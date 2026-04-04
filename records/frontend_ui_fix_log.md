# Frontend UI Fix Log

## Date

2026-04-04

## Completed Fixes

### 0000. Collect / Refine / Awaken showcase replaced with cabinet modal

Updated:

- `D:\works\hackathon\frontend\src\components\ShowcaseCabinet.tsx`
- `D:\works\hackathon\frontend\src\app\mining\page.tsx`
- `D:\works\hackathon\frontend\src\app\refining\page.tsx`
- `D:\works\hackathon\frontend\src\app\awakening\page.tsx`
- `D:\works\hackathon\frontend\src\utils\uiAssets.ts`

Changes made:

- Replaced the lower yellow showcase boxes in `collect`, `refine`, and `awaken` with the cabinet artwork `9386d55d614184d987c9810f9d4db867147dc751.png`.
- Unified all three pages onto the same cabinet-based display pattern so the right-hand side now feels like one visual system instead of three separate panels.
- Changed the showcase interaction from passive bottom display to click-to-open inspection.
- Kept the owl and parchment summary card in their original upper position, and placed the cabinet underneath as the secondary archive area.
- Added a shared `ShowcaseCabinet` component so future visual tuning only needs to be done once.

Current cabinet behavior:

- The cabinet itself is now a clean static visual entry with no inline preview items.
- Clicking the cabinet opens a centered modal with the full item list.
- This keeps the right-side area cleaner and avoids crowding the owl and parchment summary block.

If you want to tune the overall cabinet size on a page, edit the wrapper width here:

- `D:\works\hackathon\frontend\src\components\ShowcaseCabinet.tsx`

Current wrapper class:

```tsx
className="group relative mx-auto w-full max-w-[420px] text-center"
```

That `max-w-[420px]` is the main size control for the cabinet block.

### 00000. Character / owl / parchment tuning and floating motion

Updated:

- `D:\works\hackathon\frontend\src\utils\sceneTuning.ts`
- `D:\works\hackathon\frontend\src\components\FloatingArtwork.tsx`
- `D:\works\hackathon\frontend\src\components\ActionHeroButton.tsx`
- `D:\works\hackathon\frontend\src\app\mining\page.tsx`
- `D:\works\hackathon\frontend\src\app\refining\page.tsx`
- `D:\works\hackathon\frontend\src\app\awakening\page.tsx`

Changes made:

- Extracted the girl, owl, and parchment layout numbers into a shared tuning file so you can adjust them in one place.
- Added gentle floating motion to the girl, crystal pile, cauldron, awaken door, and owl.
- Kept the parchment static by default so the stats panel stays readable, but its size and position are now directly adjustable.

Main tuning file:

- `D:\works\hackathon\frontend\src\utils\sceneTuning.ts`

Girl controls:

```ts
export const characterFigureTuning = {
  maxHeight: 520,
  offsetX: 0,
  offsetY: 0,
  floatY: 14,
  floatDuration: 6.2,
  floatDelay: 0.2,
}
```

Owl and parchment controls:

```ts
export const archivePanelTuning = {
  containerMaxWidth: 420,
  containerPaddingTop: 64,
  containerOffsetX: 0,
  containerOffsetY: 0,
  owlSize: 160,
  owlOffsetX: 0,
  owlOffsetY: 0,
  owlFloatY: 10,
  owlFloatDuration: 5.4,
  owlFloatDelay: 0.4,
  parchmentScale: 1,
  parchmentOffsetX: 0,
  parchmentOffsetY: 0,
}
```

Cabinet controls:

```ts
export const showcaseCabinetTuning = {
  maxWidth: 300,
  offsetX: 0,
  offsetY: 0,
  titleMarginTop: 16,
  titleFontSize: 20,
  helperMarginTop: 8,
  helperFontSize: 18,
}
```

Center artwork controls:

```ts
export const centerArtworkTuning = {
  collect: {
    maxWidth: 430,
    offsetX: 0,
    offsetY: 0,
    labelMarginTop: 12,
    labelFontSize: 18,
    labelLetterSpacing: '0.3em',
    labelOffsetX: 0,
    labelOffsetY: 0,
  },
  refine: {
    maxWidth: 420,
    offsetX: 0,
    offsetY: 0,
    labelMarginTop: 12,
    labelFontSize: 18,
    labelLetterSpacing: '0.3em',
    labelOffsetX: 0,
    labelOffsetY: 0,
  },
  awaken: {
    maxWidth: 550,
    offsetX: 0,
    offsetY: -50,
    labelMarginTop: 12,
    labelFontSize: 18,
    labelLetterSpacing: '0.3em',
    labelOffsetX: 0,
    labelOffsetY: 0,
  },
  profileWall: {
    maxWidth: 700,
    offsetX: 0,
    offsetY: 0,
  },
}
```

Main artwork float controls:

```ts
export const heroFloatTuning = {
  crystalPile: {
    floatY: 16,
    floatDuration: 4.8,
    floatDelay: 0.1,
  },
  cauldron: {
    floatY: 14,
    floatDuration: 5.2,
    floatDelay: 0.25,
  },
  awakenDoor: {
    floatY: 12,
    floatDuration: 5.8,
    floatDelay: 0.35,
  },
}
```

Adjustment hints:

- Move the girl left or right: change `characterFigureTuning.offsetX`
- Move the girl up or down: change `characterFigureTuning.offsetY`
- Resize the girl: change `characterFigureTuning.maxHeight`
- Resize the owl: change `archivePanelTuning.owlSize`
- Move the owl: change `owlOffsetX` and `owlOffsetY`
- Resize the parchment block: change `parchmentScale`
- Move the parchment block: change `parchmentOffsetX` and `parchmentOffsetY`
- Move the whole owl + parchment group: change `containerOffsetX` and `containerOffsetY`
- Resize the cabinet: change `showcaseCabinetTuning.maxWidth`
- Move the cabinet: change `showcaseCabinetTuning.offsetX` and `showcaseCabinetTuning.offsetY`
- Adjust cabinet title spacing or size: change `titleMarginTop` and `titleFontSize`
- Adjust cabinet helper text spacing or size: change `helperMarginTop` and `helperFontSize`
- Resize the center crystal pile: change `centerArtworkTuning.collect.maxWidth`
- Move the center crystal pile: change `centerArtworkTuning.collect.offsetX` and `centerArtworkTuning.collect.offsetY`
- Adjust the collect title: change `labelMarginTop`, `labelFontSize`, `labelLetterSpacing`, `labelOffsetX`, `labelOffsetY`
- Resize the center cauldron: change `centerArtworkTuning.refine.maxWidth`
- Move the center cauldron: change `centerArtworkTuning.refine.offsetX` and `centerArtworkTuning.refine.offsetY`
- Adjust the refine title: change `labelMarginTop`, `labelFontSize`, `labelLetterSpacing`, `labelOffsetX`, `labelOffsetY`
- Resize the awaken door: change `centerArtworkTuning.awaken.maxWidth`
- Move the awaken door: change `centerArtworkTuning.awaken.offsetX` and `centerArtworkTuning.awaken.offsetY`
- Adjust the awaken title: change `labelMarginTop`, `labelFontSize`, `labelLetterSpacing`, `labelOffsetX`, `labelOffsetY`
- Resize the medal wall: change `centerArtworkTuning.profileWall.maxWidth`
- Move the medal wall: change `centerArtworkTuning.profileWall.offsetX` and `centerArtworkTuning.profileWall.offsetY`
- Make floating stronger or weaker: change the matching `floatY`
- Make floating faster or slower: change the matching `floatDuration`

Additional follow-up:

- Applied the same girl / owl / parchment tuning system to `profile`, so its side figures now stay consistent with `collect`, `refine`, and `awaken`.
- Kept the medal wall and wall medals static in `profile` because they are interactive and should remain stable for clicking.
- The medal wall and medal slots still move together as one block, so changing `centerArtworkTuning.profileWall.offsetX/offsetY` does not break the medal-to-hole alignment you already adjusted.
- Reduced page-switch flicker by disabling the floating components' initial mount animation. Floating now starts from the settled layout state instead of animating in from a separate first frame.

### 000. Background consistency and ore glow variation

Updated:

- `D:\works\hackathon\frontend\src\utils\oreVisuals.ts`
- `D:\works\hackathon\frontend\src\components\FantasyShell.tsx`
- `D:\works\hackathon\frontend\src\app\mining\page.tsx`
- `D:\works\hackathon\frontend\src\app\refining\page.tsx`
- `D:\works\hackathon\frontend\src\app\globals.css`

Changes made:

- Changed ore glow selection from a fixed dimension-only color to a seeded shared glow palette, so ores no longer all show the same blue aura.
- Kept the glow deterministic per ore, which means the same ore still matches between `collect` and `refine`.
- Moved the main page background out of the variable-height shell container and into a fixed viewport background layer.
- This keeps the crop stable across pages even when page height or content structure changes.

### 00. Regression pass: ore variation / awaken flow / profile cleanup

Updated:

- `D:\works\hackathon\frontend\src\utils\oreVisuals.ts`
- `D:\works\hackathon\frontend\src\app\mining\page.tsx`
- `D:\works\hackathon\frontend\src\app\refining\page.tsx`
- `D:\works\hackathon\frontend\src\app\awakening\page.tsx`
- `D:\works\hackathon\frontend\src\app\profile\page.tsx`

Changes made:

- Added a shared ore visual helper so each ore gets a stable crystal appearance based on its own id/text seed.
- Fixed the regression where collect-side ores all looked identical after switching to strict dimension mapping.
- Kept collect and refine visually consistent by using the same seeded ore visual logic in both pages.
- Reworked the awaken success state so mint completion no longer traps the page on `Minted On-Chain`.
- After mint succeeds, the CTA now becomes `Continue Awakening`, which resets the local medal preview and returns the user to the normal flow.
- Added a per-transaction hash guard to the awaken mint sync flow so old confirmed receipts do not get reused for the next medal.
- Removed the bottom medal gallery yellow box from profile because it duplicated the wall display.
- Strengthened clickability on wall medals so opening the detail modal is handled directly from the wall slots.

### 0. Latest pass: homepage / medal wall / awakening stability / ore consistency

Updated:

- `D:\works\hackathon\frontend\src\app\mining\page.tsx`
- `D:\works\hackathon\frontend\src\app\page.tsx`
- `D:\works\hackathon\frontend\src\app\profile\page.tsx`
- `D:\works\hackathon\frontend\src\app\awakening\page.tsx`

Changes made:

- Unified saved ore rendering in `collect` with the same dimension-based crystal mapping already used in `refine`, so ores no longer change style between the two pages.
- Removed the three yellow feature boxes from the bottom of the homepage because they duplicated the top navigation.
- Restored the medal wall to 9 distinct hole coordinates so more than 3 medals can appear on the wall again.
- Changed wall medals to render inside padded circular containers with `object-contain`, which makes 1:1 medal assets sit more naturally in the wall holes.
- Fixed the `awaken` mint flow so a newly generated medal no longer disappears immediately after a successful mint confirmation.

New awakening state behavior:

- `isPersistingMint` now gates the backend mint callback, so old transaction state does not clear a newly generated medal.
- `hasMintedCurrent` keeps the generated medal visible after minting and changes the CTA to a completed state instead of clearing the preview instantly.

### 1. Collect / Refine ore visuals

Updated the ore presentation in:

- `D:\works\hackathon\frontend\src\app\mining\page.tsx`
- `D:\works\hackathon\frontend\src\app\refining\page.tsx`

Changes made:

- Replaced the plain colored circular placeholders with crystal image assets.
- Kept the original ore-type glow colors behind the crystal so the type is still visually distinguishable.
- Mapped ore types to specific crystal assets:
  - `Wisdom` -> `uiAssets.crystals[0]`
  - `Will` -> `uiAssets.crystals[4]`
  - `Creation` -> `uiAssets.crystals[2]`
  - `Connection` -> `uiAssets.crystals[5]`

If you want to swap the crystal look later, edit the `dimensionInfo` object in those two files.

### 2. Awaken page size / position tuning points

Updated:

- `D:\works\hackathon\frontend\src\app\awakening\page.tsx`

I added explicit tuning variables near the top of the component:

```ts
const ritualDoorWidth = 700
const ritualDoorOffsetY = -50
const resultMedalSize = 260
```

These control:

- `ritualDoorWidth`: width of the main awaken door in the idle state
- `ritualDoorOffsetY`: vertical offset of the awaken door
- `resultMedalSize`: diameter of the generated medal preview

If you want to self-adjust:

- Make the awaken entry larger: increase `ritualDoorWidth`
- Move the awaken entry up or down: adjust `ritualDoorOffsetY`
- Make the generated medal larger or smaller: adjust `resultMedalSize`

Additional medal preview fix:

- After switching medal assets to 1:1, the generated medal preview could overflow the center panel if `resultMedalSize` was too large.
- I reduced the preview size and changed the preview image rendering to `object-contain` inside a padded circular container.

Current preview behavior:

- safer preview diameter: `260`
- image fit mode: `object-contain`

### 3. Profile medal wall alignment

Updated:

- `D:\works\hackathon\frontend\src\app\profile\page.tsx`

Changes made:

- Replaced the old grid-based slot layout with explicit per-slot positioning.
- Added `medalWallSlots` for 9 fixed hole positions on the wall.
- Changed medal rendering to circular placement so the medal better matches the hole artwork.

Current tuning data lives here:

```ts
const medalWallSlots = [
  { left: '20.8%', top: '29.6%', size: '22.0%' },
  { left: '38.1%', top: '29.4%', size: '21.6%' },
  { left: '55.3%', top: '29.8%', size: '22.1%' },
  { left: '21.1%', top: '53.4%', size: '21.8%' },
  { left: '38.3%', top: '53.1%', size: '21.4%' },
  { left: '55.4%', top: '53.5%', size: '21.8%' },
  { left: '20.9%', top: '77.1%', size: '21.6%' },
  { left: '38.2%', top: '76.8%', size: '21.2%' },
  { left: '55.4%', top: '77.1%', size: '21.6%' },
]
```

If alignment still needs polishing:

- Adjust horizontal position with `left`
- Adjust vertical position with `top`
- Adjust medal diameter with `size`

### 4. Profile medals clipped on the wall

Additional update:

- Reduced medal slot sizes so medals no longer overflow the upper and lower edges as easily.
- Added explicit wall-level tuning variables so the whole wall can be moved or resized without touching surrounding layout.

New tuning variables in `D:\works\hackathon\frontend\src\app\profile\page.tsx`:

```ts
const wallMaxWidth = 560
const wallOffsetX = 0
const wallOffsetY = 0
```

What they do:

- `wallMaxWidth`: controls the full wall size
- `wallOffsetX`: moves the whole wall left/right
- `wallOffsetY`: moves the whole wall up/down

Recommended adjustment method:

1. If the whole wall is too small or too large, change `wallMaxWidth`
2. If the whole wall is visually off-center, change `wallOffsetX`
3. If the whole wall sits too high or too low, change `wallOffsetY`
4. If only one medal is off, change the matching slot inside `medalWallSlots`

Current wall slot data:

```ts
const medalWallSlots = [
  { left: '20.8%', top: '29.6%', size: '22.0%' },
  { left: '38.1%', top: '29.4%', size: '21.6%' },
  { left: '55.3%', top: '29.8%', size: '22.1%' },
  { left: '21.1%', top: '53.4%', size: '21.8%' },
  { left: '38.3%', top: '53.1%', size: '21.4%' },
  { left: '55.4%', top: '53.5%', size: '21.8%' },
  { left: '20.9%', top: '77.1%', size: '21.6%' },
  { left: '38.2%', top: '76.8%', size: '21.2%' },
  { left: '55.4%', top: '77.1%', size: '21.6%' },
]
```

## Suggested Verification Order

1. Open `/mining` and confirm the ore icons now use crystal assets instead of solid color circles.
2. Open `/refining` and confirm ore selection cards now use crystal assets.
3. Open `/awakening` and test the size of the door and the final medal preview.
4. Open `/profile` and compare medal positions against the wall holes.

## Notes

- I did not run build or compile commands in this pass.
- If you send back screenshots or visual differences, the next step should be micro-adjusting:
  - `ritualDoorWidth`
  - `ritualDoorOffsetY`
  - `resultMedalSize`
  - `medalWallSlots`
