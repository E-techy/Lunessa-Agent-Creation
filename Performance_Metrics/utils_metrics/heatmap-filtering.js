// Heatmap Filtering Functions
function filterHeatmapByTimePeriod(period) {
    console.log(`Filtering heatmap by period: ${period}`);
    
    const heatmapContainer = document.getElementById('activityHeatmap');
    const heatmapTitle = document.getElementById('heatmapTitle');
    const heatmapInfo = document.getElementById('heatmapInfo');
    
    if (!heatmapContainer) {
        console.error('Heatmap container not found');
        return;
    }
    
    // Clear existing heatmap
    heatmapContainer.innerHTML = '';
    
    // Add period attribute for CSS styling
    heatmapContainer.setAttribute('data-period', period);
    
    const now = new Date();
    let filteredLogs = filterLogsByPeriod(agent.requestHandledLogs, period, now);
    
    // Update title and info based on period
    const titles = {
        days: 'Activity Heatmap - Last 7 Days (Hourly)',
        weeks: 'Activity Heatmap - This Week (Daily)',
        months: 'Activity Heatmap - This Month (Daily)',
        years: 'Activity Heatmap - This Year (Monthly)',
        lifetime: 'Activity Heatmap - Recent Years (Yearly)'
    };
    
    const infos = {
        days: 'Showing hourly activity distribution over the last 7 days',
        weeks: 'Showing daily activity distribution for 1 week only',
        months: 'Showing daily activity distribution for this month',
        years: 'Showing monthly activity distribution for this year',
        lifetime: 'Showing yearly activity distribution for most recent years (max 10 years with horizontal scroll)'
    };
    
    if (heatmapTitle) heatmapTitle.textContent = titles[period];
    if (heatmapInfo) heatmapInfo.textContent = infos[period];
    
    // Generate heatmap based on period
    let heatmapData, labels, cellCount;
    
    switch(period) {
        case 'days':
            ({ heatmapData, labels, cellCount } = generateDailyHeatmap(filteredLogs));
            break;
        case 'weeks':
            ({ heatmapData, labels, cellCount } = generateWeeklyHeatmap(filteredLogs));
            break;
        case 'months':
            ({ heatmapData, labels, cellCount } = generateMonthlyHeatmap(filteredLogs));
            break;
        case 'years':
            ({ heatmapData, labels, cellCount } = generateYearlyHeatmap(filteredLogs));
            break;
        case 'lifetime':
            ({ heatmapData, labels, cellCount } = generateLifetimeHeatmap(agent.requestHandledLogs));
            break;
        default:
            ({ heatmapData, labels, cellCount } = generateDailyHeatmap(filteredLogs));
    }
    
    // Update grid columns based on cell count and period
    let gridCols;
    if (period === 'weeks') {
        gridCols = 7; // 7 days in a week
        heatmapContainer.style.gridTemplateColumns = `repeat(${gridCols}, 1fr)`;
        heatmapContainer.style.overflowX = 'visible';
        heatmapContainer.style.width = '100%';
    } else if (period === 'lifetime') {
        // For lifetime, create flexible layout with horizontal scroll
        const minCellWidth = '60px'; // Minimum width for each year cell
        heatmapContainer.style.gridTemplateColumns = `repeat(${cellCount}, minmax(${minCellWidth}, 0fr))`;
        heatmapContainer.style.overflowX = 'auto';
        heatmapContainer.style.width = '100%';
        heatmapContainer.style.minWidth = `calc(${cellCount} * ${minCellWidth} + ${(cellCount - 1) * 4}px)`; // Include gaps
        heatmapContainer.style.paddingBottom = '10px'; // Space for scrollbar
    } else if (period === 'years') {
        gridCols = 12; // 12 months
        heatmapContainer.style.gridTemplateColumns = `repeat(${gridCols}, 1fr)`;
        heatmapContainer.style.overflowX = 'visible';
        heatmapContainer.style.width = '100%';
    } else {
        gridCols = Math.min(cellCount, 31); // Default behavior
        heatmapContainer.style.gridTemplateColumns = `repeat(${gridCols}, 1fr)`;
        heatmapContainer.style.overflowX = 'visible';
        heatmapContainer.style.width = '100%';
    }
    
    // Create heatmap cells
    for (let i = 0; i < cellCount; i++) {
        const cell = document.createElement('div');
        cell.className = 'heatmap-cell';
        cell.setAttribute('data-level', heatmapData[i] || 0);
        cell.title = `${labels[i]} - Activity Level: ${heatmapData[i] || 0}/4`;
        
        // For lifetime period, add year text inside cell
        if (period === 'lifetime') {
            cell.textContent = labels[i];
        }
        
        // Add click event for interactivity
        cell.addEventListener('click', () => {
            showHeatmapCellDetails(labels[i], heatmapData[i] || 0, period);
        });
        
        heatmapContainer.appendChild(cell);
    }
}

function resetHeatmap() {
    console.log('Resetting heatmap view');
    const currentPeriod = currentTimePeriods.activityHeatmap || 'days';
    filterHeatmapByTimePeriod(currentPeriod);
}