function initializeCharts(agent) {
    console.log('Initializing charts...');
    
    if (typeof Chart === 'undefined') {
        console.error('Chart.js is not available');
        return;
    }

    console.log('Chart.js version:', Chart.version);
    
    // Register zoom plugin if available
    if (window.ChartZoom) {
        Chart.register(window.ChartZoom.default || window.ChartZoom);
        console.log('Zoom plugin registered');
    } else {
        console.log('Zoom plugin not available, charts will work without zoom');
    }
    
    try {
        createRequestTimelineChart(agent);
        createTokenUsageChart(agent);
        createSatisfactionChart(agent);
        createRatingDistributionChart(agent);
        createTokenPerRequestChart(agent);
        console.log('All charts initialized successfully');
    } catch (error) {
        console.error('Error initializing charts:', error);
    }
}

function createRequestTimelineChart(agent) {
    console.log('Creating request timeline chart...');

    const canvas = document.getElementById("requestChart");
    if (!canvas) {
        console.error("requestChart canvas not found");
        return;
    }

    const ctx = canvas.getContext("2d");
    if (!ctx) {
        console.error("Could not get 2d context for requestChart");
        return;
    }

    const requestLogs = agent.requestHandledLogs || [];
    if (!requestLogs.length) {
        console.warn("No request logs found for agent");
    }

    // Get the current period from the active button or default to 'days'
    const currentPeriod = currentTimePeriods.requestChart || 'days';
    
    // Use the existing filter function to get data for the current period
    const now = new Date();
    const { filteredData, filteredLabels } = filterRequestData(currentPeriod, now, agent);

    try {
        // Destroy old instance if exists
        if (chartInstances.requestChart) {
            chartInstances.requestChart.destroy();
            console.log("🗑️ Old requestChart destroyed");
        }

        chartInstances.requestChart = new Chart(ctx, {
            type: "line",
            data: {
                labels: filteredLabels,
                datasets: [{
                    label: "Requests Handled",
                    data: filteredData,
                    borderColor: "#8B5CF6",
                    backgroundColor: "rgba(139, 92, 246, 0.1)",
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: "#8B5CF6",
                    pointBorderColor: "#18181B",
                    pointBorderWidth: 2,
                    pointRadius: 4,
                    pointHoverRadius: 8,
                }]
            },
            options: getChartOptions("requests", true)
        });
        console.log("✅ Request timeline chart created successfully");
    } catch (error) {
        console.error("Error creating request timeline chart:", error);
    }
}

// You'll also need this helper function that works with your existing filtering system
function filterRequestData(period, now, agent) {
    console.log(`Filtering request data for period: ${period}`);
    
    const requestLogs = agent.requestHandledLogs || [];
    
    if (period === 'lifetime') {
        return {
            filteredData: [requestLogs.length],
            filteredLabels: ['Total Requests']
        };
    }
    
    // Filter logs by the selected time period
    const filteredLogs = filterLogsByPeriod(requestLogs, period, now, agent);
    
    // Group the filtered data by the period
    const groupedData = groupDataByPeriod(filteredLogs, period, agent);
    
    // Convert to arrays for Chart.js
    const filteredLabels = Object.keys(groupedData).sort();
    const filteredData = filteredLabels.map(label => groupedData[label] || 0);
    
    // If no data, provide empty arrays with at least one point
    if (filteredLabels.length === 0) {
        const emptyLabel = getPeriodLabel(period, 0, now, agent);
        return {
            filteredData: [0],
            filteredLabels: [emptyLabel]
        };
    }
    
    return {
        filteredData,
        filteredLabels
    };
}


function createTokenUsageChart(agent) {
    console.log('Creating token usage chart...');
    const canvas = document.getElementById('tokenChart');
    if (!canvas) {
        console.error('tokenChart canvas not found');
        return;
    }
    
    const ctx = canvas.getContext('2d');
    const usageLogs = agent.usageLogs || [];
    
    if (!usageLogs.length) {
        console.warn("No usage logs found for agent");
    }

    // Get the current period from the active button or default to 'days'
    const currentPeriod = currentTimePeriods.tokenChart || 'days';
    
    // Use the existing filter function to get data for the current period
    const now = new Date();
    const { filteredData, filteredLabels } = filterTokenData(currentPeriod, now, agent);
    
    try {
        // Destroy old instance if exists
        if (chartInstances.tokenChart) {
            chartInstances.tokenChart.destroy();
            console.log("🗑️ Old tokenChart destroyed");
        }

        chartInstances.tokenChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: filteredLabels,
                datasets: [{
                    label: 'Cumulative Token Usage',
                    data: filteredData,
                    borderColor: '#8B5CF6',
                    backgroundColor: 'rgba(139, 92, 246, 0.2)',
                    borderWidth: 4,
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: '#8B5CF6',
                    pointBorderColor: '#18181B',
                    pointBorderWidth: 3,
                    pointRadius: 6,
                    pointHoverRadius: 10,
                }]
            },
            options: getChartOptions('tokens', true)
        });
        console.log('✅ Token usage chart created successfully');
    } catch (error) {
        console.error('Error creating token usage chart:', error);
    }
}

// You'll also need this helper function that works with your existing filtering system
function filterTokenData(period, now, agent) {
    console.log(`Filtering token data for period: ${period}`);
    
    const usageLogs = agent.usageLogs || [];
    
    if (period === 'lifetime') {
        // Create cumulative data for lifetime view
        let cumulative = 0;
        const cumulativeData = [];
        const labels = [];
        
        usageLogs.forEach((log, index) => {
            cumulative += log.tokensUsed || 0;
            cumulativeData.push(cumulative);
            labels.push(`Request ${index + 1}`);
        });
        
        return {
            filteredData: cumulativeData.length ? cumulativeData : [0],
            filteredLabels: labels.length ? labels : ['No Data']
        };
    }
    
    // Filter logs by the selected time period
    const filteredLogs = filterLogsByPeriod(usageLogs, period, now, agent);
    
    // Group the filtered data by the period and sum tokens for each group
    const groupedData = {};
    
    filteredLogs.forEach(log => {
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
        
        groupedData[key] = (groupedData[key] || 0) + (log.tokensUsed || 0);
    });
    
    // Convert to arrays for Chart.js and make cumulative
    const sortedKeys = Object.keys(groupedData).sort();
    let cumulative = 0;
    const cumulativeData = [];
    
    sortedKeys.forEach(key => {
        cumulative += groupedData[key];
        cumulativeData.push(cumulative);
    });
    
    // If no data, provide empty arrays with at least one point
    if (sortedKeys.length === 0) {
        const emptyLabel = getPeriodLabel(period, 0, now, agent);
        return {
            filteredData: [0],
            filteredLabels: [emptyLabel]
        };
    }
    
    return {
        filteredData: cumulativeData,
        filteredLabels: sortedKeys
    };
}

function createSatisfactionChart(agent) {
    console.log('Creating satisfaction chart...');
    const canvas = document.getElementById('satisfactionChart');
    if (!canvas) {
        console.error('satisfactionChart canvas not found');
        return;
    }
    
    const ctx = canvas.getContext('2d');
    const satisfactionLogs = agent.satisfactionRateLogs || [];
    
    if (!satisfactionLogs.length) {
        console.warn("No satisfaction logs found for agent");
    }

    // Get the current period from the active button or default to 'days'
    const currentPeriod = currentTimePeriods.satisfactionChart || 'days';
    
    // Use the existing filter function to get data for the current period
    const now = new Date();
    const { filteredData, filteredLabels } = filterSatisfactionData(currentPeriod, now, agent);
    
    try {
        // Destroy old instance if exists
        if (chartInstances.satisfactionChart) {
            chartInstances.satisfactionChart.destroy();
            console.log("🗑️ Old satisfactionChart destroyed");
        }

        chartInstances.satisfactionChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: filteredLabels,
                datasets: [{
                    label: 'Customer Satisfaction',
                    data: filteredData,
                    borderColor: '#22C55E',
                    backgroundColor: 'rgba(34, 197, 94, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: '#22C55E',
                    pointBorderColor: '#18181B',
                    pointBorderWidth: 2,
                    pointRadius: 6,
                    pointHoverRadius: 8,
                }]
            },
            options: {
                ...getChartOptions('satisfaction', true),
                scales: {
                    x: {
                        grid: {
                            color: 'rgba(244, 244, 245, 0.1)',
                            borderColor: 'rgba(244, 244, 245, 0.2)'
                        },
                        ticks: {
                            color: '#71717A',
                            font: { size: 11, weight: '500' }
                        }
                    },
                    y: {
                        grid: {
                            color: 'rgba(244, 244, 245, 0.1)',
                            borderColor: 'rgba(244, 244, 245, 0.2)'
                        },
                        ticks: {
                            color: '#71717A',
                            font: { size: 11, weight: '500' },
                            stepSize: 1
                        },
                        min: 0,
                        max: 5,
                        beginAtZero: true
                    }
                }
            }
        });
        console.log('✅ Satisfaction chart created successfully');
    } catch (error) {
        console.error('Error creating satisfaction chart:', error);
    }
}

// You'll also need this helper function that works with your existing filtering system
function filterSatisfactionData(period, now, agent) {
    console.log(`Filtering satisfaction data for period: ${period}`);
    
    const satisfactionLogs = agent.satisfactionRateLogs || [];
    
    if (period === 'lifetime') {
        // Show all satisfaction ratings for lifetime view
        const labels = satisfactionLogs.map((_, index) => `Review ${index + 1}`);
        const data = satisfactionLogs.map(log => log.reviewStar || 0);
        
        return {
            filteredData: data.length ? data : [0],
            filteredLabels: labels.length ? labels : ['No Reviews']
        };
    }
    
    // Filter logs by the selected time period
    const filteredLogs = filterLogsByPeriod(satisfactionLogs, period, now, agent);
    
    // Group the filtered data by the period and calculate average satisfaction for each group
    const groupedData = {};
    const groupedCounts = {};
    
    filteredLogs.forEach(log => {
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
        
        groupedData[key] = (groupedData[key] || 0) + (log.reviewStar || 0);
        groupedCounts[key] = (groupedCounts[key] || 0) + 1;
    });
    
    // Convert to arrays for Chart.js and calculate averages
    const sortedKeys = Object.keys(groupedData).sort();
    const averageData = sortedKeys.map(key => {
        return groupedCounts[key] > 0 ? (groupedData[key] / groupedCounts[key]) : 0;
    });
    
    // If no data, provide empty arrays with at least one point
    if (sortedKeys.length === 0) {
        const emptyLabel = getPeriodLabel(period, 0, now, agent);
        return {
            filteredData: [0],
            filteredLabels: [emptyLabel]
        };
    }
    
    return {
        filteredData: averageData,
        filteredLabels: sortedKeys
    };
}

function createRatingDistributionChart(agent) {
    console.log('Creating rating distribution chart...');
    const canvas = document.getElementById('ratingChart');
    if (!canvas) {
        console.error('ratingChart canvas not found');
        return;
    }
    
    const ctx = canvas.getContext('2d');
    
    // Use satisfactionRateLogs as the primary source (same as satisfaction chart)
    // Fall back to customerReviews for backward compatibility
    const reviews = agent.satisfactionRateLogs || agent.customerReviews || [];
    
    if (!reviews.length) {
        console.warn("No review logs found for agent");
    }

    // Get the current period from the active button or default to 'days'
    const currentPeriod = currentTimePeriods.ratingChart || 'days';
    
    // Use the existing filter function to get data for the current period
    const now = new Date();
    const { filteredData, filteredLabels } = filterRatingData(currentPeriod, now, agent);
    
    // Define colors for each rating
    const colors = ['#EF4444', '#F59E0B', '#F59E0B', '#22C55E', '#22C55E'];
    
    try {
        // Destroy old instance if exists
        if (chartInstances.ratingChart) {
            chartInstances.ratingChart.destroy();
            console.log("🗑️ Old ratingChart destroyed");
        }

        chartInstances.ratingChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: filteredLabels,
                datasets: [{
                    data: filteredData,
                    backgroundColor: colors,
                    borderColor: '#18181B',
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        labels: {
                            color: '#F4F4F5',
                            font: { size: 12, weight: '500' }
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(24, 24, 27, 0.9)',
                        titleColor: '#F4F4F5',
                        bodyColor: '#F4F4F5',
                        borderColor: '#8B5CF6',
                        borderWidth: 1
                    }
                }
            }
        });
        console.log('✅ Rating distribution chart created successfully');
    } catch (error) {
        console.error('Error creating rating distribution chart:', error);
    }
}

// You'll also need this helper function that works with your existing filtering system
function filterRatingData(period, now, agent) {
    console.log(`Filtering rating distribution data for period: ${period}`);
    
    // Use satisfactionRateLogs as primary source, fallback to customerReviews
    const reviews = agent.satisfactionRateLogs || agent.customerReviews || [];
    
    let filteredReviews = reviews;
    
    // Apply time period filtering (except for lifetime)
    if (period !== 'lifetime') {
        filteredReviews = filterLogsByPeriod(reviews, period, now, agent);
    }
    
    // Count ratings distribution
    const ratingCount = {1: 0, 2: 0, 3: 0, 4: 0, 5: 0};
    
    filteredReviews.forEach(review => {
        const rating = review.reviewStar || review.rating || 0;
        if (rating >= 1 && rating <= 5) {
            ratingCount[rating]++;
        }
    });
    
    // Prepare data for Chart.js
    const labels = ['1 Star', '2 Stars', '3 Stars', '4 Stars', '5 Stars'];
    const data = [
        ratingCount[1],
        ratingCount[2],
        ratingCount[3],
        ratingCount[4],
        ratingCount[5]
    ];
    
    // If no data, show empty state
    if (data.every(count => count === 0)) {
        return {
            filteredData: [1], // Show a single segment for "No Data"
            filteredLabels: ['No Reviews Available']
        };
    }
    
    return {
        filteredData: data,
        filteredLabels: labels
    };
}

function createTokenPerRequestChart(agent) {
    console.log('Creating token per request chart...');
    const canvas = document.getElementById('tokenPerRequestChart');
    if (!canvas) {
        console.error('tokenPerRequestChart canvas not found');
        return;
    }
    
    const ctx = canvas.getContext('2d');
    const usageLogs = agent.usageLogs;
    
    const labels = usageLogs.map((_, index) => `Request ${index + 1}`);
    const data = usageLogs.map(log => log.tokensUsed);
    
    try {
        chartInstances.tokenPerRequestChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Tokens Used per Request',
                    data: data,
                    backgroundColor: 'rgba(139, 92, 246, 0.8)',
                    borderColor: '#8B5CF6',
                    borderWidth: 2,
                    borderRadius: 8,
                    borderSkipped: false,
                }]
            },
            options: getChartOptions('tokens-per-request', true)
        });
        console.log('Token per request chart created successfully');
    } catch (error) {
        console.error('Error creating token per request chart:', error);
    }
}

function getChartOptions(type, enableZoom = false) {
    const baseOptions = {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
            intersect: false,
            mode: 'index'
        },
        scales: {
            x: {
                grid: {
                    color: 'rgba(244, 244, 245, 0.1)',
                    borderColor: 'rgba(244, 244, 245, 0.2)'
                },
                ticks: {
                    color: '#71717A',
                    font: { size: 11, weight: '500' }
                }
            },
            y: {
                grid: {
                    color: 'rgba(244, 244, 245, 0.1)',
                    borderColor: 'rgba(244, 244, 245, 0.2)'
                },
                ticks: {
                    color: '#71717A',
                    font: { size: 11, weight: '500' }
                },
                beginAtZero: true
            }
        },
        plugins: {
            legend: {
                labels: {
                    color: '#F4F4F5',
                    font: { size: 12, weight: '500' },
                    usePointStyle: true,
                    padding: 15
                }
            },
            tooltip: {
                backgroundColor: 'rgba(24, 24, 27, 0.9)',
                titleColor: '#F4F4F5',
                bodyColor: '#F4F4F5',
                borderColor: '#8B5CF6',
                borderWidth: 1,
                cornerRadius: 8,
                displayColors: true
            }
        },
        animation: {
            duration: 1500,
            easing: 'easeInOutQuart'
        }
    };

    // Add zoom functionality if zoom plugin is available and enabled
    if (enableZoom && window.ChartZoom) {
        baseOptions.plugins.zoom = {
            zoom: {
                wheel: {
                    enabled: true,
                },
                pinch: {
                    enabled: true
                },
                mode: 'x',
            },
            pan: {
                enabled: true,
                mode: 'x',
            }
        };
    }

    return baseOptions;
}