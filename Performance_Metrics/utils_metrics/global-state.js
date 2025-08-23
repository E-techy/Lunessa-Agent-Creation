// Store chart instances globally
let chartInstances = {};

// Current time period filter for each chart
let currentTimePeriods = {
    requestChart: 'days',
    tokenChart: 'days',
    satisfactionChart: 'days',
    ratingChart: 'days',
    tokenPerRequestChart: 'days',
    activityHeatmap: 'days'
};

// Global function to toggle items visibility in modification history
function toggleHistoryItems(index) {
    const itemsContent = document.getElementById(`items-content-${index}`);
    const expandIcon = document.getElementById(`expand-icon-${index}`);
    
    if (itemsContent && expandIcon) {
        const isVisible = itemsContent.style.display !== 'none';
        itemsContent.style.display = isVisible ? 'none' : 'block';
        expandIcon.style.transform = isVisible ? 'rotate(0deg)' : 'rotate(180deg)';
    }
}

// Global function to toggle individual item details in modification history
function toggleItemDetails(historyIndex, itemIndex) {
    const itemDetails = document.getElementById(`item-details-${historyIndex}-${itemIndex}`);
    const expandIcon = document.getElementById(`item-expand-icon-${historyIndex}-${itemIndex}`);
    
    if (itemDetails && expandIcon) {
        const isVisible = itemDetails.style.display !== 'none';
        itemDetails.style.display = isVisible ? 'none' : 'block';
        expandIcon.style.transform = isVisible ? 'rotate(0deg)' : 'rotate(180deg)';
    }
}