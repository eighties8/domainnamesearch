#!/usr/bin/env node

/**
 * Cron-friendly price updater
 * 
 * This script is designed to run weekly via cron job
 * It's more conservative to avoid getting blocked
 * 
 * Usage: node scripts/updatePricesCron.js
 * Cron: 0 2 * * 0 (every Sunday at 2 AM)
 */

const fs = require('fs')
const path = require('path')
const puppeteer = require('puppeteer')

const PRICE_FILE = path.join(__dirname, '../data/domainPrices.json')

// Only check a few key TLDs to reduce load
const KEY_TLDS = {
  com: 'startupdomain.com',
  io: 'startupdomain.io', 
  app: 'startupdomain.app',
  ai: 'startupdomain.ai'
}

// Conservative user agent
const USER_AGENT = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'

async function scrapeNamecheapPrice(browser, tld) {
  const page = await browser.newPage()
  const domain = KEY_TLDS[tld]
  
  try {
    console.log(`🔍 Checking Namecheap .${tld}...`)
    
    await page.setUserAgent(USER_AGENT)
    await page.setViewport({ width: 1920, height: 1080 })
    
    // Navigate to Namecheap
    await page.goto(`https://www.namecheap.com/domains/registration/results/?domain=${domain}&utm_source=domainnamesearch&utm_medium=affiliate`, {
      waitUntil: 'networkidle2',
      timeout: 30000
    })

    // Wait for content to load
    await new Promise(resolve => setTimeout(resolve, 5000))
    
    // Try to find price in page content with better logic
    const priceData = await page.evaluate((targetTld, searchDomain) => {
      // Look for the specific domain price for this TLD
      const domainName = searchDomain.split('.')[0] // e.g., "startupdomain" from "startupdomain.io"
      const targetDomain = `${domainName}.${targetTld}` // e.g., "startupdomain.io"
      
      // Look for price patterns in the entire page
      const allText = document.body.textContent
      
      // First, try to find the exact domain price by looking for the domain name
      const domainRegex = new RegExp(`${targetDomain}.*?\\$\\d+\\.?\\d*`, 'gi')
      const domainMatches = allText.match(domainRegex)
      
      if (domainMatches && domainMatches.length > 0) {
        // Extract price from the domain match
        const priceMatch = domainMatches[0].match(/\$(\d+\.?\d*)/)
        if (priceMatch) {
          const initialPrice = `$${priceMatch[1]}`
          
          // Look for renewal price near this domain
          const renewalRegex = new RegExp(`renew.*?\\$\\d+\\.?\\d*`, 'gi')
          const renewalMatches = allText.match(renewalRegex)
          let renewalPrice = null
          
          if (renewalMatches && renewalMatches.length > 0) {
            const renewalMatch = renewalMatches[0].match(/\$(\d+\.?\d*)/)
            if (renewalMatch) {
              renewalPrice = `$${renewalMatch[1]}`
            }
          }
          
          return {
            initial: initialPrice,
            renewal: renewalPrice,
            allPrices: [initialPrice] // For debugging
          }
        }
      }
      
      // Fallback: if we can't find the exact domain, look for prices in the main result area
      const priceMatches = allText.match(/\$\d+\.?\d*/g)
      
      if (priceMatches && priceMatches.length > 0) {
        // Filter out obvious non-domain prices (like SSL prices, small amounts)
        const domainPrices = priceMatches.filter(price => {
          const num = parseFloat(price.replace('$', ''))
          // Domain prices are typically between $5 and $200
          return num >= 5 && num <= 200
        })
        
        if (domainPrices.length > 0) {
          // Look for the main domain price for this specific TLD
          // Sort by price and take a reasonable one (not the cheapest)
          domainPrices.sort((a, b) => parseFloat(a.replace('$', '')) - parseFloat(b.replace('$', '')))
          
          // For .com domains, they're usually cheaper, so take a lower price
          // For .io/.ai domains, they're more expensive, so take a higher price
          let selectedIndex = Math.floor(domainPrices.length / 2)
          
          if (targetTld === 'com') {
            // For .com, take a lower price (first 1/3)
            selectedIndex = Math.floor(domainPrices.length / 3)
          } else if (targetTld === 'io' || targetTld === 'ai') {
            // For .io/.ai, take a higher price (last 1/3)
            selectedIndex = Math.floor(domainPrices.length * 2 / 3)
          }
          
          const selectedPrice = domainPrices[selectedIndex] || domainPrices[0]
          
          // Try to find renewal price - look for "renew" or "renews at" text
          let renewalPrice = null
          const renewalMatches = allText.match(/renew.*?\$(\d+\.?\d*)/gi)
          if (renewalMatches && renewalMatches.length > 0) {
            const renewalMatch = renewalMatches[0].match(/\$(\d+\.?\d*)/)
            if (renewalMatch) {
              renewalPrice = `$${renewalMatch[1]}`
            }
          }
          
          return {
            initial: selectedPrice,
            renewal: renewalPrice,
            allPrices: domainPrices // For debugging
          }
        }
      }
      
      return null
    }, tld, domain)
    
    // Debug output
    if (priceData) {
      console.log(`Found prices for .${tld}:`, priceData.allPrices)
    }
    
    await page.close()
    return priceData
    
  } catch (error) {
    console.log(`❌ Namecheap .${tld}: ${error.message}`)
    await page.close()
    return null
  }
}

async function updatePricesCron() {
  console.log('🔄 Starting weekly price update...')
  
  // Read current prices
  const currentPrices = JSON.parse(fs.readFileSync(PRICE_FILE, 'utf8'))
  const updatedPrices = { ...currentPrices }
  let updatedCount = 0
  
  // Launch browser
  const browser = await puppeteer.launch({
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu'
    ]
  })
  
  try {
    // Only check key TLDs
    for (const [tld, domain] of Object.entries(KEY_TLDS)) {
      console.log(`\n📊 Checking .${tld}...`)
      
      // Only check Namecheap for now (most reliable)
      const namecheapPrice = await scrapeNamecheapPrice(browser, tld)
      
      if (namecheapPrice && namecheapPrice.initial) {
        updatedPrices.prices.namecheap[tld] = {
          initial: namecheapPrice.initial,
          renewal: namecheapPrice.renewal || updatedPrices.prices.namecheap[tld]?.renewal || '$13.98'
        }
        console.log(`✅ Namecheap .${tld}: ${namecheapPrice.initial} (renewal: ${namecheapPrice.renewal || 'not found'})`)
        updatedCount++
      }
      
      // Long delay between checks
      await new Promise(resolve => setTimeout(resolve, 15000)) // 15 second delay
    }
    
    // Update timestamp
    updatedPrices.lastUpdated = new Date().toISOString()
    
    // Write updated prices
    fs.writeFileSync(PRICE_FILE, JSON.stringify(updatedPrices, null, 2))
    
    console.log(`\n✅ Price update complete!`)
    console.log(`📅 Last updated: ${updatedPrices.lastUpdated}`)
    console.log(`📊 Updated ${updatedCount} prices`)
    
  } catch (error) {
    console.error('❌ Error during price update:', error)
  } finally {
    await browser.close()
  }
}

if (require.main === module) {
  updatePricesCron().catch(console.error)
}

module.exports = { updatePricesCron } 