import { NextRequest, NextResponse } from 'next/server'

interface TrendsResponse {
  score: number
  label: 'High' | 'Medium' | 'Low'
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const keyword = searchParams.get('keyword')

  if (!keyword) {
    return NextResponse.json({ error: 'Keyword parameter is required' }, { status: 400 })
  }

  try {
    // Try to get data from Google Trends (unofficial endpoint)
    const trendsData = await getGoogleTrendsData(keyword)
    
    return NextResponse.json({
      score: trendsData.score,
      label: trendsData.label
    })
  } catch (error) {
    // Fallback to heuristic scoring
    const heuristicScore = getHeuristicScore(keyword)
    
    return NextResponse.json({
      score: heuristicScore,
      label: heuristicScore >= 70 ? 'High' : heuristicScore >= 30 ? 'Medium' : 'Low'
    })
  }
}

async function getGoogleTrendsData(keyword: string): Promise<TrendsResponse> {
  // Google Trends API endpoint (unofficial)
  const url = `https://trends.google.com/trends/api/widgetdata/multiline?hl=en-US&tz=-240&req=%7B%22time%22:%222024-01-01%202025-01-31%22,%22keyword%22:%22${encodeURIComponent(keyword)}%22,%22cat%22:%220%22%7D&token=APP6_UEAAAAAY_${Date.now()}&tzp=-240`
  
  const response = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    }
  })

  if (!response.ok) {
    throw new Error('Google Trends API failed')
  }

  const data = await response.text()
  
  // Parse Google Trends response (starts with ")]}'")
  const jsonData = JSON.parse(data.substring(5))
  
  if (!jsonData.timelineData || jsonData.timelineData.length === 0) {
    throw new Error('No trends data available')
  }

  // Calculate average interest over time
  const values = jsonData.timelineData.map((point: any) => point.value[0])
  const averageValue = values.reduce((sum: number, val: number) => sum + val, 0) / values.length
  
  // Normalize to 0-100 scale
  const score = Math.min(100, Math.max(0, averageValue))
  
  return {
    score,
    label: score >= 70 ? 'High' : score >= 30 ? 'Medium' : 'Low'
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