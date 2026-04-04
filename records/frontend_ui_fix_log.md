# Frontend UI Fix Log

## Date

2026-04-04

## Completed Fixes

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
  { left: '20.8%', top: '29.6%', size: '25.2%' },
  { left: '38.1%', top: '29.4%', size: '24.6%' },
  { left: '55.3%', top: '29.8%', size: '25.4%' },
  { left: '21.1%', top: '53.4%', size: '24.8%' },
  { left: '38.3%', top: '53.1%', size: '24.4%' },
  { left: '55.4%', top: '53.5%', size: '24.9%' },
  { left: '20.9%', top: '77.1%', size: '24.6%' },
  { left: '38.2%', top: '76.8%', size: '24.2%' },
  { left: '55.4%', top: '77.1%', size: '24.8%' },
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
