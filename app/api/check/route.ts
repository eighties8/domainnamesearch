import { NextRequest, NextResponse } from 'next/server'
import dns from 'dns'
import { promisify } from 'util'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const domain = searchParams.get('domain')

  if (!domain) {
    return NextResponse.json({ error: 'Domain parameter is required' }, { status: 400 })
  }

  // Use a more reliable approach - check if domain exists in DNS hierarchy
  try {
    // Try to resolve A records
    const aRecords = await resolve4(domain)
    
    // Check if the resolved IP is a known parking/hijacking IP
    const parkingIPs = [
      '143.244.220.150', // Common parking IP
      '0.0.0.0',
      '127.0.0.1'
    ]
    
    const isParkingIP = aRecords.some(ip => parkingIPs.includes(ip))
    
    if (isParkingIP) {
      return NextResponse.json({ 
        domain, 
        available: true,
        message: 'Domain appears to be available (parking IP detected)'
      })
    }
    
    // If we get here, domain has real A records and is taken
    return NextResponse.json({ 
      domain, 
      available: false,
      message: 'Domain is already registered (has A records)'
    })
  } catch (error: any) {
    // If DNS resolution fails, we need to be more careful
    const tld = domain.split('.').pop()?.toLowerCase()
    const newerTLDs = ['io', 'app', 'ai', 'dev', 'tech', 'xyz', 'org']
    
    if (error.code === 'ENOTFOUND' && newerTLDs.includes(tld || '')) {
      // For newer TLDs and .org, ENOTFOUND is more likely to mean available
      return NextResponse.json({ 
        domain, 
        available: true,
        message: 'Domain appears to be available (no DNS records found)'
      })
    }
    
    // For .com and other established TLDs, be more conservative
    // Many registered domains don't have websites, so we assume taken
    return NextResponse.json({ 
      domain, 
      available: false,
      message: 'Domain appears to be registered (DNS lookup failed)'
    })
  }
}

const resolve4 = promisify(dns.resolve4) 