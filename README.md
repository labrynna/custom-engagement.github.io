# custom-engagement.github.io
A workflow that produces customized mail drafts to reach out to existing customers based on past customer orders, defined competitors and the current season or time of the year.

## Overview

This is an AI-powered email draft generator designed for a tailoring business in Singapore. It helps generate personalized email drafts to engage with existing customers based on:

1. **Competitor Insights**: Analysis of competitor websites and LinkedIn pages
2. **Seasonal Trends**: Current seasonal trends based on date and location
3. **Customer Data**: Historical customer purchase data

## Features

- 🤖 **AI-Powered Content**: Uses DeepSeek API to generate intelligent, personalized email drafts
- 📊 **Customer Data Management**: Built-in dummy customer data with 10 customers and their order history
- 🎯 **Competitor Analysis**: Input competitor URLs for market intelligence
- 🌍 **Location-Aware**: Seasonal trends based on location (default: Singapore)
- 📧 **Email Management**: Expandable/collapsible email list with send tracking
- 👁️ **Visual Progress**: Real-time status updates showing what the AI is working on
- ✅ **Send Tracking**: Mark emails as sent with visual confirmation

## Setup Instructions

### Prerequisites

- A Netlify account
- A DeepSeek API key (from [https://www.deepseek.com/](https://www.deepseek.com/))

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
     - **Name**: `DEEPSEEK_API_KEY`
     - **Value**: Your DeepSeek API key
   - Save the changes

4. **Deploy**:
   - Netlify will automatically deploy your site
   - Your app will be available at `https://your-site-name.netlify.app`

### Required Environment Variable

- **`DEEPSEEK_API_KEY`**: Your DeepSeek API key for generating AI-powered content
  - Get your API key from [DeepSeek Platform](https://platform.deepseek.com/)
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
   DEEPSEEK_API_KEY=your_api_key_here
   ```

4. Run the development server:
   ```bash
   netlify dev
   ```

5. Open your browser to `http://localhost:8888`

## Usage

1. **Enter Competitor Information** (optional):
   - Add competitor website URLs and LinkedIn pages
   - Separate multiple URLs with commas

2. **Verify Location**:
   - Default is "Singapore"
   - Change if targeting a different location

3. **Generate Email Drafts**:
   - Click "Generate Email Drafts"
   - Watch the progress indicators as the AI processes:
     - Loading customer data
     - Analyzing competitor insights
     - Analyzing seasonal trends
     - Generating personalized recommendations
     - Creating email drafts

4. **Review and Manage Emails**:
   - Click on any email to expand and view full content
   - See customer order history within each email
   - Click "Send" to mark an email as sent
   - Sent emails show a checkmark (✓ Sent)

## Customer Data

The application includes dummy customer data with:
- 10 customers (CUST001 to CUST010)
- 5 orders per customer
- Order details including date and menswear items
- Data sorted by order date (most recent first)

You can download the customer data as a CSV file for reference.

## Technical Stack

- **Frontend**: Pure HTML, CSS, and JavaScript (no frameworks)
- **Backend**: Netlify Serverless Functions
- **AI**: DeepSeek API for content generation
- **Hosting**: Netlify

## File Structure

```
.
├── index.html              # Main HTML file
├── styles.css              # Styling
├── script.js              # Main application logic
├── customerData.js        # Customer data and CSV generation
├── netlify.toml           # Netlify configuration
├── netlify/
│   └── functions/
│       └── deepseek.js    # Serverless function for API calls
└── README.md              # This file
```

## Security

- API keys are stored securely in Netlify environment variables
- API calls are routed through Netlify serverless functions
- No sensitive data is exposed to the client side

## Troubleshooting

### Mock Data Mode

If the DeepSeek API is unavailable or the API key is not configured, the application will automatically fall back to mock responses for development and testing purposes.

### API Limits

Be aware of your DeepSeek API rate limits and quotas. The application generates one API call per processing step plus one per customer email (typically 14+ calls per generation).

## License

This project is open source and available for use and modification.

