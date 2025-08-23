// Time Period Filtering Functions
function setupTimePeriodButtons(agent) {
    console.log('Setting up time period buttons...');
    
    const timePeriodButtons = document.querySelectorAll('.time-period-btn');
    
    timePeriodButtons.forEach(button => {
        button.addEventListener('click', function() {
            const period = this.dataset.period;
            const chartId = this.dataset.chart;
            
            // Update active state
            const siblingButtons = this.parentElement.querySelectorAll('.time-period-btn');
            siblingButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Update current period
            currentTimePeriods[chartId] = period;
            
            // Filter and update chart or heatmap
            if (chartId === 'activityHeatmap') {
                filterHeatmapByTimePeriod(period, agent);
            } else {
                filterChartByTimePeriod(chartId, period, agent);
            }
        });
    });
}

function filterChartByTimePeriod(chartId, period, agent) {
    console.log(`Filtering ${chartId} by period: ${period}`);
    
    if (!chartInstances[chartId]) {
        console.error('Chart not found:', chartId);
        return;
    }
    
    const chart = chartInstances[chartId];
    const now = new Date();
    let filteredData = [];
    let filteredLabels = [];
    
    // Get the original data based on chart type
    switch(chartId) {
        case 'requestChart':
            ({ filteredData, filteredLabels } = filterRequestData(period, now, agent));
            break;
        case 'tokenChart':
            ({ filteredData, filteredLabels } = filterTokenData(period, now, agent));
            break;
        case 'satisfactionChart':
            ({ filteredData, filteredLabels } = filterSatisfactionData(period, now, agent));
            break;
        case 'ratingChart':
            ({ filteredData, filteredLabels } = filterRatingData(period, now, agent));
            break;
        case 'tokenPerRequestChart':
            ({ filteredData, filteredLabels } = filterTokenPerRequestData(period, now, agent));
            break;
    }
    
    // Update chart data
    chart.data.labels = filteredLabels;
    if (chart.data.datasets[0]) {
        chart.data.datasets[0].data = filteredData;
    }
    
    // Update chart
    chart.update('active');
}