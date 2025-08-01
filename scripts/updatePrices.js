#!/usr/bin/env node

/**
 * Script to update domain prices
 * 
 * This script helps manually update prices in data/domainPrices.json
 * You can run this weekly/monthly to keep prices current
 * 
 * Usage: node scripts/updatePrices.js
 */

const fs = require('fs')
const path = require('path')

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

function updatePriceFile() {
  console.log('🔄 Updating domain prices...')
  
  // Read current prices
  const currentPrices = JSON.parse(fs.readFileSync(PRICE_FILE, 'utf8'))
  
  // Update timestamp
  currentPrices.lastUpdated = new Date().toISOString()
  
  // Here you would typically:
  // 1. Scrape registrar websites for current prices
  // 2. Use registrar APIs if available
  // 3. Manually update prices based on research
  
  console.log('📝 Manual price update required:')
  console.log('1. Visit each registrar website')
  console.log('2. Check prices for each TLD')
  console.log('3. Update the prices in data/domainPrices.json')
  console.log('4. Update the lastUpdated timestamp')
  
  console.log('\n🔗 Registrar websites to check:')
  console.log('- Namecheap: https://www.namecheap.com/domains/')
  console.log('- GoDaddy: https://www.godaddy.com/domains/')
  console.log('- Porkbun: https://porkbun.com/domain/')
  
  console.log('\n📊 Sample domains to check:')
  Object.entries(SAMPLE_DOMAINS).forEach(([tld, domain]) => {
    console.log(`  ${tld}: ${domain}`)
  })
  
  console.log('\n✅ Price file updated with new timestamp')
  fs.writeFileSync(PRICE_FILE, JSON.stringify(currentPrices, null, 2))
}

if (require.main === module) {
  updatePriceFile()
}

module.exports = { updatePriceFile } 