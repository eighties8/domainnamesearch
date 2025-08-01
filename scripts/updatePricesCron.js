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
  com: 'example.com',
  io: 'example.io', 
  app: 'example.app',
  ai: 'example.ai'
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
    
    // Try to find price in page content
    const priceData = await page.evaluate(() => {
      // Look for price patterns in the entire page
      const allText = document.body.textContent
      const priceMatches = allText.match(/\$\d+\.?\d*/g)
      
      if (priceMatches && priceMatches.length > 0) {
        // Filter out obvious non-domain prices (like SSL prices, small amounts)
        const domainPrices = priceMatches.filter(price => {
          const num = parseFloat(price.replace('$', ''))
          // Domain prices are typically between $5 and $200
          return num >= 5 && num <= 200
        })
        
        if (domainPrices.length > 0) {
          // Look for the main domain price (usually in the middle range)
          // Sort by price and take the median or a price in the middle range
          domainPrices.sort((a, b) => parseFloat(a.replace('$', '')) - parseFloat(b.replace('$', '')))
          
          // Take a price from the middle range (not the cheapest, not the most expensive)
          const midIndex = Math.floor(domainPrices.length / 2)
          const selectedPrice = domainPrices[midIndex]
          
          return {
            initial: selectedPrice,
            renewal: null,
            allPrices: domainPrices // For debugging
          }
        }
      }
      
      return null
    })
    
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
          renewal: updatedPrices.prices.namecheap[tld]?.renewal || '$13.98'
        }
        console.log(`✅ Namecheap .${tld}: ${namecheapPrice.initial}`)
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