#!/usr/bin/env node

/**
 * Automated domain price scraper
 * 
 * This script scrapes current domain prices from registrar websites
 * and updates data/domainPrices.json automatically
 * 
 * Usage: node scripts/updatePrices.js
 */

const fs = require('fs')
const path = require('path')
const puppeteer = require('puppeteer')

const PRICE_FILE = path.join(__dirname, '../data/domainPrices.json')

// Sample domains to check for each TLD
const SAMPLE_DOMAINS = {
  com: 'example.com',
  io: 'example.io', 
  app: 'example.app',
  ai: 'example.ai',
  co: 'example.co',
  dev: 'example.dev',
  tech: 'example.tech',
  net: 'example.net',
  xyz: 'example.xyz'
}

// User agents to rotate
const USER_AGENTS = [
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Safari/605.1.15'
]

async function scrapeNamecheapPrices(browser, tld) {
  const page = await browser.newPage()
  const domain = SAMPLE_DOMAINS[tld]
  
  try {
    console.log(`🔍 Scraping Namecheap prices for .${tld}...`)
    
    // Set user agent
    await page.setUserAgent(USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)])
    
    // Navigate to Namecheap domain search
    await page.goto(`https://www.namecheap.com/domains/registration/results/?domain=${domain}&utm_source=domainnamesearch&utm_medium=affiliate`, {
      waitUntil: 'networkidle2',
      timeout: 30000
    })

    // Wait a bit for dynamic content to load
    await new Promise(resolve => setTimeout(resolve, 3000))
    
    // Extract price information with more flexible selectors
    const priceData = await page.evaluate(() => {
      // Try multiple selectors for price elements
      const priceSelectors = [
        '[data-testid="domain-price"]',
        '.domain-price',
        '.price',
        '.domain-card .price',
        '.search-result .price',
        '.price-amount',
        '.domain-price-amount',
        '[class*="price"]',
        '[class*="Price"]',
        'span[class*="price"]',
        'div[class*="price"]'
      ]
      
      let priceElement = null
      for (const selector of priceSelectors) {
        const elements = document.querySelectorAll(selector)
        for (const element of elements) {
          const text = element.textContent.trim()
          if (text.includes('$') && text.match(/\$\d+/)) {
            priceElement = element
            break
          }
        }
        if (priceElement) break
      }
      
      if (!priceElement) {
        // Fallback: search all text content for price patterns
        const allText = document.body.textContent
        const priceMatches = allText.match(/\$\d+\.?\d*/g)
        if (priceMatches && priceMatches.length > 0) {
          return {
            initial: priceMatches[0],
            renewal: null
          }
        }
        return null
      }
      
      const priceText = priceElement.textContent.trim()
      const priceMatch = priceText.match(/\$([\d,]+\.?\d*)/)
      
      if (priceMatch) {
        return {
          initial: `$${priceMatch[1]}`,
          renewal: null
        }
      }
      
      return null
    })
    
    await page.close()
    return priceData
    
  } catch (error) {
    console.log(`❌ Error scraping Namecheap .${tld}:`, error.message)
    await page.close()
    return null
  }
}

async function scrapeGoDaddyPrices(browser, tld) {
  const page = await browser.newPage()
  const domain = SAMPLE_DOMAINS[tld]
  
  try {
    console.log(`🔍 Scraping GoDaddy prices for .${tld}...`)
    
    // Set user agent
    await page.setUserAgent(USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)])
    
    // Navigate to GoDaddy domain search
    await page.goto(`https://www.godaddy.com/domains/search?domainToCheck=${domain}`, {
      waitUntil: 'networkidle2',
      timeout: 30000
    })

    // Wait a bit for dynamic content to load
    await new Promise(resolve => setTimeout(resolve, 3000))
    
    // Extract price information
    const priceData = await page.evaluate(() => {
      const priceSelectors = [
        '.domain-price',
        '.price',
        '[data-testid="price"]',
        '.search-result .price',
        '.price-amount',
        '[class*="price"]',
        '[class*="Price"]',
        'span[class*="price"]',
        'div[class*="price"]'
      ]
      
      let priceElement = null
      for (const selector of priceSelectors) {
        const elements = document.querySelectorAll(selector)
        for (const element of elements) {
          const text = element.textContent.trim()
          if (text.includes('$') && text.match(/\$\d+/)) {
            priceElement = element
            break
          }
        }
        if (priceElement) break
      }
      
      if (!priceElement) {
        // Fallback: search all text content for price patterns
        const allText = document.body.textContent
        const priceMatches = allText.match(/\$\d+\.?\d*/g)
        if (priceMatches && priceMatches.length > 0) {
          return {
            initial: priceMatches[0],
            renewal: null
          }
        }
        return null
      }
      
      const priceText = priceElement.textContent.trim()
      const priceMatch = priceText.match(/\$([\d,]+\.?\d*)/)
      
      if (priceMatch) {
        return {
          initial: `$${priceMatch[1]}`,
          renewal: null
        }
      }
      
      return null
    })
    
    await page.close()
    return priceData
    
  } catch (error) {
    console.log(`❌ Error scraping GoDaddy .${tld}:`, error.message)
    await page.close()
    return null
  }
}

async function scrapePorkbunPrices(browser, tld) {
  const page = await browser.newPage()
  const domain = SAMPLE_DOMAINS[tld]
  
  try {
    console.log(`🔍 Scraping Porkbun prices for .${tld}...`)
    
    // Set user agent
    await page.setUserAgent(USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)])
    
    // Navigate to Porkbun domain search
    await page.goto(`https://porkbun.com/domain/${domain}`, {
      waitUntil: 'networkidle2',
      timeout: 30000
    })

    // Wait a bit for dynamic content to load
    await new Promise(resolve => setTimeout(resolve, 3000))
    
    // Extract price information
    const priceData = await page.evaluate(() => {
      const priceSelectors = [
        '.price',
        '.domain-price',
        '[data-testid="price"]',
        '.search-result .price',
        '.price-amount',
        '[class*="price"]',
        '[class*="Price"]',
        'span[class*="price"]',
        'div[class*="price"]'
      ]
      
      let priceElement = null
      for (const selector of priceSelectors) {
        const elements = document.querySelectorAll(selector)
        for (const element of elements) {
          const text = element.textContent.trim()
          if (text.includes('$') && text.match(/\$\d+/)) {
            priceElement = element
            break
          }
        }
        if (priceElement) break
      }
      
      if (!priceElement) {
        // Fallback: search all text content for price patterns
        const allText = document.body.textContent
        const priceMatches = allText.match(/\$\d+\.?\d*/g)
        if (priceMatches && priceMatches.length > 0) {
          return {
            initial: priceMatches[0],
            renewal: null
          }
        }
        return null
      }
      
      const priceText = priceElement.textContent.trim()
      const priceMatch = priceText.match(/\$([\d,]+\.?\d*)/)
      
      if (priceMatch) {
        return {
          initial: `$${priceMatch[1]}`,
          renewal: null
        }
      }
      
      return null
    })
    
    await page.close()
    return priceData
    
  } catch (error) {
    console.log(`❌ Error scraping Porkbun .${tld}:`, error.message)
    await page.close()
    return null
  }
}

async function updatePriceFile() {
  console.log('🔄 Starting automated price update...')
  
  // Read current prices as fallback
  const currentPrices = JSON.parse(fs.readFileSync(PRICE_FILE, 'utf8'))
  const updatedPrices = { ...currentPrices }
  
  // Launch browser with stealth settings
  const browser = await puppeteer.launch({
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--no-first-run',
      '--no-zygote',
      '--disable-gpu'
    ]
  })
  
  try {
    // Scrape prices for each TLD
    for (const [tld, domain] of Object.entries(SAMPLE_DOMAINS)) {
      console.log(`\n📊 Checking .${tld} prices...`)
      
      // Scrape from each registrar with longer delays
      const namecheapPrice = await scrapeNamecheapPrices(browser, tld)
      await new Promise(resolve => setTimeout(resolve, 5000)) // 5 second delay
      
      const godaddyPrice = await scrapeGoDaddyPrices(browser, tld)
      await new Promise(resolve => setTimeout(resolve, 5000)) // 5 second delay
      
      const porkbunPrice = await scrapePorkbunPrices(browser, tld)
      await new Promise(resolve => setTimeout(resolve, 5000)) // 5 second delay
      
      // Update prices if we got new data
      if (namecheapPrice && namecheapPrice.initial) {
        updatedPrices.prices.namecheap[tld] = {
          initial: namecheapPrice.initial,
          renewal: namecheapPrice.renewal || updatedPrices.prices.namecheap[tld]?.renewal || '$13.98'
        }
        console.log(`✅ Namecheap .${tld}: ${namecheapPrice.initial}`)
      }
      
      if (godaddyPrice && godaddyPrice.initial) {
        updatedPrices.prices.godaddy[tld] = {
          initial: godaddyPrice.initial,
          renewal: godaddyPrice.renewal || updatedPrices.prices.godaddy[tld]?.renewal || '$19.99'
        }
        console.log(`✅ GoDaddy .${tld}: ${godaddyPrice.initial}`)
      }
      
      if (porkbunPrice && porkbunPrice.initial) {
        updatedPrices.prices.porkbun[tld] = {
          initial: porkbunPrice.initial,
          renewal: porkbunPrice.renewal || updatedPrices.prices.porkbun[tld]?.renewal || '$8.56'
        }
        console.log(`✅ Porkbun .${tld}: ${porkbunPrice.initial}`)
      }
      
      // Add longer delay between TLDs to be very respectful
      await new Promise(resolve => setTimeout(resolve, 10000)) // 10 second delay
    }
    
    // Update timestamp
    updatedPrices.lastUpdated = new Date().toISOString()
    
    // Write updated prices
    fs.writeFileSync(PRICE_FILE, JSON.stringify(updatedPrices, null, 2))
    console.log('\n✅ Price file updated successfully!')
    console.log(`📅 Last updated: ${updatedPrices.lastUpdated}`)
    
  } catch (error) {
    console.error('❌ Error during price update:', error)
  } finally {
    await browser.close()
  }
}

if (require.main === module) {
  updatePriceFile().catch(console.error)
}

module.exports = { updatePriceFile } 