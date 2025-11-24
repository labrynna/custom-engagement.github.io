// Main application script - Step-by-step wizard approach

// Constants
const SAMPLE_ORDERS_PER_CUSTOMER = 3;

// State management
let appState = {
    currentStep: 1,
    competitors: [],
    competitorInsights: '',
    seasonalTrends: '',
    location: 'Singapore',
    currentDate: '',
    customers: [],
    emailDrafts: []
};

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
    appState.currentDate = dateString;
    
    // Load customer data
    appState.customers = customerData;
    
    // Show first step
    goToStep(1);
});

// Step navigation
function goToStep(stepNumber, showResults = false) {
    appState.currentStep = stepNumber;
    
    // Hide all content sections
    document.querySelectorAll('.step-content, .card:not(.wizard-progress)').forEach(el => {
        if (!el.classList.contains('wizard-progress')) {
            el.classList.add('hidden');
        }
    });
    
    // Update wizard progress
    document.querySelectorAll('.wizard-step').forEach((step, index) => {
        step.classList.remove('active', 'completed');
        if (index + 1 < stepNumber) {
            step.classList.add('completed');
        } else if (index + 1 === stepNumber) {
            step.classList.add('active');
        }
    });
    
    // Show appropriate content
    if (showResults) {
        // Show results from previous step
        if (stepNumber === 1) {
            document.getElementById('step-1-results').classList.remove('hidden');
        } else if (stepNumber === 2) {
            document.getElementById('step-2-results').classList.remove('hidden');
        }
    } else {
        // Show step input form
        if (stepNumber === 1) {
            document.getElementById('step-1').classList.remove('hidden');
        } else if (stepNumber === 2) {
            document.getElementById('step-2').classList.remove('hidden');
        } else if (stepNumber === 3) {
            showCustomerReview();
        } else if (stepNumber === 4) {
            document.getElementById('step-4-results').classList.remove('hidden');
        }
    }
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Add competitor entry
function addCompetitorEntry() {
    const competitorList = document.getElementById('competitor-list');
    const newEntry = document.createElement('div');
    newEntry.className = 'competitor-entry';
    newEntry.innerHTML = `
        <input type="text" class="competitor-name" placeholder="Competitor Name">
        <input type="url" class="competitor-url" placeholder="Website URL">
        <input type="url" class="competitor-linkedin" placeholder="LinkedIn URL (optional)">
    `;
    competitorList.appendChild(newEntry);
}

// Step 1: Analyze Competitors
async function analyzeCompetitors() {
    // Collect competitor data
    const entries = document.querySelectorAll('.competitor-entry');
    appState.competitors = [];
    
    entries.forEach(entry => {
        const name = entry.querySelector('.competitor-name').value.trim();
        const url = entry.querySelector('.competitor-url').value.trim();
        const linkedin = entry.querySelector('.competitor-linkedin').value.trim();
        
        if (name && url) {
            appState.competitors.push({ name, url, linkedin });
        }
    });
    
    if (appState.competitors.length === 0) {
        showError('Please enter at least one competitor with name and website URL.');
        return;
    }
    
    // Show progress
    document.getElementById('step-1').classList.add('hidden');
    document.getElementById('step-1-progress').classList.remove('hidden');
    
    try {
        // Build prompt for Perplexity
        const competitorList = appState.competitors.map(c => 
            `- ${c.name}: ${c.url}${c.linkedin ? ` (LinkedIn: ${c.linkedin})` : ''}`
        ).join('\n');
        
        const prompt = `Research and analyze the following tailoring/menswear competitors in Singapore and their latest updates:

${competitorList}

Please search their websites and social media (LinkedIn if provided) for:
1. Latest product launches or collections
2. Current promotions or special offers
3. Unique selling propositions and services
4. Recent updates, news, or announcements
5. Pricing strategies and positioning

Provide a comprehensive summary of competitive insights that would be useful for a tailoring business planning customer outreach campaigns.`;

        const insights = await callPerplexityAPI(prompt);
        appState.competitorInsights = insights;
        
        // Show results
        document.getElementById('step-1-progress').classList.add('hidden');
        displayCompetitorInsights(insights);
        document.getElementById('step-1-results').classList.remove('hidden');
        
        // Update wizard progress
        document.querySelector('.wizard-step[data-step="1"]').classList.add('completed');
        
    } catch (error) {
        console.error('Error analyzing competitors:', error);
        document.getElementById('step-1-progress').classList.add('hidden');
        showError(`Failed to analyze competitors: ${error.message}`);
        document.getElementById('step-1').classList.remove('hidden');
    }
}

function displayCompetitorInsights(insights) {
    const content = document.getElementById('competitor-insights-content');
    content.innerHTML = `
        <h3>🔍 Competitive Intelligence Summary</h3>
        <div style="white-space: pre-wrap; line-height: 1.8;">${insights}</div>
    `;
}

// Step 2: Analyze Seasonal Trends
async function analyzeSeasonalTrends() {
    appState.location = document.getElementById('location').value || 'Singapore';
    
    // Show progress
    document.getElementById('step-2').classList.add('hidden');
    document.getElementById('step-2-progress').classList.remove('hidden');
    
    try {
        const prompt = `Analyze current seasonal fashion trends for menswear (tailored suits, dress shirts, and coats) in ${appState.location} as of ${appState.currentDate}.

Please research and provide:
1. Current season and climate considerations for ${appState.location}
2. Trending fabrics, colors, and styles for this time of year
3. Upcoming events or holidays that drive formal wear demand
4. Fashion industry trends affecting tailored menswear
5. Customer preferences and buying patterns for this season

Focus on actionable insights for a bespoke tailoring business planning customer engagement campaigns.`;

        const trends = await callPerplexityAPI(prompt);
        appState.seasonalTrends = trends;
        
        // Show results
        document.getElementById('step-2-progress').classList.add('hidden');
        displaySeasonalTrends(trends);
        document.getElementById('step-2-results').classList.remove('hidden');
        
        // Update wizard progress
        document.querySelector('.wizard-step[data-step="2"]').classList.add('completed');
        
    } catch (error) {
        console.error('Error analyzing seasonal trends:', error);
        document.getElementById('step-2-progress').classList.add('hidden');
        showError(`Failed to analyze seasonal trends: ${error.message}`);
        document.getElementById('step-2').classList.remove('hidden');
    }
}

function displaySeasonalTrends(trends) {
    const content = document.getElementById('seasonal-insights-content');
    content.innerHTML = `
        <h3>🌤️ Seasonal Trends Analysis</h3>
        <div style="white-space: pre-wrap; line-height: 1.8;">${trends}</div>
    `;
}

// Step 3: Show Customer Review
function showCustomerReview() {
    const totalCustomers = appState.customers.length;
    const totalOrders = appState.customers.reduce((sum, c) => sum + c.orders.length, 0);
    const avgOrders = (totalOrders / totalCustomers).toFixed(1);
    
    document.getElementById('total-customers').textContent = totalCustomers;
    document.getElementById('total-orders').textContent = totalOrders;
    document.getElementById('avg-orders').textContent = avgOrders;
    
    // Display customer preview
    const preview = document.getElementById('customer-preview');
    preview.innerHTML = appState.customers.map(customer => `
        <div class="customer-preview-item">
            <div>
                <div class="customer-name-preview">${customer.customerName}</div>
                <div class="customer-orders-preview">ID: ${customer.customerId}</div>
            </div>
            <div class="customer-orders-preview">${customer.orders.length} orders</div>
        </div>
    `).join('');
    
    document.getElementById('step-3').classList.remove('hidden');
    document.querySelector('.wizard-step[data-step="3"]').classList.add('completed');
}

// Step 4: Generate Emails
async function startEmailGeneration() {
    document.getElementById('step-3').classList.add('hidden');
    document.getElementById('step-4-progress').classList.remove('hidden');
    
    appState.emailDrafts = [];
    const totalCustomers = appState.customers.length;
    
    try {
        for (let i = 0; i < totalCustomers; i++) {
            const customer = appState.customers[i];
            
            // Update progress
            const progressPercent = ((i) / totalCustomers) * 100;
            document.getElementById('email-progress-bar').style.width = `${progressPercent}%`;
            document.getElementById('email-progress-count').textContent = 
                `${i} of ${totalCustomers} emails generated`;
            document.getElementById('email-progress-text').textContent = 
                `Generating personalized email for ${customer.customerName}...`;
            
            // Generate email
            const email = await generateCustomerEmail(customer);
            appState.emailDrafts.push(email);
            
            // Small delay between API calls
            await sleep(500);
        }
        
        // Complete
        document.getElementById('email-progress-bar').style.width = '100%';
        document.getElementById('email-progress-count').textContent = 
            `${totalCustomers} of ${totalCustomers} emails generated`;
        
        await sleep(500);
        
        // Show results
        document.getElementById('step-4-progress').classList.add('hidden');
        displayEmailDrafts();
        document.getElementById('step-4-results').classList.remove('hidden');
        document.querySelector('.wizard-step[data-step="4"]').classList.add('completed');
        
    } catch (error) {
        console.error('Error generating emails:', error);
        document.getElementById('step-4-progress').classList.add('hidden');
        showError(`Failed to generate emails: ${error.message}`);
        document.getElementById('step-3').classList.remove('hidden');
    }
}

async function generateCustomerEmail(customer) {
    const recentOrders = customer.orders.slice(0, SAMPLE_ORDERS_PER_CUSTOMER);
    const orderDetails = recentOrders.map(o => 
        `${o.orderDate}: ${o.items} (Order ${o.orderId})`
    ).join('\n');
    
    const prompt = `Write a personalized customer engagement email for a bespoke tailoring business.

Customer Information:
- Name: ${customer.customerName}
- Customer ID: ${customer.customerId}
- Recent Purchase History:
${orderDetails}

Context for Personalization:
1. Competitive Landscape: ${appState.competitorInsights.substring(0, 400)}...

2. Seasonal Trends: ${appState.seasonalTrends.substring(0, 400)}...

Please create a warm, professional email that:
- References their specific past purchases naturally
- Suggests relevant products/services based on seasonal trends
- Creates urgency with timely seasonal/event context
- Differentiates from competitors
- Includes a clear call-to-action
- Maintains a personalized, conversational tone

Format:
Subject: [Compelling subject line]

[Email body - 200-250 words]

Best regards,
[Signature]`;

    const response = await callPerplexityAPI(prompt, 'You are an expert email marketing specialist for luxury tailoring businesses.');
    
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
    
    return {
        customer: customer,
        subject: subject,
        body: body,
        sent: false
    };
}

function displayEmailDrafts() {
    const emailList = document.getElementById('email-list');
    emailList.innerHTML = '';
    
    appState.emailDrafts.forEach((draft, index) => {
        const emailItem = createEmailItem(draft, index);
        emailList.appendChild(emailItem);
    });
}

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
    
    const orderHistory = draft.customer.orders.slice(0, SAMPLE_ORDERS_PER_CUSTOMER).map(order => 
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

function toggleEmail(index) {
    const emailItem = document.getElementById(`email-${index}`);
    emailItem.classList.toggle('expanded');
}

function markAsSent(index) {
    appState.emailDrafts[index].sent = true;
    
    const emailItem = document.getElementById(`email-${index}`);
    const actions = emailItem.querySelector('.email-actions');
    actions.innerHTML = '<div class="sent-status">✓ Sent</div>';
    
    // Re-add expand icon
    const expandIcon = document.createElement('div');
    expandIcon.className = 'expand-icon';
    expandIcon.textContent = '▼';
    actions.appendChild(expandIcon);
}

// Perplexity API call function using Netlify serverless function
async function callPerplexityAPI(prompt, systemPrompt = 'You are a helpful assistant for a tailoring business in Singapore.') {
    try {
        const response = await fetch('/.netlify/functions/perplexity', {
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
        console.error('Perplexity API error:', error);
        // Fallback to mock response for development
        console.warn('Using mock response for development/testing');
        return getMockResponse(prompt);
    }
}

// Mock response generator for development/testing
function getMockResponse(prompt) {
    if (prompt.includes('competitor') || prompt.includes('Competitor')) {
        return `Based on competitive analysis of Singapore's tailoring market:

**Key Findings:**
- Premium competitors focus on sustainable fabrics and eco-friendly materials
- Quick turnaround times (24-48 hours) are major selling points
- Virtual fitting consultations gaining popularity post-pandemic
- Year-end festive promotions heavily advertised (15-25% off)
- Emphasis on bespoke craftsmanship and personalized service
- Social media presence strong on Instagram and LinkedIn
- Wedding season packages with complimentary accessories

**Pricing Insights:**
- Custom suits range from SGD 800-2500
- Shirt packages: SGD 200-400 for 3 shirts
- Express alterations at premium (50% surcharge)

**Opportunities:**
- Personalized follow-up with past customers
- Seasonal fabric collections
- Loyalty programs underutilized`;
    } else if (prompt.includes('seasonal') || prompt.includes('Seasonal') || prompt.includes('trends')) {
        return `Seasonal Fashion Trends for ${appState.location} - ${appState.currentDate}:

**Current Climate:**
- Late November: Transitioning to year-end festive season
- Tropical climate remains warm (26-30°C), but evening events common

**Trending Styles:**
- Darker, richer colors for evening events (navy, charcoal, burgundy)
- Lightweight wool blends for Singapore's climate
- Slim-fit silhouettes with modern cuts
- Patterned shirts and bold accessories for festive occasions

**Key Events Driving Demand:**
- Christmas parties and corporate year-end events
- New Year celebrations and galas
- Wedding season peak (November-February)
- Chinese New Year preparations (January-February)

**Fabric Trends:**
- Breathable wool blends and cotton
- Linen still popular for daytime wear
- Velvet accents for festive touch
- Performance fabrics with stretch

**Customer Preferences:**
- Quick turnaround for last-minute events
- Versatile pieces (dress-down Friday to evening events)
- Investment in quality over fast fashion
- Sustainable and eco-conscious choices`;
    } else if (prompt.includes('email') || prompt.includes('Email')) {
        const customerName = prompt.match(/Name: ([^\n]+)/)?.[1] || 'Valued Customer';
        return `Subject: ${customerName}, Exclusive Year-End Tailoring Offer Just for You

Dear ${customerName},

As we approach the festive season, I wanted to reach out personally to thank you for your continued trust in our craftsmanship.

Looking at your recent purchases, I can see you appreciate quality tailoring—from your elegant navy suit to your sophisticated grey blazer. This season, we're seeing a wonderful trend toward richer evening colors and versatile pieces that transition seamlessly from boardroom to celebration.

I'd love to invite you for a complimentary consultation to explore our new winter collection, featuring luxurious fabrics perfect for the upcoming year-end events. Plus, as a valued client, enjoy 20% off your next order when booked before December 15th.

With wedding season and holiday celebrations approaching, now is the perfect time to ensure you're dressed impeccably for every occasion.

Shall we schedule a fitting this week? Reply to this email or call us directly.

Best regards,
Your Personal Tailor
[Signature]`;
    }
    return 'Mock response generated for development purposes.';
}

// Utility functions
function showError(message) {
    document.getElementById('error-message').textContent = message;
    document.getElementById('error-section').classList.remove('hidden');
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function hideError() {
    document.getElementById('error-section').classList.add('hidden');
}

function startOver() {
    appState = {
        currentStep: 1,
        competitors: [],
        competitorInsights: '',
        seasonalTrends: '',
        location: 'Singapore',
        currentDate: appState.currentDate,
        customers: customerData,
        emailDrafts: []
    };
    
    // Reset competitor inputs
    const competitorList = document.getElementById('competitor-list');
    competitorList.innerHTML = `
        <div class="competitor-entry">
            <input type="text" class="competitor-name" placeholder="Competitor Name (e.g., Premium Tailors)">
            <input type="url" class="competitor-url" placeholder="Website URL">
            <input type="url" class="competitor-linkedin" placeholder="LinkedIn URL (optional)">
        </div>
    `;
    
    goToStep(1);
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
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
