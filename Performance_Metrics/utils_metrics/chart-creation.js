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
    const canvas = document.getElementById('requestChart');
    if (!canvas) {
        console.error('requestChart canvas not found');
        return;
    }
    
    const ctx = canvas.getContext('2d');
    if (!ctx) {
        console.error('Could not get 2d context for requestChart');
        return;
    }
    
    const requestLogs = agent.requestHandledLogs;
    
    // Process request data by hour
    const hourlyData = {};
    requestLogs.forEach(log => {
        const date = new Date(log.timestamp);
        const hour = date.getHours();
        hourlyData[hour] = (hourlyData[hour] || 0) + 1;
    });
    
    const labels = Array.from({length: 24}, (_, i) => `${i}:00`);
    const data = labels.map((_, i) => hourlyData[i] || 0);
    
    try {
        chartInstances.requestChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Requests Handled',
                    data: data,
                    borderColor: '#8B5CF6',
                    backgroundColor: 'rgba(139, 92, 246, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: '#8B5CF6',
                    pointBorderColor: '#18181B',
                    pointBorderWidth: 2,
                    pointRadius: 4,
                    pointHoverRadius: 8,
                }]
            },
            options: getChartOptions('requests', true)
        });
        console.log('Request timeline chart created successfully');
    } catch (error) {
        console.error('Error creating request timeline chart:', error);
    }
}

function createTokenUsageChart(agent) {
    console.log('Creating token usage chart...');
    const canvas = document.getElementById('tokenChart');
    if (!canvas) {
        console.error('tokenChart canvas not found');
        return;
    }
    
    const ctx = canvas.getContext('2d');
    const usageLogs = agent.usageLogs;
    
    // Create cumulative token usage
    let cumulative = 0;
    const labels = [];
    const data = [];
    
    usageLogs.forEach((log, index) => {
        cumulative += log.tokensUsed;
        labels.push(`Request ${index + 1}`);
        data.push(cumulative);
    });
    
    try {
        chartInstances.tokenChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Cumulative Token Usage',
                    data: data,
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
        console.log('Token usage chart created successfully');
    } catch (error) {
        console.error('Error creating token usage chart:', error);
    }
}

function createSatisfactionChart(agent) {
    console.log('Creating satisfaction chart...');
    const canvas = document.getElementById('satisfactionChart');
    if (!canvas) {
        console.error('satisfactionChart canvas not found');
        return;
    }
    
    const ctx = canvas.getContext('2d');
    const satisfactionLogs = agent.satisfactionRateLogs;
    
    const labels = satisfactionLogs.map((_, index) => `Review ${index + 1}`);
    const data = satisfactionLogs.map(log => log.reviewStar);
    
    try {
        chartInstances.satisfactionChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Customer Satisfaction',
                    data: data,
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
        console.log('Satisfaction chart created successfully');
    } catch (error) {
        console.error('Error creating satisfaction chart:', error);
    }
}

function createRatingDistributionChart(agent) {
    console.log('Creating rating distribution chart...');
    const canvas = document.getElementById('ratingChart');
    if (!canvas) {
        console.error('ratingChart canvas not found');
        return;
    }
    
    const ctx = canvas.getContext('2d');
    const reviews = agent.customerReviews;
    
    // Count ratings
    const ratingCount = {1: 0, 2: 0, 3: 0, 4: 0, 5: 0};
    reviews.forEach(review => {
        ratingCount[review.reviewStar]++;
    });
    
    const labels = ['1 Star', '2 Stars', '3 Stars', '4 Stars', '5 Stars'];
    const data = Object.values(ratingCount);
    const colors = ['#EF4444', '#F59E0B', '#F59E0B', '#22C55E', '#22C55E'];
    
    try {
        chartInstances.ratingChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: labels,
                datasets: [{
                    data: data,
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
        console.log('Rating distribution chart created successfully');
    } catch (error) {
        console.error('Error creating rating distribution chart:', error);
    }
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