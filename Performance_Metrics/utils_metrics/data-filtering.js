function filterRequestData(period, now, agent) {
    let requestLogs = agent.requestHandledLogs;
    let filteredLogs = filterLogsByPeriod(requestLogs, period, now,agent);
    
    if (period === 'days' || period === 'lifetime') {
        // Hourly distribution
        const hourlyData = {};
        filteredLogs.forEach(log => {
            const hour = new Date(log.timestamp).getHours();
            hourlyData[hour] = (hourlyData[hour] || 0) + 1;
        });
        
        const labels = Array.from({length: 24}, (_, i) => `${i}:00`);
        const data = labels.map((_, i) => hourlyData[i] || 0);
        
        return { filteredData: data, filteredLabels: labels };
    } else {
        // Group by time period
        const groupedData = groupDataByPeriod(filteredLogs, period, agent);
        const labels = Object.keys(groupedData).sort();
        const data = labels.map(label => groupedData[label]);
        
        return { filteredData: data, filteredLabels: labels };
    }
}

function filterTokenData(period, now, agent) {
    const usageLogs = agent.usageLogs;
    let filteredLogs = filterLogsByPeriod(usageLogs, period, now, agent);
    
    // Create cumulative data
    let cumulative = 0;
    const labels = [];
    const data = [];
    
    filteredLogs.forEach((log, index) => {
        cumulative += log.tokensUsed;
        labels.push(getPeriodLabel(period, index, new Date(log.timestamp), agent));
        data.push(cumulative);
    });
    
    return { filteredData: data, filteredLabels: labels };
}

function filterSatisfactionData(period, now, agent) {
    const satisfactionLogs = agent.satisfactionRateLogs;
    let filteredLogs = filterLogsByPeriod(satisfactionLogs, period, now, agent);
    
    const labels = filteredLogs.map((log, index) => 
        getPeriodLabel(period, index, new Date(log.timestamp), agent));
    const data = filteredLogs.map(log => log.reviewStar);
    
    return { filteredData: data, filteredLabels: labels };
}

function filterRatingData(period, now, agent) {
    const reviews = agent.customerReviews;
    let filteredReviews = filterLogsByPeriod(reviews, period, now, agent);
    
    // Count ratings
    const ratingCount = {1: 0, 2: 0, 3: 0, 4: 0, 5: 0};
    filteredReviews.forEach(review => {
        ratingCount[review.reviewStar]++;
    });
    
    const labels = ['1 Star', '2 Stars', '3 Stars', '4 Stars', '5 Stars'];
    const data = Object.values(ratingCount);
    
    return { filteredData: data, filteredLabels: labels };
}

function filterTokenPerRequestData(period, now, agent) {
    const usageLogs = agent.usageLogs;
    let filteredLogs = filterLogsByPeriod(usageLogs, period, now, agent);
    
    const labels = filteredLogs.map((log, index) => 
        getPeriodLabel(period, index, new Date(log.timestamp), agent));
    const data = filteredLogs.map(log => log.tokensUsed);
    
    return { filteredData: data, filteredLabels: labels };
}