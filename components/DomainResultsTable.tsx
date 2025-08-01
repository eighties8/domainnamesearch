'use client'

import { useState } from 'react'
import { CheckCircleIcon, XCircleIcon, ChevronDownIcon, ChevronUpIcon, ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline'
import { getDomainPrices, DomainPrice, getLastUpdated } from '../lib/priceUtils'
import { SearchDemand } from '../lib/searchDemandUtils'
import { SearchDemandBadge } from './SearchDemandBadge'

interface DomainResult {
  domain: string
  availability: 'available' | 'taken' | 'loading'
  brandabilityScore: number
  estimatedValue: string
  searchDemand: SearchDemand | 'N/A'
}

interface DomainResultsTableProps {
  domainResults: DomainResult[]
}

export default function DomainResultsTable({ domainResults }: DomainResultsTableProps) {
  const [expandedDomain, setExpandedDomain] = useState<string | null>(null)

  const toggleExpansion = (domain: string) => {
    console.log('Toggle expansion for domain:', domain, 'Current expanded:', expandedDomain)
    const newExpandedDomain = expandedDomain === domain ? null : domain
    console.log('Setting expanded domain to:', newExpandedDomain)
    setExpandedDomain(newExpandedDomain)
  }

  const getAvailabilityIcon = (availability: 'available' | 'taken' | 'loading') => {
    if (availability === 'loading') {
      return <div className="w-5 h-5 animate-spin rounded-full border-2 border-gray-300 border-t-primary-600"></div>
    }
    return availability === 'available' ? (
      <CheckCircleIcon className="w-5 h-5 text-green-600 dark:text-green-400" />
    ) : (
      <XCircleIcon className="w-5 h-5 text-red-600 dark:text-red-400" />
    )
  }

  const getAvailabilityText = (availability: 'available' | 'taken' | 'loading') => {
    if (availability === 'loading') return 'Loading...'
    return availability === 'available' ? 'Available' : 'Taken'
  }

  const getAvailabilityColor = (availability: 'available' | 'taken' | 'loading') => {
    if (availability === 'loading') return 'text-gray-500 dark:text-gray-400'
    return availability === 'available' 
      ? 'text-green-600 dark:text-green-400' 
      : 'text-red-600 dark:text-red-400'
  }

  const getAffiliateLink = (registrar: string, domain: string) => {
    switch (registrar) {
      case "Namecheap":
        return `https://www.namecheap.com/domains/registration/results/?domain=${domain}&utm_source=domainnamesearch&utm_medium=affiliate`
      case "GoDaddy":
        return `https://www.godaddy.com/domainsearch/find?domainToCheck=${domain}&utm_source=domainnamesearch&utm_medium=affiliate`
      case "Porkbun":
        return `https://porkbun.com/checkout/search?q=${domain}&utm_source=domainnamesearch&utm_medium=affiliate`
      default:
        return "#"
    }
  }

  const formatLastUpdated = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    })
  }

  const getFavicon = (domain: string) => {
    // Use DuckDuckGo's favicon service which is more reliable
    return `https://icons.duckduckgo.com/ip3/${domain}.ico`
  }

  const getDomainAge = (createdDate: string) => {
    const created = new Date(createdDate)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - created.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    const diffYears = Math.floor(diffDays / 365)
    const diffMonths = Math.floor((diffDays % 365) / 30)
    
    if (diffYears > 0) {
      return `${diffYears} year${diffYears > 1 ? 's' : ''}`
    } else if (diffMonths > 0) {
      return `${diffMonths} month${diffMonths > 1 ? 's' : ''}`
    } else {
      return `${diffDays} day${diffDays > 1 ? 's' : ''}`
    }
  }

  return (
    <div className="space-y-4">
      
      {/* Last Updated Info */}
      <div className="text-right">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Prices last updated: {formatLastUpdated(getLastUpdated())}
        </p>
      </div>

      {/* Desktop Table */}
      <div className="hidden lg:block space-y-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">Domain</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">Availability</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">Brandability</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">Est. Value</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">Search Demand</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">Action</th>
              </tr>
            </thead>
            <tbody>
              {domainResults.map((result, index) => (
                <>
                  <tr key={index} className="border-b border-gray-100 dark:border-gray-800">
                                      <td className="py-4 px-4">
                    {result.availability === 'taken' ? (
                      <div className="flex items-center gap-3">
                        <img 
                          src={getFavicon(result.domain)}
                          alt={`${result.domain} favicon`}
                          className="w-6 h-6 rounded"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none'
                          }}
                        />
                        <div>
                          <a 
                            href={`https://${result.domain}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 underline"
                          >
                            {result.domain}
                          </a>

                        </div>
                      </div>
                    ) : (
                      <span className="font-medium text-gray-900 dark:text-white">{result.domain}</span>
                    )}
                  </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        {getAvailabilityIcon(result.availability)}
                        <span className={getAvailabilityColor(result.availability)}>
                          {getAvailabilityText(result.availability)}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      {result.brandabilityScore === 0 ? (
                        <span className="text-gray-400 dark:text-gray-500 text-sm">N/A</span>
                      ) : (
                        <div className="flex items-center gap-2">
                          <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div 
                              className="bg-primary-600 h-2 rounded-full" 
                              style={{ width: `${(result.brandabilityScore / 10) * 100}%` }}
                            ></div>
                          </div>
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            {result.brandabilityScore}/10
                          </span>
                        </div>
                      )}
                    </td>
                    <td className="py-4 px-4">
                      <span className={`font-medium ${
                        result.estimatedValue === 'N/A' 
                          ? 'text-gray-400 dark:text-gray-500' 
                          : 'text-gray-900 dark:text-white'
                      }`}>
                        {result.estimatedValue}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      {result.searchDemand === 'N/A' ? (
                        <span className="text-gray-400 dark:text-gray-500 text-sm">N/A</span>
                      ) : (
                        <SearchDemandBadge demand={result.searchDemand} />
                      )}
                    </td>
                    <td className="py-4 px-4">
                      <button
                        onClick={() => toggleExpansion(result.domain)}
                        disabled={result.availability === 'taken'}
                        className={`flex items-center gap-1 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 border-2 ${
                          result.availability === 'taken'
                            ? 'text-gray-400 cursor-not-allowed bg-gray-100 dark:bg-gray-700 border-gray-200 dark:border-gray-600'
                            : 'text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 bg-white dark:bg-gray-700 hover:bg-primary-50 dark:hover:bg-primary-900/20 border-primary-200 dark:border-primary-700 hover:border-primary-300 dark:hover:border-primary-600 shadow-sm hover:shadow-md'
                        }`}
                      >
                        View Prices
                        {expandedDomain === result.domain ? (
                          <ChevronUpIcon className="w-4 h-4" />
                        ) : (
                          <ChevronDownIcon className="w-4 h-4" />
                        )}
                      </button>
                    </td>
                  </tr>
                  {/* Expanded content for this row */}
                  {expandedDomain === result.domain && (
                    <tr>
                      <td colSpan={6} className="p-0">
                        <div className="bg-white dark:bg-gray-700 rounded-lg shadow-lg border border-gray-200 dark:border-gray-600 p-6 m-4">
                          <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                            Price Comparison for {result.domain}
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {getDomainPrices(result.domain).map((registrar, idx) => (
                              <div key={idx} className="bg-gray-50 dark:bg-gray-600 rounded-lg p-4">
                                <div className="flex justify-between items-center mb-3">
                                  <h5 className="font-semibold text-gray-900 dark:text-white">{registrar.registrar}</h5>
                                  <span className={`px-2 py-1 text-xs rounded-full ${
                                    registrar.priority === 'Best Value' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                                    registrar.priority === 'Popular' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                                    'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                                  }`}>
                                    {registrar.priority}
                                  </span>
                                </div>
                                <div className="space-y-2 mb-4">
                                  <div className="flex justify-between">
                                    <span className="text-sm text-gray-600 dark:text-gray-400">Initial:</span>
                                    <span className="font-medium text-gray-900 dark:text-white">{registrar.initial}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-sm text-gray-600 dark:text-gray-400">Renewal:</span>
                                    <span className="font-medium text-gray-900 dark:text-white">{registrar.renewal}</span>
                                  </div>
                                </div>
                                <a
                                  href={getAffiliateLink(registrar.registrar, result.domain)}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="w-full bg-primary-600 hover:bg-primary-700 text-white text-center py-2 px-4 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center justify-center gap-2"
                                >
                                  <span>Buy Now</span>
                                  <ArrowTopRightOnSquareIcon className="w-4 h-4" />
                                </a>
                              </div>
                            ))}
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
        </div>
            </div>

      {/* Mobile Cards */}
      <div className="lg:hidden space-y-4">
        {domainResults.map((result, index) => (
          <div key={index} className="card p-4">
            <div className="flex justify-between items-start mb-3">
              <div>
                {result.availability === 'taken' ? (
                  <div>
                    <div className="flex items-center gap-2">
                      <img 
                        src={getFavicon(result.domain)}
                        alt={`${result.domain} favicon`}
                        className="w-5 h-5 rounded"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none'
                        }}
                      />
                      <a 
                        href={`https://${result.domain}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-semibold text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 underline"
                      >
                        {result.domain}
                      </a>
                    </div>

                  </div>
                ) : (
                  <h3 className="font-semibold text-gray-900 dark:text-white">{result.domain}</h3>
                )}
                <div className="flex items-center gap-2 mt-1">
                  {getAvailabilityIcon(result.availability)}
                  <span className={getAvailabilityColor(result.availability)}>
                    {getAvailabilityText(result.availability)}
                  </span>
                </div>
              </div>
              <button
                onClick={() => toggleExpansion(result.domain)}
                disabled={result.availability === 'taken'}
                className={`flex items-center gap-1 px-3 py-2 rounded text-sm transition-colors border border-gray-300 dark:border-gray-600 ${
                  result.availability === 'taken'
                    ? 'text-gray-400 cursor-not-allowed bg-gray-100 dark:bg-gray-700'
                    : 'text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600'
                }`}
              >
                View Prices
                {expandedDomain === result.domain ? (
                  <ChevronUpIcon className="w-4 h-4" />
                ) : (
                  <ChevronDownIcon className="w-4 h-4" />
                )}
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600 dark:text-gray-400">Brandability:</span>
                {result.brandabilityScore === 0 ? (
                  <div className="text-gray-400 dark:text-gray-500 text-sm mt-1">N/A</div>
                ) : (
                  <div className="flex items-center gap-2 mt-1">
                    <div className="w-12 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-primary-600 h-2 rounded-full" 
                        style={{ width: `${(result.brandabilityScore / 10) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-gray-600 dark:text-gray-400 text-sm">
                      {result.brandabilityScore}/10
                    </span>
                  </div>
                )}
              </div>
              <div>
                <span className="text-gray-600 dark:text-gray-400">Est. Value:</span>
                <div className={`font-medium mt-1 ${
                  result.estimatedValue === 'N/A' 
                    ? 'text-gray-400 dark:text-gray-500' 
                    : 'text-gray-900 dark:text-white'
                }`}>
                  {result.estimatedValue}
                </div>
              </div>
              <div>
                <span className="text-gray-600 dark:text-gray-400">Search Demand:</span>
                <div className="mt-1">
                  {result.searchDemand === 'N/A' ? (
                    <span className="text-gray-400 dark:text-gray-500 text-sm">N/A</span>
                  ) : (
                    <SearchDemandBadge demand={result.searchDemand} />
                  )}
                </div>
              </div>
            </div>
            
            {/* Mobile Expanded Price Comparison */}
            {expandedDomain === result.domain && result.availability === 'available' && (
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Price Comparison for {result.domain}
                </h4>
                <div className="space-y-3">
                  {getDomainPrices(result.domain).map((registrar, idx) => (
                    <div key={idx} className="bg-gray-50 dark:bg-gray-600 rounded-lg p-3">
                      <div className="flex justify-between items-center mb-2">
                        <h5 className="font-medium text-gray-900 dark:text-white">{registrar.registrar}</h5>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          registrar.priority === 'Best Value' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                          registrar.priority === 'Popular' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                          'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                        }`}>
                          {registrar.priority}
                        </span>
                      </div>
                      <div className="space-y-1 mb-3">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600 dark:text-gray-400">Initial:</span>
                          <span className="font-medium text-gray-900 dark:text-white">{registrar.initial}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600 dark:text-gray-400">Renewal:</span>
                          <span className="font-medium text-gray-900 dark:text-white">{registrar.renewal}</span>
                        </div>
                      </div>
                      <a
                        href={getAffiliateLink(registrar.registrar, result.domain)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full bg-primary-600 hover:bg-primary-700 text-white text-center py-2 px-4 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center justify-center gap-2"
                      >
                        <span>Buy Now</span>
                        <ArrowTopRightOnSquareIcon className="w-4 h-4" />
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}