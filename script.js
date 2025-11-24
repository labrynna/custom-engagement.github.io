// Main application script

// Constants for sampling and display
const SAMPLE_CUSTOMERS_COUNT = 3;
const SAMPLE_ORDERS_PER_CUSTOMER = 2;
const API_CALL_DELAY_MS = 300; // Small delay between API calls to avoid rate limiting

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
    // Set current date
    const today = new Date();
    const dateString = today.toLocaleDateString('en-SG', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
    document.getElementById('current-date').value = dateString;

    // Add event listener to generate button
    document.getElementById('generate-btn').addEventListener('click', generateEmailDrafts);
});

// State management
let emailDraftsState = [];

// Main function to generate email drafts
async function generateEmailDrafts() {
    const location = document.getElementById('location').value || 'Singapore';
    const competitorUrls = document.getElementById('competitor-urls').value;
    const currentDate = document.getElementById('current-date').value;

    // Hide error and results sections
    hideSection('error-section');
    hideSection('results-section');
    
    // Show progress section
    showSection('progress-section');
    
    // Disable generate button
    const generateBtn = document.getElementById('generate-btn');
    generateBtn.disabled = true;
    generateBtn.textContent = 'Processing...';

    try {
        // Step 1: Load customer data
        await updateStep('step-customer-data', 'active', 'Processing customer data...');
        await sleep(500);
        const customers = customerData;
        await updateStep('step-customer-data', 'completed', '✅ Customer data loaded');

        // Step 2: Analyze competitor insights
        await updateStep('step-competitor', 'active', 'Analyzing competitor insights...');
        const competitorInsights = await analyzeCompetitors(competitorUrls, location);
        await updateStep('step-competitor', 'completed', '✅ Competitor analysis complete');

        // Step 3: Analyze seasonal trends
        await updateStep('step-seasonal', 'active', 'Analyzing seasonal trends...');
        const seasonalTrends = await analyzeSeasonalTrends(location, currentDate);
        await updateStep('step-seasonal', 'completed', '✅ Seasonal analysis complete');

        // Step 4: Generate recommendations
        await updateStep('step-recommendations', 'active', 'Generating personalized recommendations...');
        const recommendations = await generateRecommendations(
            customers,
            competitorInsights,
            seasonalTrends
        );
        await updateStep('step-recommendations', 'completed', '✅ Recommendations generated');

        // Step 5: Create email drafts
        await updateStep('step-emails', 'active', 'Creating personalized email drafts...');
        const emailDrafts = await generateEmails(
            customers,
            recommendations,
            competitorInsights,
            seasonalTrends
        );
        await updateStep('step-emails', 'completed', '✅ Email drafts created');

        // Store email drafts
        emailDraftsState = emailDrafts;

        // Display results
        displayEmailDrafts(emailDrafts);
        showSection('results-section');

    } catch (error) {
        console.error('Error:', error);
        showError(`Failed to generate email drafts: ${error.message}`);
    } finally {
        generateBtn.disabled = false;
        generateBtn.textContent = 'Generate Email Drafts';
    }
}

// DeepSeek API call function using Netlify serverless function
async function callDeepSeekAPI(prompt, systemPrompt = 'You are a helpful assistant for a tailoring business in Singapore.') {
    try {
        const response = await fetch('/.netlify/functions/deepseek', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                prompt: prompt,
                systemPrompt: systemPrompt
            })
        });

        if (!response.ok) {
            // If serverless function fails, fall back to mock response
            console.warn('API call failed, using mock response');
            return getMockResponse(prompt);
        }

        const data = await response.json();
        return data.content;
    } catch (error) {
        console.error('DeepSeek API error:', error);
        // Fallback to mock response for development
        console.warn('Using mock response for development/testing');
        return getMockResponse(prompt);
    }
}

// Mock response generator for development/testing
function getMockResponse(prompt) {
    if (prompt.includes('competitor')) {
        return `Based on the competitor analysis:
- Competitors are focusing on sustainable fabrics and eco-friendly materials
- Premium alterations and quick turnaround times are key selling points
- Digital presence with virtual fitting consultations is trending
- Holiday season promotions and gift packages are being advertised
- Emphasis on bespoke craftsmanship and personalized service`;
    } else if (prompt.includes('seasonal') || prompt.includes('trends')) {
        return `Current seasonal trends for Singapore:
- End of November: Transition to year-end festive season
- High demand for formal wear for Christmas parties and New Year events
- Corporate year-end events driving business attire needs
- Wedding season is active with many ceremonies planned
- Light fabrics remain important due to tropical climate
- Darker, richer colors popular for evening events`;
    } else if (prompt.includes('recommendation')) {
        return `Personalized engagement recommendations for customers with formal wear history:
1. Highlight year-end event preparation with exclusive discounts
2. Suggest complementary accessories for existing suits
3. Offer quick alteration services for last-minute events
4. Introduce new premium fabric collections
5. Emphasize personalized fitting appointments`;
    } else {
        return 'Mock response generated for development purposes.';
    }
}

// Analyze competitors
async function analyzeCompetitors(urls, location) {
    const prompt = `As a tailoring business analyst in ${location}, analyze the following competitor information:
Competitor URLs: ${urls || 'General tailoring competitors in Singapore'}

Provide insights on:
1. What services or products they are currently highlighting
2. Any special promotions or seasonal offers
3. Their unique selling points
4. Industry trends they are following

Keep the response concise and actionable.`;

    return await callDeepSeekAPI(prompt);
}

// Analyze seasonal trends
async function analyzeSeasonalTrends(location, date) {
    const prompt = `Analyze the current seasonal trends for a tailoring business in ${location} as of ${date}.

Consider:
1. Current season and weather patterns
2. Upcoming holidays and events
3. Fashion trends for this time of year
4. Customer needs based on the calendar
5. Cultural events specific to ${location}

Provide actionable insights for customer engagement.`;

    return await callDeepSeekAPI(prompt);
}

// Generate recommendations
async function generateRecommendations(customers, competitorInsights, seasonalTrends) {
    // Aggregate recent purchase patterns from multiple customers for better recommendations
    const recentItemsSample = customers.slice(0, SAMPLE_CUSTOMERS_COUNT).map(customer => 
        customer.orders.slice(0, SAMPLE_ORDERS_PER_CUSTOMER).map(o => o.items).join(', ')
    ).join(' | ');
    
    const prompt = `As a customer engagement specialist for a tailoring business, generate personalized engagement strategies.

Context:
- Competitor Insights: ${competitorInsights.substring(0, 300)}...
- Seasonal Trends: ${seasonalTrends.substring(0, 300)}...
- Customer purchase patterns (samples): ${recentItemsSample.substring(0, 400)}...

Provide 5-7 specific, actionable recommendations for engaging with existing customers who have purchase history in formal menswear.`;

    return await callDeepSeekAPI(prompt);
}

// Generate email drafts for each customer
async function generateEmails(customers, recommendations, competitorInsights, seasonalTrends) {
    const emailDrafts = [];

    for (let i = 0; i < customers.length; i++) {
        const customer = customers[i];
        const recentOrders = customer.orders.slice(0, 3);
        const orderDetails = recentOrders.map(o => 
            `${o.orderDate}: ${o.items} (${o.orderId})`
        ).join('\n');

        const prompt = `Write a personalized email draft for a tailoring business customer in Singapore.

Customer Name: ${customer.customerName}
Customer ID: ${customer.customerId}
Recent Purchase History:
${orderDetails}

Context:
- Current Season: Late November, approaching year-end festivities
- Competitor Strategy: ${competitorInsights.substring(0, 200)}...
- Seasonal Trends: ${seasonalTrends.substring(0, 200)}...
- Engagement Strategy: ${recommendations.substring(0, 200)}...

Create a warm, personalized email that:
1. References their past purchases naturally
2. Suggests relevant new products or services
3. Creates urgency with seasonal/event-based timing
4. Includes a clear call-to-action
5. Maintains a friendly, professional tone

Format as:
Subject: [Email Subject]

[Email Body]

Keep it concise (200-250 words).`;

        const response = await callDeepSeekAPI(prompt, 'You are an expert email marketing specialist for luxury tailoring businesses.');
        
        // Parse subject and body
        const lines = response.split('\n');
        let subject = 'Your Personalized Tailoring Update';
        let body = response;
        
        for (let j = 0; j < lines.length; j++) {
            if (lines[j].toLowerCase().startsWith('subject:')) {
                subject = lines[j].replace(/^subject:\s*/i, '').trim();
                body = lines.slice(j + 1).join('\n').trim();
                break;
            }
        }

        emailDrafts.push({
            customer: customer,
            subject: subject,
            body: body,
            sent: false
        });

        // Update progress for email generation
        await updateStep('step-emails', 'active', `Creating email drafts... (${i + 1}/${customers.length})`);
        await sleep(API_CALL_DELAY_MS); // Delay to avoid potential rate limiting
    }

    return emailDrafts;
}

// Display email drafts in the UI
function displayEmailDrafts(emailDrafts) {
    const emailList = document.getElementById('email-list');
    emailList.innerHTML = '';

    emailDrafts.forEach((draft, index) => {
        const emailItem = createEmailItem(draft, index);
        emailList.appendChild(emailItem);
    });
}

// Create email item element
function createEmailItem(draft, index) {
    const div = document.createElement('div');
    div.className = 'email-item';
    div.id = `email-${index}`;

    const header = document.createElement('div');
    header.className = 'email-header';
    header.onclick = () => toggleEmail(index);

    const info = document.createElement('div');
    info.className = 'email-info';
    info.innerHTML = `
        <div class="customer-name">${draft.customer.customerName}</div>
        <div class="customer-id">Customer ID: ${draft.customer.customerId}</div>
    `;

    const actions = document.createElement('div');
    actions.className = 'email-actions';

    if (draft.sent) {
        actions.innerHTML = '<div class="sent-status">✓ Sent</div>';
    } else {
        const sendBtn = document.createElement('button');
        sendBtn.className = 'send-btn';
        sendBtn.textContent = 'Send';
        sendBtn.onclick = (e) => {
            e.stopPropagation();
            markAsSent(index);
        };
        actions.appendChild(sendBtn);
    }

    const expandIcon = document.createElement('div');
    expandIcon.className = 'expand-icon';
    expandIcon.textContent = '▼';
    actions.appendChild(expandIcon);

    header.appendChild(info);
    header.appendChild(actions);

    const content = document.createElement('div');
    content.className = 'email-content';
    
    const orderHistory = draft.customer.orders.slice(0, SAMPLE_ORDERS_PER_CUSTOMER + 1).map(order => 
        `<div class="order-item">
            <strong>${order.orderId}</strong> - ${order.orderDate}: ${order.items}
        </div>`
    ).join('');

    content.innerHTML = `
        <div class="email-subject"><strong>Subject:</strong> ${draft.subject}</div>
        <div class="email-body">${draft.body}</div>
        <div class="order-history">
            <h4>Recent Orders:</h4>
            ${orderHistory}
        </div>
    `;

    div.appendChild(header);
    div.appendChild(content);

    return div;
}

// Toggle email expansion
function toggleEmail(index) {
    const emailItem = document.getElementById(`email-${index}`);
    emailItem.classList.toggle('expanded');
}

// Mark email as sent
function markAsSent(index) {
    emailDraftsState[index].sent = true;
    
    const emailItem = document.getElementById(`email-${index}`);
    const actions = emailItem.querySelector('.email-actions');
    actions.innerHTML = '<div class="sent-status">✓ Sent</div>';
    
    // Re-add expand icon
    const expandIcon = document.createElement('div');
    expandIcon.className = 'expand-icon';
    expandIcon.textContent = '▼';
    actions.appendChild(expandIcon);
}

// Update progress step
async function updateStep(stepId, status, text) {
    const step = document.getElementById(stepId);
    const stepText = step.querySelector('.step-text');
    const stepIcon = step.querySelector('.step-icon');

    // Remove existing status classes
    step.classList.remove('active', 'completed');
    
    if (status === 'active') {
        step.classList.add('active');
        stepIcon.textContent = '⚙️';
        stepText.textContent = text;
    } else if (status === 'completed') {
        step.classList.add('completed');
        stepIcon.textContent = '✅';
        stepText.textContent = text;
    }

    await sleep(100); // Small delay for visual feedback
}

// Utility functions
function showSection(sectionId) {
    document.getElementById(sectionId).classList.remove('hidden');
}

function hideSection(sectionId) {
    document.getElementById(sectionId).classList.add('hidden');
}

function showError(message) {
    document.getElementById('error-message').textContent = message;
    showSection('error-section');
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
