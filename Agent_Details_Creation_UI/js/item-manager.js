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
    
    // Alias for addNewItem for compatibility
    addItem(itemData = null) {
        return this.addNewItem(itemData);
    }
    
    // Get all items data
    getItems() {
        const items = [];
        const itemCards = this.itemsContainer.querySelectorAll('.item-card');
        
        itemCards.forEach(card => {
            const itemId = card.id;
            const nameInput = card.querySelector(`input[name="${itemId}-name"]`);
            const descInput = card.querySelector(`textarea[name="${itemId}-initial"]`);
            const codeInput = card.querySelector(`input[name="${itemId}-code"]`);
            
            if (nameInput && nameInput.value.trim()) {
                // Collect implementation steps
                const implementationSteps = [];
                const stepInputs = card.querySelectorAll('input[name^="' + itemId + '-step-"]');
                stepInputs.forEach(stepInput => {
                    if (stepInput.value.trim()) {
                        implementationSteps.push(stepInput.value.trim());
                    }
                });
                
                // Collect issues and solutions
                const issuesAndSolutions = [];
                const issueInputs = card.querySelectorAll('input[name^="' + itemId + '-issue-"]');
                const solutionInputs = card.querySelectorAll('input[name^="' + itemId + '-solution-"]');
                
                issueInputs.forEach((issueInput, index) => {
                    const correspondingSolution = solutionInputs[index];
                    if (issueInput.value.trim() && correspondingSolution && correspondingSolution.value.trim()) {
                        issuesAndSolutions.push({
                            issue: issueInput.value.trim(),
                            solution: correspondingSolution.value.trim()
                        });
                    }
                });
                
                items.push({
                    name: nameInput.value.trim(),
                    description: descInput ? descInput.value.trim() : '',
                    itemCode: codeInput ? codeInput.value.trim() : '',
                    implementationSteps: implementationSteps,
                    issuesAndSolutions: issuesAndSolutions
                });
            }
        });
        
        return items;
    }
}
