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
        const establishmentDate = new Date(entry.establishmentDate);
        const itemsCount = entry.items ? entry.items.length : 0;
        
        // Generate detailed items HTML with full information
        const itemsHTML = entry.items && entry.items.length > 0 ? 
            entry.items.map((item, itemIndex) => {
                // Find full item details from current items
                const fullItem = agent.agentBasicDetails.items.find(fullItemData => 
                    fullItemData.itemName === item.itemName && fullItemData.itemCode === item.itemCode
                );
                
                return `
                    <div class="history-item-entry">
                        <div class="item-header">
                            <div class="item-title">
                                <span class="item-name">${item.itemName}</span>
                                <span class="item-code">${item.itemCode}</span>
                            </div>
                            <button class="item-expand-btn" onclick="toggleItemDetails(${index}, ${itemIndex})">
                                <svg class="item-expand-icon" id="item-expand-icon-${index}-${itemIndex}" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <polyline points="6 9 12 15 18 9"></polyline>
                                </svg>
                            </button>
                        </div>
                        <div class="item-details" id="item-details-${index}-${itemIndex}" style="display: none;">
                            ${fullItem ? `
                                <div class="item-detail-section">
                                    <h5>Description:</h5>
                                    <p>${fullItem.itemInitialWorkingExplanation}</p>
                                </div>
                                <div class="item-detail-section">
                                    <h5>Process Steps:</h5>
                                    <ol>
                                        ${fullItem.itemRunningSteps.map(step => `<li>${step}</li>`).join('')}
                                    </ol>
                                </div>
                                <div class="item-detail-section">
                                    <h5>Common Problems & Solutions:</h5>
                                    <div class="problems-solutions">
                                        ${fullItem.commonProblemsSolutions.map(solution => `
                                            <div class="problem-solution-pair">
                                                <div class="problem">
                                                    <strong>Problem:</strong> ${solution.problem}
                                                </div>
                                                <div class="solution">
                                                    <strong>Solution:</strong> ${solution.solution}
                                                </div>
                                            </div>
                                        `).join('')}
                                    </div>
                                </div>
                            ` : `
                                <div class="item-detail-section">
                                    <p class="no-details">Detailed information not available for this item.</p>
                                </div>
                            `}
                        </div>
                    </div>
                `;
            }).join('') : '<div class="no-items">No items added in this modification</div>';
        
        return `
            <div class="history-item" data-entry-index="${index}">
                <div class="history-marker"></div>
                <div class="history-content">
                    <div class="history-header">
                        <h4>Modification #${index + 1}</h4>
                        <span class="history-date">${date.toLocaleDateString()} at ${date.toLocaleTimeString()}</span>
                    </div>
                    <div class="history-details">
                        <div class="company-info-grid">
                            <div class="history-detail-row">
                                <strong>🏢 Company Name</strong> 
                                <span>${entry.companyName}</span>
                            </div>
                            <div class="history-detail-row">
                                <strong>📅 Establishment Date</strong> 
                                <span>${establishmentDate.toLocaleDateString()}</span>
                            </div>
                            <div class="history-detail-row">
                                <strong>👤 Company Owner</strong> 
                                <span>${entry.companyOwnerName}</span>
                            </div>
                            <div class="history-detail-row">
                                <strong>📞 Service Number</strong> 
                                <span>${entry.companyHumanServiceNumber}</span>
                            </div>
                            <div class="history-detail-row">
                                <strong>✉️ Company Email</strong> 
                                <span>${entry.companyEmail}</span>
                            </div>
                        </div>
                        <div class="history-detail-row description-row">
                            <strong>📝 Description</strong> 
                            <span>${entry.companyDescription}</span>
                        </div>
                        <div class="history-items-section">
                            <div class="items-header" onclick="toggleHistoryItems(${index})">
                                <strong>Items (${itemsCount})</strong>
                                <svg class="expand-icon" id="expand-icon-${index}" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <polyline points="6 9 12 15 18 9"></polyline>
                                </svg>
                            </div>
                            <div class="items-content" id="items-content-${index}" style="display: none;">
                                ${itemsHTML}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}