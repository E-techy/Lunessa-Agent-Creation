// Progress bar management
class ProgressTracker {
    constructor(progressFill, progressPercent) {
        this.progressFill = progressFill;
        this.progressPercent = progressPercent;
        this.completionPercentage = 25;
    }
    
    updateProgress() {
        const filledFields = Array.from(document.querySelectorAll('input, textarea, select'))
            .filter(field => field.value.trim() !== '').length;
        
        const totalFields = document.querySelectorAll('input, textarea, select').length;
        const newPercentage = Math.min(100, Math.round((filledFields / totalFields) * 100));
        
        if (newPercentage !== this.completionPercentage) {
            this.completionPercentage = newPercentage;
            this.progressFill.style.width = `${this.completionPercentage}%`;
            this.progressPercent.textContent = `${this.completionPercentage}%`;
        }
    }
}
