function populateAgentInfo() {
    console.log('Populating agent info...');
    const details = agent.agentBasicDetails;
    
    // Update agent profile
    const agentNameEl = document.getElementById('agentName');
    const agentIdEl = document.getElementById('agentId');
    const companyNameEl = document.getElementById('companyName');
    const companyOwnerEl = document.getElementById('companyOwner');
    const companyEmailEl = document.getElementById('companyEmail');
    const companyPhoneEl = document.getElementById('companyPhone');
    const establishmentDateEl = document.getElementById('establishmentDate');
    const totalRequestsEl = document.getElementById('totalRequests');
    const satisfactionRateEl = document.getElementById('satisfactionRate');
    const availableTokensEl = document.getElementById('availableTokens');
    const totalTokensEl = document.getElementById('totalTokens');
    const agentInitialsEl = document.getElementById('agentInitials');

    if (agentNameEl) agentNameEl.textContent = details.agentName;
    if (agentIdEl) agentIdEl.textContent = details.agentId;
    if (companyNameEl) companyNameEl.textContent = details.companyName;
    if (companyOwnerEl) companyOwnerEl.textContent = `Owner: ${details.companyOwnerName}`;
    if (companyEmailEl) companyEmailEl.textContent = details.companyEmail;
    if (companyPhoneEl) companyPhoneEl.textContent = `📞 ${details.companyHumanServiceNumber}`;
    
    // Format establishment date
    const establishmentDate = new Date(details.establishmentDate);
    if (establishmentDateEl) establishmentDateEl.textContent = `Established: ${establishmentDate.toLocaleDateString()}`;
    
    // Update metrics
    if (totalRequestsEl) totalRequestsEl.textContent = agent.totalRequestsHandled;
    if (satisfactionRateEl) satisfactionRateEl.textContent = agent.satisfactionRate;
    if (availableTokensEl) availableTokensEl.textContent = details.availableTokens;
    
    // Calculate total tokens used
    const totalTokensUsed = agent.usageLogs.reduce((sum, log) => sum + log.tokensUsed, 0);
    if (totalTokensEl) totalTokensEl.textContent = totalTokensUsed;
    
    // Update agent initials
    const initials = details.agentName.split(' ').map(name => name[0]).join('').toUpperCase();
    if (agentInitialsEl) agentInitialsEl.textContent = initials;
}

function populateServices() {
    console.log('Populating services...');
    const servicesGrid = document.getElementById('servicesGrid');
    if (!servicesGrid) return;
    
    const services = agent.agentBasicDetails.items;
    
    servicesGrid.innerHTML = services.map(service => `
        <div class="service-card">
            <div class="service-header">
                <h3>${service.itemName}</h3>
                <span class="service-code">${service.itemCode}</span>
            </div>
            <p class="service-description">${service.itemInitialWorkingExplanation}</p>
            
            <div class="service-steps">
                <h4>Process Steps:</h4>
                <ul>
                    ${service.itemRunningSteps.map(step => `<li>${step}</li>`).join('')}
                </ul>
            </div>
            
            <div class="common-problems">
                <h4>Common Solutions:</h4>
                ${service.commonProblemsSolutions.map(solution => `
                    <div class="problem-solution">
                        <strong>Problem:</strong> ${solution.problem}<br>
                        <strong>Solution:</strong> ${solution.solution}
                    </div>
                `).join('')}
            </div>
        </div>
    `).join('');
}

function populateReviews() {
    console.log('Populating reviews...');
    const reviewsGrid = document.getElementById('reviewsGrid');
    if (!reviewsGrid) return;
    
    const reviews = agent.customerReviews;
    
    reviewsGrid.innerHTML = reviews.map(review => {
        const date = new Date(review.timestamp);
        const stars = '★'.repeat(review.reviewStar) + '☆'.repeat(5 - review.reviewStar);
        
        return `
            <div class="review-card">
                <div class="review-header">
                    <div class="reviewer-info">
                        <div class="reviewer-avatar">${review.username[0]}</div>
                        <span class="reviewer-name">${review.username}</span>
                    </div>
                    <div class="review-rating">
                        <span class="stars">${stars}</span>
                        <span class="rating-number">${review.reviewStar}/5</span>
                    </div>
                </div>
                <p class="review-comment">${review.comment}</p>
                <span class="review-date">${date.toLocaleDateString()} at ${date.toLocaleTimeString()}</span>
            </div>
        `;
    }).join('');
}

function populateModificationHistory() {
    console.log('Populating modification history...');
    const historyTimeline = document.getElementById('historyTimeline');
    if (!historyTimeline) return;
    
    const history = agent.agentBasicDetails.modificationHistory;
    
    historyTimeline.innerHTML = history.map((entry, index) => {
        const date = new Date(entry.timestamp);
        const itemsCount = entry.items ? entry.items.length : 0;
        
        return `
            <div class="history-item">
                <div class="history-marker"></div>
                <div class="history-content">
                    <div class="history-header">
                        <h4>System Update #${index + 1}</h4>
                        <span class="history-date">${date.toLocaleDateString()} ${date.toLocaleTimeString()}</span>
                    </div>
                    <div class="history-details">
                        <p><strong>Company:</strong> ${entry.companyName}</p>
                        <p><strong>Owner:</strong> ${entry.companyOwnerName}</p>
                        <p><strong>Services Added:</strong> ${itemsCount} item(s)</p>
                        <p><strong>Description:</strong> ${entry.companyDescription}</p>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}