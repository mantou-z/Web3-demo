'use client'

// Shared scene tuning values for the main fantasy pages.
// Update these numbers when you want to fine-tune character, owl, parchment,
// and the floating behavior of the large artwork.

export const characterFigureTuning = {
  maxHeight: 1000,
  offsetX: 50,
  offsetY: 30,
  floatY: 14,
  floatDuration: 4,
  floatDelay: 0.2,
} as const

export const archivePanelTuning = {
  containerMaxWidth: 300,
  containerPaddingTop: 55,
  containerOffsetX: 100,
  containerOffsetY: 0,
  owlSize: 250,
  owlOffsetX: -80,
  owlOffsetY: -70,
  owlFloatY: 10,
  owlFloatDuration: 5,
  owlFloatDelay: 0.4,
  parchmentScale: 1,
  parchmentOffsetX: 0,
  parchmentOffsetY: 0,
} as const

export const showcaseCabinetTuning = {
  maxWidth: 350,
  offsetX: -180,
  offsetY: -300,
  titleMarginTop: 16,
  titleFontSize: 15,
  helperMarginTop: 8,
  helperFontSize: 18,
} as const

export const heroFloatTuning = {
  crystalPile: {
    floatY: 16,
    floatDuration: 3,
    floatDelay: 0.1,
  },
  cauldron: {
    floatY: 14,
    floatDuration: 3,
    floatDelay: 0.25,
  },
  awakenDoor: {
    floatY: 12,
    floatDuration: 3,
    floatDelay: 0.35,
  },
} as const
