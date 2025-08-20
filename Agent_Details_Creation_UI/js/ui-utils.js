// UI utilities and notifications
class UIUtils {
    static showNotification(message, type = 'success') {
        // Get background color based on type
        let backgroundColor;
        switch(type) {
            case 'success':
                backgroundColor = '#16A34A'; // green-600
                break;
            case 'error':
                backgroundColor = '#DC2626'; // red-600
                break;
            case 'warning':
                backgroundColor = '#D97706'; // orange-600
                break;
            case 'info':
                backgroundColor = 'linear-gradient(135deg, var(--accent), var(--accent-dark))'; 
                break;
            default:
                backgroundColor = '#16A34A';
        }
        
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div style="position: fixed; bottom: 20px; right: 20px; background: ${backgroundColor}; color: white; padding: 1rem 1.5rem; border-radius: 12px; box-shadow: 0 10px 30px rgba(0,0,0,0.2); display: flex; align-items: center; gap: 0.75rem; z-index: 1000; animation: fadeInUp 0.3s ease-out; max-width: 400px; font-weight: 500;">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width: 18px; height: 18px; flex-shrink: 0;">
                    ${ICONS[type] || ICONS.success}
                </svg>
                <span>${message}</span>
            </div>
        `;
        document.body.appendChild(notification);
        
        // Remove notification after duration
        setTimeout(() => {
            const notificationDiv = notification.firstElementChild;
            if (notificationDiv) {
                notificationDiv.style.opacity = '0';
                notificationDiv.style.transform = 'translateY(20px)';
                notificationDiv.style.transition = 'all 0.3s ease';
            }
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, CONFIG.ANIMATION_DELAY);
        }, CONFIG.NOTIFICATION_DURATION);
    }
    
    static injectStyles() {
        const style = document.createElement('style');
        style.innerHTML = `
            @keyframes spin {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
            }
            @keyframes fadeInUp {
                from { opacity: 0; transform: translateY(20px); }
                to { opacity: 1; transform: translateY(0); }
            }
        `;
        document.head.appendChild(style);
    }
    
    static animateRemoval(element, callback) {
        element.style.opacity = '0';
        element.style.transform = 'translateX(-20px)';
        element.style.transition = 'all 0.3s ease';
        
        setTimeout(callback, CONFIG.ANIMATION_DELAY);
    }
    
    static animateItemRemoval(element, callback) {
        element.style.opacity = '0';
        element.style.height = '0';
        element.style.padding = '0';
        element.style.margin = '0';
        element.style.overflow = 'hidden';
        element.style.transition = 'all 0.3s ease';
        
        setTimeout(callback, CONFIG.ANIMATION_DELAY);
    }
}
