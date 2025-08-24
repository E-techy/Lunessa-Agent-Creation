function filterLogsByPeriod(logs, period, now, agent) {
    if (period === 'lifetime') {
        return logs; // Show all logs
    }

    const { start, end } = getPeriodRange(period, now);

    return logs.filter(log => {
        const logTime = new Date(log.timestamp);
        return logTime >= start && logTime <= end;
    });
}

function getPeriodRange(period, now) {
    const start = new Date(now);
    let end = new Date(now);

    switch (period) {
        case 'days': // Today only
            start.setHours(0, 0, 0, 0);
            break;

        case 'weeks': // Current week (Sun → Sat)
            start.setDate(now.getDate() - now.getDay());
            start.setHours(0, 0, 0, 0);
            end = new Date(start);
            end.setDate(start.getDate() + 6);
            end.setHours(23, 59, 59, 999);
            break;

        case 'months': // Current month
            start.setDate(1);
            start.setHours(0, 0, 0, 0);
            end = new Date(start.getFullYear(), start.getMonth() + 1, 0, 23, 59, 59, 999);
            break;

        case 'years': // Current year
            start.setMonth(0, 1);
            start.setHours(0, 0, 0, 0);
            end = new Date(start.getFullYear(), 11, 31, 23, 59, 59, 999);
            break;

        default: // fallback = today
            start.setHours(0, 0, 0, 0);
    }

    return { start, end };
}

function groupDataByPeriod(logs, period, agent) {
    const grouped = {};

    logs.forEach(log => {
        const date = new Date(log.timestamp);
        let key;

        switch (period) {
            case 'days':
                key = `${date.getHours()}:00`; // group by hour
                break;
            case 'weeks':
                key = date.toLocaleDateString('en-US', { weekday: 'short' });
                break;
            case 'months':
                key = date.getDate().toString(); // group by day number
                break;
            case 'years':
                key = date.toLocaleDateString('en-US', { month: 'short' });
                break;
            case 'lifetime':
                key = date.getFullYear().toString();
                break;
            default:
                key = date.toLocaleDateString();
        }

        grouped[key] = (grouped[key] || 0) + 1;
    });

    return grouped;
}

function getPeriodLabel(period, index, date, agent) {
    switch (period) {
        case 'days':
            return `${date.getHours()}:00`;
        case 'weeks':
            return date.toLocaleDateString('en-US', { weekday: 'short' });
        case 'months':
            return date.getDate().toString();
        case 'years':
            return date.toLocaleDateString('en-US', { month: 'short' });
        case 'lifetime':
            return String(date.getFullYear());
        default:
            return `Entry ${index + 1}`;
    }
}
