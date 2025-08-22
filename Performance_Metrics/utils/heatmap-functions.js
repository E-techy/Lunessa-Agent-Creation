// Activity heatmap functions
function createActivityHeatmap() {
    console.log('Creating activity heatmap...');
    filterHeatmapByTimePeriod('days'); // Initialize with days view
}

function generateActivityData() {
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