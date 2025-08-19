// Configuration and constants
const CONFIG = {
    ANIMATION_DELAY: 300,
    STAGGER_DELAY: 200,
    NOTIFICATION_DURATION: 5000,
    FORM_SUBMIT_DELAY: 2000,
    PROGRESS_UPDATE_DELAY: 500
};

const TEMPLATES = {
    stepInput: (itemId, stepCount) => `
        <input type="text" name="${itemId}-step-${stepCount}" placeholder="Step ${stepCount}: Enter implementation step" class="step-input">
        <button type="button" class="remove-step-btn">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
        </button>
    `,
    
    issueInput: (itemId, issueCount) => `
        <div class="issue-solution-row">
            <input type="text" name="${itemId}-issue-${issueCount}" placeholder="Issue ${issueCount}: Describe the problem" class="issue-input">
            <input type="text" name="${itemId}-solution-${issueCount}" placeholder="Solution ${issueCount}: Describe the solution" class="solution-input">
            <button type="button" class="remove-issue-btn">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
            </button>
        </div>
    `,
    
    itemCard: (itemId, itemCount) => `
        <button class="remove-item-btn" data-item="${itemId}">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
        </button>
        <div class="item-title">
            <span class="item-number">${itemCount}</span>
            <span>Product/Service Details</span>
        </div>
        <div class="form-grid">
            <div class="form-group">
                <label for="${itemId}-name">Item Name</label>
                <input type="text" id="${itemId}-name" name="${itemId}-name" placeholder="e.g., Enterprise Solution" required>
            </div>
            <div class="form-group">
                <label for="${itemId}-code">Item Code</label>
                <input type="text" id="${itemId}-code" name="${itemId}-code" placeholder="e.g., ES-2025" required>
            </div>
            <div class="form-group full-width">
                <label for="${itemId}-initial">Initial Working Explanation</label>
                <textarea id="${itemId}-initial" name="${itemId}-initial" placeholder="Describe how this product/service should function" required></textarea>
            </div>
            <div class="form-group full-width">
                <label for="${itemId}-steps">Implementation Steps</label>
                <div class="implementation-steps" id="${itemId}-steps-container">
                    <div class="step-input-group">
                        <input type="text" name="${itemId}-step-1" placeholder="Step 1: Enter implementation step" class="step-input">
                        <button type="button" class="remove-step-btn" style="display: none;">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        </button>
                    </div>
                </div>
                <button type="button" class="add-step-btn" data-item="${itemId}">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <line x1="12" y1="5" x2="12" y2="19"></line>
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                    </svg>
                    Add Step
                </button>
            </div>
            <div class="form-group full-width">
                <label for="${itemId}-issues">Common Issues & Solutions</label>
                <div class="issues-solutions" id="${itemId}-issues-container">
                    <div class="issue-solution-group">
                        <div class="issue-solution-row">
                            <input type="text" name="${itemId}-issue-1" placeholder="Issue 1: Describe the problem" class="issue-input">
                            <input type="text" name="${itemId}-solution-1" placeholder="Solution 1: Describe the solution" class="solution-input">
                            <button type="button" class="remove-issue-btn" style="display: none;">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <line x1="18" y1="6" x2="6" y2="18"></line>
                                    <line x1="6" y1="6" x2="18" y2="18"></line>
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
                <button type="button" class="add-issue-btn" data-item="${itemId}">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <line x1="12" y1="5" x2="12" y2="19"></line>
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                    </svg>
                    Add Issue & Solution
                </button>
            </div>
        </div>
    `
};

const ICONS = {
    success: '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline>',
    error: '<circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line>',
    loading: '<path d="M21 12a9 9 0 1 1-6.219-8.56"></path>'
};
