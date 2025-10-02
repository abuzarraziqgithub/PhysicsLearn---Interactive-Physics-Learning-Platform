/**
 * Smooth Scroll Implementation using Lenis
 * Provides buttery smooth scrolling experience
 * Created by Abuzar RaziQ
 */

class SmoothScrollManager {
    constructor() {
        this.lenis = null;
        this.init();
    }

    init() {
        // Check for performance preferences
        const useSimpleScroll = window.performanceManager && window.performanceManager.isLowEndDevice;
        
        if (useSimpleScroll) {
            console.log('Using simple scroll for performance');
            this.setupSimpleScroll();
            return;
        }

        // Initialize Lenis smooth scroll with lighter settings
        this.lenis = new Lenis({
            duration: 1.0, // Reduced from 1.2
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            direction: 'vertical',
            gestureDirection: 'vertical',
            smooth: true,
            mouseMultiplier: 0.8, // Reduced sensitivity
            smoothTouch: false,
            touchMultiplier: 1.5, // Reduced from 2
            infinite: false,
        });

        // Connect GSAP ScrollTrigger with Lenis
        this.lenis.on('scroll', () => {
            if (typeof ScrollTrigger !== 'undefined') {
                ScrollTrigger.update();
            }
        });

        // Register GSAP ticker
        if (typeof gsap !== 'undefined') {
            gsap.ticker.add((time) => {
                this.lenis.raf(time * 1000);
            });

            gsap.ticker.lagSmoothing(0);
        }

        // Start animation loop
        this.raf();

        // Handle resize
        window.addEventListener('resize', () => {
            this.lenis.resize();
        });

        // Handle anchor links
        this.setupAnchorLinks();
    }

    /**
     * Setup simple scroll for low-end devices
     */
    setupSimpleScroll() {
        // Just setup anchor links without smooth scrolling library
        this.setupAnchorLinks();
        
        // Add a simple smooth scroll behavior via CSS
        document.documentElement.style.scrollBehavior = 'smooth';
    }

    raf() {
        this.lenis.raf();
        requestAnimationFrame(() => this.raf());
    }

    setupAnchorLinks() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                const href = anchor.getAttribute('href');
                if (href !== '#') {
                    e.preventDefault();
                    const target = document.querySelector(href);
                    if (target) {
                        this.scrollTo(target);
                    }
                }
            });
        });
    }

    scrollTo(target, options = {}) {
        const defaultOptions = {
            offset: -80, // Account for fixed header
            duration: 1.5,
            easing: (t) => t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1
        };

        const finalOptions = { ...defaultOptions, ...options };

        this.lenis.scrollTo(target, finalOptions);
    }

    scrollToTop() {
        this.lenis.scrollTo(0, {
            duration: 2,
            easing: (t) => 1 - Math.pow(1 - t, 3)
        });
    }

    stop() {
        this.lenis.stop();
    }

    start() {
        this.lenis.start();
    }

    destroy() {
        this.lenis.destroy();
        if (typeof gsap !== 'undefined') {
            gsap.ticker.remove(this.raf);
        }
    }
}

// Initialize smooth scroll when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.smoothScroll = new SmoothScrollManager();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SmoothScrollManager;
}
