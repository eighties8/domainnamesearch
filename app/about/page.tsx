export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="card p-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
            About DomainNameSearch.app
          </h1>
          
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
              DomainNameSearch.app helps startup founders and domain hunters find the best available domain names quickly and efficiently. Our platform provides comprehensive domain analysis across all major TLDs with valuable insights to help you make informed decisions.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              What We Do
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              We've built a powerful domain search tool that goes beyond simple availability checking. Our platform analyzes domains across multiple dimensions to give you the complete picture:
            </p>

            <ul className="space-y-3 mb-8">
              <li className="flex items-start">
                <span className="text-primary-600 dark:text-primary-400 mr-3">•</span>
                <span className="text-gray-600 dark:text-gray-300">
                  <strong>Real-time Availability:</strong> Check domain availability across all major TLDs including .com, .net, .io, .app, .ai, .co, .dev, .tech, and .xyz
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-primary-600 dark:text-primary-400 mr-3">•</span>
                <span className="text-gray-600 dark:text-gray-300">
                  <strong>Brandability Scoring:</strong> Our proprietary algorithm evaluates how memorable and brandable each domain name is
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-primary-600 dark:text-primary-400 mr-3">•</span>
                <span className="text-gray-600 dark:text-gray-300">
                  <strong>Estimated Value:</strong> Get insights into potential resale value based on TLD popularity, brandability, and market trends
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-primary-600 dark:text-primary-400 mr-3">•</span>
                <span className="text-gray-600 dark:text-gray-300">
                  <strong>Search Volume Data:</strong> Understand the search demand for your domain keywords to gauge market potential
                </span>
              </li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Built for Startup Founders
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              We understand the challenges that startup founders face when choosing a domain name. Your domain is often the first impression potential customers have of your brand, so it needs to be perfect. Our platform helps you:
            </p>

            <ul className="space-y-3 mb-8">
              <li className="flex items-start">
                <span className="text-primary-600 dark:text-primary-400 mr-3">•</span>
                <span className="text-gray-600 dark:text-gray-300">Find available domains quickly across multiple TLDs</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary-600 dark:text-primary-400 mr-3">•</span>
                <span className="text-gray-600 dark:text-gray-300">Evaluate brandability and memorability</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary-600 dark:text-primary-400 mr-3">•</span>
                <span className="text-gray-600 dark:text-gray-300">Understand market demand and search volume</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary-600 dark:text-primary-400 mr-3">•</span>
                <span className="text-gray-600 dark:text-gray-300">Make informed decisions about domain investments</span>
              </li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Our Mission
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              We believe that every great startup deserves a great domain name. Our mission is to democratize domain research by providing powerful tools that were previously only available to domain investors and large companies.
            </p>

            <p className="text-gray-600 dark:text-gray-300">
              Whether you're launching your first startup or expanding your domain portfolio, DomainNameSearch.app is here to help you find the perfect domain name that will grow with your business.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
} 