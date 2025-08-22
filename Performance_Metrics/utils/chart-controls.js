// Control functions
function resetZoom(chartId) {
    console.log('Resetting zoom for:', chartId);
    if (chartInstances[chartId]) {
        if (chartInstances[chartId].resetZoom) {
            chartInstances[chartId].resetZoom();
        } else {
            chartInstances[chartId].update();
        }
    }
}

function exportChart(chartId) {
    console.log('Exporting chart:', chartId);
    if (chartInstances[chartId]) {
        try {
            const link = document.createElement('a');
            link.download = `${chartId}-export.png`;
            link.href = chartInstances[chartId].toBase64Image();
            link.click();
        } catch (error) {
            console.error('Export error:', error);
            alert('Export failed. Please try again.');
        }
    } else {
        console.error('Chart not found for export:', chartId);
        alert('Chart not available for export');
    }
}