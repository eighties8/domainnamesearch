import priceData from '../data/domainPrices.json'

interface PriceData {
  lastUpdated: string
  prices: {
    [registrar: string]: {
      [tld: string]: {
        initial: string
        renewal: string
      }
    }
  }
}

export interface DomainPrice {
  registrar: string
  initial: string
  renewal: string
  priority: string
}

export function getDomainPrices(domain: string): DomainPrice[] {
  const tld = domain.split('.').pop()?.toLowerCase() || 'com'
  const prices = (priceData as PriceData).prices
  
  const domainPrices: DomainPrice[] = [
    {
      registrar: 'Namecheap',
      initial: prices.namecheap[tld]?.initial || '$9.48',
      renewal: prices.namecheap[tld]?.renewal || '$13.98',
      priority: 'Best Value'
    },
    {
      registrar: 'GoDaddy',
      initial: prices.godaddy[tld]?.initial || '$1.99',
      renewal: prices.godaddy[tld]?.renewal || '$19.99',
      priority: 'Popular'
    },
    {
      registrar: 'Porkbun',
      initial: prices.porkbun[tld]?.initial || '$8.56',
      renewal: prices.porkbun[tld]?.renewal || '$8.56',
      priority: 'Developer Friendly'
    }
  ]

  return domainPrices
}

export function getLastUpdated(): string {
  return (priceData as PriceData).lastUpdated
} 