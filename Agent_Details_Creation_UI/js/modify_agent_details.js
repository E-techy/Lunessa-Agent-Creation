document.addEventListener("DOMContentLoaded", () => {
  const modifyBtns = document.querySelectorAll(".modifyAgentDetailsBtn");

  modifyBtns.forEach(btn => {
    btn.addEventListener("click", async () => {
      // Collect main form values
      const agentId = document.getElementById("agentId").value.trim();
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
        console.log("Modify Request Body:", JSON.stringify(reqBody, null, 2));

        const response = await fetch(`/modify_agent_details?agentId=${encodeURIComponent(agentId)}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          credentials: "include", // ✅ ensures cookies are sent
          body: JSON.stringify(reqBody)
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to modify agent");
        }

        alert("Agent modified successfully!");
        console.log("Server Response:", data);

      } catch (err) {
        console.error("❌ Error modifying agent:", err);
        alert("Error modifying agent. Please try again.");
      }
    });
  });
});
