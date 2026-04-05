# Backend Content Customization

## Main Control File

All demo-mode text, image selection, and future local-generation presets are now centralized in:

- `D:\works\hackathon\backend\src\config\contentRuntimeConfigReadable.js`

This readable file is the one you should edit directly.

You can edit this one file to customize:

- demo ores
- demo cards
- demo medal
- category labels
- keyword classification
- ore prefix and suffix pools
- generated card title pool
- generated card description templates
- generated medal title pool
- generated medal description templates
- generated card image strategy
- generated medal image strategy

## Demo Data Section

This section controls the preloaded showcase content:

- `DEMO_SEED_DATA.ores`
- `DEMO_SEED_DATA.cards`
- `DEMO_SEED_DATA.medal`

Important fields:

- `categoryId`
- `text`
- `title`
- `description`
- `imageIndex`

## Generated Content Section

This section controls later local generation behavior:

- `CATEGORY_CONTENT_CONFIG.knowledge`
- `CATEGORY_CONTENT_CONFIG.exercise`
- `CATEGORY_CONTENT_CONFIG.growth`

Customizable pools:

- `orePrefixes`
- `oreSuffixes`
- `cardTitles`
- `cardDescriptions`
- `medalTitles`
- `medalDescriptions`

Template placeholders supported in descriptions:

- `{label}`

## Generated Image Strategy

Per category you can control local image selection with:

- `generatedCardImage`
- `generatedMedalImage`

Supported modes:

```js
{ mode: 'index', index: 0 }
{ mode: 'hash', indices: [0, 1, 2] }
{ mode: 'random' }
```
