export type SearchDemand = 'High' | 'Medium' | 'Low'

interface SearchDemandCache {
  [keyword: string]: {
    label: SearchDemand
    score: number
    timestamp: number
  }
}

const CACHE_DURATION = 24 * 60 * 60 * 1000 // 24 hours

export async function getSearchDemandLabel(keyword: string): Promise<SearchDemand> {
  // Check cache first
  const cached = getCachedSearchDemand(keyword)
  if (cached) {
    return cached.label
  }

  try {
    // Query Google Trends API
    const response = await fetch(`/api/searchDemand?keyword=${encodeURIComponent(keyword)}`)
    const data = await response.json()
    
    // Cache the result
    cacheSearchDemand(keyword, data.label, data.score)
    
    return data.label
  } catch (error) {
    // Fallback to heuristic
    const heuristicScore = getHeuristicScore(keyword)
    const label: SearchDemand = heuristicScore >= 70 ? 'High' : heuristicScore >= 30 ? 'Medium' : 'Low'
    
    // Cache the fallback result
    cacheSearchDemand(keyword, label, heuristicScore)
    
    return label
  }
}

function getCachedSearchDemand(keyword: string): { label: SearchDemand; score: number } | null {
  if (typeof window === 'undefined') return null
  
  try {
    const cache: SearchDemandCache = JSON.parse(localStorage.getItem('searchDemandCache') || '{}')
    const cached = cache[keyword.toLowerCase()]
    
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return { label: cached.label, score: cached.score }
    }
  } catch (error) {
    console.warn('Failed to read search demand cache:', error)
  }
  
  return null
}

function cacheSearchDemand(keyword: string, label: SearchDemand, score: number): void {
  if (typeof window === 'undefined') return
  
  try {
    const cache: SearchDemandCache = JSON.parse(localStorage.getItem('searchDemandCache') || '{}')
    cache[keyword.toLowerCase()] = {
      label,
      score,
      timestamp: Date.now()
    }
    localStorage.setItem('searchDemandCache', JSON.stringify(cache))
  } catch (error) {
    console.warn('Failed to cache search demand:', error)
  }
}

function getHeuristicScore(keyword: string): number {
  let score = 0
  
  // Length factor (shorter = higher demand)
  if (keyword.length <= 4) score += 40
  else if (keyword.length <= 6) score += 30
  else if (keyword.length <= 8) score += 20
  else if (keyword.length <= 10) score += 10
  
  // Common word patterns
  const commonWords = ['the', 'and', 'for', 'with', 'from', 'this', 'that', 'have', 'will', 'your']
  if (commonWords.includes(keyword.toLowerCase())) score += 30
  
  // Brandable patterns (consonant-vowel-consonant)
  const cvcPattern = /^[bcdfghjklmnpqrstvwxyz][aeiou][bcdfghjklmnpqrstvwxyz]$/i
  if (cvcPattern.test(keyword)) score += 25
  
  // Tech/startup keywords
  const techKeywords = ['app', 'tech', 'dev', 'io', 'ai', 'api', 'web', 'cloud', 'data', 'code']
  if (techKeywords.some(tech => keyword.toLowerCase().includes(tech))) score += 20
  
  // Memorable patterns
  if (keyword.toLowerCase().includes('get') || keyword.toLowerCase().includes('go')) score += 15
  if (keyword.toLowerCase().includes('my') || keyword.toLowerCase().includes('me')) score += 15
  
  return Math.min(100, score)
} 