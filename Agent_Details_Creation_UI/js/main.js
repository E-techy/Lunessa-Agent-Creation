// Main application entry point
document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
    const itemsContainer = document.getElementById('itemsContainer');
    const addItemBtn = document.getElementById('addItemBtn');
    const progressFill = document.querySelector('.progress-fill');
    const progressPercent = document.querySelector('.progress-percent');
    const importContainer = document.getElementById('importContainer');
    const fileInput = document.getElementById('fileInput');
    const form = document.getElementById('companyAgentForm');

    // Initialize core components
    const progressTracker = new ProgressTracker(progressFill, progressPercent);
    const dynamicContentManager = new DynamicContentManager(progressTracker);
    const itemManager = new ItemManager(itemsContainer, progressTracker, dynamicContentManager);
    const fileHandler = new FileHandler(importContainer, fileInput, itemManager);
    // const formController = new FormController(form, itemManager);
    // const eventListeners = new EventListeners(itemManager, fileHandler, formController, progressTracker);
    
    // Initialize navigation controller for agent management
    const navigationController = new NavigationController();

    // Initialize agent data and populate the list
    if (typeof agentDataManager !== 'undefined') {
        agentDataManager.populateAgentList();
        
        // Set up navigation button event listeners
        const yourAgentsBtn = document.getElementById('yourAgentsBtn');
        const createNewAgentBtn = document.getElementById('createNewAgentBtn');
        
        if (yourAgentsBtn) {
            yourAgentsBtn.addEventListener('click', () => {
                agentDataManager.switchToListView();
            });
        }
        
        if (createNewAgentBtn) {
            createNewAgentBtn.addEventListener('click', () => {
                agentDataManager.createNewAgent();
            });
        }
    }

    // Make components globally available
    window.progressTracker = progressTracker;
    window.ItemManager = itemManager;

    // Inject required styles
    UIUtils.injectStyles();

    // Initial progress update
    progressTracker.updateProgress();
    
    // Override form submission to handle agent saving
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Show loading state
            const submitBtn = form.querySelector('button[type="submit"]');
            // const originalText = submitBtn.innerHTML;
            // submitBtn.innerHTML = `
            //     <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="animate-spin" style="animation: spin 1s linear infinite; width: 16px; height: 16px; margin-right: 8px;">
            //         <path d="M21 12a9 9 0 11-6.219-8.56"/>
            //     </svg>
            //     Processing...
            // `;
            // submitBtn.disabled = true;
            
            // Collect form data
            const formData = new FormData(form);
            const agentData = {
                agentName: formData.get('agentName'),
                companyName: formData.get('companyName'),
                establishmentDate: formData.get('establishmentDate'),
                ownerName: formData.get('ownerName'),
                customerServiceNumber: formData.get('customerServiceNumber'),
                companyemail: formData.get('companyemail'),
                companyDescription: formData.get('companyDescription'),
                products: itemManager ? itemManager.getItems() : []
            };
            
            console.log('Form submission - collected agent data:', agentData);
            
            // Simulate processing delay
            setTimeout(() => {
                // Reset button state
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
                
                // Save agent data
                if (typeof agentDataManager !== 'undefined') {
                    const success = agentDataManager.saveAgent(agentData);
                    if (success) {
                        // Show success notification
                        const notification = document.createElement('div');
                        notification.innerHTML = `
                            <div style="position: fixed; bottom: 20px; right: 20px; background: var(--success); color: white; padding: 1rem 1.5rem; border-radius: var(--radius); box-shadow: var(--shadow-lg); display: flex; align-items: center; gap: 0.5rem; z-index: 1000; animation: fadeInUp 0.3s ease-out;">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width: 16px; height: 16px;">
                                    <polyline points="9 11 12 14 22 4"></polyline>
                                    <path d="M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9c1.45 0 2.81.34 4.02.94"></path>
                                </svg>
                                Agent details saved successfully!
                            </div>
                        `;
                        document.body.appendChild(notification);
                        
                        // Clear current editing state
                        agentDataManager.currentEditingAgent = null;
                        
                        // Reset form and items
                        form.reset();
                        if (itemManager) {
                            itemManager.resetItems();
                        }
                        
                        // Update progress
                        if (progressTracker) {
                            progressTracker.updateProgress();
                        }
                        
                        // Switch to list view
                        setTimeout(() => {
                            agentDataManager.switchToListView();
                        }, 1000);
                        
                        // Remove notification after delay
                        setTimeout(() => {
                            if (document.body.contains(notification)) {
                                notification.style.opacity = '0';
                                notification.style.transform = 'translateY(20px)';
                                notification.style.transition = 'all 0.3s ease';
                                setTimeout(() => {
                                    if (document.body.contains(notification)) {
                                        document.body.removeChild(notification);
                                    }
                                }, 300);
                            }
                        }, 3000);
                    }
                } else {
                    // Fallback behavior
                    alert('Agent data manager not available');
                }
            }, 1000); // 1 second delay to show processing state
        });
    }
});
