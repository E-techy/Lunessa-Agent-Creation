// Performance_Metrics/utils_metrics/refresh_customer_satisfaction_trend.js

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
 * Refreshes customer satisfaction logs for a given agentId
 * Updates IndexedDB and re-renders ONLY satisfaction chart
 * @param {string} agentId - The agent ID to fetch satisfaction logs for
 * @param {string} timeframe - (optional) timeframe filter
 * @returns {Promise<boolean>} - true if updated successfully, false otherwise
 */
async function refreshCustomerSatisfactionLogs(agentId, timeframe = "lifetime") {
  try {
    if (!agentId) {
      throw new Error("agentId is required to fetch satisfaction logs");
    }

    // 1. Fetch new logs from backend
    const response = await fetch(`/performance_metrics/satisfaction_rate_logs?timeframe=${timeframe}`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ agentId }),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch satisfaction logs: ${response.statusText}`);
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

          // update logs and satisfaction rate
          agentData.satisfactionRateLogs = newLogs;
          agentData.satisfactionRate = satisfactionRate;

          const putReq = store.put(agentData);

          putReq.onsuccess = async () => {
            console.log(`✅ satisfactionRateLogs updated for agentId=${agentId}`);

            try {
              // 3. Fetch updated agent and re-render ONLY satisfaction chart
              const updatedAgent = await getAgentFromIndexedDB(agentId);

              if (typeof createSatisfactionChart === "function") {
                // Safely destroy old chart instance
                const existingChart = Chart.getChart("satisfactionChart");
                if (existingChart) {
                  existingChart.destroy();
                  console.log("🗑️ Old satisfactionChart destroyed");
                }

                // Find which period button is active for satisfactionChart
                let activeBtn = document.querySelector(
                  `.time-period-buttons button.active[data-chart="satisfactionChart"]`
                );
                let period = activeBtn ? activeBtn.dataset.period : "days";

                // Recreate satisfaction chart with the same selected period
                createSatisfactionChart(updatedAgent);
                console.log(`🔄 Satisfaction chart refreshed with period: ${period}`);
              }

            } catch (err) {
              console.error("⚠️ Could not reload satisfaction chart with updated agent:", err);
            }

            resolve(true);
          };

          putReq.onerror = () => {
            console.error("❌ Failed to update satisfactionRateLogs in IndexedDB");
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
    console.error("Error in refreshCustomerSatisfactionLogs:", err);
    return false;
  }
}

// Attach refresh button listener for satisfaction chart
window.addEventListener("load", () => {
  const agentId = getAgentIdFromUrl();
  const satisfactionRefreshBtn = document.querySelector("#refreshSatisfactionRateChartBtn");

  if (satisfactionRefreshBtn && agentId) {
    satisfactionRefreshBtn.addEventListener("click", async () => {
      console.log("🔄 Satisfaction chart refresh button clicked for agent:", agentId);

      // Get active time period for satisfaction chart
      const activeBtn = document.querySelector(
        `.time-period-buttons button.active[data-chart="satisfactionChart"]`
      );
      const timeframe = activeBtn ? mapPeriodToTimeframe(activeBtn.dataset.period) : "lifetime";

      const success = await refreshCustomerSatisfactionLogs(agentId, timeframe);

      if (success) {
        console.log("✅ Satisfaction logs refreshed & chart updated");
      } else {
        console.error("❌ Failed to refresh satisfaction logs");
      }
    });
  }
});

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