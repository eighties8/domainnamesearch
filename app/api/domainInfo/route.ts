import { NextRequest, NextResponse } from 'next/server'

interface RDAPResponse {
  events?: Array<{
    eventAction: string
    eventDate: string
  }>
  entities?: Array<{
    roles?: string[]
    vcardArray?: any[]
  }>
  status?: string[]
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const domain = searchParams.get('domain')

  if (!domain) {
    return NextResponse.json({ error: 'Domain parameter is required' }, { status: 400 })
  }

  try {
    console.log(`🔍 Fetching RDAP info for ${domain}...`)
    
    // Use RDAP API (free, no API key required)
    const response = await fetch(`https://rdap.org/domain/${domain}`, {
      headers: {
        'Accept': 'application/rdap+json',
        'User-Agent': 'DomainNameSearch.app/1.0'
      }
    })

    if (!response.ok) {
      console.log(`❌ RDAP lookup failed for ${domain}: ${response.status}`)
      return NextResponse.json({
        domain,
        error: 'Domain information not available',
        message: 'Unable to fetch domain details'
      }, { status: 404 })
    }

    const data: RDAPResponse = await response.json()
    
    // Extract registration and expiration dates
    const events = data.events || []
    const registrationEvent = events.find(e => e.eventAction === 'registration')
    const expirationEvent = events.find(e => e.eventAction === 'expiration')
    
    // Check for auto-renewal status - look for various auto-renewal indicators
    const autoRenewalIndicators = [
      'auto renew period',
      'autorenew',
      'auto-renew',
      'auto renew',
      'renewal grace period',
      'redemption period'
    ]
    
    const hasAutoRenewal = data.status?.some(status => 
      autoRenewalIndicators.some(indicator => 
        status.toLowerCase().includes(indicator)
      )
    ) || false
    
    // Only include expiration info if we're confident it's NOT auto-renewing
    const expirationInfo = !hasAutoRenewal && expirationEvent?.eventDate ? {
      daysUntilExpiration: Math.ceil((new Date(expirationEvent.eventDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    } : null
    
    const result = {
      domain,
      registrationDate: registrationEvent?.eventDate || null,
      age: registrationEvent?.eventDate ? 
        Math.floor((Date.now() - new Date(registrationEvent.eventDate).getTime()) / (1000 * 60 * 60 * 24 * 365)) : null,
      hasAutoRenewal,
      ...(expirationInfo && { daysUntilExpiration: expirationInfo.daysUntilExpiration })
    }

    console.log(`✅ RDAP info for ${domain}:`, result)
    
    return NextResponse.json(result)

  } catch (error) {
    console.error(`❌ Error fetching domain info for ${domain}:`, error)
    return NextResponse.json({
      domain,
      error: 'Failed to fetch domain information',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
} 