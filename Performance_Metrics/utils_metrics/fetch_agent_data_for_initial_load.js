

// Performance_Metrics/utils_metrics/fetch_agent_data_for_initial_load.js

// Loading agent id 
const urlParams = new URLSearchParams(window.location.search);

const agentId = urlParams.get("agentId");


// ✅ Function to open IndexedDB
function openAgentDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("PerformanceMetricsDB", 1);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains("agents")) {
        db.createObjectStore("agents", { keyPath: "agentId" });
      }
    };

    request.onsuccess = (event) => {
      resolve(event.target.result);
    };

    request.onerror = (event) => {
      reject("IndexedDB error: " + event.target.errorCode);
    };
  });
}

// ✅ Function to save agent in IndexedDB
async function saveAgentToDB(agent) {
  const db = await openAgentDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction("agents", "readwrite");
    const store = tx.objectStore("agents");
    const request = store.put(agent); // ✅ keyPath = agentId ensures unique

    request.onsuccess = () => resolve(agent);
    request.onerror = (event) => reject("Save error: " + event.target.errorCode);
  });
}

// ✅ Main function
async function fetchAgentDataForInitialLoad() {
  try {
    // 1. Get agentId from URL query params
    const urlParams = new URLSearchParams(window.location.search);
    const agentId = urlParams.get("agentId");

    if (!agentId) {
      throw new Error("agentId is required in URL query params");
    }

    // 2. Make POST request with credentials
    const response = await fetch(`/performance_metrics/all`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // 👈 for cookies (JWT)
      body: JSON.stringify({ agentId }), // ✅ sending agentId in request body
    });

    if (!response.ok) {
      throw new Error(`Server error: ${response.status}`);
    }

    const agents = await response.json(); // ✅ single agent object
    console.log("Fetched agent from API:", agents);

    // Create proper object to save
    const agentToSave = { ...agents, agentId: agents.agentBasicDetails.agentId };

    // 3. Save into IndexedDB
    await saveAgentToDB(agentToSave);

    // 4. Return the saved agent object
    return agentToSave;

  } catch (err) {
    console.error("Error fetching agent:", err);
    throw err;
  }
}

// Setting agent object for the global scope so that everyone can access it 

// Auto-run for initial load before the page loads
window.agentDataReady = (async () => {
  let agent = await fetchAgentDataForInitialLoad();
  console.log("Agent data stored in IndexedDB:", agent);
})();

