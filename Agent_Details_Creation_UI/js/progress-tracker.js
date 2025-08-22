// Progress bar management
class ProgressTracker {
    constructor(progressFill, progressPercent) {
        this.progressFill = progressFill;
        this.progressPercent = progressPercent;
        this.completionPercentage = 0;
    }
    
    updateProgress() {
        // Get all relevant form fields, excluding file inputs, hidden inputs, and readonly fields
        const allFields = Array.from(document.querySelectorAll('input, textarea, select'))
            .filter(field => {
                return field.type !== 'file' && 
                       field.type !== 'hidden' && 
                       !field.readOnly && 
                       !field.disabled &&
                       field.style.display !== 'none' &&
                       field.closest('.form-group, .step-input-group, .issue-solution-group');
            });
        
        const filledFields = allFields.filter(field => {
            const value = field.value.trim();
            return value !== '' && value !== null;
        });
        
        const totalFields = allFields.length;
        
        console.log(`Progress Update: ${filledFields.length}/${totalFields} fields filled`);
        
        // Calculate percentage
        const newPercentage = totalFields > 0 ? 
            Math.min(100, Math.round((filledFields.length / totalFields) * 100)) : 0;
        
        // Only update if percentage changed
        if (newPercentage !== this.completionPercentage) {
            this.completionPercentage = newPercentage;
            
            // Animate progress bar
            if (this.progressFill) {
                this.progressFill.style.transition = 'width 0.3s ease-out';
                this.progressFill.style.width = `${this.completionPercentage}%`;
            }
            
            // Update percentage text
            if (this.progressPercent) {
                this.progressPercent.textContent = `${this.completionPercentage}%`;
            }
            
            // Change progress bar color based on completion
            if (this.progressFill) {
                if (this.completionPercentage >= 100) {
                    this.progressFill.style.background = 'linear-gradient(90deg, #10b981, #059669)';
                } else if (this.completionPercentage >= 70) {
                    this.progressFill.style.background = 'linear-gradient(90deg, #3b82f6, #1e40af)';
                } else if (this.completionPercentage >= 40) {
                    this.progressFill.style.background = 'linear-gradient(90deg, #f59e0b, #d97706)';
                } else {
                    this.progressFill.style.background = 'linear-gradient(90deg, #ef4444, #dc2626)';
                }
            }
            
            console.log(`✅ Progress updated to ${this.completionPercentage}%`);
        }
    }
    
    // Manual trigger for progress update with slight delay
    triggerUpdate() {
        setTimeout(() => {
            this.updateProgress();
        }, 50);
    }
}
