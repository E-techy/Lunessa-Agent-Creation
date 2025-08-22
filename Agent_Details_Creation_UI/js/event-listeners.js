// Event listeners and initialization
class EventListeners {
    constructor(itemManager, fileHandler, formController, progressTracker) {
        this.itemManager = itemManager;
        this.fileHandler = fileHandler;
        this.formController = formController;
        this.progressTracker = progressTracker;
        this.setupEventListeners();
    }
    
    setupEventListeners() {
        // Manual add item button
        const addManualBtn = document.getElementById('addManualBtn');
        if (addManualBtn) {
            addManualBtn.addEventListener('click', () => {
                this.itemManager.addNewItem();
                UIUtils.showNotification('✓ New product/service item added successfully!', 'success');
            });
        }
        
        // Remove item functionality (event delegation) - FIXED VERSION
        this.itemManager.itemsContainer.addEventListener('click', (e) => {
            if (e.target.closest('.remove-item-btn')) {
                // Prevent any form submission or automatic save
                e.preventDefault();
                e.stopPropagation();
                e.stopImmediatePropagation();
                
                const button = e.target.closest('.remove-item-btn');
                const itemId = button.getAttribute('data-item');
                
                // Check if we're in edit mode
                const isEditMode = window.agentDataManager && window.agentDataManager.currentEditingAgent;
                
                if (isEditMode) {
                    // In edit mode: Only remove locally, don't save, don't refresh
                    console.log('Edit Mode: Removing item locally without saving');
                    if (confirm('Remove this item? (Changes will NOT be saved until you click "Save Changes")')) {
                        // Set flag to prevent automatic saves
                        window.isRemovingItem = true;
                        
                        this.removeItemLocallyOnly(itemId);
                        UIUtils.showNotification('✓ Item removed locally. Click "Save Changes" to save.', 'warning');
                        
                        // Clear flag after a short delay
                        setTimeout(() => {
                            window.isRemovingItem = false;
                        }, 1000);
                    }
                } else {
                    // In create mode: Normal remove behavior
                    if (confirm('Are you sure you want to remove this item?')) {
                        this.itemManager.removeItem(itemId);
                        UIUtils.showNotification('✓ Item removed', 'success');
                    }
                }
                
                // Return false to prevent any further event processing
                return false;
            }
        });
        
        // Track form field changes (initial fields)
        this.setupProgressTracking();
        
        // Set up observer for dynamically added fields
        this.setupDynamicFieldObserver();
    }
    
    // Set up progress tracking for all form fields
    setupProgressTracking() {
        const updateProgress = () => {
            if (this.progressTracker && !window.isRemovingItem) {
                this.progressTracker.updateProgress();
            }
        };
        
        // Add listeners to existing form fields
        document.querySelectorAll('input, textarea, select').forEach(input => {
            // Skip file inputs and readonly fields
            if (input.type !== 'file' && !input.readOnly) {
                input.addEventListener('input', updateProgress);
                input.addEventListener('change', updateProgress);
            }
        });
        
        console.log('✅ Progress tracking setup for existing fields');
    }
    
    // Set up observer for dynamically added fields
    setupDynamicFieldObserver() {
        const updateProgress = () => {
            if (this.progressTracker && !window.isRemovingItem) {
                this.progressTracker.updateProgress();
            }
        };
        
        // Create a mutation observer to watch for new form fields
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            // Find any input, textarea, or select elements in the added node
                            const newFields = node.querySelectorAll ? 
                                node.querySelectorAll('input, textarea, select') : [];
                            
                            newFields.forEach(field => {
                                if (field.type !== 'file' && !field.readOnly) {
                                    field.addEventListener('input', updateProgress);
                                    field.addEventListener('change', updateProgress);
                                }
                            });
                            
                            // Also check if the node itself is a form field
                            if ((node.tagName === 'INPUT' || node.tagName === 'TEXTAREA' || node.tagName === 'SELECT') 
                                && node.type !== 'file' && !node.readOnly) {
                                node.addEventListener('input', updateProgress);
                                node.addEventListener('change', updateProgress);
                            }
                        }
                    });
                }
            });
        });
        
        // Start observing the entire form container
        const formContainer = document.getElementById('company-form') || document.body;
        observer.observe(formContainer, {
            childList: true,
            subtree: true
        });
        
        console.log('✅ Dynamic field observer setup');
    }
    
    // New method: Remove item locally only (no save, no refresh)
    removeItemLocallyOnly(itemId) {
        const itemToRemove = document.getElementById(itemId);
        
        if (!itemToRemove) {
            console.error('Item not found:', itemId);
            return;
        }
        
        console.log(`🗑️ Removing item ${itemId} locally (no save, no refresh)`);
        
        // Use the same UI animation but prevent any save operations
        UIUtils.animateItemRemoval(itemToRemove, () => {
            // Remove the item from DOM
            this.itemManager.itemsContainer.removeChild(itemToRemove);
            
            // Renumber remaining items
            const items = this.itemManager.itemsContainer.querySelectorAll('.item-card');
            items.forEach((item, index) => {
                const itemNumberElement = item.querySelector('.item-number');
                if (itemNumberElement) {
                    itemNumberElement.textContent = index + 1;
                }
            });
            
            // Update item count
            this.itemManager.itemCount = items.length;
            
            // Update progress tracker after a short delay (but don't trigger any saves)
            setTimeout(() => {
                if (this.progressTracker) {
                    this.progressTracker.updateProgress();
                }
            }, 100);
            
            console.log(`✅ Item ${itemId} removed locally. Changes NOT saved. Click "Save Changes" to persist.`);
        });
    }
}
