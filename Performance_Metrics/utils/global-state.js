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