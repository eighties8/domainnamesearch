'use client'

import { useState } from 'react'
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import DomainResultsTable from '../components/DomainResultsTable'
import { generateDomainSuggestions, calculateBrandabilityScore, calculateEstimatedValue } from '../lib/domainUtils'
import { getSearchDemandLabel, SearchDemand } from '../lib/searchDemandUtils'

interface DomainResult {
  domain: string
  availability: 'available' | 'taken' | 'loading'
  brandabilityScore: number
  estimatedValue: string
  searchDemand: SearchDemand | 'N/A'
  domainInfo?: {
    registrationDate: string | null
    hasAutoRenewal: boolean
    age: number | null
    daysUntilExpiration?: number | null
  }
}

export default function HomePage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [results, setResults] = useState<DomainResult[]>([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)



  const exampleDomains = ['tapr', 'jobtapr', 'quotapr', 'foundr']

  const checkDomainAvailability = async (domain: string) => {
    try {
      const response = await fetch(`/api/check?domain=${domain}`)
      const data = await response.json()
      return data.available
    } catch (error) {
      console.error('Error checking domain:', error)
      return false
    }
  }

  const getDomainInfo = async (domain: string) => {
    try {
      const response = await fetch(`/api/domainInfo?domain=${domain}`)
      if (!response.ok) {
        return null
      }
      const data = await response.json()
      return data
    } catch (error) {
      console.error('Error fetching domain info:', error)
      return null
    }
  }



  const cleanDomainName = (name: string): string => {
    return name
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '') // Remove all spaces
      .split('.')[0] // Only take the part before the first dot
      .replace(/[^a-z0-9-]/g, '') // Remove special characters except hyphens
  }

  const sortResults = (results: DomainResult[]): DomainResult[] => {
    return results.sort((a, b) => {
      // First sort by availability (available first)
      if (a.availability === 'available' && b.availability === 'taken') return -1
      if (a.availability === 'taken' && b.availability === 'available') return 1

      // If both have same availability, sort by brandability score (higher first)
      if (a.brandabilityScore !== b.brandabilityScore) {
        return b.brandabilityScore - a.brandabilityScore
      }

      // If brandability is the same, sort by TLD priority (.com first, then .io, .app, etc.)
      const tldPriority = { com: 1, io: 2, app: 3, ai: 4, co: 5, dev: 6, tech: 7, net: 8, xyz: 9 }
      const aTld = a.domain.split('.')[1]
      const bTld = b.domain.split('.')[1]
      const aPriority = tldPriority[aTld as keyof typeof tldPriority] || 10
      const bPriority = tldPriority[bTld as keyof typeof tldPriority] || 10

      return aPriority - bPriority
    })
  }

  const searchDomains = async () => {
    if (!searchTerm.trim()) return

    setLoading(true)
    setSearched(true)

    const baseName = cleanDomainName(searchTerm)
    const domainSuggestions = generateDomainSuggestions(baseName)
    
    const newResults: DomainResult[] = domainSuggestions.map(domain => ({
      domain,
      availability: 'loading', // Will be updated after checking
      brandabilityScore: calculateBrandabilityScore(domain, domain.split('.')[1]),
      estimatedValue: '$0', // Will be updated after checking
      searchDemand: 'Low' // Will be updated after checking
    }))

    setResults(newResults)

    // Check availability for each domain and update state immediately
    newResults.forEach(async (result, index) => {
      try {
        const available = await checkDomainAvailability(result.domain)
        
        // Only calculate values for available domains
        const brandabilityScore = available ? calculateBrandabilityScore(result.domain, result.domain.split('.')[1]) : 0
        const estimatedValue = available ? calculateEstimatedValue(result.domain) : 0
        
        // Get search demand for the domain name (without TLD) - only for available domains
        const domainName = result.domain.split('.')[0]
        const searchDemand: SearchDemand | 'N/A' = available ? await getSearchDemandLabel(domainName) : 'N/A'
        
        // Fetch domain info for taken domains
        let domainInfo = null
        if (!available) {
          domainInfo = await getDomainInfo(result.domain)
        }
        
        const updatedResult = {
          ...result,
          availability: available ? 'available' as const : 'taken' as const,
          brandabilityScore: available ? brandabilityScore : 0,
          estimatedValue: available ? `$${estimatedValue.toLocaleString()}` : 'N/A',
          searchDemand,
          domainInfo
        }
        
        // Update the specific result in the state
        setResults(prevResults => {
          const newResults = [...prevResults]
          newResults[index] = updatedResult
          return sortResults(newResults)
        })
      } catch (error) {
        console.error(`Error checking domain ${result.domain}:`, error)
        // Mark as taken if there's an error
        setResults(prevResults => {
          const newResults = [...prevResults]
          newResults[index] = {
            ...result,
            availability: 'taken' as const,
            brandabilityScore: 0,
            estimatedValue: 'N/A',
            searchDemand: 'N/A'
          }
          return sortResults(newResults)
        })
      }
    })
    
    // Set loading to false after a reasonable timeout
    setTimeout(() => setLoading(false), 1000)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    searchDomains()
  }

  const handleExampleClick = (example: string) => {
    setSearchTerm(example)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <div className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              Find Your Perfect
              <span className="text-primary-600 dark:text-primary-400"> Domain Name</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
              Your secret weapon to find the best available domain name ideas, fast — across all major TLDs with insights like brandability score, estimated resale value, and search volume.
            </p>

            {/* Search Form */}
            <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Enter your domain name (e.g., mystartup)"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary px-8 py-3 text-lg font-medium"
                >
                  {loading ? 'Searching...' : 'Search Domains'}
                </button>
              </div>
            </form>

            {/* Example searches
            <div className="mt-6">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Try these examples:</p>
              <div className="flex flex-wrap justify-center gap-2">
                {exampleDomains.map((example) => (
                  <button
                    key={example}
                    onClick={() => handleExampleClick(example)}
                    className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-full transition-colors duration-200"
                  >
                    {example}
                  </button>
                ))}
              </div>
            </div> */}
          </div>
        </div>
      </div>

      {/* Features Section - Only show when no search has been performed */}
      {!searched && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Why Choose DomainNameSearch.app?
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Get instant domain availability across all major TLDs with AI-powered insights and brandability scoring.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-primary-100 dark:bg-primary-900/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <MagnifyingGlassIcon className="w-8 h-8 text-primary-600 dark:text-primary-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Instant Availability Check
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Check domain availability across .com, .io, .app, .ai, .co, .dev, .tech, .net, and .xyz in seconds.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-primary-100 dark:bg-primary-900/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Brandability Scoring
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                AI-powered scoring based on length, pronounceability, and market appeal to help you choose the best domain.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-primary-100 dark:bg-primary-900/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Value Estimation
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Get estimated resale values and search volume insights to make informed domain investment decisions.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Results Section */}
      {searched && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="card p-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Domain Results for "{searchTerm}"
            </h2>

            <DomainResultsTable domainResults={results} />
          </div>
        </div>
      )}


    </div>
  )
} 