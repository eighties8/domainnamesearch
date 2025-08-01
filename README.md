# DomainNameSearch.app

A Next.js 14 application to help startup founders find available domain name ideas across major TLDs with insights like brandability score, estimated resale value, and search volume.

## Features

- 🔍 **Domain Availability Check** - Real-time DNS-based availability checking
- 💰 **Price Comparison** - Compare prices across Namecheap, GoDaddy, and Porkbun
- 📊 **Brandability Scoring** - AI-powered domain name analysis
- 🔗 **Affiliate Links** - Direct links to registrars with tracking
- 📱 **Responsive Design** - Mobile-first design with Tailwind CSS
- 🌙 **Dark Mode** - Built-in dark/light theme toggle
- 🎯 **Search Volume** - EMD (Exact Match Domain) search demand data

## Automated Price Updates

The application includes an automated system to keep domain prices current:

### GitHub Actions (Recommended)
- **Schedule**: Every Sunday at 2 AM UTC
- **File**: `.github/workflows/update-prices.yml`
- **Features**: 
  - Automatic price scraping from Namecheap
  - Commits updated prices to repository
  - Manual trigger available in GitHub UI

### Vercel Cron (Alternative)
- **Endpoint**: `/api/cron/update-prices`
- **Environment Variable**: `CRON_SECRET` (set in Vercel dashboard)
- **Features**:
  - Can be triggered by Vercel's cron service
  - Manual POST requests for testing

### Manual Updates
```bash
# Run the conservative weekly updater
node scripts/updatePricesCron.js

# Run the full updater (use sparingly)
node scripts/updatePrices.js
```

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **Language**: TypeScript
- **Icons**: Heroicons
- **Deployment**: Vercel
- **Scraping**: Puppeteer (for price updates)

## Getting Started

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd domainnamesearch
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Environment Variables

Create a `.env.local` file:
```env
# Optional: For Vercel cron endpoint
CRON_SECRET=your-secret-token-here

# Domain Registrar API Credentials (for real-time pricing)
# Namecheap API (https://www.namecheap.com/support/api/)
NAMECHEAP_API_USER=your_username
NAMECHEAP_API_KEY=your_api_key
NAMECHEAP_CLIENT_IP=your_ip_address

# GoDaddy API (https://developer.godaddy.com/)
GODADDY_API_KEY=your_api_key
GODADDY_API_SECRET=your_api_secret

# Porkbun API (https://porkbun.com/api/json/v3/documentation)
PORKBUN_API_KEY=your_api_key
PORKBUN_SECRET_KEY=your_secret_key
```

### Getting API Credentials

#### Namecheap
1. Sign up for [Namecheap Affiliate Program](https://www.namecheap.com/affiliate/)
2. Get API credentials from [Namecheap API](https://www.namecheap.com/support/api/)
3. Use sandbox environment for testing

#### GoDaddy
1. Sign up for [GoDaddy Affiliate Program](https://www.godaddy.com/affiliate/)
2. Get API credentials from [GoDaddy Developer Portal](https://developer.godaddy.com/)
3. Use production API for real pricing

#### Porkbun
1. Sign up for [Porkbun Affiliate Program](https://porkbun.com/affiliate/)
2. Get API credentials from [Porkbun API Documentation](https://porkbun.com/api/json/v3/documentation)
3. Use production API for real pricing

## Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Deploy automatically on push to main branch
3. Set environment variables in Vercel dashboard

### Manual Deployment
```bash
npm run build
npm start
```

## Project Structure

```
domainnamesearch/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Homepage
├── components/            # React components
├── data/                  # Static JSON data
├── lib/                   # Utility functions
├── scripts/               # Automation scripts
└── public/                # Static assets
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - see LICENSE file for details. 