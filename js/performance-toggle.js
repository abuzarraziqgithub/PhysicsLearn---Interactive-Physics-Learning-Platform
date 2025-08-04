/**
 * Performance Toggle for Users
 * Created by Abuzar RaziQ - https://github.com/abuzarraziqgithub
 * Allows users to enable/disable performance-heavy features
 */

class PerformanceToggle {
    constructor() {
        this.isAdvancedMode = false;
        this.init();
    }

    init() {
        this.createToggleButton();
        this.loadUserPreference();
    }

    createToggleButton() {
        // Create toggle button
        const toggleButton = document.createElement('button');
        toggleButton.innerHTML = `
            <i class="fas fa-tachometer-alt"></i>
            <span class="toggle-text">Performance Mode</span>
        `;
        toggleButton.className = 'performance-toggle-btn';
        toggleButton.setAttribute('aria-label', 'Toggle performance mode');
        toggleButton.title = 'Click to toggle between performance and visual quality';

        // Add styles
        const style = document.createElement('style');
        style.textContent = `
            .performance-toggle-btn {
                position: fixed;
                bottom: 20px;
                right: 20px;
                background: rgba(78, 205, 196, 0.9);
                color: white;
                border: none;
                border-radius: 50px;
                padding: 12px 20px;
                font-size: 14px;
                font-weight: 500;
                cursor: pointer;
                backdrop-filter: blur(10px);
                transition: all 0.3s ease;
                z-index: 1000;
                box-shadow: 0 4px 15px rgba(78, 205, 196, 0.3);
                display: flex;
                align-items: center;
                gap: 8px;
            }

            .performance-toggle-btn:hover {
                background: rgba(78, 205, 196, 1);
                transform: translateY(-2px);
                box-shadow: 0 6px 20px rgba(78, 205, 196, 0.4);
            }

            .performance-toggle-btn.advanced-mode {
                background: rgba(255, 107, 107, 0.9);
            }

            .performance-toggle-btn.advanced-mode:hover {
                background: rgba(255, 107, 107, 1);
                box-shadow: 0 6px 20px rgba(255, 107, 107, 0.4);
            }

            .performance-toggle-btn i {
                font-size: 16px;
            }

            @media (max-width: 768px) {
                .performance-toggle-btn {
                    bottom: 10px;
                    right: 10px;
                    padding: 10px 16px;
                    font-size: 12px;
                }
                
                .performance-toggle-btn .toggle-text {
                    display: none;
                }
            }
        `;
        document.head.appendChild(style);

        // Add event listener
        toggleButton.addEventListener('click', () => {
            this.togglePerformanceMode();
        });

        // Add to page
        document.body.appendChild(toggleButton);
        this.toggleButton = toggleButton;
    }

    togglePerformanceMode() {
        this.isAdvancedMode = !this.isAdvancedMode;
        this.saveUserPreference();
        this.applyPerformanceMode();
        this.updateButtonState();
        
        // Show notification
        this.showNotification(
            this.isAdvancedMode ? 
            'Advanced visuals enabled! Enjoy the full experience.' : 
            'Performance mode enabled! Smoother experience on slower devices.'
        );
    }

    applyPerformanceMode() {
        if (this.isAdvancedMode) {
            // Enable advanced features
            document.documentElement.classList.remove('low-end-device');
            window.DISABLE_3D_BACKGROUNDS = false;
            window.PARTICLE_COUNT_MULTIPLIER = 1;
            
            // Show particles and 3D backgrounds
            document.querySelectorAll('.particles-container, .three-container').forEach(el => {
                el.style.display = 'block';
            });
            
            // Reinitialize effects if available
            if (window.particlesManager) {
                window.particlesManager.init();
            }
            
            console.log('Advanced mode enabled');
        } else {
            // Enable performance mode
            document.documentElement.classList.add('low-end-device');
            window.DISABLE_3D_BACKGROUNDS = true;
            window.PARTICLE_COUNT_MULTIPLIER = 0;
            
            // Hide particles and 3D backgrounds
            document.querySelectorAll('.particles-container, .three-container').forEach(el => {
                el.style.display = 'none';
            });
            
            // Destroy particles if available
            if (window.particlesManager) {
                window.particlesManager.destroy();
            }
            
            console.log('Performance mode enabled');
        }
    }

    updateButtonState() {
        if (this.isAdvancedMode) {
            this.toggleButton.classList.add('advanced-mode');
            this.toggleButton.querySelector('.toggle-text').textContent = 'Advanced Mode';
            this.toggleButton.querySelector('i').className = 'fas fa-sparkles';
            this.toggleButton.title = 'Click to enable performance mode';
        } else {
            this.toggleButton.classList.remove('advanced-mode');
            this.toggleButton.querySelector('.toggle-text').textContent = 'Performance Mode';
            this.toggleButton.querySelector('i').className = 'fas fa-tachometer-alt';
            this.toggleButton.title = 'Click to enable advanced visuals';
        }
    }

    saveUserPreference() {
        localStorage.setItem('physicslearn-performance-mode', this.isAdvancedMode ? 'advanced' : 'performance');
    }

    loadUserPreference() {
        const saved = localStorage.getItem('physicslearn-performance-mode');
        
        if (saved === 'advanced') {
            this.isAdvancedMode = true;
        } else if (saved === 'performance') {
            this.isAdvancedMode = false;
        } else {
            // Auto-detect based on device capabilities
            this.isAdvancedMode = window.performanceManager ? 
                !window.performanceManager.isLowEndDevice : 
                navigator.hardwareConcurrency > 4;
        }
        
        this.applyPerformanceMode();
        this.updateButtonState();
    }

    showNotification(message) {
        // Create notification element
        const notification = document.createElement('div');
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: rgba(78, 205, 196, 0.95);
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            font-size: 14px;
            font-weight: 500;
            z-index: 10000;
            backdrop-filter: blur(10px);
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
            transform: translateX(100%);
            transition: transform 0.3s ease;
            max-width: 300px;
        `;

        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        // Animate out and remove
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Small delay to ensure other systems are initialized
    setTimeout(() => {
        window.performanceToggle = new PerformanceToggle();
    }, 1000);
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PerformanceToggle;
}
