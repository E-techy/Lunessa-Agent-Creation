// Dynamic content management for steps and issues
class DynamicContentManager {
    constructor(progressTracker) {
        this.progressTracker = progressTracker;
    }
    
    setupDynamicButtons(itemCard, itemId) {
        const addStepBtn = itemCard.querySelector('.add-step-btn');
        const addIssueBtn = itemCard.querySelector('.add-issue-btn');
        const stepsContainer = itemCard.querySelector(`#${itemId}-steps-container`);
        const issuesContainer = itemCard.querySelector(`#${itemId}-issues-container`);

        let stepCount = 1;
        let issueCount = 1;

        // Add step functionality
        addStepBtn.addEventListener('click', () => {
            stepCount++;
            const stepGroup = document.createElement('div');
            stepGroup.className = 'step-input-group fade-in';
            stepGroup.innerHTML = TEMPLATES.stepInput(itemId, stepCount);
            
            stepsContainer.appendChild(stepGroup);
            
            // Show remove buttons if more than one step
            if (stepsContainer.children.length > 1) {
                stepsContainer.querySelectorAll('.remove-step-btn').forEach(btn => {
                    btn.style.display = 'flex';
                });
            }
            
            // Progress tracking will be handled automatically by the mutation observer
            this.progressTracker.triggerUpdate();
        });

        // Add issue & solution functionality
        addIssueBtn.addEventListener('click', () => {
            issueCount++;
            const issueGroup = document.createElement('div');
            issueGroup.className = 'issue-solution-group fade-in';
            issueGroup.innerHTML = TEMPLATES.issueInput(itemId, issueCount);
            
            issuesContainer.appendChild(issueGroup);
            
            // Show remove buttons if more than one issue
            if (issuesContainer.children.length > 1) {
                issuesContainer.querySelectorAll('.remove-issue-btn').forEach(btn => {
                    btn.style.display = 'flex';
                });
            }
            
            // Progress tracking will be handled automatically by the mutation observer
            this.progressTracker.triggerUpdate();
        });

        // Remove step functionality
        stepsContainer.addEventListener('click', (e) => {
            if (e.target.closest('.remove-step-btn')) {
                const stepGroup = e.target.closest('.step-input-group');
                UIUtils.animateRemoval(stepGroup, () => {
                    stepsContainer.removeChild(stepGroup);
                    
                    // Hide remove buttons if only one step left
                    if (stepsContainer.children.length === 1) {
                        stepsContainer.querySelectorAll('.remove-step-btn').forEach(btn => {
                            btn.style.display = 'none';
                        });
                    }
                    
                    // Renumber steps
                    const steps = stepsContainer.querySelectorAll('.step-input');
                    steps.forEach((step, index) => {
                        step.placeholder = `Step ${index + 1}: Enter implementation step`;
                    });
                    stepCount = steps.length;
                    
                    this.progressTracker.triggerUpdate();
                });
            }
        });

        // Remove issue functionality
        issuesContainer.addEventListener('click', (e) => {
            if (e.target.closest('.remove-issue-btn')) {
                const issueGroup = e.target.closest('.issue-solution-group');
                UIUtils.animateRemoval(issueGroup, () => {
                    issuesContainer.removeChild(issueGroup);
                    
                    // Hide remove buttons if only one issue left
                    if (issuesContainer.children.length === 1) {
                        issuesContainer.querySelectorAll('.remove-issue-btn').forEach(btn => {
                            btn.style.display = 'none';
                        });
                    }
                    
                    // Renumber issues
                    const issueInputs = issuesContainer.querySelectorAll('.issue-input');
                    const solutionInputs = issuesContainer.querySelectorAll('.solution-input');
                    issueInputs.forEach((input, index) => {
                        input.placeholder = `Issue ${index + 1}: Describe the problem`;
                    });
                    solutionInputs.forEach((input, index) => {
                        input.placeholder = `Solution ${index + 1}: Describe the solution`;
                    });
                    issueCount = issueInputs.length;
                    
                    this.progressTracker.triggerUpdate();
                });
            }
        });
    }
}
