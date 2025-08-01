interface DomainPrice {
  initial: string
  renewal: string
  available: boolean
}

interface RegistrarPrices {
  namecheap?: DomainPrice
  godaddy?: DomainPrice
  porkbun?: DomainPrice
}

// Namecheap API
export async function getNamecheapPrice(domain: string): Promise<DomainPrice | undefined> {
  try {
    const apiUser = process.env.NAMECHEAP_API_USER
    const apiKey = process.env.NAMECHEAP_API_KEY
    const clientIp = process.env.NAMECHEAP_CLIENT_IP

    if (!apiUser || !apiKey || !clientIp) {
      console.log('❌ Namecheap API credentials not configured')
      return undefined
    }

    const url = `https://api.sandbox.namecheap.com/xml.response?ApiUser=${apiUser}&ApiKey=${apiKey}&UserName=${apiUser}&Command=namecheap.domains.check&ClientIp=${clientIp}&DomainList=${domain}`

    const response = await fetch(url)
    const xmlText = await response.text()
    
    // Parse XML response (simplified)
    const available = !xmlText.includes('Domain name is not available')
    const priceMatch = xmlText.match(/Price[^>]*>([^<]+)</)
    const renewalMatch = xmlText.match(/RenewalPrice[^>]*>([^<]+)</)
    
    if (priceMatch) {
      return {
        initial: `$${priceMatch[1]}`,
        renewal: renewalMatch ? `$${renewalMatch[1]}` : '$13.98',
        available
      }
    }

    return undefined
  } catch (error) {
    console.error('❌ Namecheap API error:', error)
    return undefined
  }
}

// GoDaddy API
export async function getGoDaddyPrice(domain: string): Promise<DomainPrice | undefined> {
  try {
    const apiKey = process.env.GODADDY_API_KEY
    const apiSecret = process.env.GODADDY_API_SECRET

    if (!apiKey || !apiSecret) {
      console.log('❌ GoDaddy API credentials not configured')
      return undefined
    }

    const url = `https://api.godaddy.com/v1/domains/available?domain=${domain}`
    
    const response = await fetch(url, {
      headers: {
        'Authorization': `sso-key ${apiKey}:${apiSecret}`,
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      console.log(`❌ GoDaddy API error: ${response.status}`)
      return undefined
    }

    const data = await response.json()
    
    if (data.available) {
      // GoDaddy doesn't provide pricing in availability check
      // We'd need a separate pricing API call
      return {
        initial: '$19.99', // Default fallback
        renewal: '$19.99',
        available: true
      }
    }

    return {
      initial: '$0',
      renewal: '$0',
      available: false
    }
  } catch (error) {
    console.error('❌ GoDaddy API error:', error)
    return undefined
  }
}

// Porkbun API
export async function getPorkbunPrice(domain: string): Promise<DomainPrice | undefined> {
  try {
    const apiKey = process.env.PORKBUN_API_KEY
    const secretKey = process.env.PORKBUN_SECRET_KEY

    if (!apiKey || !secretKey) {
      console.log('❌ Porkbun API credentials not configured')
      return undefined
    }

    const url = 'https://porkbun.com/api/json/v3/domain/available'
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        domain: domain,
        apiKey: apiKey,
        secretKey: secretKey
      })
    })

    if (!response.ok) {
      console.log(`❌ Porkbun API error: ${response.status}`)
      return undefined
    }

    const data = await response.json()
    
    if (data.status === 'SUCCESS' && data.available) {
      // Porkbun doesn't provide pricing in availability check
      // We'd need a separate pricing API call
      return {
        initial: '$8.56', // Default fallback
        renewal: '$8.56',
        available: true
      }
    }

    return {
      initial: '$0',
      renewal: '$0',
      available: false
    }
  } catch (error) {
    console.error('❌ Porkbun API error:', error)
    return undefined
  }
}

// Main function to get all registrar prices
export async function getAllRegistrarPrices(domain: string): Promise<RegistrarPrices> {
  const [namecheap, godaddy, porkbun] = await Promise.allSettled([
    getNamecheapPrice(domain),
    getGoDaddyPrice(domain),
    getPorkbunPrice(domain)
  ])

  return {
    namecheap: namecheap.status === 'fulfilled' ? namecheap.value : undefined,
    godaddy: godaddy.status === 'fulfilled' ? godaddy.value : undefined,
    porkbun: porkbun.status === 'fulfilled' ? porkbun.value : undefined
  }
} 