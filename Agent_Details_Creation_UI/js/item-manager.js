// Item CRUD operations
class ItemManager {
    constructor(itemsContainer, progressTracker, dynamicContentManager) {
        this.itemsContainer = itemsContainer;
        this.progressTracker = progressTracker;
        this.dynamicContentManager = dynamicContentManager;
        this.itemCount = 0;
    }
    
    addNewItem(itemData = null) {
        this.itemCount++;
        const itemId = 'item-' + this.itemCount;
        
        const itemCard = document.createElement('div');
        itemCard.className = 'item-card fade-in';
        itemCard.id = itemId;
        
        itemCard.innerHTML = TEMPLATES.itemCard(itemId, this.itemCount);
        
        this.itemsContainer.appendChild(itemCard);
        
        // Add event listeners to new inputs
        itemCard.querySelectorAll('input, textarea').forEach(input => {
            input.addEventListener('input', () => this.progressTracker.updateProgress());
        });
        
        // Add event listeners for dynamic buttons
        this.dynamicContentManager.setupDynamicButtons(itemCard, itemId);
        
        // Scroll to the new item
        itemCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        
        // Update progress
        this.progressTracker.updateProgress();
        
        // Populate with data if provided
        if (itemData) {
            DataPopulator.populateItemData(itemCard, itemData);
        }
    }
    
    removeItem(itemId) {
        const itemToRemove = document.getElementById(itemId);
        
        UIUtils.animateItemRemoval(itemToRemove, () => {
            this.itemsContainer.removeChild(itemToRemove);
            // Renumber remaining items
            const items = this.itemsContainer.querySelectorAll('.item-card');
            items.forEach((item, index) => {
                item.querySelector('.item-number').textContent = index + 1;
            });
            this.itemCount = items.length;
            
            // Update progress
            this.progressTracker.updateProgress();
        });
    }
    
    resetItems() {
        this.itemsContainer.innerHTML = '';
        this.itemCount = 0;
        this.progressTracker.updateProgress();
    }
}
