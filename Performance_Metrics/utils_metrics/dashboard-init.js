// Utility: Get agentId from URL
function getAgentIdFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get("agentId");
}

// Utility: Fetch agent from IndexedDB by agentId
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

            const getRequest = store.get(agentId); // agentId is the key
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

// Wait for everything to load
window.addEventListener("load", function () {
    console.log("Window loaded, initializing dashboard...");

    const agentId = getAgentIdFromUrl();
    if (!agentId) {
        console.error("No agentId found in URL");
        return;
    }

    // ✅ Ensure IndexedDB has been updated first
    window.agentDataReady
        .then(async () => {
            try {
                // ✅ Now safely read agent from IndexedDB
                const agentFromDB = await getAgentFromIndexedDB(agentId);
                console.log("Agent fetched from IndexedDB:", agentFromDB);

                // Wait for Chart.js etc.
                setTimeout(() => {
                    if (typeof Chart === "undefined") {
                        console.error("Chart.js not loaded, retrying...");
                        setTimeout(() => initializeDashboard(agentFromDB), 1000);
                        return;
                    }

                    initializeDashboard(agentFromDB);
                }, 100);
            } catch (err) {
                console.error("Failed to get agent data from IndexedDB:", err);
            }
        })
        .catch((err) => {
            console.error("Error waiting for agentDataReady:", err);
        });
});

async function initializeDashboard(agent) {
    console.log("Starting dashboard initialization...");

    try {
        populateAgentInfo(agent);
        populateServices(agent);
        populateReviews(agent);
        populateModificationHistory(agent);
        createActivityHeatmap(agent);

        setTimeout(() => {
            initializeCharts(agent);
            setupTimePeriodButtons();
        }, 200);

        console.log("Dashboard initialization complete");
    } catch (error) {
        console.error("Error initializing dashboard:", error);
    }
}
