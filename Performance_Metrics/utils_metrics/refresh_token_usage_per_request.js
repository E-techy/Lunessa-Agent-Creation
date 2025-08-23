// Performance_Metrics/utils_metrics/refresh_token_usage_per_request.js

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
 * Refreshes token usage per request logs for a given agentId
 * Updates IndexedDB and re-renders ONLY token per request chart
 * @param {string} agentId - The agent ID to fetch token usage logs for
 * @param {string} timeframe - (optional) timeframe filter
 * @returns {Promise<boolean>} - true if updated successfully, false otherwise
 */
async function refreshTokenUsagePerRequestLogs(agentId, timeframe = "lifetime") {
  try {
    if (!agentId) {
      throw new Error("agentId is required to fetch token usage per request logs");
    }

    // 1. Fetch new logs from backend (same endpoint as cumulative token usage)
    const response = await fetch(`/performance_metrics/usage_stats?timeframe=${timeframe}`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ agentId }),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch token usage per request logs: ${response.statusText}`);
    }

    const responseData = await response.json();
    const newLogs = responseData.usageLogs;
    
    if (!Array.isArray(newLogs)) {
      throw new Error("Invalid data format: usageLogs should be an array");
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

          // update logs and calculate total tokens used
          agentData.usageLogs = newLogs;
          agentData.totalTokensUsed = newLogs.reduce((total, log) => total + (log.tokensUsed || 0), 0);

          const putReq = store.put(agentData);

          putReq.onsuccess = async () => {
            console.log(`✅ Token usage per request logs updated for agentId=${agentId}`);

            try {
              // 3. Fetch updated agent and re-render ONLY token per request chart
              const updatedAgent = await getAgentFromIndexedDB(agentId);

              if (typeof createTokenPerRequestChart === "function") {
                // Safely destroy old chart instance
                const existingChart = Chart.getChart("tokenPerRequestChart");
                if (existingChart) {
                  existingChart.destroy();
                  console.log("🗑️ Old tokenPerRequestChart destroyed");
                }

                // Find which period button is active for tokenPerRequestChart
                let activeBtn = document.querySelector(
                  `.time-period-buttons button.active[data-chart="tokenPerRequestChart"]`
                );
                let period = activeBtn ? activeBtn.dataset.period : "days";

                // Recreate token per request chart with the same selected period
                createTokenPerRequestChart(updatedAgent);
                console.log(`🔄 Token per request chart refreshed with period: ${period}`);
              }

            } catch (err) {
              console.error("⚠️ Could not reload token per request chart with updated agent:", err);
            }

            resolve(true);
          };

          putReq.onerror = () => {
            console.error("❌ Failed to update token usage per request logs in IndexedDB");
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
    console.error("Error in refreshTokenUsagePerRequestLogs:", err);
    return false;
  }
}

// Attach refresh button listener for token usage per request chart
window.addEventListener("load", () => {
  const agentId = getAgentIdFromUrl();
  const tokenPerRequestRefreshBtn = document.querySelector("#refreshTokenUsagePerRequestBtn");

  if (tokenPerRequestRefreshBtn && agentId) {
    tokenPerRequestRefreshBtn.addEventListener("click", async () => {
      console.log("🔄 Token usage per request refresh button clicked for agent:", agentId);

      // Get active time period for token per request chart
      const activeBtn = document.querySelector(
        `.time-period-buttons button.active[data-chart="tokenPerRequestChart"]`
      );
      const timeframe = activeBtn ? mapPeriodToTimeframe(activeBtn.dataset.period) : "lifetime";

      const success = await refreshTokenUsagePerRequestLogs(agentId, timeframe);

      if (success) {
        console.log("✅ Token usage per request logs refreshed & chart updated");
      } else {
        console.error("❌ Failed to refresh token usage per request logs");
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