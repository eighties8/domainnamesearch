import { SearchDemand } from '../lib/searchDemandUtils'

interface SearchDemandBadgeProps {
  demand: SearchDemand
}

export function SearchDemandBadge({ demand }: SearchDemandBadgeProps) {
  const getBadgeStyles = () => {
    switch (demand) {
      case 'High':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      case 'Low':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
    }
  }

  return (
    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getBadgeStyles()}`}>
      {demand}
    </span>
  )
} 