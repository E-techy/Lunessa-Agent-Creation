/**
 * Renders the performance metrics UI
 * @param {Array} agents - Array of agents (each with only id & name)
 * @param {Array} agentDetailsData - Full agents array with details
 */
function renderPerformanceMetrics(agents, agentDetailsData) {
  const totalAgentsElement = document.getElementById("totalAgents");
  const agentsListElement = document.getElementById("agentsList");

  // Update total agents count
  totalAgentsElement.textContent = agents.length;

  // Clear old list
  agentsListElement.innerHTML = "";

  // Populate agents (only id + name shown)
  agents.forEach(agent => {
    const li = document.createElement("li");
    li.setAttribute("data-id", agent.id);

    const nameSpan = document.createElement("span");
    nameSpan.classList.add("agent-name");
    nameSpan.textContent = agent.name;

    const idSpan = document.createElement("span");
    idSpan.classList.add("agent-id");
    idSpan.textContent = agent.id;

    li.appendChild(nameSpan);
    li.appendChild(idSpan);

    // 🔹 Click handler → show details using full dataset
    li.addEventListener("click", () => {
      renderAgentDetails(agent.id, agentDetailsData);
    });

    agentsListElement.appendChild(li);
  });
}
