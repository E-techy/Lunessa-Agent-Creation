function filterLogsByPeriod(logs, period, now) {
    if (period === 'lifetime') {
        return logs;
    }
    
    const periodMs = getPeriodMilliseconds(period);
    const cutoffTime = new Date(now.getTime() - periodMs);
    
    return logs.filter(log => {
        const logTime = new Date(log.timestamp);
        return logTime >= cutoffTime;
    });
}

function getPeriodMilliseconds(period) {
    const msPerDay = 24 * 60 * 60 * 1000;
    
    switch(period) {
        case 'days': return 7 * msPerDay; // Last 7 days
        case 'weeks': return 4 * 7 * msPerDay; // Last 4 weeks
        case 'months': return 12 * 30 * msPerDay; // Last 12 months (approx)
        case 'years': return 5 * 365 * msPerDay; // Last 5 years
        default: return 7 * msPerDay;
    }
}

function groupDataByPeriod(logs, period) {
    const grouped = {};
    
    logs.forEach(log => {
        const date = new Date(log.timestamp);
        let key;
        
        switch(period) {
            case 'days':
                key = date.toLocaleDateString();
                break;
            case 'weeks':
                const weekStart = new Date(date);
                weekStart.setDate(date.getDate() - date.getDay());
                key = `Week of ${weekStart.toLocaleDateString()}`;
                break;
            case 'months':
                key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
                break;
            case 'years':
                key = String(date.getFullYear());
                break;
            default:
                key = date.toLocaleDateString();
        }
        
        grouped[key] = (grouped[key] || 0) + 1;
    });
    
    return grouped;
}

function getPeriodLabel(period, index, date) {
    switch(period) {
        case 'days':
            return date.toLocaleDateString();
        case 'weeks':
            return `Week ${Math.ceil((index + 1) / 7)}`;
        case 'months':
            return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
        case 'years':
            return String(date.getFullYear());
        case 'lifetime':
            return `Entry ${index + 1}`;
        default:
            return `Entry ${index + 1}`;
    }
}