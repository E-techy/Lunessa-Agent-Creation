// Navigation controller for agent management interface
class NavigationController {
    constructor() {
        this.yourAgentsBtn = document.getElementById('yourAgentsBtn');
        this.createNewAgentBtn = document.getElementById('createNewAgentBtn');
        this.agentListView = document.getElementById('agentListView');
        this.companyForm = document.getElementById('company-form');
        
        this.currentView = 'agents'; // 'agents' or 'create'
        
        this.init();
    }
    
    init() {
        // Set initial state
        this.showAgentList();
        
        // Add event listeners
        this.yourAgentsBtn.addEventListener('click', () => {
            if (window.agentDataManager) {
                window.agentDataManager.switchToListView();
            } else {
                this.showAgentList();
            }
        });
        
        this.createNewAgentBtn.addEventListener('click', () => {
            if (window.agentDataManager) {
                window.agentDataManager.createNewAgent();
            } else {
                this.showCreateForm();
            }
        });
        
        // Add sample agents data for demonstration
        this.populateSampleAgents();
    }
    
    showAgentList() {
        // Update button states
        this.yourAgentsBtn.classList.add('active');
        this.yourAgentsBtn.classList.remove('nav-btn-primary');
        this.yourAgentsBtn.classList.add('nav-btn-primary');
        
        this.createNewAgentBtn.classList.remove('active');
        this.createNewAgentBtn.classList.remove('nav-btn-secondary');
        this.createNewAgentBtn.classList.add('nav-btn-secondary');
        
        // Show/hide content
        this.agentListView.style.display = 'block';
        this.companyForm.classList.remove('active');
        
        this.currentView = 'agents';
        
        // Show notification
        UIUtils.showNotification('Showing your agents list', 'info');
    }
    
    showCreateForm() {
        // Update button states
        this.createNewAgentBtn.classList.add('active');
        this.createNewAgentBtn.classList.remove('nav-btn-secondary');
        this.createNewAgentBtn.classList.add('nav-btn-secondary');
        
        this.yourAgentsBtn.classList.remove('active');
        this.yourAgentsBtn.classList.remove('nav-btn-primary');
        this.yourAgentsBtn.classList.add('nav-btn-primary');
        
        // Show/hide content
        this.agentListView.style.display = 'none';
        this.companyForm.classList.add('active');
        
        this.currentView = 'create';
        
        // Reset form
        const form = document.getElementById('companyAgentForm');
        if (form) {
            form.reset();
            // Reset progress if available
            if (window.progressTracker) {
                window.progressTracker.updateProgress();
            }
        }
        
        // Show notification
        UIUtils.showNotification('✨ Create your new agent profile', 'success');
        
        // Smooth scroll to form
        this.companyForm.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
    }
    
    populateSampleAgents() {
        const agentListContainer = document.getElementById('agentListContainer');
        if (!agentListContainer) return;
        
        const sampleAgents = [
            {
                id: 'AGT-001',
                name: 'TechSupport Assistant',
                url: 'https://agent.example.com/techsupport',
                company: 'TechCorp Solutions',
                createdDate: '2024-01-15'
            },
            {
                id: 'AGT-002', 
                name: 'Sales Helper Bot',
                url: 'https://agent.example.com/sales',
                company: 'SalesPro Inc',
                createdDate: '2024-02-20'
            }
        ];
        
        agentListContainer.innerHTML = sampleAgents.map(agent => `
            <div class=\"table-row\" onclick=\"NavigationController.viewAgentDetails('${agent.id}')\">
                <div class=\"table-cell\">
                    <button class=\"agent-name-btn\" onclick=\"NavigationController.viewAgentDetails('${agent.id}')\">
                        <div class=\"agent-info\">
                            <div class=\"agent-name\">${agent.name}</div>
                            <div class=\"agent-id\">${agent.id}</div>
                        </div>
                    </button>
                </div>
                <div class=\"table-cell\">
                    <a href=\"${agent.url}\" class=\"agent-url\" target=\"_blank\" onclick=\"event.stopPropagation()\">
                        ${agent.url}
                        <svg class=\"external-link\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\">
                            <path d=\"M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6\"></path>
                            <polyline points=\"15 3 21 3 21 9\"></polyline>
                            <line x1=\"10\" y1=\"14\" x2=\"21\" y2=\"3\"></line>
                        </svg>
                    </a>
                </div>
                <div class=\"table-cell\">
                    <div class=\"company-name\">${agent.company}</div>
                </div>
                <div class=\"table-cell agent-actions-cell\">
                    <button class=\"action-btn edit-btn\" onclick=\"NavigationController.editAgent('${agent.id}'); event.stopPropagation()\" title=\"Edit Agent\">
                        <svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\">
                            <path d=\"M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7\"></path>
                            <path d=\"M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z\"></path>
                        </svg>
                    </button>
                    <button class=\"action-btn delete-btn\" onclick=\"NavigationController.deleteAgent('${agent.id}'); event.stopPropagation()\" title=\"Delete Agent\">
                        <svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\">
                            <polyline points=\"3 6 5 6 21 6\"></polyline>
                            <path d=\"M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2\"></path>
                            <line x1=\"10\" y1=\"11\" x2=\"10\" y2=\"17\"></line>
                            <line x1=\"14\" y1=\"11\" x2=\"14\" y2=\"17\"></line>
                        </svg>
                    </button>
                </div>
            </div>
        `).join('');
        
        // Update agent count
        const agentCount = document.getElementById('agentCount');
        if (agentCount) {
            agentCount.textContent = `${sampleAgents.length} agent(s)`;
        }
    }
    
    // Static methods for global access
    static viewAgentDetails(agentId) {
        UIUtils.showNotification(`Viewing details for agent: ${agentId}`, 'info');
        console.log('View agent details:', agentId);
    }
    
    static editAgent(agentId) {
        UIUtils.showNotification(`Editing agent: ${agentId}`, 'warning');
        console.log('Edit agent:', agentId);
    }
    
    static deleteAgent(agentId) {
        if (confirm(`Are you sure you want to delete agent ${agentId}?`)) {
            UIUtils.showNotification(`Agent ${agentId} deleted successfully`, 'success');
            console.log('Delete agent:', agentId);
            // Here you would remove the agent from the list
        }
    }
}

// Export for use in other modules
window.NavigationController = NavigationController;
