// Main application script - Step-by-step wizard approach

// Constants
const SAMPLE_ORDERS_PER_CUSTOMER = 3;
const SENDER_NAME = 'Your Tailor';
const COMPANY_NAME = 'Ins[ai]ght';

// State management
let appState = {
    currentStep: 1,
    competitorInput: '',
    competitorInsights: '',
    seasonalTrends: '',
    location: 'Singapore',
    currentDate: '',
    customers: [],
    emailDrafts: []
};

// Utility function to remove asterisks, hashtags, and references from AI-generated text
function cleanAIText(text) {
    if (!text) return text;
    // Remove asterisks used for bold/italic markdown
    // Remove hashtags used for headers
    // Remove reference citations like [1], [2], (1), (2), etc.
    return text
        .replace(/\*+/g, '')
        .replace(/#/g, '')
        .replace(/\[\d+\]|\(\d+\)/g, '');
}

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
    // This function is no longer needed with the single text field approach
    // Kept for backward compatibility
    console.log('addCompetitorEntry is deprecated - using single text field');
}

// Step 1: Analyze Competitors
async function analyzeCompetitors() {
    // Get competitor data from single text field
    const competitorInput = document.getElementById('competitor-input').value.trim();
    
    if (!competitorInput) {
        showError('Please enter competitor information (names, websites, or email links).');
        return;
    }
    
    appState.competitorInput = competitorInput;
    
    // Show progress
    document.getElementById('step-1').classList.add('hidden');
    document.getElementById('step-1-progress').classList.remove('hidden');
    
    try {
        // Build prompt for Perplexity - let AI identify the competitors from the input
        const prompt = `Analyze the following competitor information for a bespoke menswear tailoring business. The input may contain competitor names, website URLs, email addresses, and other details in various formats. Please identify and research each competitor mentioned.

Input provided:
${competitorInput}

Please provide your analysis in TWO CLEARLY SEPARATED SECTIONS:

SECTION 1 - COMPETITOR INTELLIGENCE:
1. Identify all competitors mentioned (names, websites, emails)
2. Research their websites and online presence for:
   - Latest product launches or collections
   - Current promotions or special offers
   - Unique selling propositions and services
   - Recent updates, news, or announcements
   - Pricing strategies and positioning

SECTION 2 - TAILORED ADVICE FOR YOUR BUSINESS:
Based on the competitor analysis above, provide specific, actionable recommendations for a high-end bespoke tailoring business to:
- Differentiate from competitors
- Capitalize on market gaps
- Improve customer engagement strategies
- Create compelling offers and promotions
- Enhance competitive positioning

IMPORTANT: Clearly label each section with "COMPETITOR INTELLIGENCE:" and "TAILORED ADVICE:" headers so they can be easily identified.`;

        const insights = await callPerplexityAPI(prompt);
        appState.competitorInsights = cleanAIText(insights);
        
        // Show results
        document.getElementById('step-1-progress').classList.add('hidden');
        displayCompetitorInsights(appState.competitorInsights);
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

// Convert basic markdown to HTML for better display
function markdownToHtml(text) {
    // Text should already be cleaned, but ensure it is
    let cleanedText = cleanAIText(text);
    
    // Convert markdown syntax (without asterisks/hashtags since they're cleaned)
    let html = cleanedText;
    
    // Process lists: find consecutive lines starting with "- " and wrap in <ul>
    const lines = html.split('\n');
    const result = [];
    let inList = false;
    
    for (const line of lines) {
        if (line.match(/^- .+/)) {
            if (!inList) {
                result.push('<ul>');
                inList = true;
            }
            result.push('<li>' + line.substring(2) + '</li>');
        } else {
            if (inList) {
                result.push('</ul>');
                inList = false;
            }
            result.push(line);
        }
    }
    if (inList) {
        result.push('</ul>');
    }
    
    // Join and convert remaining line breaks
    return result.join('\n').replace(/\n/g, '<br>');
}

function displayCompetitorInsights(insights) {
    const content = document.getElementById('competitor-insights-content');
    
    // Parse the insights to separate Competitor Intelligence and Tailored Advice
    let competitorIntelligence = insights;
    let tailoredAdvice = '';
    
    // Try to find the tailored advice section using various possible headers
    const tailoredAdviceSplitPatterns = [
        /SECTION 2[\s\-]*TAILORED ADVICE[\s\-]*FOR YOUR BUSINESS[:\s]*/i,
        /SECTION 2[\s\-]*TAILORED ADVICE[:\s]*/i,
        /TAILORED ADVICE FOR YOUR BUSINESS[:\s]*/i,
        /TAILORED ADVICE[:\s]*/i
    ];
    
    for (const pattern of tailoredAdviceSplitPatterns) {
        const matchIndex = insights.search(pattern);
        if (matchIndex !== -1) {
            competitorIntelligence = insights.substring(0, matchIndex).trim();
            tailoredAdvice = insights.substring(matchIndex).trim();
            // Remove the header from tailored advice content
            tailoredAdvice = tailoredAdvice
                .replace(/SECTION 2[\s\-]*TAILORED ADVICE[\s\-]*FOR YOUR BUSINESS[:\s]*/i, '')
                .replace(/SECTION 2[\s\-]*TAILORED ADVICE[:\s]*/i, '')
                .replace(/TAILORED ADVICE FOR YOUR BUSINESS[:\s]*/i, '')
                .replace(/TAILORED ADVICE[:\s]*/i, '')
                .replace(/^FOR YOUR BUSINESS[:\s]*/i, '')
                .trim();
            break;
        }
    }
    
    // Clean up the competitor intelligence section header
    competitorIntelligence = competitorIntelligence
        .replace(/SECTION 1[\s\-]*COMPETITOR INTELLIGENCE[:\s]*/gi, '')
        .replace(/COMPETITOR INTELLIGENCE[:\s]*/gi, '')
        .replace(/^SECTION 1[\s\-]*/i, '')
        .trim();
    
    // Build the HTML with two distinct sections
    let html = `
        <div class="insights-section">
            <h3>Competitive Intelligence Summary</h3>
            <span class="ai-badge">AI Generated</span>
            <div class="insights-text">${markdownToHtml(competitorIntelligence)}</div>
        </div>
    `;
    
    if (tailoredAdvice) {
        html += `
        <div class="tailored-advice-section" id="tailored-advice-section">
            <div class="tailored-advice-header">
                <h3>Tailored Advice for Your Business</h3>
                <span class="advice-badge">Actionable Recommendations</span>
            </div>
            <div class="tailored-advice-content">${markdownToHtml(tailoredAdvice)}</div>
        </div>
        `;
    }
    
    // Add jump link at the top if tailored advice exists
    if (tailoredAdvice) {
        html = `
        <div class="jump-to-advice">
            <a href="#tailored-advice-section" class="jump-link" onclick="scrollToTailoredAdvice(event)">
                ➔ Jump to Tailored Advice
            </a>
        </div>
        ` + html;
    }
    
    content.innerHTML = html;
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
        appState.seasonalTrends = cleanAIText(trends);
        
        // Show results
        document.getElementById('step-2-progress').classList.add('hidden');
        displaySeasonalTrends(appState.seasonalTrends);
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
        <h3>Seasonal Trends Analysis</h3>
        <span class="ai-badge">AI Generated</span>
        <div class="insights-text">${markdownToHtml(trends)}</div>
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
    
    // Display customer preview with expandable order details
    const preview = document.getElementById('customer-preview');
    preview.innerHTML = appState.customers.map((customer, index) => {
        const orderDetailsHtml = customer.orders.map(order => 
            `<div class="customer-order-detail">
                <strong>${order.orderId}</strong> - ${order.orderDate}: ${order.items}
            </div>`
        ).join('');
        
        return `
        <div class="customer-preview-item" onclick="toggleCustomerOrders(${index})">
            <div>
                <div class="customer-name-preview">${customer.customerName}</div>
                <div class="customer-orders-preview">ID: ${customer.customerId}</div>
            </div>
            <div class="customer-orders-preview">${customer.orders.length} orders <span class="customer-expand-icon" id="customer-expand-${index}">▼</span></div>
        </div>
        <div class="customer-orders-details hidden" id="customer-orders-${index}">
            ${orderDetailsHtml}
        </div>
    `}).join('');
    
    document.getElementById('step-3').classList.remove('hidden');
    document.querySelector('.wizard-step[data-step="3"]').classList.add('completed');
}

// Toggle customer order details visibility
function toggleCustomerOrders(index) {
    const ordersContainer = document.getElementById(`customer-orders-${index}`);
    const expandIcon = document.getElementById(`customer-expand-${index}`);
    
    if (ordersContainer.classList.contains('hidden')) {
        ordersContainer.classList.remove('hidden');
        expandIcon.textContent = '▲';
    } else {
        ordersContainer.classList.add('hidden');
        expandIcon.textContent = '▼';
    }
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
    
    const prompt = `Write a highly personalized customer engagement email for a luxury bespoke tailoring business.

Customer Information:
- Name: ${customer.customerName}
- Customer ID: ${customer.customerId}
- Recent Purchase History:
${orderDetails}

Background context (use to inform the tone and suggestions, but DO NOT mention competitors or competitive analysis directly):
${appState.competitorInsights.substring(0, 500)}

Seasonal context (use naturally without explicitly citing as "trends"):
${appState.seasonalTrends.substring(0, 500)}

Create a warm, sophisticated email that:
- Opens with a genuine, personal touch that makes the customer feel valued
- References their specific past purchases naturally and thoughtfully
- Suggests relevant products or services that complement their previous purchases
- Weaves in timely seasonal or event-related context naturally (without saying "seasonal trends suggest...")
- Offers exclusive value that feels personalized to them
- Maintains an elegant, understated luxury tone befitting a high-end tailor
- Includes a clear but non-pushy call-to-action
- Avoids any mention of competitors, market analysis, or competitive research
- Does not use asterisks (*) or hashtags (#) anywhere in the text

Format:
Subject: [Compelling, personalized subject line]

[Email body - 200-250 words, warm and sophisticated]

Best regards,
${SENDER_NAME}
${COMPANY_NAME}`;

    const response = await callPerplexityAPI(prompt, `You are an expert email copywriter for luxury bespoke tailoring. Write elegant, highly personalized emails that feel like they come from a caring craftsman who knows the customer personally. Never use asterisks or hashtags in your writing. Always sign the email as "${SENDER_NAME}" from "${COMPANY_NAME}".`);
    
    // Clean the response of any asterisks or hashtags
    const cleanedResponse = cleanAIText(response);
    
    // Parse subject and body
    const lines = cleanedResponse.split('\n');
    let subject = 'Your Personalized Tailoring Update';
    let body = cleanedResponse;
    
    for (let j = 0; j < lines.length; j++) {
        if (lines[j].toLowerCase().startsWith('subject:')) {
            subject = lines[j].replace(/^subject:\s*/i, '').trim();
            body = lines.slice(j + 1).join('\n').trim();
            break;
        }
    }
    
    return {
        customer: customer,
        subject: cleanAIText(subject),
        body: cleanAIText(body),
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
        actions.innerHTML = '<div class="sent-status">Sent</div>';
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
    expandIcon.textContent = 'v';
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
    const emailItem = document.getElementById(`email-${index}`);
    const actions = emailItem.querySelector('.email-actions');
    
    // Show loading spinner
    const sendBtn = actions.querySelector('.send-btn');
    if (sendBtn) {
        sendBtn.innerHTML = '<span class="send-spinner"></span>';
        sendBtn.disabled = true;
    }
    
    // After 1 second, show "Sent" status
    setTimeout(() => {
        appState.emailDrafts[index].sent = true;
        
        actions.innerHTML = '<div class="sent-status">✓ Sent</div>';
        
        // Re-add expand icon
        const expandIcon = document.createElement('div');
        expandIcon.className = 'expand-icon';
        expandIcon.textContent = 'v';
        actions.appendChild(expandIcon);
    }, 1000);
}

// Perplexity API call function using Netlify serverless function
async function callPerplexityAPI(prompt, systemPrompt = 'You are a helpful assistant for a tailoring business in Singapore.') {
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
        const errorData = await response.json().catch(() => ({ error: 'Failed to parse error response from API' }));
        throw new Error(errorData.error || `API request failed with status ${response.status}. Please ensure the PERPLEXITY_API_KEY is configured.`);
    }

    const data = await response.json();
    return data.content;
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
        competitorInput: '',
        competitorInsights: '',
        seasonalTrends: '',
        location: 'Singapore',
        currentDate: appState.currentDate,
        customers: customerData,
        emailDrafts: []
    };
    
    // Reset competitor input
    document.getElementById('competitor-input').value = '';
    
    goToStep(1);
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Smooth scroll to tailored advice section
function scrollToTailoredAdvice(event) {
    event.preventDefault();
    const element = document.getElementById('tailored-advice-section');
    if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}
