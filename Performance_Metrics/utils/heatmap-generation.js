function generateDailyHeatmap(logs) {
    const hourlyData = new Array(24).fill(0);
    const labels = [];
    
    // Generate hourly activity using actual log data
    logs.forEach(log => {
        const hour = new Date(log.timestamp).getHours();
        hourlyData[hour] = Math.min(4, hourlyData[hour] + 1);
    });
    
    // Create labels for all 24 hours
    for (let i = 0; i < 24; i++) {
        labels.push(`${i}:00`);
    }
    
    return { heatmapData: hourlyData, labels, cellCount: 24 };
}

function generateWeeklyHeatmap(logs) {
    const dailyData = new Array(7).fill(0); // 1 week = 7 days
    const labels = [];
    const now = new Date();
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
    // Generate daily activity for last 1 week only
    for (let i = 6; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(now.getDate() - i);
        const dayName = daysOfWeek[date.getDay()];
        const dayMonth = date.getDate();
        labels.push(`${dayName} ${dayMonth}`);
        
        const dayLogs = logs.filter(log => {
            const logDate = new Date(log.timestamp);
            return logDate.toDateString() === date.toDateString();
        });
        
        dailyData[6 - i] = Math.min(4, dayLogs.length);
    }
    
    return { heatmapData: dailyData, labels, cellCount: 7 };
}

function generateMonthlyHeatmap(logs) {
    const dailyData = new Array(31).fill(0); // Max days in a month
    const labels = [];
    const now = new Date();
    
    // Generate daily activity for current month
    const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    
    for (let i = 1; i <= daysInMonth; i++) {
        const date = new Date(now.getFullYear(), now.getMonth(), i);
        labels.push(date.toLocaleDateString('en-US', { day: 'numeric' }));
        
        const dayLogs = logs.filter(log => {
            const logDate = new Date(log.timestamp);
            return logDate.getDate() === i && logDate.getMonth() === now.getMonth();
        });
        
        dailyData[i - 1] = Math.min(4, dayLogs.length);
    }
    
    return { heatmapData: dailyData.slice(0, daysInMonth), labels, cellCount: daysInMonth };
}

function generateYearlyHeatmap(logs) {
    const monthlyData = new Array(12).fill(0);
    const labels = [];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                   'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    // Generate monthly activity
    for (let i = 0; i < 12; i++) {
        labels.push(months[i]);
        
        const monthLogs = logs.filter(log => {
            const logDate = new Date(log.timestamp);
            return logDate.getMonth() === i;
        });
        
        monthlyData[i] = Math.min(4, Math.floor(monthLogs.length / 2) || 0);
    }
    
    return { heatmapData: monthlyData, labels, cellCount: 12 };
}

function generateLifetimeHeatmap(logs) {
    const currentYear = new Date().getFullYear();
    
    // Get all unique years from logs and current year
    const logYears = new Set();
    logs.forEach(log => {
        const logYear = new Date(log.timestamp).getFullYear();
        logYears.add(logYear);
    });
    
    // Add current year if not present
    logYears.add(currentYear);
    
    // Convert to sorted array (most recent first)
    const sortedYears = Array.from(logYears).sort((a, b) => b - a);
    
    // Limit to maximum 10 years, starting from most recent
    const yearsToShow = sortedYears.slice(0, 10);
    
    const yearlyData = [];
    const labels = [];
    
    // Generate data for selected years (keep chronological order for display)
    yearsToShow.reverse().forEach(year => {
        labels.push(year.toString());
        
        const yearLogs = logs.filter(log => {
            const logDate = new Date(log.timestamp);
            return logDate.getFullYear() === year;
        });
        
        // Scale the activity level based on requests per year
        const requestsInYear = yearLogs.length;
        if (requestsInYear === 0) {
            yearlyData.push(0);
        } else if (requestsInYear <= 5) {
            yearlyData.push(1);
        } else if (requestsInYear <= 15) {
            yearlyData.push(2);
        } else if (requestsInYear <= 25) {
            yearlyData.push(3);
        } else {
            yearlyData.push(4);
        }
    });
    
    return { heatmapData: yearlyData, labels, cellCount: yearsToShow.length };
}

function showHeatmapCellDetails(label, level, period) {
    const activityMessages = {
        0: 'No activity',
        1: 'Low activity',
        2: 'Moderate activity', 
        3: 'High activity',
        4: 'Peak activity'
    };
    
    const periodDescriptions = {
        days: 'Hour',
        weeks: 'Day',
        months: 'Day',
        years: 'Month',
        lifetime: 'Period'
    };
    
    alert(`${periodDescriptions[period]}: ${label}\nActivity Level: ${activityMessages[level]}\nRequests: ${level > 0 ? Math.floor(level * 2.5) : 0}`);
}