document.addEventListener("DOMContentLoaded", () => {
  const yourAgentsBtn = document.getElementById("yourAgentsBtn");

  async function fetchYourAgents() {
    try {
      const response = await fetch("http://localhost:3002/get_agents", {
        method: "POST",
        credentials: "include", // 👈 cookies bhejne ke liye zaroori
        headers: {
          "Content-Type": "application/json"
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch agents. Status: ${response.status}`);
      }

      const data = await response.json();

      if (data.agentsList && Array.isArray(data.agentsList)) {
        // Save in localStorage
        localStorage.setItem("agentsList", JSON.stringify(data.agentsList));

        console.log("✅ Agents fetched and saved:", data.agentsList);
        alert("Agents list updated successfully!");
      } else {
        console.error("❌ Invalid response format:", data);
        alert("Failed to fetch agents. Invalid response format.");
      }
    } catch (error) {
      console.error("❌ Error fetching agents:", error);
      alert("Error fetching agents. Check console for details.");
    }
  }

  // Attach to button
  if (yourAgentsBtn) {
    yourAgentsBtn.addEventListener("click", fetchYourAgents);
  }
});
