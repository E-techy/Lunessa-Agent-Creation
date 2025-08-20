// Mock agent data for demonstration
const MOCK_AGENTS = [
    {
        id: "AG001",
        agentName: "TechSolutions Pro",
        companyName: "TechSolutions Inc.",
        establishmentDate: "2018-03-15",
        ownerName: "Sarah Johnson",
        customerServiceNumber: "+1-555-0123",
        companyemail: "contact@techsolutions.com",
        companyDescription: "We provide cutting-edge software solutions for enterprise businesses, specializing in cloud infrastructure, AI integration, and digital transformation services.",
        agentUrl: "https://techsolutions-pro.agent-portal.com",
        products: [
            {
                name: "Cloud Infrastructure Setup",
                description: "Complete cloud migration and setup services",
                itemCode: "CIS-2025",
                implementationSteps: [
                    "Assess current infrastructure and requirements",
                    "Design cloud architecture and migration strategy",
                    "Set up cloud environments and security protocols",
                    "Migrate data and applications in phases",
                    "Test and validate all systems",
                    "Train staff and provide documentation"
                ],
                issuesAndSolutions: [
                    {
                        issue: "Data migration downtime concerns",
                        solution: "Implement phased migration with minimal downtime windows"
                    },
                    {
                        issue: "Security compliance requirements",
                        solution: "Apply industry-standard encryption and compliance frameworks"
                    },
                    {
                        issue: "Staff training and adoption",
                        solution: "Provide comprehensive training sessions and ongoing support"
                    }
                ]
            },
            {
                name: "AI Chatbot Integration",
                description: "Custom AI chatbot development and integration",
                itemCode: "ACI-2025",
                implementationSteps: [
                    "Analyze customer support requirements and use cases",
                    "Design chatbot conversation flows and responses",
                    "Develop and train AI models for specific industry needs",
                    "Integrate chatbot with existing systems and platforms",
                    "Test chatbot functionality and user experience",
                    "Deploy and monitor performance metrics"
                ],
                issuesAndSolutions: [
                    {
                        issue: "Limited understanding of complex queries",
                        solution: "Implement fallback to human agents for complex issues"
                    },
                    {
                        issue: "Integration compatibility issues",
                        solution: "Use standard APIs and middleware for seamless integration"
                    }
                ]
            }
        ]
    },
    {
        id: "AG002",
        agentName: "EcoGreen Solutions",
        companyName: "GreenTech Enterprises",
        establishmentDate: "2020-07-22",
        ownerName: "Michael Chen",
        customerServiceNumber: "+1-555-0456",
        companyemail: "info@greentech.com",
        companyDescription: "Environmental consulting and sustainable technology solutions for businesses looking to reduce their carbon footprint and implement eco-friendly practices.",
        agentUrl: "https://ecogreen-solutions.agent-portal.com",
        products: [
            {
                name: "Carbon Footprint Assessment",
                description: "Comprehensive environmental impact analysis",
                itemCode: "CFA-2025",
                implementationSteps: [
                    "Conduct initial environmental audit",
                    "Collect and analyze energy consumption data",
                    "Calculate carbon emissions across all operations",
                    "Identify major emission sources and patterns",
                    "Generate comprehensive assessment report",
                    "Provide recommendations for emission reduction"
                ],
                issuesAndSolutions: [
                    {
                        issue: "Incomplete data collection from multiple sources",
                        solution: "Use automated monitoring tools and standardized data collection protocols"
                    },
                    {
                        issue: "Difficulty tracking indirect emissions (Scope 3)",
                        solution: "Partner with suppliers to establish emission tracking systems"
                    }
                ]
            },
            {
                name: "Solar Panel Installation",
                description: "Commercial solar energy system installation",
                itemCode: "SPI-2025",
                implementationSteps: [
                    "Site assessment and energy needs analysis",
                    "Design optimal solar panel layout and configuration",
                    "Obtain necessary permits and regulatory approvals",
                    "Install mounting systems and solar panels",
                    "Connect electrical systems and grid integration",
                    "Test system performance and provide monitoring setup"
                ],
                issuesAndSolutions: [
                    {
                        issue: "Weather-dependent installation delays",
                        solution: "Plan installation during optimal weather windows with backup scheduling"
                    },
                    {
                        issue: "Grid integration complications",
                        solution: "Coordinate with utility companies early in the planning process"
                    },
                    {
                        issue: "Roof structural limitations",
                        solution: "Conduct thorough structural analysis and reinforce if necessary"
                    }
                ]
            },
            {
                name: "Sustainability Consulting",
                description: "Strategic planning for sustainable business practices",
                itemCode: "SC-2025",
                implementationSteps: [
                    "Assess current business practices and sustainability goals",
                    "Develop comprehensive sustainability strategy",
                    "Create implementation roadmap with timelines",
                    "Establish key performance indicators and metrics",
                    "Train staff on sustainable practices",
                    "Monitor progress and adjust strategies as needed"
                ],
                issuesAndSolutions: [
                    {
                        issue: "Resistance to change from existing processes",
                        solution: "Implement gradual changes with clear benefits communication"
                    },
                    {
                        issue: "Budget constraints for sustainability initiatives",
                        solution: "Prioritize high-impact, low-cost initiatives and seek green financing options"
                    }
                ]
            }
        ]
    },
    {
        id: "AG003",
        agentName: "HealthCare Connect",
        companyName: "MediCore Systems",
        establishmentDate: "2019-11-08",
        ownerName: "Dr. Emily Rodriguez",
        customerServiceNumber: "+1-555-0789",
        companyemail: "support@medicore.com",
        companyDescription: "Healthcare technology solutions including patient management systems, telemedicine platforms, and medical device integration services.",
        agentUrl: "https://healthcare-connect.agent-portal.com",
        products: [
            {
                name: "Patient Management System",
                description: "Complete patient records and scheduling system",
                itemCode: "PMS-2025",
                implementationSteps: [
                    "Analyze current patient data management workflows",
                    "Design database schema and user interface",
                    "Develop patient registration and scheduling modules",
                    "Implement security protocols and HIPAA compliance",
                    "Integrate with existing medical devices and systems",
                    "Train staff and provide ongoing technical support"
                ],
                issuesAndSolutions: [
                    {
                        issue: "Data migration from legacy systems",
                        solution: "Create automated data migration tools with validation checks"
                    },
                    {
                        issue: "Staff resistance to new digital workflows",
                        solution: "Provide comprehensive training and gradual system rollout"
                    },
                    {
                        issue: "HIPAA compliance requirements",
                        solution: "Implement end-to-end encryption and audit trail features"
                    }
                ]
            },
            {
                name: "Telemedicine Platform",
                description: "Secure video consultation platform",
                itemCode: "TP-2025",
                implementationSteps: [
                    "Assess technical requirements and bandwidth capabilities",
                    "Develop secure video conferencing infrastructure",
                    "Create patient portal and appointment scheduling system",
                    "Implement prescription and medical records integration",
                    "Test platform security and performance",
                    "Deploy platform and provide user training"
                ],
                issuesAndSolutions: [
                    {
                        issue: "Video quality issues due to poor internet connectivity",
                        solution: "Implement adaptive video quality and backup communication methods"
                    },
                    {
                        issue: "Patient privacy and data security concerns",
                        solution: "Use end-to-end encryption and secure cloud infrastructure"
                    }
                ]
            }
        ]
    }
];

// Agent management functions
class AgentDataManager {
    constructor() {
        this.agents = [...MOCK_AGENTS];
        this.currentEditingAgent = null;
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

        // Populate agent rows
        this.agents.forEach(agent => {
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
    }

    deleteAgent(agentId) {
        const agent = this.getAgentById(agentId);
        if (!agent) return;

        if (confirm(`Are you sure you want to delete the agent "${agent.agentName}"? This action cannot be undone.`)) {
            this.agents = this.agents.filter(a => a.id !== agentId);
            this.populateAgentList();
            
            // If we were editing this agent, clear the form
            if (this.currentEditingAgent && this.currentEditingAgent.id === agentId) {
                this.clearForm();
                this.switchToListView();
            }
        }
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
            const newAgent = {
                id: this.generateAgentId(),
                ...formData,
                agentUrl: `https://${formData.agentName.toLowerCase().replace(/\s+/g, '-')}.agent-portal.com`,
                products: formData.products || [] // Ensure products are included
            };
            this.agents.push(newAgent);
            console.log('Created new agent:', newAgent);
        }
        
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
}

// Initialize agent data manager
const agentDataManager = new AgentDataManager();

// Make it globally available
window.agentDataManager = agentDataManager;

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { AgentDataManager, MOCK_AGENTS };
}