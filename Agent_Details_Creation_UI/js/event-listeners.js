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
        
        // Remove item functionality (event delegation)
        this.itemManager.itemsContainer.addEventListener('click', (e) => {
            if (e.target.closest('.remove-item-btn')) {
                const button = e.target.closest('.remove-item-btn');
                const itemId = button.getAttribute('data-item');
                this.itemManager.removeItem(itemId);
            }
        });
        
        // Track form field changes (initial fields)
        document.querySelectorAll('input, textarea, select').forEach(input => {
            input.addEventListener('input', () => this.progressTracker.updateProgress());
        });
    }
}
