import searchVolumeData from '@/data/searchVolume.json'
import tldData from '@/data/tlds.json'

export interface DomainResult {
  domain: string
  tld: string
  available: boolean
  brandabilityScore: number
  estimatedValue: number
  searchVolume: number
  loading?: boolean
}

export interface TLDInfo {
  tld: string
  name: string
  price: number
  popularity: number
  brandability: number
}

// Calculate brandability score based on heuristics
export function calculateBrandabilityScore(domain: string, tld: string): number {
  let score = 0
  const domainName = domain.split('.')[0]
  
  // Length scoring (0-3 points)
  if (domainName.length <= 4) score += 3
  else if (domainName.length <= 6) score += 2
  else if (domainName.length <= 8) score += 1
  
  // Consonant ending (0-2 points)
  const consonants = 'bcdfghjklmnpqrstvwxyz'
  if (consonants.includes(domainName[domainName.length - 1].toLowerCase())) {
    score += 2
  }
  
  // Pronounceability check (0-2 points)
  const vowels = 'aeiou'
  let vowelCount = 0
  for (let i = 0; i < domainName.length; i++) {
    if (vowels.includes(domainName[i].toLowerCase())) {
      vowelCount++
    }
  }
  const vowelRatio = vowelCount / domainName.length
  if (vowelRatio >= 0.3 && vowelRatio <= 0.6) {
    score += 2
  }
  
  // TLD bonus (0-1 point)
  if (tld === 'com') {
    score += 1
  }
  
  // Cap at 10
  return Math.min(10, score)
}

// Get search volume for a domain
export function getSearchVolume(domain: string): number {
  const name = domain.split('.')[0]
  return (searchVolumeData as any)[name] || 0
}

// Get TLD info
export function getTLDInfo(tld: string): TLDInfo | undefined {
  return (tldData as TLDInfo[]).find(t => t.tld === tld)
}

// Calculate estimated value
export function calculateEstimatedValue(domain: string): number {
  const tldMultiplier = {
    '.com': 1.0,
    '.net': 0.8,
    '.org': 0.7,
    '.app': 0.6,
    '.tech': 0.5,
    '.dev': 0.5,
    '.io': 0.9
  }

  const base = 100;
  const lengthPenalty = Math.max(0, 10 - domain.split('.')[0].length) * 5;
  const keywordBonus = domain.includes('quote') ? 25 : 0;
  const tld = domain.slice(domain.lastIndexOf('.'));
  const multiplier = tldMultiplier[tld as keyof typeof tldMultiplier] ?? 0.4;

  return Math.round((base + lengthPenalty + keywordBonus) * multiplier);
}

// Generate domain suggestions
export function generateDomainSuggestions(baseName: string): string[] {
  const tlds = tldData.map(t => t.tld)
  return tlds.map(tld => `${baseName}.${tld}`)
}

// Check if domain is pronounceable
export function isPronounceable(domain: string): boolean {
  const name = domain.split('.')[0]
  const vowels = 'aeiou'
  let vowelCount = 0
  
  for (const char of name.toLowerCase()) {
    if (vowels.includes(char)) {
      vowelCount++
    }
  }
  
  return vowelCount >= 1 && vowelCount <= name.length - 1
} 