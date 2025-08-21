// Function to toggle buttons based on mode (edit vs create)
function toggleButtonsForMode(isEditMode) {
    const modifyButton = document.querySelector('.modifyAgentDetailsBtn');
    const submitButton = document.querySelector('#saveNewAgentBtn');
    
    if (isEditMode) {
        // Show "Save Changes" button, hide "Submit Details" button
        if (modifyButton) {
            modifyButton.style.display = 'inline-flex';
        }
        if (submitButton) {
            submitButton.style.display = 'none';
        }
    } else {
        // Show "Submit Details" button, hide "Save Changes" button
        if (modifyButton) {
            modifyButton.style.display = 'none';
        }
        if (submitButton) {
            submitButton.style.display = 'inline-flex';
        }
    }
}

// Agent management functions
class AgentDataManager {
    constructor() {
        this.agents = [];
        this.currentEditingAgent = null;
        this.loadAgentsFromLocalStorage();
    }

    loadAgentsFromLocalStorage() {
        try {
            const storedAgents = localStorage.getItem('agentsList');
            if (storedAgents) {
                const parsedAgents = JSON.parse(storedAgents);
                if (Array.isArray(parsedAgents)) {
                    // Convert localStorage format to internal format
                    this.agents = parsedAgents.map(agent => this.convertFromStorageFormat(agent));
                    console.log('Loaded agents from localStorage:', this.agents);
                } else if (typeof parsedAgents === 'object') {
                    // Handle object format (indexed agents)
                    this.agents = Object.values(parsedAgents).map(agent => this.convertFromStorageFormat(agent));
                    console.log('Loaded agents from localStorage (object format):', this.agents);
                }
            }
        } catch (error) {
            console.error('Error loading agents from localStorage:', error);
            this.agents = [];
        }
    }

    convertFromStorageFormat(storageAgent) {
        // Convert from localStorage format to internal format
        const agent = {
            id: storageAgent.agentId || this.generateAgentId(),
            agentName: storageAgent.agentName || '',
            companyName: storageAgent.companyName || '',
            establishmentDate: storageAgent.establishmentDate ? 
                new Date(storageAgent.establishmentDate).toISOString().split('T')[0] : '',
            ownerName: storageAgent.companyOwnerName || '',
            customerServiceNumber: storageAgent.companyHumanServiceNumber || '',
            companyemail: storageAgent.companyEmail || '',
            companyDescription: storageAgent.companyDescription || '',
            agentUrl: `http://localhost:3001/chat_agent?agentId=${storageAgent.agentId}&agentName=${encodeURIComponent(storageAgent.agentName)}`,
            products: []
        };

        // Convert items to products format
        if (storageAgent.items && Array.isArray(storageAgent.items)) {
            agent.products = storageAgent.items.map(item => ({
                name: item.itemName || '',
                description: item.itemInitialWorkingExplanation || '',
                itemCode: item.itemCode || '',
                implementationSteps: item.itemRunningSteps || [],
                issuesAndSolutions: (item.commonProblemsSolutions || []).map(ps => ({
                    issue: ps.problem || '',
                    solution: ps.solution || ''
                }))
            }));
        }

        return agent;
    }

    getAllAgents() {
        return this.agents;
    }

    getAgentById(agentId) {
        return this.agents.find(agent => agent.id === agentId);
    }

    populateAgentList() {
        const agentListContainer = document.getElementById('agentListContainer');
        const agentCountElement = document.getElementById('agentCount');
        
        if (!agentListContainer) return;

        // Update agent count
        if (agentCountElement) {
            agentCountElement.textContent = `${this.agents.length} agent(s)`;
        }

        // Clear existing content
        agentListContainer.innerHTML = '';

        if (this.agents.length === 0) {
            agentListContainer.innerHTML = `
                <div class="no-agents-message">
                    <p>No agents found. Create your first agent or fetch from server.</p>
                </div>
            `;
            return;
        }

        // Sort agents by lastModified (newest first)
        this.agents
            .sort((a, b) => new Date(b.lastModified) - new Date(a.lastModified))
            .forEach(agent => {
                const agentRow = this.createAgentRow(agent);
                agentListContainer.appendChild(agentRow);
        });

    }

    createAgentRow(agent) {
        const row = document.createElement('div');
        row.className = 'table-row';
        row.innerHTML = `
            <div class="table-cell">
                <button class="agent-name-btn" onclick="agentDataManager.editAgent('${agent.id}')">
                    <div class="agent-info">
                        <div class="agent-name">${agent.agentName}</div>
                        <div class="agent-id">ID: ${agent.id}</div>
                    </div>
                </button>
            </div>
            <div class="table-cell">
                <a href="${agent.agentUrl}" target="_blank" class="agent-url">
                    ${agent.agentUrl}
                    <svg class="external-link" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                        <polyline points="15 3 21 3 21 9"></polyline>
                        <line x1="10" y1="14" x2="21" y2="3"></line>
                    </svg>
                </a>
            </div>
            <div class="table-cell">
                <div class="company-name">${agent.companyName}</div>
            </div>
            <div class="table-cell agent-actions-cell">
                <button class="action-btn edit-btn" onclick="agentDataManager.editAgent('${agent.id}')" title="Edit Agent">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                        <path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                    </svg>
                </button>
                <button class="action-btn delete-btn" onclick="agentDataManager.deleteAgent('${agent.id}')" title="Delete Agent">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        <line x1="10" y1="11" x2="10" y2="17"></line>
                        <line x1="14" y1="11" x2="14" y2="17"></line>
                    </svg>
                </button>
            </div>
        `;
        return row;
    }

    editAgent(agentId) {
        const agent = this.getAgentById(agentId);
        if (!agent) {
            console.error('Agent not found:', agentId);
            return;
        }

        this.currentEditingAgent = agent;
        this.populateForm(agent);
        this.switchToFormView();
        
        // Toggle buttons to show "Save Changes" and hide "Submit Details"
        toggleButtonsForMode(true);
    }

    populateForm(agent) {
        // Show and populate status indicator
        const statusIndicator = document.getElementById('formStatusIndicator');
        const statusText = document.getElementById('formStatusText');
        const agentIdGroup = document.getElementById('agentIdGroup');
        
        if (statusIndicator && statusText) {
            statusIndicator.style.display = 'flex';
            statusIndicator.className = 'status-indicator status-edit animate-in';
            statusText.innerHTML = `
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                </svg>
                Editing Agent: ${agent.agentName}
            `;
        }

        // Show and populate Agent ID field
        if (agentIdGroup) {
            agentIdGroup.style.display = 'flex';
        }

        // Populate form fields
        const formFields = {
            'agentId': agent.id,
            'agentName': agent.agentName,
            'companyName': agent.companyName,
            'establishmentDate': agent.establishmentDate,
            'ownerName': agent.ownerName,
            'customerServiceNumber': agent.customerServiceNumber,
            'companyemail': agent.companyemail,
            'companyDescription': agent.companyDescription
        };

        // Fill form fields
        Object.entries(formFields).forEach(([fieldId, value]) => {
            const field = document.getElementById(fieldId);
            if (field) {
                field.value = value || '';
                
                // Make agent name read-only for existing agents
                if (fieldId === 'agentName') {
                    field.readOnly = true;
                    field.style.backgroundColor = '#f9fafb';
                    field.style.color = '#6b7280';
                }
            }
        });

        // Clear and populate products/services with a slight delay to ensure form is ready
        setTimeout(() => {
            this.populateProducts(agent.products || []);
        }, 100);

        // Update progress bar after form population
        setTimeout(() => {
            if (window.progressTracker) {
                window.progressTracker.updateProgress();
            }
        }, 300);
    }

    populateProducts(products) {
        const itemsContainer = document.getElementById('itemsContainer');
        if (!itemsContainer) return;

        // Clear existing items
        itemsContainer.innerHTML = '';

        // Add each product
        products.forEach((product, index) => {
            if (window.ItemManager) {
                window.ItemManager.addItem();
                
                // Wait a moment for the item to be added, then populate it
                setTimeout(() => {
                    const itemCards = itemsContainer.querySelectorAll('.item-card');
                    const itemCard = itemCards[index];
                    
                    if (itemCard) {
                        // Get the item ID from the card
                        const itemId = itemCard.id;
                        
                        // Find inputs using the correct naming pattern from config.js template
                        const nameInput = itemCard.querySelector(`input[name="${itemId}-name"]`);
                        const descInput = itemCard.querySelector(`textarea[name="${itemId}-initial"]`); // Using initial working explanation
                        const codeInput = itemCard.querySelector(`input[name="${itemId}-code"]`);
                        
                        // Populate the fields
                        if (nameInput) nameInput.value = product.name || '';
                        if (descInput) descInput.value = product.description || '';
                        if (codeInput) {
                            codeInput.value = product.itemCode || '';
                        }
                        
                        // Populate implementation steps
                        if (product.implementationSteps && product.implementationSteps.length > 0) {
                            this.populateImplementationSteps(itemId, product.implementationSteps);
                        }
                        
                        // Populate issues and solutions
                        if (product.issuesAndSolutions && product.issuesAndSolutions.length > 0) {
                            this.populateIssuesAndSolutions(itemId, product.issuesAndSolutions);
                        }
                        
                        // Update progress after populating
                        if (window.progressTracker) {
                            setTimeout(() => {
                                window.progressTracker.updateProgress();
                            }, 50);
                        }
                    }
                }, 200 * index); // Increased delay to ensure proper rendering
            }
        });
        
        // Update progress after all items are loaded
        setTimeout(() => {
            if (window.progressTracker) {
                window.progressTracker.updateProgress();
            }
        }, 200 * products.length + 300);
    }

    switchToFormView() {
        // Hide agent list view
        const agentListView = document.getElementById('agentListView');
        if (agentListView) {
            agentListView.style.display = 'none';
        }

        // Show company form
        const companyForm = document.getElementById('company-form');
        if (companyForm) {
            companyForm.classList.add('active');
            companyForm.style.display = 'block';
        }

        // Update navigation buttons
        const yourAgentsBtn = document.getElementById('yourAgentsBtn');
        const createNewAgentBtn = document.getElementById('createNewAgentBtn');
        
        if (yourAgentsBtn) {
            yourAgentsBtn.classList.remove('active');
        }
        if (createNewAgentBtn) {
            createNewAgentBtn.classList.add('active');
        }

        // Scroll to form
        if (companyForm) {
            companyForm.scrollIntoView({ behavior: 'smooth' });
        }
    }

    createNewAgent() {
        this.currentEditingAgent = null;
        this.clearForm();
        
        // Show create status indicator
        const statusIndicator = document.getElementById('formStatusIndicator');
        const statusText = document.getElementById('formStatusText');
        
        if (statusIndicator && statusText) {
            statusIndicator.style.display = 'flex';
            statusIndicator.className = 'status-indicator status-create animate-in';
            statusText.innerHTML = `
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
                Creating New Agent
            `;
        }
        
        this.switchToFormView();
        
        // Toggle buttons to show "Submit Details" and hide "Save Changes"
        toggleButtonsForMode(false);
    }

    clearForm() {
        // Hide status indicator
        const statusIndicator = document.getElementById('formStatusIndicator');
        const statusText = document.getElementById('formStatusText');
        const agentIdGroup = document.getElementById('agentIdGroup');
        
        if (statusIndicator) {
            statusIndicator.style.display = 'none';
        }
        
        if (agentIdGroup) {
            agentIdGroup.style.display = 'none';
        }

        // Clear all form fields
        const form = document.getElementById('companyAgentForm');
        if (form) {
            form.reset();
        }

        // Make agent name editable again
        const agentNameField = document.getElementById('agentName');
        if (agentNameField) {
            agentNameField.readOnly = false;
            agentNameField.style.backgroundColor = '';
            agentNameField.style.color = '';
        }

        // Clear items container
        const itemsContainer = document.getElementById('itemsContainer');
        if (itemsContainer) {
            itemsContainer.innerHTML = '';
        }

        // Reset progress
        if (window.progressTracker) {
            window.progressTracker.updateProgress();
        }
    }

    switchToListView() {
        // Show agent list view
        const agentListView = document.getElementById('agentListView');
        if (agentListView) {
            agentListView.style.display = 'block';
        }

        // Hide company form
        const companyForm = document.getElementById('company-form');
        if (companyForm) {
            companyForm.classList.remove('active');
            companyForm.style.display = 'none';
        }

        // Update navigation buttons
        const yourAgentsBtn = document.getElementById('yourAgentsBtn');
        const createNewAgentBtn = document.getElementById('createNewAgentBtn');
        
        if (yourAgentsBtn) {
            yourAgentsBtn.classList.add('active');
        }
        if (createNewAgentBtn) {
            createNewAgentBtn.classList.remove('active');
        }
        
        // Reset button visibility when going back to list view
        toggleButtonsForMode(false);
    }

    async deleteAgent(agentId) {
    const agent = this.getAgentById(agentId);
    if (!agent) return;

    if (confirm(`Are you sure you want to delete the agent "${agent.agentName}"? This action cannot be undone.`)) {
        try {
            // Send request to backend
            const response = await fetch(`/delete_agent?agentId=${agentId}`, {
                method: "POST",
                credentials: "include" // important: sends cookies for auth
            });

            const result = await response.json();
            console.log("Delete Agent Response:", result);

            if (result.success) {
                // Remove from local list only if server confirmed deletion
                this.agents = this.agents.filter(a => a.id !== agentId);

                // Update localStorage
                this.updateLocalStorage();

                // Refresh the display
                this.populateAgentList();

                // If we were editing this agent, clear the form
                if (this.currentEditingAgent && this.currentEditingAgent.id === agentId) {
                    this.clearForm();
                    this.switchToListView();
                }
            } else {
                alert(`Failed to delete agent: ${result.message}`);
            }
        } catch (err) {
            console.error("❌ Error deleting agent:", err);
            alert("An error occurred while deleting the agent.");
        }
    }
}


    updateLocalStorage() {
        try {
            // Convert back to storage format
            const storageFormat = this.agents.map(agent => this.convertToStorageFormat(agent));
            // localStorage.setItem('agentsList', JSON.stringify(storageFormat));
            console.log('Updated localStorage with agents:', storageFormat);
        } catch (error) {
            console.error('Error updating localStorage:', error);
        }
    }

    convertToStorageFormat(agent) {
        return {
            agentId: agent.id,
            agentName: agent.agentName,
            companyName: agent.companyName,
            establishmentDate: agent.establishmentDate ? new Date(agent.establishmentDate).toISOString() : '',
            companyOwnerName: agent.ownerName,
            companyHumanServiceNumber: agent.customerServiceNumber,
            companyEmail: agent.companyemail,
            companyDescription: agent.companyDescription,
            items: agent.products.map(product => ({
                itemName: product.name,
                itemCode: product.itemCode,
                itemInitialWorkingExplanation: product.description,
                itemRunningSteps: product.implementationSteps,
                commonProblemsSolutions: product.issuesAndSolutions.map(is => ({
                    problem: is.issue,
                    solution: is.solution
                }))
            }))
        };
    }

    saveAgent(formData) {
        console.log('Saving agent with data:', formData);
        
        if (this.currentEditingAgent) {
            // Update existing agent
            const agentIndex = this.agents.findIndex(a => a.id === this.currentEditingAgent.id);
            if (agentIndex !== -1) {
                // Preserve the original ID and URL for existing agents
                this.agents[agentIndex] = { 
                    ...this.agents[agentIndex], 
                    ...formData,
                    id: this.currentEditingAgent.id,
                    agentUrl: this.currentEditingAgent.agentUrl,
                    products: formData.products || [] // Ensure products are included
                };
                console.log('Updated existing agent:', this.agents[agentIndex]);
            }
        } else {
            // Create new agent
            // const newAgent = {
            //     id: this.generateAgentId(),
            //     ...formData,
            //     agentUrl: `http://localhost:3001/chat_agent?agentId=${formData.agentName.toLowerCase().replace(/\s+/g, '-')}&agentName=${encodeURIComponent(formData.agentName)}`,
            //     products: formData.products || [] // Ensure products are included
            // };
            // this.agents.push(newAgent);
            // console.log('Created new agent:', newAgent);
        }
        
        // Update localStorage
        this.updateLocalStorage();
        
        // Refresh the agent list to show updated data
        this.populateAgentList();
        return true;
    }

    generateAgentId() {
        const existingIds = this.agents.map(a => a.id);
        let counter = 1;
        let newId;
        
        do {
            newId = `AG${counter.toString().padStart(3, '0')}`;
            counter++;
        } while (existingIds.includes(newId));
        
        return newId;
    }

    populateImplementationSteps(itemId, steps) {
        const stepsContainer = document.getElementById(`${itemId}-steps-container`);
        if (!stepsContainer) return;

        // Clear existing steps (keep first step input)
        const existingSteps = stepsContainer.querySelectorAll('.step-input-group');
        existingSteps.forEach((step, index) => {
            if (index > 0) { // Keep the first step, remove others
                step.remove();
            }
        });

        // Populate steps
        steps.forEach((stepText, index) => {
            if (index === 0) {
                // Populate first existing step
                const firstStepInput = stepsContainer.querySelector(`input[name="${itemId}-step-1"]`);
                if (firstStepInput) {
                    firstStepInput.value = stepText;
                }
            } else {
                // Add new step
                const stepCount = index + 1;
                const stepGroup = document.createElement('div');
                stepGroup.className = 'step-input-group';
                stepGroup.innerHTML = `
                    <input type="text" name="${itemId}-step-${stepCount}" placeholder="Step ${stepCount}: Enter implementation step" class="step-input" value="${stepText}">
                    <button type="button" class="remove-step-btn">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                `;
                stepsContainer.appendChild(stepGroup);

                // Add event listener for remove button
                const removeBtn = stepGroup.querySelector('.remove-step-btn');
                if (removeBtn && window.EventListeners) {
                    removeBtn.addEventListener('click', window.EventListeners.handleRemoveStep);
                }
            }
        });

        // Show remove buttons if there are multiple steps
        if (steps.length > 1) {
            const removeButtons = stepsContainer.querySelectorAll('.remove-step-btn');
            removeButtons.forEach(btn => btn.style.display = 'flex');
        }
    }

    populateIssuesAndSolutions(itemId, issuesAndSolutions) {
        const issuesContainer = document.getElementById(`${itemId}-issues-container`);
        if (!issuesContainer) return;

        // Clear existing issues (keep first issue input)
        const existingIssues = issuesContainer.querySelectorAll('.issue-solution-group');
        existingIssues.forEach((issue, index) => {
            if (index > 0) { // Keep the first issue, remove others
                issue.remove();
            }
        });

        // Populate issues and solutions
        issuesAndSolutions.forEach((item, index) => {
            if (index === 0) {
                // Populate first existing issue
                const firstIssueInput = issuesContainer.querySelector(`input[name="${itemId}-issue-1"]`);
                const firstSolutionInput = issuesContainer.querySelector(`input[name="${itemId}-solution-1"]`);
                if (firstIssueInput) firstIssueInput.value = item.issue;
                if (firstSolutionInput) firstSolutionInput.value = item.solution;
            } else {
                // Add new issue-solution pair
                const issueCount = index + 1;
                const issueGroup = document.createElement('div');
                issueGroup.className = 'issue-solution-group';
                issueGroup.innerHTML = `
                    <div class="issue-solution-row">
                        <input type="text" name="${itemId}-issue-${issueCount}" placeholder="Issue ${issueCount}: Describe the problem" class="issue-input" value="${item.issue}">
                        <input type="text" name="${itemId}-solution-${issueCount}" placeholder="Solution ${issueCount}: Describe the solution" class="solution-input" value="${item.solution}">
                        <button type="button" class="remove-issue-btn">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        </button>
                    </div>
                `;
                issuesContainer.appendChild(issueGroup);

                // Add event listener for remove button
                const removeBtn = issueGroup.querySelector('.remove-issue-btn');
                if (removeBtn && window.EventListeners) {
                    removeBtn.addEventListener('click', window.EventListeners.handleRemoveIssue);
                }
            }
        });

        // Show remove buttons if there are multiple issues
        if (issuesAndSolutions.length > 1) {
            const removeButtons = issuesContainer.querySelectorAll('.remove-issue-btn');
            removeButtons.forEach(btn => btn.style.display = 'flex');
        }
    }

    // Method to refresh agents from server and update localStorage
    async fetchAgentsFromServer() {
        try {
            const response = await fetch("http://localhost:3002/get_agents", {
                method: "POST",
                credentials: "include",
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
                
                // Reload agents from localStorage
                this.loadAgentsFromLocalStorage();
                
                // Refresh the display
                this.populateAgentList();

                console.log("✅ Agents fetched and updated:", data.agentsList);
                alert("Agents list updated successfully!");
                return true;
            } else {
                console.error("❌ Invalid response format:", data);
                alert("Failed to fetch agents. Invalid response format.");
                return false;
            }
        } catch (error) {
            console.error("❌ Error fetching agents:", error);
            alert("Error fetching agents. Check console for details.");
            return false;
        }
    }
}

// Initialize agent data manager
const agentDataManager = new AgentDataManager();

// Make it globally available
window.agentDataManager = agentDataManager;

// DOM Content Loaded Event Handler
document.addEventListener("DOMContentLoaded", () => {
    // Populate agent list on page load
    agentDataManager.populateAgentList();

    // Attach fetch functionality to "Your Agents" button
    const yourAgentsBtn = document.getElementById("yourAgentsBtn");
    if (yourAgentsBtn) {
        yourAgentsBtn.addEventListener("click", async () => {
            // Switch to list view first
            agentDataManager.switchToListView();
            
            // Try to fetch fresh data from server
            await agentDataManager.fetchAgentsFromServer();
        });
    }

    // Attach create new agent functionality
    const createNewAgentBtn = document.getElementById("createNewAgentBtn");
    if (createNewAgentBtn) {
        createNewAgentBtn.addEventListener("click", () => {
            agentDataManager.createNewAgent();
        });
    }
});

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { AgentDataManager };
}