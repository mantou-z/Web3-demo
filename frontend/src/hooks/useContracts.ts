'use client'

import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'

// 合约地址 - 需要部署后更新
const ALCHEME_SBT_ADDRESS = process.env.NEXT_PUBLIC_ALCHEME_SBT_ADDRESS as `0x${string}` || '0x0000000000000000000000000000000000000000'

// AlchemeSBT ABI
const AlchemeSBTABI = [
  {
    "inputs": [
      { "name": "to", "type": "address" },
      { "name": "uri", "type": "string" },
      { "name": "title", "type": "string" },
      { "name": "description", "type": "string" }
    ],
    "name": "mint",
    "outputs": [{ "name": "tokenId", "type": "uint256" }],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "name": "tokenId", "type": "uint256" },
      { "name": "newUri", "type": "string" },
      { "name": "newTitle", "type": "string" },
      { "name": "newDescription", "type": "string" }
    ],
    "name": "evolve",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{ "name": "tokenId", "type": "uint256" }],
    "name": "tokenURI",
    "outputs": [{ "name": "", "type": "string" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "name": "tokenId", "type": "uint256" }],
    "name": "getMedalData",
    "outputs": [
      {
        "components": [
          { "name": "title", "type": "string" },
          { "name": "description", "type": "string" },
          { "name": "createdAt", "type": "uint256" },
          { "name": "creator", "type": "address" }
        ],
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "name": "owner_", "type": "address" }],
    "name": "getTokensByOwner",
    "outputs": [{ "name": "", "type": "uint256[]" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "name": "owner_", "type": "address" }],
    "name": "balanceOf",
    "outputs": [{ "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  }
] as const

// 读取用户勋章
export function useUserMedals(address: `0x${string}` | undefined) {
  return useReadContract({
    address: ALCHEME_SBT_ADDRESS,
    abi: AlchemeSBTABI,
    functionName: 'getTokensByOwner',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address && ALCHEME_SBT_ADDRESS !== '0x0000000000000000000000000000000000000000',
    },
  })
}

// 读取勋章详情
export function useMedalData(tokenId: bigint | undefined) {
  return useReadContract({
    address: ALCHEME_SBT_ADDRESS,
    abi: AlchemeSBTABI,
    functionName: 'getMedalData',
    args: tokenId !== undefined ? [tokenId] : undefined,
    query: {
      enabled: tokenId !== undefined && ALCHEME_SBT_ADDRESS !== '0x0000000000000000000000000000000000000000',
    },
  })
}

// 读取tokenURI
export function useTokenURI(tokenId: bigint | undefined) {
  return useReadContract({
    address: ALCHEME_SBT_ADDRESS,
    abi: AlchemeSBTABI,
    functionName: 'tokenURI',
    args: tokenId !== undefined ? [tokenId] : undefined,
    query: {
      enabled: tokenId !== undefined && ALCHEME_SBT_ADDRESS !== '0x0000000000000000000000000000000000000000',
    },
  })
}

// 铸造勋章
export function useMintMedal() {
  const { writeContract, isPending, error, data: hash } = useWriteContract()
  
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  })

  const mintMedal = (to: `0x${string}`, uri: string, title: string, description: string) => {
    writeContract({
      address: ALCHEME_SBT_ADDRESS,
      abi: AlchemeSBTABI,
      functionName: 'mint',
      args: [to, uri, title, description],
    })
  }

  return { 
    mintMedal, 
    isPending, 
    isConfirming, 
    isConfirmed, 
    error, 
    hash 
  }
}

// 进化勋章
export function useEvolveMedal() {
  const { writeContract, isPending, error, data: hash } = useWriteContract()
  
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  })

  const evolveMedal = (tokenId: bigint, newUri: string, newTitle: string, newDescription: string) => {
    writeContract({
      address: ALCHEME_SBT_ADDRESS,
      abi: AlchemeSBTABI,
      functionName: 'evolve',
      args: [tokenId, newUri, newTitle, newDescription],
    })
  }

  return { 
    evolveMedal, 
    isPending, 
    isConfirming, 
    isConfirmed, 
    error, 
    hash 
  }
}

// 读取用户余额
export function useMedalBalance(address: `0x${string}` | undefined) {
  return useReadContract({
    address: ALCHEME_SBT_ADDRESS,
    abi: AlchemeSBTABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address && ALCHEME_SBT_ADDRESS !== '0x0000000000000000000000000000000000000000',
    },
  })
}
