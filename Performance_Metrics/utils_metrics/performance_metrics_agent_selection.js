// Company Agents Data
        const CompanyAgentsRegistered = {
            "username": "aman1234",
            "totalAgents": 50,
            "AgentRecord": [
                {
                    "agentName": "ghshfs",
                    "agentId": "ads4144"
                },
                {
                    "agentName": "ghshfs",
                    "agentId": "ads4144"
                },
                {
                    "agentName": "ghshfs",
                    "agentId": "ads4144"
                }
            ]
        };

        // Function to populate agent data
        // Function to capitalize first letter of each word
        function capitalizeWords(str) {
            return str.replace(/\b\w/g, letter => letter.toUpperCase());
        }

        function populateAgentData() {
            // Update user info with capitalized text
            document.getElementById('username-display').textContent = capitalizeWords(`username: ${CompanyAgentsRegistered.username}`);
            document.getElementById('total-agents-display').textContent = capitalizeWords(`total agents: ${CompanyAgentsRegistered.totalAgents}`);
            
            // Update agent count in section header
            const agentCount = CompanyAgentsRegistered.AgentRecord.length;
            document.getElementById('agent-count-display').textContent = `${agentCount} agents`;
            
            // Populate agents table
            const tbody = document.getElementById('agents-tbody');
            tbody.innerHTML = ''; // Clear existing content
            
            CompanyAgentsRegistered.AgentRecord.forEach((agent, index) => {
                const row = document.createElement('tr');
                row.className = 'agent-row';
                
                row.innerHTML = `
                    <td class="agent-name">${agent.agentName}</td>
                    <td><button class="agent-id-btn" data-agent-id="${agent.agentId}">${agent.agentId}</button></td>
                `;
                
                tbody.appendChild(row);
            });
            
            // Re-attach event listeners after populating data
            attachEventListeners();
        }

        // Function to attach event listeners
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
                    
                    // Replace this with actual navigation logic
                    alert(`Navigating to agent details page for: ${agentId}`);
                    
                    // Example navigation (uncomment and modify as needed):
                    // window.location.href = `/agent-details/${agentId}`;
                    // window.open(`/agent-details/${agentId}`, '_blank');
                });
            });
        }

        // Add animation to performance metrics
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

        // Initialize page when DOM is loaded
        document.addEventListener('DOMContentLoaded', function() {
            populateAgentData();
            setTimeout(animateMetrics, 500);
        });