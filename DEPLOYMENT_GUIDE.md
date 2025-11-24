# Deployment Guide for Customer Engagement Email Generator

## Quick Start for Netlify Deployment

### Step 1: Get Your Perplexity API Key

1. Visit [Perplexity AI](https://www.perplexity.ai/)
2. Sign up or log in to your account
3. Navigate to API Keys section
4. Create a new API key
5. Copy the API key (you'll need it in Step 3)

### Step 2: Deploy to Netlify

#### Option A: Deploy from GitHub (Recommended)

1. **Fork this repository** to your GitHub account
2. Log in to [Netlify](https://www.netlify.com/)
3. Click **"Add new site"** → **"Import an existing project"**
4. Choose **GitHub** as your Git provider
5. Authorize Netlify to access your GitHub account
6. Select the forked repository: `custom-engagement.github.io`
7. Configure build settings:
   - **Build command**: Leave empty (or use `echo "No build needed"`)
   - **Publish directory**: `.` (current directory)
   - Click **"Deploy site"**

#### Option B: Deploy via Netlify CLI

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Deploy the site
netlify deploy --prod
```

### Step 3: Configure Environment Variables

This is **CRITICAL** for the application to work with the Perplexity API:

1. In your Netlify site dashboard, go to **"Site settings"**
2. Navigate to **"Environment variables"** in the left sidebar
3. Click **"Add a variable"**
4. Add the following:
   - **Key**: `PERPLEXITY_API_KEY`
   - **Value**: Your Perplexity API key from Step 1
   - **Scopes**: Select all (Builds, Functions, Post-processing)
5. Click **"Save"**
6. **Trigger a new deploy** for the environment variable to take effect:
   - Go to **"Deploys"** tab
   - Click **"Trigger deploy"** → **"Clear cache and deploy site"**

### Step 4: Verify Deployment

1. Once deployment is complete, visit your site URL (e.g., `https://your-site-name.netlify.app`)
2. The application should load with Step 1: Competitor Analysis
3. Try the workflow to verify the API integration works

## Environment Variables Reference

| Variable Name | Required | Description |
|--------------|----------|-------------|
| `PERPLEXITY_API_KEY` | **YES** | Your Perplexity API key for AI-powered web research and content generation |

## User Guide

### Step 1: Competitor Analysis
1. Enter competitor names and website URLs
2. Optionally add LinkedIn URLs
3. Click "+ Add Another Competitor" to add more
4. Click "Analyze Competitors"
5. Wait for AI to search and analyze (spinner shows progress)
6. Review the competitive insights summary
7. Click "Continue to Seasonal Trends →"

### Step 2: Seasonal Trends
1. Verify the location (default: Singapore)
2. Current date is automatically populated
3. Click "Analyze Seasonal Trends"
4. Wait for AI analysis (spinner shows progress)
5. Review the seasonal trends summary
6. Click "Continue to Customer Review →"

### Step 3: Customer Database Review
1. Review customer database statistics
2. Check the customer preview list (10 customers, 50 orders)
3. Verify all information is correct
4. Click "Generate Emails for All Customers"

### Step 4: Email Generation & Management
1. Watch the progress bar as emails are generated
2. See which customer's email is being processed
3. Once complete, all emails are displayed
4. Click any email to expand and view full content
5. Click "Send" to mark an email as sent (shows ✓ Sent)
6. Click "← Start Over" to begin a new session

## Troubleshooting

### Issue: AI responses use mock data instead of real analysis

**Cause**: Perplexity API key is not configured or incorrect

**Solution**:
1. Verify the environment variable is set correctly in Netlify
2. Make sure the variable name is exactly `PERPLEXITY_API_KEY` (case-sensitive)
3. Redeploy the site after adding/updating environment variables
4. Check browser console for API error messages

### Issue: Netlify Functions not working

**Cause**: Functions may not be deployed properly

**Solution**:
1. Verify the `netlify.toml` file is present in your repository
2. Check that `netlify/functions/perplexity.js` exists
3. Redeploy the site with cleared cache
4. Check Netlify function logs in the dashboard

### Issue: Competitor analysis fails

**Cause**: Invalid URLs or API rate limits

**Solution**:
1. Ensure competitor URLs are valid and accessible
2. Check if you've exceeded your Perplexity API quota
3. Verify network connectivity

### Issue: Slow email generation

**Cause**: Normal behavior - AI generates personalized content

**Solution**:
- This is expected - each email takes 3-5 seconds to generate
- Total time for 10 customers: ~30-60 seconds
- Progress bar shows real-time status

## Cost Considerations

### Netlify (Free Tier)
- 100 GB bandwidth/month
- 300 build minutes/month
- 125k function invocations/month
- **Cost: FREE** for moderate usage

### Perplexity API
- Pay-per-use pricing (check current rates at perplexity.ai)
- ~12 API calls per complete workflow:
  - 1 call for competitor analysis
  - 1 call for seasonal trends
  - 10 calls for customer emails
- **Estimated cost: Low** for typical usage

## Why Perplexity API?

Perplexity was chosen over other LLMs because:
- **Superior web search**: Can access and analyze real-time competitor websites
- **Research-focused**: Designed specifically for information gathering tasks
- **Up-to-date information**: Access to current web content
- **Better for analysis**: Excels at synthesizing information from multiple sources

## Local Development

To test the application locally:

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Setup

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

4. Start the development server:
```bash
netlify dev
```

5. Open your browser to `http://localhost:8888`

The Netlify Dev server will:
- Serve your static files
- Run serverless functions locally
- Load environment variables from `.env`

## Security Best Practices

✅ **DO:**
- Keep your API keys secret and never commit them to Git
- Use Netlify environment variables for sensitive data
- Regularly rotate API keys
- Monitor API usage for unusual activity

❌ **DON'T:**
- Never expose API keys in client-side code
- Don't commit `.env` files to version control
- Don't share your API keys publicly

## Support

If you encounter issues:

1. Check the browser console for error messages
2. Review Netlify function logs in your dashboard
3. Verify all environment variables are set correctly
4. Ensure your Perplexity API key is valid and has sufficient quota

## Updates and Maintenance

To update the application:

1. Make changes to your forked repository
2. Commit and push changes to GitHub
3. Netlify will automatically detect changes and redeploy

Alternatively, use Netlify CLI:
```bash
netlify deploy --prod
```

---

**Need Help?** Refer to:
- [Netlify Documentation](https://docs.netlify.com/)
- [Perplexity AI Documentation](https://docs.perplexity.ai/)
