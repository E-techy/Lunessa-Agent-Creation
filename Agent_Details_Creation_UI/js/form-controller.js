// Form submission and validation
// class FormController {
//     constructor(form, itemManager) {
//         this.form = form;
//         this.itemManager = itemManager;
//         this.setupFormSubmission();
//     }
    
//     setupFormSubmission() {
//         this.form.addEventListener('submit', (e) => {
//             e.preventDefault();
//             this.handleSubmit();
//         });
//     }
    
//     handleSubmit() {
//         // Show loading state
//         const submitBtn = this.form.querySelector('button[type="submit"]');
//         const originalText = submitBtn.innerHTML;
//         submitBtn.innerHTML = `
//             <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="animate-spin" style="animation: spin 1s linear infinite;">
//                 ${ICONS.loading}
//             </svg>
//             Processing...
//         `;
//         submitBtn.disabled = true;
        
//         // Simulate API call
//         setTimeout(() => {
//             // Reset form
//             submitBtn.innerHTML = originalText;
//             submitBtn.disabled = false;
            
//             // Show success message
//             const notification = document.createElement('div');
//             notification.className = 'success-notification';
//             notification.innerHTML = `
//                 <div style="position: fixed; bottom: 20px; right: 20px; background: var(--success); color: white; padding: 1rem 1.5rem; border-radius: var(--radius); box-shadow: var(--shadow-lg); display: flex; align-items: center; gap: 0.5rem; z-index: 1000; animation: fadeInUp 0.3s ease-out;">
//                     <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
//                         ${ICONS.success}
//                     </svg>
//                     Company details submitted successfully!
//                 </div>
//             `;
//             document.body.appendChild(notification);
            
//             // Remove notification after duration
//             setTimeout(() => {
//                 notification.style.opacity = '0';
//                 notification.style.transform = 'translateY(20px)';
//                 notification.style.transition = 'all 0.3s ease';
//                 setTimeout(() => {
//                     document.body.removeChild(notification);
//                 }, CONFIG.ANIMATION_DELAY);
//             }, CONFIG.NOTIFICATION_DURATION);
            
//             // Reset form
//             this.form.reset();
//             this.itemManager.resetItems();
//         }, CONFIG.FORM_SUBMIT_DELAY);
//     }
// }
