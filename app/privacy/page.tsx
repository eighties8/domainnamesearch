export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="card p-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
            Privacy Policy
          </h1>
          
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Last updated: {new Date().toLocaleDateString()}
            </p>

            <p className="text-gray-600 dark:text-gray-300 mb-6">
              DomainNameSearch.app ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your information when you visit our website.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Information We Collect
            </h2>
            
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Information You Provide
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              When you use our domain search service, you may provide us with:
            </p>
            <ul className="list-disc pl-6 mb-6 text-gray-600 dark:text-gray-300">
              <li>Domain names you search for</li>
              <li>Contact information if you use our contact form (name, email, message)</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Automatically Collected Information
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              We automatically collect certain information when you visit our website:
            </p>
            <ul className="list-disc pl-6 mb-6 text-gray-600 dark:text-gray-300">
              <li>IP address and location data</li>
              <li>Browser type and version</li>
              <li>Operating system</li>
              <li>Pages visited and time spent on each page</li>
              <li>Referring website</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              How We Use Your Information
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              We use the collected information for the following purposes:
            </p>
            <ul className="list-disc pl-6 mb-6 text-gray-600 dark:text-gray-300">
              <li>To provide and maintain our domain search service</li>
              <li>To improve our website and user experience</li>
              <li>To respond to your inquiries and provide customer support</li>
              <li>To analyze usage patterns and optimize our service</li>
              <li>To comply with legal obligations</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Cookies and Tracking Technologies
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              We use cookies and similar tracking technologies to enhance your experience on our website:
            </p>
            <ul className="list-disc pl-6 mb-6 text-gray-600 dark:text-gray-300">
              <li><strong>Essential Cookies:</strong> Required for the website to function properly</li>
              <li><strong>Analytics Cookies:</strong> Help us understand how visitors use our website</li>
              <li><strong>Advertising Cookies:</strong> Used to display relevant advertisements</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Google AdSense
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Our website uses Google AdSense to display advertisements. Google AdSense may:
            </p>
            <ul className="list-disc pl-6 mb-6 text-gray-600 dark:text-gray-300">
              <li>Use cookies to personalize ads based on your interests</li>
              <li>Collect information about your visits to our website and other websites</li>
              <li>Use this information to provide targeted advertising</li>
            </ul>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              You can opt out of personalized advertising by visiting <a href="https://www.google.com/settings/ads" className="text-primary-600 dark:text-primary-400 hover:underline">Google Ads Settings</a>.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Information Sharing
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              We do not sell, trade, or otherwise transfer your personal information to third parties, except:
            </p>
            <ul className="list-disc pl-6 mb-6 text-gray-600 dark:text-gray-300">
              <li>With your explicit consent</li>
              <li>To comply with legal requirements</li>
              <li>To protect our rights and safety</li>
              <li>With trusted service providers who assist us in operating our website</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Data Security
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet is 100% secure.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Your Rights
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              You have the right to:
            </p>
            <ul className="list-disc pl-6 mb-6 text-gray-600 dark:text-gray-300">
              <li>Access your personal information</li>
              <li>Correct inaccurate information</li>
              <li>Request deletion of your information</li>
              <li>Opt out of marketing communications</li>
              <li>Disable cookies in your browser settings</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Children's Privacy
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Our website is not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Changes to This Privacy Policy
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Contact Us
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              If you have any questions about this Privacy Policy, please contact us at:
            </p>
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
              <p className="text-gray-900 dark:text-white">
                Email: <a href="mailto:hello@domainnamesearch.app" className="text-primary-600 dark:text-primary-400 hover:underline">hello@domainnamesearch.app</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 