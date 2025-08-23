// API Configuration
const API_CONFIG = {
    baseUrl: '/performance_metrics',
    credentials: 'include' // This ensures cookies/session data is sent with requests
};

// Global variable to store fetched data
let companyAgentsData = null;

/**
 * Fetches agent record data from the API
 * @returns {Promise<Object>} The agent record data
 */
async function fetchAgentRecord() {
    try {
        const response = await fetch(`${API_CONFIG.baseUrl}/agent_record`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: API_CONFIG.credentials,
            body: JSON.stringify({}) // Username will be extracted from session/auth
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
        if (data.error) {
            throw new Error(data.error);
        }

        return data;
    } catch (error) {
        console.error('Error fetching agent record:', error);
        throw error;
    }
}

/**
 * Updates the UI with user information
 * @param {Object} data - The agent record data
 */
function updateUserInfo(data) {
    const usernameElement = document.getElementById('username-display');
    const totalAgentsElement = document.getElementById('total-agents-display');
    
    if (usernameElement) {
        usernameElement.textContent = capitalizeWords(`username: ${data.username}`);
    }
    
    if (totalAgentsElement) {
        totalAgentsElement.textContent = capitalizeWords(`total agents: ${data.totalAgents}`);
    }
}

/**
 * Updates the agent count display
 * @param {number} count - Number of agents
 */
function updateAgentCount(count) {
    const agentCountElement = document.getElementById('agent-count-display');
    if (agentCountElement) {
        agentCountElement.textContent = `${count} agents`;
    }
}

/**
 * Creates and populates the agents table
 * @param {Array} agentRecord - Array of agent objects
 */
function populateAgentsTable(agentRecord) {
    const tbody = document.getElementById('agents-tbody');
    if (!tbody) {
        console.error('Agent table body not found');
        return;
    }

    // Clear existing content
    tbody.innerHTML = '';
    
    if (!agentRecord || agentRecord.length === 0) {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td colspan="2" class="no-agents-message">No agents found</td>
        `;
        tbody.appendChild(row);
        return;
    }

    agentRecord.forEach((agent, index) => {
        const row = document.createElement('tr');
        row.className = 'agent-row';
        
        row.innerHTML = `
            <td class="agent-name">${agent.agentName || 'Unknown Agent'}</td>
            <td><button class="agent-id-btn" data-agent-id="${agent.agentId}">${agent.agentId}</button></td>
        `;
        
        tbody.appendChild(row);
    });
}

/**
 * Handles navigation to agent performance page
 * @param {string} agentId - The agent ID to navigate to
 */
function navigateToAgentPerformance(agentId) {
    if (!agentId) {
        console.error('Agent ID is required for navigation');
        return;
    }

    // Construct the URL for the agent performance page
    const performanceUrl = `/performance_metrics?agentId=${encodeURIComponent(agentId)}`;
    
    // Open in new tab with credentials included
    window.open(performanceUrl, '_blank');
    
    // Log the navigation for debugging
    console.log(`Navigating to agent performance page for: ${agentId}`);
}

/**
 * Attaches event listeners to agent rows and buttons
 */
function attachEventListeners() {
    // Add click functionality to agent rows
    document.querySelectorAll('.agent-row').forEach(row => {
        row.addEventListener('click', function(e) {
            // Don't trigger row selection if clicking on the button
            if (e.target.classList.contains('agent-id-btn')) {
                return;
            }
            
            // Remove previous selections
            document.querySelectorAll('.agent-row').forEach(r => r.classList.remove('selected'));
            
            // Add selection to clicked row
            this.classList.add('selected');
            
            const agentName = this.querySelector('.agent-name').textContent;
            console.log(`Selected Agent: ${agentName}`);
        });
    });

    // Add click functionality to agent ID buttons
    document.querySelectorAll('.agent-id-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation(); // Prevent row selection
            
            const agentId = this.dataset.agentId;
            navigateToAgentPerformance(agentId);
        });
    });
}

/**
 * Capitalizes the first letter of each word in a string
 * @param {string} str - The string to capitalize
 * @returns {string} The capitalized string
 */
function capitalizeWords(str) {
    return str.replace(/\b\w/g, letter => letter.toUpperCase());
}

/**
 * Displays loading state in the UI
 */
function showLoadingState() {
    const usernameElement = document.getElementById('username-display');
    const totalAgentsElement = document.getElementById('total-agents-display');
    const agentCountElement = document.getElementById('agent-count-display');
    
    if (usernameElement) usernameElement.textContent = 'Username: Loading...';
    if (totalAgentsElement) totalAgentsElement.textContent = 'Total Agents: Loading...';
    if (agentCountElement) agentCountElement.textContent = 'Loading agents...';
}

/**
 * Displays error state in the UI
 * @param {string} errorMessage - The error message to display
 */
function showErrorState(errorMessage) {
    const usernameElement = document.getElementById('username-display');
    const totalAgentsElement = document.getElementById('total-agents-display');
    const agentCountElement = document.getElementById('agent-count-display');
    const tbody = document.getElementById('agents-tbody');
    
    if (usernameElement) usernameElement.textContent = 'Username: Error loading';
    if (totalAgentsElement) totalAgentsElement.textContent = 'Total Agents: Error loading';
    if (agentCountElement) agentCountElement.textContent = 'Error loading agents';
    
    if (tbody) {
        tbody.innerHTML = `
            <tr>
                <td colspan="2" class="error-message">Error loading agents: ${errorMessage}</td>
            </tr>
        `;
    }
    
    console.error('Error loading agent data:', errorMessage);
}

/**
 * Main function to populate agent data from API
 */
async function populateAgentData() {
    try {
        // Show loading state
        showLoadingState();
        
        // Fetch data from API
        const data = await fetchAgentRecord();
        
        // Store data globally for potential later use
        companyAgentsData = data;
        
        // Update UI components
        updateUserInfo(data);
        updateAgentCount(data.agentRecord ? data.agentRecord.length : 0);
        populateAgentsTable(data.agentRecord);
        
        // Attach event listeners after populating data
        attachEventListeners();
        
        console.log('Agent data loaded successfully:', data);
        
    } catch (error) {
        // Show error state
        showErrorState(error.message);
    }
}

/**
 * Animates the performance metrics with scale effect
 */
function animateMetrics() {
    const metrics = document.querySelectorAll('.metric-value');
    metrics.forEach((metric, index) => {
        setTimeout(() => {
            metric.style.transform = 'scale(1.1)';
            setTimeout(() => {
                metric.style.transform = 'scale(1)';
            }, 200);
        }, index * 100);
    });
}

/**
 * Initializes the page when DOM is loaded
 */
function initializePage() {
    console.log('Initializing Agent Selection page...');
    
    // Load agent data
    populateAgentData();
    
    // Animate metrics after a short delay
    setTimeout(animateMetrics, 500);
}

// Initialize page when DOM is loaded
document.addEventListener('DOMContentLoaded', initializePage);

// Export functions for potential external use
window.AgentSelection = {
    populateAgentData,
    fetchAgentRecord,
    navigateToAgentPerformance,
    getCompanyAgentsData: () => companyAgentsData
};