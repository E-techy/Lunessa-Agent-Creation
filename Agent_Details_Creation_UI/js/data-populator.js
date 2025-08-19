// Data population utilities
class DataPopulator {
    static populateItemData(itemCard, data) {
        // Handle different data formats
        let itemName, itemCode, initialExplanation, steps = [], issues = [], solutions = [];
        
        // Parse JSON format
        if (data.Item) {
            itemName = data.Item.Name || data.Item.name;
            itemCode = data.Item.Code || data.Item.code;
            initialExplanation = data.Item.Description || data.Item.description;
            
            if (data.ImplementationSteps) {
                steps = data.ImplementationSteps.map(step => step.description || step.desc);
            }
            
            if (data.CommonIssuesAndSolutions) {
                data.CommonIssuesAndSolutions.forEach(item => {
                    issues.push(item.issue);
                    solutions.push(item.solution);
                });
            }
        }
        // Parse direct format or TXT parsed data
        else {
            itemName = data.itemName || data.name;
            itemCode = data.itemCode || data.code;
            initialExplanation = data.initialExplanation || data.description;
            steps = data.steps || [];
            issues = data.issues || [];
            solutions = data.solutions || [];
        }
        
        // Populate basic fields
        if (itemName) itemCard.querySelector('[name*="-name"]').value = itemName;
        if (itemCode) itemCard.querySelector('[name*="-code"]').value = itemCode;
        if (initialExplanation) itemCard.querySelector('[name*="-initial"]').value = initialExplanation;
        
        // Populate implementation steps
        if (steps && steps.length > 0) {
            const stepsContainer = itemCard.querySelector('.implementation-steps');
            const firstStep = stepsContainer.querySelector('.step-input');
            if (firstStep && steps[0]) {
                firstStep.value = steps[0];
            }
            
            // Add additional steps
            for (let i = 1; i < steps.length; i++) {
                const addStepBtn = itemCard.querySelector('.add-step-btn');
                addStepBtn.click();
                setTimeout(() => {
                    const stepInputs = stepsContainer.querySelectorAll('.step-input');
                    if (stepInputs[i]) {
                        stepInputs[i].value = steps[i];
                    }
                }, 100 * i); // Stagger the updates
            }
        }
        
        // Populate issues and solutions
        if (issues.length > 0 && solutions.length > 0) {
            const issuesContainer = itemCard.querySelector('.issues-solutions');
            const firstIssue = issuesContainer.querySelector('.issue-input');
            const firstSolution = issuesContainer.querySelector('.solution-input');
            
            if (firstIssue && issues[0]) firstIssue.value = issues[0];
            if (firstSolution && solutions[0]) firstSolution.value = solutions[0];
            
            // Add additional issue-solution pairs
            const maxLength = Math.max(issues.length, solutions.length);
            for (let i = 1; i < maxLength; i++) {
                const addIssueBtn = itemCard.querySelector('.add-issue-btn');
                addIssueBtn.click();
                setTimeout(() => {
                    const issueInputs = issuesContainer.querySelectorAll('.issue-input');
                    const solutionInputs = issuesContainer.querySelectorAll('.solution-input');
                    if (issueInputs[i] && issues[i]) issueInputs[i].value = issues[i];
                    if (solutionInputs[i] && solutions[i]) solutionInputs[i].value = solutions[i];
                }, 100 * i); // Stagger the updates
            }
        }
        
        // Update progress after a delay to ensure all fields are populated
        setTimeout(() => {
            if (window.progressTracker) {
                window.progressTracker.updateProgress();
            }
        }, Math.max(CONFIG.PROGRESS_UPDATE_DELAY, steps.length * 100 + issues.length * 100));
    }
}
