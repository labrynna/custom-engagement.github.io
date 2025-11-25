// Netlify serverless function to handle Perplexity API calls
// This keeps the API key secure on the server side

// Note: Netlify runtime with Node.js 18+ provides fetch globally
// For Node.js versions below 18, you would need to use node-fetch
// Netlify automatically uses Node 18+ by default as of 2023

exports.handler = async (event, context) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  // Get API key from environment variable
  const apiKey = process.env.PERPLEXITY_API_KEY;

  if (!apiKey) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'API key not configured' })
    };
  }

  try {
    // Parse request body
    const { prompt, systemPrompt } = JSON.parse(event.body);

    if (!prompt) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Prompt is required' })
      };
    }

    // Call Perplexity API
    // Using sonar-pro for better web search capabilities
    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'sonar-pro',  // Best for web searches and research
        messages: [
          { 
            role: 'system', 
            content: systemPrompt || 'You are a helpful assistant for a tailoring business in Singapore.'
          },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 2000,
        return_citations: false,
        return_images: false,
        search_recency_filter: 'month'  // Focus on recent information
      })
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Perplexity API error:', errorData);
      return {
        statusCode: response.status,
        body: JSON.stringify({ error: `API request failed: ${response.status}` })
      };
    }

    const data = await response.json();
    
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        content: data.choices[0].message.content
      })
    };

  } catch (error) {
    console.error('Function error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};
