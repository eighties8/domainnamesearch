# DomainNameSearch.app

A modern Next.js 14 application that helps startup founders find the best available domain name ideas, fast — across all major TLDs with insights like brandability score, estimated resale value, and search volume.

## 🚀 Features

- **Instant Domain Availability Check**: Check domain availability across major TLDs (.com, .net, .io, .app, .ai, .co, .dev, .tech, .xyz)
- **Brandability Scoring**: AI-powered scoring based on length, pronounceability, and market appeal
- **Value Estimation**: Get estimated resale values and search volume insights
- **Affiliate Integration**: Direct links to Namecheap, GoDaddy, and Porkbun with proper tracking
- **Responsive Design**: Mobile-first design with dark mode support
- **Real-time DNS Lookup**: Accurate domain availability checking using DNS resolution

## 💰 Updating Domain Prices

Domain prices are stored in `data/domainPrices.json` and can be updated manually to keep them current:

### Quick Update
```bash
npm run update-prices
```

This will update the timestamp and provide guidance on checking current prices.

### Manual Price Updates

1. **Visit Registrar Websites**:
   - [Namecheap](https://www.namecheap.com/domains/)
   - [GoDaddy](https://www.godaddy.com/domains/)
   - [Porkbun](https://porkbun.com/domain/)

2. **Check Prices for Each TLD**:
   - .com, .io, .app, .ai, .co, .dev, .tech, .net, .xyz

3. **Update the JSON File**:
   ```json
   {
     "lastUpdated": "2025-01-31T00:00:00Z",
     "prices": {
       "namecheap": {
         "app": { "initial": "$6.98", "renewal": "$17.98" }
       }
     }
   }
   ```

### Price Update Frequency
- **Recommended**: Weekly or monthly updates
- **Critical TLDs**: .com, .io, .app (most popular)
- **Seasonal**: Check for promotional pricing during holidays

### Avoiding API Limits
- No automated scraping to avoid rate limiting
- Manual updates prevent API lockouts
- Local JSON storage ensures fast loading

## 🛠 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **Language**: TypeScript
- **Icons**: Heroicons
- **Domain Checking**: Built-in DNS lookup API
- **Deployment**: Vercel-ready

## 📦 Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd domainnamesearch
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🏗 Project Structure

```
domainnamesearch/
├── app/                    # Next.js 14 App Router
│   ├── api/               # API routes
│   │   └── check/         # Domain availability checker
│   ├── about/             # About page
│   ├── contact/           # Contact page
│   ├── privacy/           # Privacy policy
│   ├── terms/             # Terms of service
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Homepage
├── components/            # Reusable components
│   ├── Navigation.tsx     # Navigation with dark mode
│   └── Footer.tsx         # Footer with links
├── data/                  # Static data files
│   ├── searchVolume.json  # Search volume data
│   └── tlds.json         # TLD information
├── lib/                   # Utility functions
│   └── domainUtils.ts     # Domain analysis utilities
└── public/               # Static assets
```

## 🎯 Key Features Explained

### Domain Availability Checking
- Uses built-in Node.js DNS lookup
- No external API dependencies
- Real-time availability status

### Brandability Scoring Algorithm
- +10 points for domains ≤8 characters
- +5 points if domain ends in consonant
- +5 points for pronounceable structure (V-C-V)
- +5 bonus for .com availability
- Maximum score: 100

### Estimated Value Calculation
- Base value: TLD price × 2
- Brandability score contribution
- Search volume multiplier
- TLD popularity factor

### Search Volume Data
- Static JSON file with monthly search volumes
- Easily editable for different keywords
- Used for value estimation

## 🎨 Styling

- **Mobile-first**: Responsive design using Tailwind CSS
- **Dark mode**: Toggle between light and dark themes
- **Modern UI**: Clean design with rounded corners and shadows
- **Accessibility**: Proper contrast ratios and semantic HTML

## 📱 Pages

1. **Homepage (`/`)**: Main search interface with results table
2. **About (`/about`)**: Information about the service
3. **Contact (`/contact`)**: Contact form and information
4. **Privacy (`/privacy`)**: Privacy policy with AdSense compliance
5. **Terms (`/terms`)**: Terms of service with liability disclaimers

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy automatically

### Manual Deployment
```bash
npm run build
npm start
```

## 🔧 Configuration

### Adding New TLDs
Edit `data/tlds.json` to add new TLDs:
```json
{
  "tld": "new",
  "name": ".new",
  "price": 19.99,
  "popularity": 7,
  "brandability": 8
}
```

### Updating Search Volume Data
Edit `data/searchVolume.json` to add new keywords:
```json
{
  "newkeyword": 150
}
```

## 🧪 Testing

The app includes hardcoded examples for testing:
- `tapr.com`
- `jobtapr.io`
- `quotapr.dev`
- `foundr.ai`

## 💰 Monetization

- **Affiliate Links**: "Buy Now" buttons link to GoDaddy with tracking
- **AdSense Ready**: Includes required privacy policy and terms
- **No Database**: Client-side + serverless architecture

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📞 Support

For support, email hello@domainnamesearch.app or create an issue on GitHub.

---

Built with ❤️ for startup founders and domain hunters. 