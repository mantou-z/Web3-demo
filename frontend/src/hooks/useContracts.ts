'use client'

import { useReadContract, useWriteContract } from 'wagmi'
import { CONTRACT_ADDRESSES, GrowthForgeABI, OreNFTABI } from '@/contracts/addresses'

// 读取用户目标列表
export function useUserGoals(address: `0x${string}` | undefined) {
  return useReadContract({
    address: CONTRACT_ADDRESSES.GrowthForge as `0x${string}`,
    abi: GrowthForgeABI,
    functionName: 'getUserGoals',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  })
}

// 读取单个目标详情
export function useGoal(goalId: bigint | undefined) {
  return useReadContract({
    address: CONTRACT_ADDRESSES.GrowthForge as `0x${string}`,
    abi: GrowthForgeABI,
    functionName: 'getGoal',
    args: goalId !== undefined ? [goalId] : undefined,
    query: {
      enabled: goalId !== undefined,
    },
  })
}

// 创建目标
export function useCreateGoal() {
  const { writeContract, isPending, error } = useWriteContract()

  const createGoal = (name: string, description: string, category: number) => {
    writeContract({
      address: CONTRACT_ADDRESSES.GrowthForge as `0x${string}`,
      abi: GrowthForgeABI,
      functionName: 'createGoal',
      args: [name, description, category],
    })
  }

  return { createGoal, isPending, error }
}

// 记录每日打卡
export function useRecordDaily() {
  const { writeContract, isPending, error } = useWriteContract()

  const recordDaily = (goalId: bigint, contentHash: string, quality: number) => {
    writeContract({
      address: CONTRACT_ADDRESSES.GrowthForge as `0x${string}`,
      abi: GrowthForgeABI,
      functionName: 'recordDaily',
      args: [goalId, contentHash, quality],
    })
  }

  return { recordDaily, isPending, error }
}

// 读取用户矿石列表
export function useUserOres(address: `0x${string}` | undefined) {
  return useReadContract({
    address: CONTRACT_ADDRESSES.OreNFT as `0x${string}`,
    abi: OreNFTABI,
    functionName: 'getOresByOwner',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  })
}

// 锻造卡片
export function useForgeCard() {
  const { writeContract, isPending, error } = useWriteContract()

  const forgeCard = (oreIds: bigint[], expectedType: number) => {
    writeContract({
      address: CONTRACT_ADDRESSES.GrowthForge as `0x${string}`,
      abi: GrowthForgeABI,
      functionName: 'forgeBasicCard',
      args: [oreIds, expectedType],
    })
  }

  return { forgeCard, isPending, error }
}
