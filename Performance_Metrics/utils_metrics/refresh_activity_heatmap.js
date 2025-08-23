// Performance_Metrics/utils_metrics/refresh_activity_heatmap.js

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
 * Refreshes activity heatmap data for a given agentId
 * Updates IndexedDB and re-renders ONLY activity heatmap
 * @param {string} agentId - The agent ID to fetch request handling logs for
 * @param {string} timeframe - (optional) timeframe filter
 * @returns {Promise<boolean>} - true if updated successfully, false otherwise
 */
async function refreshActivityHeatmapData(agentId, timeframe = "lifetime") {
  try {
    if (!agentId) {
      throw new Error("agentId is required to fetch activity heatmap data");
    }

    // 1. Fetch new logs from backend (same endpoint as request timeline chart)
    const response = await fetch(`/performance_metrics/requests_handled?timeframe=${timeframe}`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ agentId }),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch activity heatmap data: ${response.statusText}`);
    }

    const responseData = await response.json();
    const newLogs = responseData.requestHandledLogs;
    
    if (!Array.isArray(newLogs)) {
      throw new Error("Invalid data format: requestHandledLogs should be an array");
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

          // update logs + count
          agentData.requestHandledLogs = newLogs;
          agentData.totalRequestsHandled = newLogs.length;

          const putReq = store.put(agentData);

          putReq.onsuccess = async () => {
            console.log(`✅ Activity heatmap data updated for agentId=${agentId}`);

            try {
              // 3. Fetch updated agent and re-render ONLY activity heatmap
              const updatedAgent = await getAgentFromIndexedDB(agentId);

              if (typeof createActivityHeatmap === "function") {
                // Find which period button is active for activityHeatmap
                let activeBtn = document.querySelector(
                  `.time-period-buttons button.active[data-chart="activityHeatmap"]`
                );
                let period = activeBtn ? activeBtn.dataset.period : "days";

                // Update current period in global state
                currentTimePeriods.activityHeatmap = period;

                // Recreate activity heatmap with the same selected period
                filterHeatmapByTimePeriod(period, updatedAgent);
                console.log(`🔄 Activity heatmap refreshed with period: ${period}`);
              }

            } catch (err) {
              console.error("⚠️ Could not reload activity heatmap with updated agent:", err);
            }

            resolve(true);
          };

          putReq.onerror = () => {
            console.error("❌ Failed to update activity heatmap data in IndexedDB");
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
    console.error("Error in refreshActivityHeatmapData:", err);
    return false;
  }
}

// Attach refresh button listener for activity heatmap
window.addEventListener("load", () => {
  const agentId = getAgentIdFromUrl();
  const heatmapRefreshBtn = document.querySelector("#refreshActivityHeatmapBtn");

  if (heatmapRefreshBtn && agentId) {
    heatmapRefreshBtn.addEventListener("click", async () => {
      console.log("🔄 Activity heatmap refresh button clicked for agent:", agentId);

      // Get active time period for activity heatmap
      const activeBtn = document.querySelector(
        `.time-period-buttons button.active[data-chart="activityHeatmap"]`
      );
      const timeframe = activeBtn ? mapPeriodToTimeframe(activeBtn.dataset.period) : "lifetime";

      const success = await refreshActivityHeatmapData(agentId, timeframe);

      if (success) {
        console.log("✅ Activity heatmap data refreshed & heatmap updated");
      } else {
        console.error("❌ Failed to refresh activity heatmap data");
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