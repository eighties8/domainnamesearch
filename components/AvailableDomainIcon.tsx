'use client'

import { 
  RocketLaunchIcon, 
  StarIcon, 
  HeartIcon, 
  FireIcon,
  BoltIcon,
  TrophyIcon,
  SparklesIcon,
  CpuChipIcon,
  CodeBracketIcon,
  CommandLineIcon,
  GlobeAltIcon,
  BuildingOfficeIcon,
  WrenchScrewdriverIcon,
  BeakerIcon,
  AcademicCapIcon
} from '@heroicons/react/24/outline'

interface AvailableDomainIconProps {
  domain: string
  className?: string
}

export default function AvailableDomainIcon({ domain, className = '' }: AvailableDomainIconProps) {
  // Get TLD-appropriate icon
  const getIconForTLD = (domainName: string) => {
    const tld = domainName.split('.').pop()?.toLowerCase()
    
    switch (tld) {
      case 'com':
        return GlobeAltIcon
      case 'io':
        return RocketLaunchIcon
      case 'app':
        return StarIcon
      case 'ai':
        return CpuChipIcon
      case 'co':
        return BuildingOfficeIcon
      case 'dev':
        return CodeBracketIcon
      case 'tech':
        return WrenchScrewdriverIcon
      case 'net':
        return CommandLineIcon
      case 'xyz':
        return SparklesIcon
      default:
        return HeartIcon
    }
  }

  const IconComponent = getIconForTLD(domain)
  const colors = [
    'text-blue-500',
    'text-green-500', 
    'text-purple-500',
    'text-orange-500',
    'text-pink-500',
    'text-indigo-500',
    'text-teal-500',
    'text-yellow-500'
  ]
  
  const color = colors[Math.abs(domain.split('').reduce((acc, char) => {
    return char.charCodeAt(0) + ((acc << 5) - acc)
  }, 0)) % colors.length]

  return (
    <div className={`w-6 h-6 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center ${className}`}>
      <IconComponent className={`w-4 h-4 ${color}`} />
    </div>
  )
} 