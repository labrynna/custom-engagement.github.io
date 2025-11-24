# Deployment Guide for Customer Engagement Email Generator

## Quick Start for Netlify Deployment

### Step 1: Get Your DeepSeek API Key

1. Visit [DeepSeek Platform](https://platform.deepseek.com/)
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

This is **CRITICAL** for the application to work with the DeepSeek API:

1. In your Netlify site dashboard, go to **"Site settings"**
2. Navigate to **"Environment variables"** in the left sidebar
3. Click **"Add a variable"**
4. Add the following:
   - **Key**: `DEEPSEEK_API_KEY`
   - **Value**: Your DeepSeek API key from Step 1
   - **Scopes**: Select all (Builds, Functions, Post-processing)
5. Click **"Save"**
6. **Trigger a new deploy** for the environment variable to take effect:
   - Go to **"Deploys"** tab
   - Click **"Trigger deploy"** → **"Clear cache and deploy site"**

### Step 4: Verify Deployment

1. Once deployment is complete, visit your site URL (e.g., `https://your-site-name.netlify.app`)
2. The application should load with the input form
3. Try generating email drafts to verify the API integration works

## Environment Variables Reference

| Variable Name | Required | Description |
|--------------|----------|-------------|
| `DEEPSEEK_API_KEY` | **YES** | Your DeepSeek API key for generating AI-powered email content |

## Troubleshooting

### Issue: Email generation uses mock data instead of AI

**Cause**: DeepSeek API key is not configured or incorrect

**Solution**:
1. Verify the environment variable is set correctly in Netlify
2. Make sure the variable name is exactly `DEEPSEEK_API_KEY` (case-sensitive)
3. Redeploy the site after adding/updating environment variables
4. Check browser console for API error messages

### Issue: Netlify Functions not working

**Cause**: Functions may not be deployed properly

**Solution**:
1. Verify the `netlify.toml` file is present in your repository
2. Check that `netlify/functions/deepseek.js` exists
3. Redeploy the site with cleared cache
4. Check Netlify function logs in the dashboard

### Issue: API rate limits or quotas

**Cause**: DeepSeek API has usage limits

**Solution**:
1. Check your DeepSeek account usage and limits
2. Consider adding rate limiting or caching in the application
3. Upgrade your DeepSeek plan if needed

## Local Development

To test the application locally before deploying:

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
DEEPSEEK_API_KEY=your_api_key_here
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

## Custom Domain Setup (Optional)

1. In your Netlify site dashboard, go to **"Domain settings"**
2. Click **"Add custom domain"**
3. Follow the instructions to:
   - Add your domain
   - Configure DNS settings
   - Enable HTTPS (automatic with Netlify)

## Cost Considerations

### Netlify
- Free tier includes:
  - 100 GB bandwidth/month
  - 300 build minutes/month
  - 125k function invocations/month
- This should be sufficient for moderate usage

### DeepSeek API
- Check [DeepSeek pricing](https://platform.deepseek.com/pricing)
- Each email generation session uses approximately 14-15 API calls:
  - 1 call for competitor analysis
  - 1 call for seasonal trends
  - 1 call for recommendations
  - 10 calls for individual email drafts
- Monitor your API usage in the DeepSeek dashboard

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
4. Ensure your DeepSeek API key is valid and has sufficient quota

## Updates and Maintenance

To update the application:

1. Make changes to your forked repository
2. Commit and push changes to GitHub
3. Netlify will automatically detect changes and redeploy

Alternatively, use Netlify CLI:
```bash
netlify deploy --prod
```

## Performance Optimization

- The application uses client-side rendering (no build step required)
- Serverless functions handle API calls securely
- Mock data fallback ensures the app works even without API access (for testing)

## Next Steps

After successful deployment:

1. **Test the workflow** with sample competitor URLs
2. **Customize the email templates** in `script.js` if needed
3. **Adjust customer data** in `customerData.js` to match your business
4. **Brand the application** by modifying colors and styling in `styles.css`

---

**Need Help?** Refer to:
- [Netlify Documentation](https://docs.netlify.com/)
- [DeepSeek API Documentation](https://platform.deepseek.com/docs)
