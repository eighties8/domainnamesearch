import { NextRequest, NextResponse } from 'next/server'
import { promises as dns } from 'dns'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const domain = searchParams.get('domain')

  if (!domain) {
    return NextResponse.json({ error: 'Domain parameter is required' }, { status: 400 })
  }

  console.log('=== API CALL START ===')
  console.log('Checking domain:', domain)

  try {
    // Simple DNS-based domain availability check
    const timeout = 5000 // 5 second timeout
    
    const result = await Promise.race([
      dns.resolve4(domain),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('DNS_TIMEOUT')), timeout)
      )
    ])
    
    // Check if the resolved IP is a parking page
    const parkingIPs = ['143.244.220.150', '0.0.0.0', '127.0.0.1']
    const resolvedIPs = Array.isArray(result) ? result : [result]
    const isParkingIP = resolvedIPs.some(ip => parkingIPs.includes(ip))
    
    console.log('Domain:', domain)
    console.log('Resolved IPs:', resolvedIPs)
    console.log('Parking IPs list:', parkingIPs)
    console.log('Is Parking IP:', isParkingIP)
    
    // If it's a parking IP, check if it's a random domain
    if (isParkingIP) {
      const domainName = domain.split('.')[0]
      const isRandomDomain = /^[a-z]{6,}$/i.test(domainName)
      
      console.log('Domain name:', domainName)
      console.log('Is random domain:', isRandomDomain)
      
      if (isRandomDomain) {
        return NextResponse.json({ 
          domain, 
          available: true,
          message: 'Domain appears to be available (parking IP detected for random domain)'
        })
      }
    }
    
    // If DNS resolution succeeds, domain is taken
    return NextResponse.json({ 
      domain, 
      available: false,
      message: 'Domain is already registered (DNS resolution successful)'
    })
    
  } catch (error: any) {
    // DNS resolution failed - check if it's ENOTFOUND (domain not found)
    if (error.code === 'ENOTFOUND') {
      return NextResponse.json({ 
        domain, 
        available: true,
        message: 'Domain is available (DNS resolution failed - ENOTFOUND)'
      })
    }
    
    // DNS timeout or other error - be conservative and assume taken
    console.error('DNS error:', error.message)
    return NextResponse.json({ 
      domain, 
      available: false,
      message: 'Domain appears to be registered (DNS lookup failed)'
    })
  }
} 