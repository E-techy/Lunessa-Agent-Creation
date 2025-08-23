// Activity heatmap functions
function createActivityHeatmap(agent) {
    console.log('Creating activity heatmap...');
    
    // Get the current period from the active button or default to 'days'
    const currentPeriod = currentTimePeriods.activityHeatmap || 'days';
    
    // Initialize heatmap with the current selected period
    filterHeatmapByTimePeriod(currentPeriod, agent);
}

// Enhanced refresh function that works with the existing filtering system
function refreshActivityHeatmap(agent) {
    console.log('Refreshing activity heatmap with updated data...');
    
    // Get the currently active time period
    const activeBtn = document.querySelector(
        `.time-period-buttons button.active[data-chart="activityHeatmap"]`
    );
    const currentPeriod = activeBtn ? activeBtn.dataset.period : 'days';
    
    // Update the current period in global state
    currentTimePeriods.activityHeatmap = currentPeriod;
    
    // Re-render the heatmap with the same period but fresh data
    filterHeatmapByTimePeriod(currentPeriod, agent);
    
    console.log(`✅ Activity heatmap refreshed with period: ${currentPeriod}`);
}

// Helper function to validate heatmap data structure
function validateHeatmapData(agent) {
    if (!agent) {
        console.error('❌ No agent data provided for heatmap');
        return false;
    }
    
    if (!agent.requestHandledLogs || !Array.isArray(agent.requestHandledLogs)) {
        console.warn('⚠️ No requestHandledLogs found or invalid format');
        return false;
    }
    
    return true;
}

// Enhanced heatmap creation with error handling
function createActivityHeatmapSafe(agent) {
    console.log('Creating activity heatmap with safety checks...');
    
    if (!validateHeatmapData(agent)) {
        // Create empty heatmap if no data
        const heatmapContainer = document.getElementById('activityHeatmap');
        const heatmapTitle = document.getElementById('heatmapTitle');
        const heatmapInfo = document.getElementById('heatmapInfo');
        
        if (heatmapContainer) {
            heatmapContainer.innerHTML = '<div class="no-data-message">No activity data available</div>';
        }
        if (heatmapTitle) {
            heatmapTitle.textContent = 'Activity Heatmap - No Data';
        }
        if (heatmapInfo) {
            heatmapInfo.textContent = 'No request handling logs found for this agent';
        }
        return;
    }
    
    // Proceed with normal heatmap creation
    createActivityHeatmap(agent);
}

function generateActivityData(agent) {
    // Generate activity data based on actual request timestamps
    const activity = new Array(24).fill(0);
    
    agent.requestHandledLogs.forEach(log => {
        const hour = new Date(log.timestamp).getHours();
        activity[hour] = Math.min(4, activity[hour] + 1);
    });

    return activity;
}

function showActivityDetails(hour, level) {
    const activityMessages = {
        0: 'No activity',
        1: 'Low activity',
        2: 'Moderate activity', 
        3: 'High activity',
        4: 'Peak activity'
    };

    const requestsAtHour = agent.requestHandledLogs.filter(log => {
        return new Date(log.timestamp).getHours() === hour;
    }).length;

    alert(`Hour ${hour}:00\nActivity Level: ${activityMessages[level]}\nRequests Handled: ${requestsAtHour}`);
}