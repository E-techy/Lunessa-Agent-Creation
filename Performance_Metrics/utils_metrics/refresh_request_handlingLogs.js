// Performance_Metrics/utils_metrics/refresh_request_handlingLogs.js

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
 * Refreshes requests_handled logs for a given agentId
 * Updates IndexedDB and re-renders ONLY request timeline chart
 * @param {string} agentId - The agent ID to fetch request handling logs for
 * @param {string} timeframe - (optional) timeframe filter
 * @returns {Promise<boolean>} - true if updated successfully, false otherwise
 */
async function refreshRequestHandlingLogs(agentId, timeframe = "lifetime") {
  try {
    if (!agentId) {
      throw new Error("agentId is required to fetch request handling logs");
    }

    // 1. Fetch new logs from backend
    const response = await fetch(`/performance_metrics/requests_handled?timeframe=${timeframe}`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ agentId }),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch request handling logs: ${response.statusText}`);
    }

    const newLogs = (await response.json()).requestHandledLogs;
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
            console.log(`✅ requestHandledLogs updated for agentId=${agentId}`);

            try {

                
            // 3. Fetch updated agent and re-render ONLY request chart
            const updatedAgent = await getAgentFromIndexedDB(agentId);

            if (typeof createRequestTimelineChart === "function") {
            // Safely destroy old chart instance
            const existingChart = Chart.getChart("requestChart");
            if (existingChart) {
                existingChart.destroy();
                console.log("🗑️ Old requestChart destroyed");
            }

            // Find which period button is active for requestChart
            let activeBtn = document.querySelector(
                `.time-period-buttons button.active[data-chart="requestChart"]`
            );
            let period = activeBtn ? activeBtn.dataset.period : "days";

            // Recreate timeline chart with the same selected period
            createRequestTimelineChart(updatedAgent, period);
            console.log(`🔄 Request timeline chart refreshed with period: ${period}`);
            }


            } catch (err) {
              console.error("⚠️ Could not reload request chart with updated agent:", err);
            }

            resolve(true);
          };

          putReq.onerror = () => {
            console.error("❌ Failed to update requestHandledLogs in IndexedDB");
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
    console.error("Error in refreshRequestHandlingLogs:", err);
    return false;
  }
}

// Attach refresh button listener
window.addEventListener("load", () => {
  const agentId = getAgentIdFromUrl();
  const refreshBtn = document.querySelector(".refresh-btn"); // or "#refreshLogsBtn"

  if (refreshBtn && agentId) {
    refreshBtn.addEventListener("click", async () => {
      console.log("🔄 Refresh button clicked for agent:", agentId);

      const success = await refreshRequestHandlingLogs(agentId, "daily"); // timeframe can be changed

      if (success) {
        console.log("✅ Logs refreshed & request timeline chart updated");
      } else {
        console.error("❌ Failed to refresh logs");
      }
    });
  }
});
