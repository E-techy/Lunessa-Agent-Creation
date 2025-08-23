// Wait for everything to load
window.addEventListener('load', function() {
    console.log('Window loaded, initializing dashboard...');
    
    // Wait a bit more for libraries to load
    setTimeout(() => {
        // Check that Chart.js is available
        if (typeof Chart === 'undefined') {
            console.error('Chart.js not loaded, retrying...');
            setTimeout(() => initializeDashboard(), 1000);
            return;
        }
        
        initializeDashboard();
    }, 100);
});

function initializeDashboard() {
    console.log('Starting dashboard initialization...');

    window.agentDataReady.then((agent) => {
        try {
            populateAgentInfo(agent);
            populateServices(agent);
            populateReviews(agent);
            populateModificationHistory(agent);
            createActivityHeatmap(agent);

            // Wait a bit more before initializing charts
            setTimeout(() => {
                initializeCharts(agent);
                setupTimePeriodButtons();
            }, 200);

            console.log('Dashboard initialization complete');
        } catch (error) {
            console.error('Error initializing dashboard:', error);
        }
    }).catch((err) => {
        console.error("Failed to load agent data:", err);
    });
}