// Performance_Metrics/utils_metrics/refresh_rating_distribution.js

// helper to get updated agent data from IndexedDB
async function getAgentFromIndexedDB(agentId) {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("PerformanceMetricsDB", 1);

    request.onerror = (event) => {
      reject("Error opening IndexedDB: " + event.target.errorCode);
    };

    request.onsuccess = (event) => {
      const db = event.target.result;
      const tx = db.transaction("agents", "readonly");
      const store = tx.objectStore("agents");

      const getRequest = store.get(agentId);
      getRequest.onsuccess = () => {
        if (getRequest.result) {
          resolve(getRequest.result);
        } else {
          reject("No agent found with id " + agentId);
        }
      };
      getRequest.onerror = () => reject("Error fetching agent from IndexedDB");
    };
  });
}

/**
 * Refreshes rating distribution data for a given agentId
 * Updates IndexedDB and re-renders ONLY rating distribution chart
 * @param {string} agentId - The agent ID to fetch rating data for
 * @param {string} timeframe - (optional) timeframe filter
 * @returns {Promise<boolean>} - true if updated successfully, false otherwise
 */
async function refreshRatingDistributionData(agentId, timeframe = "lifetime") {
  try {
    if (!agentId) {
      throw new Error("agentId is required to fetch rating distribution data");
    }

    // 1. Fetch new data from backend (same endpoint as satisfaction trend)
    const response = await fetch(`/performance_metrics/satisfaction_rate_logs?timeframe=${timeframe}`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ agentId }),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch rating distribution data: ${response.statusText}`);
    }

    const responseData = await response.json();
    const newLogs = responseData.satisfactionRateLogs;
    const satisfactionRate = responseData.satisfactionRate;
    
    if (!Array.isArray(newLogs)) {
      throw new Error("Invalid data format: satisfactionRateLogs should be an array");
    }

    // 2. Open IndexedDB and update
    const dbRequest = indexedDB.open("PerformanceMetricsDB", 1);

    return new Promise((resolve) => {
      dbRequest.onerror = () => {
        console.error("❌ Failed to open PerformanceMetricsDB");
        resolve(false);
      };

      dbRequest.onsuccess = async () => {
        const db = dbRequest.result;
        const tx = db.transaction("agents", "readwrite");
        const store = tx.objectStore("agents");

        const getReq = store.get(agentId);

        getReq.onsuccess = async () => {
          const agentData = getReq.result;
          if (!agentData) {
            console.error("❌ Agent not found in IndexedDB:", agentId);
            resolve(false);
            return;
          }

          // update logs (used for both satisfaction and rating distribution)
          agentData.satisfactionRateLogs = newLogs;
          agentData.customerReviews = newLogs; // Also update customerReviews for rating chart compatibility
          agentData.satisfactionRate = satisfactionRate;

          const putReq = store.put(agentData);

          putReq.onsuccess = async () => {
            console.log(`✅ Rating distribution data updated for agentId=${agentId}`);

            try {
              // 3. Fetch updated agent and re-render ONLY rating distribution chart
              const updatedAgent = await getAgentFromIndexedDB(agentId);

              if (typeof createRatingDistributionChart === "function") {
                // Safely destroy old chart instance
                const existingChart = Chart.getChart("ratingChart");
                if (existingChart) {
                  existingChart.destroy();
                  console.log("🗑️ Old ratingChart destroyed");
                }

                // Find which period button is active for ratingChart
                let activeBtn = document.querySelector(
                  `.time-period-buttons button.active[data-chart="ratingChart"]`
                );
                let period = activeBtn ? activeBtn.dataset.period : "days";

                // Recreate rating distribution chart with the same selected period
                createRatingDistributionChart(updatedAgent);
                console.log(`🔄 Rating distribution chart refreshed with period: ${period}`);
              }

            } catch (err) {
              console.error("⚠️ Could not reload rating distribution chart with updated agent:", err);
            }

            resolve(true);
          };

          putReq.onerror = () => {
            console.error("❌ Failed to update rating distribution data in IndexedDB");
            resolve(false);
          };
        };

        getReq.onerror = () => {
          console.error("❌ Failed to read agent data from IndexedDB");
          resolve(false);
        };
      };
    });

  } catch (err) {
    console.error("Error in refreshRatingDistributionData:", err);
    return false;
  }
}

// Update the existing refreshChart function to handle ratingChart specifically
// This function should be called from the onclick="refreshChart('ratingChart')" in HTML
window.refreshChart = window.refreshChart || {};

// Add specific handler for rating chart refresh
if (typeof window.refreshChart !== 'function') {
  window.refreshChart = async function(chartId) {
    if (chartId === 'ratingChart') {
      const agentId = getAgentIdFromUrl();
      if (!agentId) {
        console.error("❌ No agent ID found for rating chart refresh");
        return;
      }

      console.log("🔄 Rating distribution refresh triggered for agent:", agentId);

      // Get active time period for rating chart
      const activeBtn = document.querySelector(
        `.time-period-buttons button.active[data-chart="ratingChart"]`
      );
      const timeframe = activeBtn ? mapPeriodToTimeframe(activeBtn.dataset.period) : "lifetime";

      const success = await refreshRatingDistributionData(agentId, timeframe);

      if (success) {
        console.log("✅ Rating distribution data refreshed & chart updated");
      } else {
        console.error("❌ Failed to refresh rating distribution data");
      }
    } else {
      console.log(`Refresh not implemented for chart: ${chartId}`);
    }
  };
}

// Helper function to map frontend period to backend timeframe
function mapPeriodToTimeframe(period) {
  const mapping = {
    'days': 'week',      // Show last week when "days" is selected
    'weeks': 'month',    // Show last month when "weeks" is selected  
    'months': 'year',    // Show last year when "months" is selected
    'years': 'lifetime', // Show lifetime when "years" is selected
    'lifetime': 'lifetime'
  };
  return mapping[period] || 'lifetime';
}