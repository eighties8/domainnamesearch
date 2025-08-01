import { NextRequest, NextResponse } from 'next/server'
import { getAllRegistrarPrices } from '../../../lib/domainApis'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const domain = searchParams.get('domain')

  if (!domain) {
    return NextResponse.json({ error: 'Domain parameter is required' }, { status: 400 })
  }

  try {
    console.log(`🔍 Getting real-time prices for ${domain}...`)
    
    const prices = await getAllRegistrarPrices(domain)
    
    console.log(`✅ Got prices for ${domain}:`, prices)
    
    return NextResponse.json({
      domain,
      prices,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('❌ Error getting domain prices:', error)
    return NextResponse.json({
      error: 'Failed to get domain prices',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
} 