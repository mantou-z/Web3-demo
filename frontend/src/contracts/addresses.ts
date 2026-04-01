// 部署后填入合约地址
export const CONTRACT_ADDRESSES = {
  GrowthForge: '0x36b1507fb395d6deb8bb9e6bf9886f6dc08e943ad4d861aa95fb5d55f8263d98', // 替换为你的 GrowthForge 合约地址
  OreNFT: '0x83b4962cf6b9f47b501d2f474207c12079018d582b332caadf137e608995a707',      // 替换为你的 OreNFT 合约地址
  CardNFT: '0x2560937ebf39f551e4505eee06336cc96aba35f660159db66490aa606a9650cd',     // 替换为你的 CardNFT 合约地址
  MedalNFT: '0x129ffa29a1920f2aebee52785c4cf316a364aaf8b6423b7cd13ded871b77ae41',    // 替换为你的 MedalNFT 合约地址（可选）
} as const

export { default as GrowthForgeABI } from './GrowthForge.json'
export { default as OreNFTABI } from './OreNFT.json'
export { default as CardNFTABI } from './CardNFT.json'
export { default as MedalNFTABI } from './MedalNFT.json'
