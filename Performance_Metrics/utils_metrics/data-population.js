// ============================================================
// Utility: Capitalize first letter of each word
// ============================================================
function capitalizeFirstLetter(str) {
    if (!str) return str;
    return str
        .split(" ")
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(" ");
}

// ============================================================
// Agent Info
// ============================================================
function populateAgentInfo(agent) {
    const details = agent.agentBasicDetails;
    const get = id => document.getElementById(id);

    const agentNameEl = get("agentName");
    const agentIdEl = get("agentId");
    const agentInitialsEl = get("agentInitials");
    const agentNameDisplayEl = get("agentNameDisplay");
    const agentIdDisplayEl = get("agentIdDisplay");
    const establishmentDateEl = get("establishmentDate");
    const companyNameEl = get("companyName");
    const companyOwnerNameEl = get("companyOwnerName");
    const companyEmailEl = get("companyEmail");
    const companyHumanServiceNumberEl = get("companyHumanServiceNumber");
    const totalRequestsEl = get("totalRequests");
    const satisfactionRateEl = get("satisfactionRate");
    const availableTokensEl = get("availableTokens");
    const totalTokensEl = get("totalTokens");
    const servicesCountEl = get("servicesCount");

    if (agentNameEl) agentNameEl.textContent = capitalizeFirstLetter(details.agentName);
    if (agentIdEl) agentIdEl.textContent = details.agentId;

    if (agentInitialsEl)
        agentInitialsEl.textContent = details.agentName
            .split(" ")
            .map(n => n[0])
            .join("")
            .toUpperCase();

    if (agentNameDisplayEl) agentNameDisplayEl.textContent = capitalizeFirstLetter(details.agentName);
    if (agentIdDisplayEl) agentIdDisplayEl.textContent = details.agentId;

    if (establishmentDateEl) {
        const estDate = new Date(details.establishmentDate);
        establishmentDateEl.textContent = estDate.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    }

    if (companyNameEl) companyNameEl.textContent = details.companyName;
    if (companyOwnerNameEl) companyOwnerNameEl.textContent = capitalizeFirstLetter(details.companyOwnerName);
    if (companyEmailEl) companyEmailEl.textContent = details.companyEmail;
    if (companyHumanServiceNumberEl) companyHumanServiceNumberEl.textContent = details.companyHumanServiceNumber;

    if (totalRequestsEl) totalRequestsEl.textContent = agent.totalRequestsHandled;

    if (satisfactionRateEl) {
        const satisfactionCard = satisfactionRateEl.closest(".metric-card");
        if (satisfactionCard) {
            const rate = parseFloat(agent.satisfactionRate);
            satisfactionRateEl.textContent = rate + "%";
            satisfactionCard.classList.remove(
                "satisfaction-red",
                "satisfaction-yellow",
                "satisfaction-orange",
                "satisfaction-green"
            );
            if (rate < 25) satisfactionCard.classList.add("satisfaction-red");
            else if (rate < 50) satisfactionCard.classList.add("satisfaction-yellow");
            else if (rate <= 80) satisfactionCard.classList.add("satisfaction-orange");
            else satisfactionCard.classList.add("satisfaction-green");
        }
    }

    if (availableTokensEl) availableTokensEl.textContent = details.availableTokens;

    const totalUsed = agent.usageLogs.reduce((sum, log) => sum + log.tokensUsed, 0);
    if (totalTokensEl) totalTokensEl.textContent = totalUsed;

    const count = agent.agentBasicDetails.items ? agent.agentBasicDetails.items.length : 0;
    if (servicesCountEl) servicesCountEl.textContent = count;
}

// ============================================================
// Services
// ============================================================
function populateServices(agent) {
    const grid = document.getElementById("servicesGrid");
    if (!grid) return;
    const services = agent.agentBasicDetails.items || [];

    grid.innerHTML = services
        .map(
            s => `
        <div class="service-card">
            <div class="service-header">
                <h3>${s.itemName}</h3>
                <span class="service-code">${s.itemCode}</span>
            </div>
            <p class="service-description">${s.itemInitialWorkingExplanation}</p>
            <div class="service-steps">
                <h4>Process Steps:</h4>
                <ul>${s.itemRunningSteps.map(step => `<li>${step}</li>`).join("")}</ul>
            </div>
            <div class="common-problems">
                <h4>Common Solutions:</h4>
                ${s.commonProblemsSolutions
                    .map(
                        sol => `
                    <div class="problem-solution">
                        <strong>Problem:</strong> ${sol.problem}<br>
                        <strong>Solution:</strong> ${sol.solution}
                    </div>`
                    )
                    .join("")}
            </div>
        </div>`
        )
        .join("");
}

// ============================================================
// Reviews Pagination (16 per batch, 4x4 grid)
// ============================================================

let currentReviewIndex = 0;
const REVIEWS_PER_PAGE = 16;
let currentReviewsData = [];

function populateReviews(agent) {
    currentReviewsData = agent.customerReviews || [];
    renderReviewBatch(0);

    const loadMoreBtn = document.getElementById("loadMoreReviewsBtn");

    if (loadMoreBtn) {
        loadMoreBtn.onclick = function () {
            const nextIndex = currentReviewIndex + REVIEWS_PER_PAGE;

            if (nextIndex >= currentReviewsData.length) {
                loadMoreBtn.disabled = true;
                loadMoreBtn.textContent = "No More Reviews";
                return;
            }

            renderReviewBatch(nextIndex);
        };
    }
}

function renderReviewBatch(startIndex) {
    const grid = document.getElementById("reviewsGrid");
    if (!grid) return;

    const endIndex = Math.min(startIndex + REVIEWS_PER_PAGE, currentReviewsData.length);
    const batch = currentReviewsData.slice(startIndex, endIndex);

    currentReviewIndex = startIndex;

    grid.innerHTML = batch
        .map(review => {
            const date = new Date(review.timestamp);
            const stars = "★".repeat(review.reviewStar) + "☆".repeat(5 - review.reviewStar);

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
        })
        .join("");
}


// ============================================================
// Modification History (Compact Grid + Real Data + Pagination)
// ============================================================
let currentHistoryIndex = 0;
const ITEMS_PER_PAGE = 9;
let currentExpandedIndex = null;
let currentHistoryData = [];

function populateModificationHistory(agent) {
    const container = document.getElementById("historyTimeline");
    if (!container) return;

    currentHistoryData = agent.agentBasicDetails.modificationHistory || [];
    renderHistoryBatch(container, currentHistoryData, 0);

    const loadMoreBtn = document.getElementById("loadMoreHistoryBtn");
    const backBtn = document.getElementById("backHistoryBtn");

    if (loadMoreBtn && backBtn) {
        loadMoreBtn.onclick = function () {
            const next = currentHistoryIndex + ITEMS_PER_PAGE;
            if (next >= currentHistoryData.length) {
                loadMoreBtn.disabled = true;
                loadMoreBtn.textContent = "NO MORE RECORDS";
                return;
            }
            renderHistoryBatch(container, currentHistoryData, next);
            backBtn.style.display = "inline-flex";
        };

        backBtn.onclick = function () {
            const prev = currentHistoryIndex - ITEMS_PER_PAGE;
            if (prev < 0) return;
            renderHistoryBatch(container, currentHistoryData, prev);
            loadMoreBtn.textContent = "Load More History";
            loadMoreBtn.disabled = false;
            if (prev === 0) backBtn.style.display = "none";
        };
    }
}

function renderHistoryBatch(container, history, startIndex) {
    const end = Math.min(startIndex + ITEMS_PER_PAGE, history.length);
    const batch = history.slice(startIndex, end);
    currentHistoryIndex = startIndex;

    container.innerHTML = `
        <div class="history-grid">
            ${batch
                .map((entry, i) => {
                    const idx = startIndex + i;
                    const d = new Date(entry.timestamp);
                    return `
                    <div class="history-card" id="mod-card-${idx}">
                        <div class="card-header">
                            <span class="mod-title">Modification #${idx + 1}</span>
                            <span class="mod-date">${d.toLocaleDateString()} ${d.toLocaleTimeString()}</span>
                            <button class="mod-expand-btn" onclick="toggleModificationDetails(${idx})">
                                <svg class="mod-expand-icon" id="mod-expand-icon-${idx}" width="14" height="14"
                                    viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                    stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <polyline points="6 9 12 15 18 9"></polyline>
                                </svg>
                            </button>
                        </div>
                    </div>`;
                })
                .join("")}
        </div>`;
}

function toggleModificationDetails(index) {
    const container = document.querySelector(".history-grid");
    const existing = document.getElementById("expanded-details");
    if (existing) existing.remove();
    if (currentExpandedIndex === index) {
        currentExpandedIndex = null;
        return;
    }

    const entry = currentHistoryData[index];
    const cards = Array.from(container.querySelectorAll(".history-card"));
    const groupStart = Math.floor(index / 3) * 3;
    const groupEnd = Math.min(groupStart + 2, cards.length - 1);
    const target = cards[groupEnd];

    const expanded = document.createElement("div");
    expanded.id = "expanded-details";
    expanded.className = "expanded-mod-details";

    // Real items HTML
    const itemsHTML = entry.items
        ? entry.items
              .map(
                  item => `
        <div class="mod-item">
            <h4>${item.itemName} <span class="code">(${item.itemCode})</span></h4>
            <p class="item-desc">${item.itemInitialWorkingExplanation}</p>
            <div class="item-steps">
                <h5>Process Steps:</h5>
                <ol>${item.itemRunningSteps.map(s => `<li>${s}</li>`).join("")}</ol>
            </div>
            <div class="item-problems">
                <h5>Common Problems & Solutions:</h5>
                ${item.commonProblemsSolutions
                    .map(
                        p => `
                    <div class="problem-solution">
                        <strong>Problem:</strong> ${p.problem}<br>
                        <strong>Solution:</strong> ${p.solution}
                    </div>`
                    )
                    .join("")}
            </div>
        </div>`
              )
              .join("")
        : "<p>No items in this modification.</p>";

    expanded.innerHTML = `
        <div class="expanded-content">
            <div class="expanded-header">
                <h3>${entry.companyName}</h3>
                <p><strong>Owner:</strong> ${entry.companyOwnerName}</p>
                <p><strong>Email:</strong> ${entry.companyEmail}</p>
                <p><strong>Service No:</strong> ${entry.companyHumanServiceNumber}</p>
                <p><strong>Description:</strong> ${entry.companyDescription}</p>
            </div>
            <div class="expanded-items">${itemsHTML}</div>
        </div>`;

    target.insertAdjacentElement("afterend", expanded);
    currentExpandedIndex = index;
}
