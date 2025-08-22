document.getElementById("saveNewAgentBtn").addEventListener("click", async () => {
    // Prevent save during item removal
    if (window.isRemovingItem) {
        console.log('Save blocked: Item removal in progress');
        return;
    }
    // Collect main form values
    const agentName = document.getElementById("agentName").value.trim();
    const companyName = document.getElementById("companyName").value.trim();
    const establishmentDate = document.getElementById("establishmentDate").value.trim();
    const companyOwnerName = document.getElementById("ownerName").value.trim();
    const companyHumanServiceNumber = document.getElementById("customerServiceNumber").value.trim();
    const companyEmail = document.getElementById("companyemail").value.trim();
    const companyDescription = document.getElementById("companyDescription").value.trim();

    // Collect items from itemsContainer
    const items = [];
    document.querySelectorAll("#itemsContainer .item-card").forEach(itemCard => {
        const itemId = itemCard.id; // e.g., item-1, item-2

        const itemName = itemCard.querySelector(`#${itemId}-name`)?.value.trim() || "";
        const itemCode = itemCard.querySelector(`#${itemId}-code`)?.value.trim() || "";
        const itemInitialWorkingExplanation = itemCard.querySelector(`#${itemId}-initial`)?.value.trim() || "";

        // Collect steps → itemRunningSteps
        const itemRunningSteps = [];
        itemCard.querySelectorAll(`#${itemId}-steps-container .step-input`).forEach(input => {
            if (input.value.trim() !== "") itemRunningSteps.push(input.value.trim());
        });

        // Collect problems & solutions → commonProblemsSolutions
        const commonProblemsSolutions = [];
        itemCard.querySelectorAll(`#${itemId}-issues-container .issue-solution-row`).forEach(row => {
            const problem = row.querySelector(".issue-input")?.value.trim() || "";
            const solution = row.querySelector(".solution-input")?.value.trim() || "";
            if (problem || solution) {
                commonProblemsSolutions.push({ problem, solution });
            }
        });

        items.push({
            itemName,
            itemCode,
            itemInitialWorkingExplanation,
            itemRunningSteps,
            commonProblemsSolutions
        });
    });

    // Build request body
    const reqBody = {
        companyName,
        establishmentDate,
        companyOwnerName,
        companyHumanServiceNumber,
        companyEmail,
        companyDescription,
        agentName,
        items
    };

    try {
        console.log("Request Body:", JSON.stringify(reqBody, null, 2));
        
        const response = await fetch("/create_new_agent", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include", // ✅ ensures cookies are sent
            body: JSON.stringify(reqBody)
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || "Failed to save agent");
        }

        alert("Agent saved successfully!");
        console.log("Server Response:", data);
        const agentData = data.agent;
        console.log("agent Data:",agentData);
        
        const agentUrl = `http://localhost:3001/chat_agent?agentId=${data.agent.agentId}&agentName=${encodeURIComponent(data.agent.agentName)}`;
        console.log("agentUrl:", agentUrl);
        
        // Update localStorage with new agent data
        const currentAgents = JSON.parse(localStorage.getItem('agentsList') || '[]');
        const newAgentData = {
            agentId: data.agent.agentId,
            agentName: agentData.agentName,
            companyName: agentData.companyName,
            establishmentDate: agentData.establishmentDate,
            companyOwnerName: agentData.companyOwnerName,
            companyHumanServiceNumber: agentData.companyHumanServiceNumber,
            companyEmail: agentData.companyEmail,
            companyDescription: agentData.companyDescription,
            items: agentData.items
        };
        
        currentAgents.push(newAgentData);
        localStorage.setItem('agentsList', JSON.stringify(currentAgents));
        
        // Refresh the agent data manager if it exists
        if (window.agentDataManager) {
            window.agentDataManager.loadAgentsFromLocalStorage();
            window.agentDataManager.populateAgentList();
        }
        

    } catch (err) {
        console.error("Error saving agent:", err);
        alert("Error saving agent. Please try again.");
    }
});
