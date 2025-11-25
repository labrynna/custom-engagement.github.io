# custom-engagement.github.io
A step-by-step wizard that produces customized mail drafts to reach out to existing customers based on past customer orders, competitor analysis, and current seasonal trends.

## Overview

This is an AI-powered email draft generator designed for a tailoring business in Singapore. It features a guided, step-by-step workflow that helps generate personalized email drafts based on:

1. **Competitor Insights**: AI-powered analysis of competitor websites and LinkedIn pages
2. **Seasonal Trends**: Current seasonal trends based on date and location
3. **Customer Data**: Historical customer purchase data

## Features

- 🤖 **AI-Powered Content**: Uses Perplexity API for intelligent web research and content generation
- 🎯 **Step-by-Step Wizard**: Guided workflow with visual progress tracking
- 🔍 **Competitor Analysis**: Input competitor URLs for AI-powered market intelligence
- 🌍 **Seasonal Trends**: Location-aware seasonal trend analysis
- 👥 **Customer Database Review**: Review customer data before email generation
- 📧 **Email Management**: Expandable/collapsible email list with send tracking
- 👁️ **Visual Progress**: Real-time status updates at every step
- ✅ **Send Tracking**: Mark emails as sent with visual confirmation

## Step-by-Step Workflow

### Step 1: Competitor Analysis
- Enter competitor names and their website/LinkedIn URLs
- AI analyzes their latest updates, offerings, and strategies
- View comprehensive competitive insights summary
- Confirm or edit before proceeding

### Step 2: Seasonal Trends
- Enter current location (default: Singapore)
- AI analyzes seasonal fashion trends for menswear
- View seasonal insights and recommendations
- Confirm or edit before proceeding

### Step 3: Customer Review
- Review customer database statistics
- See total customers, orders, and averages
- Preview customer list with order counts
- Confirm to start email generation

### Step 4: Email Generation
- Watch real-time progress as AI generates personalized emails
- Progress bar shows completion status
- View all generated emails with expand/collapse functionality
- Mark emails as sent individually

## Setup Instructions

### Prerequisites

- A Netlify account
- A Perplexity API key (from [https://www.perplexity.ai/](https://www.perplexity.ai/))

### Deployment to Netlify

1. **Fork or clone this repository**

2. **Connect to Netlify**:
   - Log in to [Netlify](https://www.netlify.com/)
   - Click "Add new site" → "Import an existing project"
   - Connect your Git repository
   - Configure the build settings (defaults should work)

3. **Configure Environment Variables**:
   - In your Netlify site dashboard, go to "Site settings" → "Environment variables"
   - Add the following environment variable:
     - **Name**: `PERPLEXITY_API_KEY`
     - **Value**: Your Perplexity API key
   - Save the changes

4. **Deploy**:
   - Netlify will automatically deploy your site
   - Your app will be available at `https://your-site-name.netlify.app`

### Required Environment Variable

- **`PERPLEXITY_API_KEY`**: Your Perplexity API key for AI-powered web research and content generation
  - Get your API key from [Perplexity Platform](https://www.perplexity.ai/)
  - Add this in Netlify's environment variables section

## Local Development

To run this project locally:

1. Clone the repository:
   ```bash
   git clone https://github.com/labrynna/custom-engagement.github.io.git
   cd custom-engagement.github.io
   ```

2. Install Netlify CLI:
   ```bash
   npm install -g netlify-cli
   ```

3. Create a `.env` file in the root directory:
   ```
   PERPLEXITY_API_KEY=your_api_key_here
   ```

4. Run the development server:
   ```bash
   netlify dev
   ```

5. Open your browser to `http://localhost:8888`

## Usage

### Step 1: Competitor Analysis
1. Enter competitor names and their website URLs
2. Optionally add LinkedIn URLs
3. Click "+ Add Another Competitor" to add more
4. Click "Analyze Competitors"
5. Wait for AI to search and analyze (progress indicator shown)
6. Review the competitive insights summary
7. Click "Continue to Seasonal Trends →"

### Step 2: Seasonal Trends
1. Verify the location (default: Singapore)
2. Current date is automatically populated
3. Click "Analyze Seasonal Trends"
4. Wait for AI analysis (progress indicator shown)
5. Review the seasonal trends summary
6. Click "Continue to Customer Review →"

### Step 3: Customer Review
1. Review customer database statistics
2. Check the customer preview list
3. Verify all information is correct
4. Click "Generate Emails for All Customers"

### Step 4: Email Generation
1. Watch the progress bar as emails are generated
2. Each email is personalized based on customer history
3. Once complete, all emails are displayed
4. Click any email to expand and view full content
5. Click "Send" to mark an email as sent
6. Click "← Start Over" to begin a new session

## Customer Data

The application includes dummy customer data with:
- **10 customers**: James Tan, Sarah Lim, Michael Wong, David Chen, Robert Ng, Kevin Lee, Andrew Koh, Daniel Ong, Christopher Teo, Thomas Goh
- **50 total orders**: 5 orders per customer
- **Realistic items**: Navy suits, dress shirts, blazers, chinos, polo shirts, etc.
- **Date range**: July 2025 to November 2025
- **Sorted by date**: Most recent orders first

## Technical Stack

- **Frontend**: Pure HTML, CSS, and JavaScript (no frameworks)
- **Backend**: Netlify Serverless Functions
- **AI**: Perplexity API (sonar-pro model for web research)
- **Hosting**: Netlify

## File Structure

```
.
├── index.html              # Main HTML with wizard interface
├── styles.css              # Styling with wizard components
├── script.js              # Step-by-step workflow logic
├── customerData.js        # Customer data and CSV generation
├── netlify.toml           # Netlify configuration
├── netlify/
│   └── functions/
│       ├── perplexity.js  # Perplexity API handler (NEW)
│       └── deepseek.js    # Legacy (deprecated)
└── README.md              # This file
```

## Security

- API keys are stored securely in Netlify environment variables
- API calls are routed through Netlify serverless functions
- No sensitive data is exposed to the client side

## Why Perplexity API?

Perplexity API was chosen over DeepSeek because:
- **Better web search capabilities**: Perplexity excels at searching and analyzing real-time web content
- **Up-to-date information**: Can access current competitor websites and social media
- **Research-oriented**: Designed specifically for research and information gathering tasks
- **Citation support**: Provides sources for its information (optional)

## Troubleshooting

### Mock Data Mode

If the Perplexity API is unavailable or the API key is not configured, the application will automatically fall back to mock responses for development and testing purposes.

### API Limits

Be aware of your Perplexity API rate limits and quotas. The application generates:
- 1 API call for competitor analysis
- 1 API call for seasonal trends
- 1 API call per customer email (typically 10 calls)
- **Total: ~12 API calls per complete workflow**

### Common Issues

**Problem**: Steps show generic insights instead of real research
**Solution**: Check that `PERPLEXITY_API_KEY` is set correctly in Netlify environment variables

**Problem**: Competitor analysis fails
**Solution**: Ensure competitor URLs are valid and accessible

**Problem**: Slow email generation
**Solution**: Normal behavior - AI generates personalized content for each customer (takes 30-60 seconds for 10 customers)

## Maintenance

The app requires minimal maintenance:
- Monitor Perplexity API usage and costs
- Update customer data as needed
- Refresh competitor URLs periodically
- Keep API keys secure and rotate regularly

## License

This project is open source and available for use and modification.

