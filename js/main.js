/**
 * PhysicsLearn - Main JavaScript File
 * Handles core functionality including navigation, animations, and user interactions
 */

class PhysicsLearnApp {
    constructor() {
        this.init();
    }

    /**
     * Initialize the application
     */
    init() {
        this.setupEventListeners();
        this.initializeAnimations();
        this.setupAccessibility();
        this.handlePageLoad();
    }

    /**
     * Set up all event listeners
     */
    setupEventListeners() {
        // DOM loaded event
        document.addEventListener('DOMContentLoaded', () => {
            this.onDOMLoaded();
        });

        // Window events
        window.addEventListener('load', () => {
            this.onWindowLoad();
        });

        window.addEventListener('resize', this.debounce(() => {
            this.handleResize();
        }, 250));

        window.addEventListener('scroll', this.throttle(() => {
            this.handleScroll();
        }, 16)); // ~60fps

        // Navigation events
        this.setupNavigationEvents();
        
        // Form events
        this.setupFormEvents();
        
        // Button click events
        this.setupButtonEvents();
    }

    /**
     * Handle DOM content loaded
     */
    onDOMLoaded() {
        console.log('PhysicsLearn app initialized');
        
        // Initialize navigation
        this.initializeNavigation();
        
        // Initialize stats counter animation
        this.initializeStatsCounter();
        
        // Initialize smooth scrolling
        this.initializeSmoothScrolling();
        
        // Initialize lazy loading
        this.initializeLazyLoading();
    }

    /**
     * Handle window load event
     */
    onWindowLoad() {
        // Hide loading indicators
        this.hideLoadingIndicators();
        
        // Start entrance animations
        this.startEntranceAnimations();
        
        // Initialize performance monitoring
        this.initializePerformanceMonitoring();
    }

    /**
     * Set up navigation functionality
     */
    setupNavigationEvents() {
        const navToggle = document.querySelector('.nav-toggle');
        const navMenu = document.querySelector('.nav-menu');
        const navLinks = document.querySelectorAll('.nav-link');

        if (navToggle && navMenu) {
            navToggle.addEventListener('click', () => {
                this.toggleMobileMenu(navToggle, navMenu);
            });

            // Close mobile menu when clicking outside
            document.addEventListener('click', (e) => {
                if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
                    this.closeMobileMenu(navToggle, navMenu);
                }
            });

            // Close mobile menu when pressing Escape
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') {
                    this.closeMobileMenu(navToggle, navMenu);
                }
            });
        }

        // Handle navigation link clicks
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                this.handleNavLinkClick(e, navToggle, navMenu);
            });
        });
    }

    /**
     * Initialize navigation
     */
    initializeNavigation() {
        // Set active navigation item based on current page
        this.setActiveNavItem();
        
        // Initialize navigation accessibility
        this.setupNavigationA11y();
    }

    /**
     * Toggle mobile menu
     */
    toggleMobileMenu(toggle, menu) {
        const isActive = toggle.classList.contains('active');
        
        if (isActive) {
            this.closeMobileMenu(toggle, menu);
        } else {
            this.openMobileMenu(toggle, menu);
        }
    }

    /**
     * Open mobile menu
     */
    openMobileMenu(toggle, menu) {
        toggle.classList.add('active');
        menu.classList.add('active');
        toggle.setAttribute('aria-expanded', 'true');
        
        // Prevent body scrolling when menu is open
        document.body.style.overflow = 'hidden';
        
        // Focus first menu item for accessibility
        const firstLink = menu.querySelector('.nav-link');
        if (firstLink) {
            setTimeout(() => firstLink.focus(), 100);
        }
    }

    /**
     * Close mobile menu
     */
    closeMobileMenu(toggle, menu) {
        toggle.classList.remove('active');
        menu.classList.remove('active');
        toggle.setAttribute('aria-expanded', 'false');
        
        // Restore body scrolling
        document.body.style.overflow = '';
    }

    /**
     * Handle navigation link clicks
     */
    handleNavLinkClick(e, toggle, menu) {
        const link = e.target;
        const href = link.getAttribute('href');
        
        // Close mobile menu if open
        if (menu.classList.contains('active')) {
            this.closeMobileMenu(toggle, menu);
        }
        
        // Handle internal links with smooth scrolling
        if (href && href.startsWith('#')) {
            e.preventDefault();
            this.smoothScrollToElement(href);
        }
    }

    /**
     * Set active navigation item
     */
    setActiveNavItem() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        const navLinks = document.querySelectorAll('.nav-link');
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === currentPage) {
                link.classList.add('active');
            }
        });
    }

    /**
     * Setup form events
     */
    setupFormEvents() {
        const forms = document.querySelectorAll('form');
        
        forms.forEach(form => {
            form.addEventListener('submit', (e) => {
                this.handleFormSubmit(e);
            });
        });

        // Setup input validation
        const inputs = document.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', () => {
                this.validateInput(input);
            });
            
            input.addEventListener('input', () => {
                this.clearInputError(input);
            });
        });
    }

    /**
     * Setup button events
     */
    setupButtonEvents() {
        const buttons = document.querySelectorAll('.btn');
        
        buttons.forEach(button => {
            button.addEventListener('click', (e) => {
                this.handleButtonClick(e);
            });
        });
    }

    /**
     * Handle form submission
     */
    handleFormSubmit(e) {
        const form = e.target;
        const isValid = this.validateForm(form);
        
        if (!isValid) {
            e.preventDefault();
            return false;
        }
        
        // Show loading state
        this.showFormLoading(form);
        
        console.log('Form submitted:', form.id || 'unnamed form');
    }

    /**
     * Validate form
     */
    validateForm(form) {
        const inputs = form.querySelectorAll('input[required], textarea[required]');
        let isValid = true;
        
        inputs.forEach(input => {
            if (!this.validateInput(input)) {
                isValid = false;
            }
        });
        
        return isValid;
    }

    /**
     * Validate individual input
     */
    validateInput(input) {
        const value = input.value.trim();
        const type = input.type;
        let isValid = true;
        let errorMessage = '';
        
        // Check required fields
        if (input.hasAttribute('required') && !value) {
            isValid = false;
            errorMessage = 'This field is required';
        }
        
        // Email validation
        else if (type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                isValid = false;
                errorMessage = 'Please enter a valid email address';
            }
        }
        
        // Password validation
        else if (type === 'password' && value) {
            if (value.length < 8) {
                isValid = false;
                errorMessage = 'Password must be at least 8 characters long';
            }
        }
        
        // Show/hide error
        if (!isValid) {
            this.showInputError(input, errorMessage);
        } else {
            this.clearInputError(input);
        }
        
        return isValid;
    }

    /**
     * Show input error
     */
    showInputError(input, message) {
        input.classList.add('error');
        input.setAttribute('aria-invalid', 'true');
        
        let errorElement = input.parentNode.querySelector('.error-message');
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.className = 'error-message';
            errorElement.setAttribute('role', 'alert');
            input.parentNode.appendChild(errorElement);
        }
        
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }

    /**
     * Clear input error
     */
    clearInputError(input) {
        input.classList.remove('error');
        input.setAttribute('aria-invalid', 'false');
        
        const errorElement = input.parentNode.querySelector('.error-message');
        if (errorElement) {
            errorElement.style.display = 'none';
        }
    }

    /**
     * Handle button clicks
     */
    handleButtonClick(e) {
        const button = e.target.closest('.btn');
        const href = button.getAttribute('href');
        const action = button.getAttribute('data-action');
        
        // Add click animation
        this.addButtonClickAnimation(button);
        
        // Handle special actions
        if (action) {
            e.preventDefault();
            this.handleButtonAction(action, button);
        }
        
        console.log('Button clicked:', button.textContent.trim());
    }

    /**
     * Add button click animation
     */
    addButtonClickAnimation(button) {
        button.style.transform = 'scale(0.95)';
        setTimeout(() => {
            button.style.transform = '';
        }, 150);
    }

    /**
     * Handle special button actions
     */
    handleButtonAction(action, button) {
        switch (action) {
            case 'scroll-to-top':
                this.scrollToTop();
                break;
            case 'toggle-theme':
                this.toggleTheme();
                break;
            case 'share':
                this.shareContent();
                break;
            default:
                console.log('Unknown action:', action);
        }
    }

    /**
     * Initialize animations
     */
    initializeAnimations() {
        this.setupIntersectionObserver();
        this.initializeParallaxEffects();
    }

    /**
     * Setup Intersection Observer for animations
     */
    setupIntersectionObserver() {
        if (!('IntersectionObserver' in window)) {
            return; // Fallback for older browsers
        }

        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                    this.observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // Observe elements for animation
        const animatedElements = document.querySelectorAll(
            '.feature-card, .simulation-card, .stat-item, .hero-content'
        );
        
        animatedElements.forEach(el => {
            el.classList.add('animate-on-scroll');
            this.observer.observe(el);
        });
    }

    /**
     * Initialize stats counter animation
     */
    initializeStatsCounter() {
        const statNumbers = document.querySelectorAll('.stat-number');
        
        statNumbers.forEach(stat => {
            const target = parseInt(stat.getAttribute('data-target'));
            const duration = 2000; // 2 seconds
            
            // Animate when element comes into view
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.animateCounter(stat, 0, target, duration);
                        observer.unobserve(entry.target);
                    }
                });
            });
            
            observer.observe(stat);
        });
    }

    /**
     * Animate counter
     */
    animateCounter(element, start, end, duration) {
        const startTime = performance.now();
        
        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const current = Math.round(start + (end - start) * easeOut);
            
            element.textContent = current.toLocaleString();
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };
        
        requestAnimationFrame(animate);
    }

    /**
     * Initialize smooth scrolling
     */
    initializeSmoothScrolling() {
        const links = document.querySelectorAll('a[href^="#"]');
        
        links.forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                if (href !== '#') {
                    e.preventDefault();
                    this.smoothScrollToElement(href);
                }
            });
        });
    }

    /**
     * Smooth scroll to element
     */
    smoothScrollToElement(selector) {
        const target = document.querySelector(selector);
        
        if (target) {
            const headerHeight = document.querySelector('.header').offsetHeight;
            const targetPosition = target.offsetTop - headerHeight - 20;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
            
            // Update focus for accessibility
            setTimeout(() => {
                target.focus();
            }, 500);
        }
    }

    /**
     * Initialize lazy loading
     */
    initializeLazyLoading() {
        if ('IntersectionObserver' in window) {
            const lazyImages = document.querySelectorAll('img[data-src]');
            
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                        imageObserver.unobserve(img);
                    }
                });
            });
            
            lazyImages.forEach(img => imageObserver.observe(img));
        }
    }

    /**
     * Handle window resize
     */
    handleResize() {
        // Update mobile menu state
        const navMenu = document.querySelector('.nav-menu');
        const navToggle = document.querySelector('.nav-toggle');
        
        if (window.innerWidth > 767 && navMenu.classList.contains('active')) {
            this.closeMobileMenu(navToggle, navMenu);
        }
        
        // Trigger custom resize event
        this.dispatchCustomEvent('app:resize', {
            width: window.innerWidth,
            height: window.innerHeight
        });
    }

    /**
     * Handle window scroll
     */
    handleScroll() {
        const scrollTop = window.pageYOffset;
        const header = document.querySelector('.header');
        
        // Add/remove scrolled class to header
        if (scrollTop > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // Trigger custom scroll event
        this.dispatchCustomEvent('app:scroll', {
            scrollTop: scrollTop,
            scrollPercent: (scrollTop / (document.body.scrollHeight - window.innerHeight)) * 100
        });
    }

    /**
     * Setup accessibility features
     */
    setupAccessibility() {
        this.setupKeyboardNavigation();
        this.setupFocusManagement();
        this.setupARIALabels();
    }

    /**
     * Setup keyboard navigation
     */
    setupKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            // Skip links functionality
            if (e.key === 'Tab' && !e.shiftKey) {
                const skipLink = document.querySelector('.skip-link');
                if (skipLink && document.activeElement === skipLink) {
                    e.preventDefault();
                    const target = document.querySelector(skipLink.getAttribute('href'));
                    if (target) {
                        target.focus();
                    }
                }
            }
        });
    }

    /**
     * Setup focus management
     */
    setupFocusManagement() {
        // Ensure focus is visible
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                document.body.classList.add('keyboard-navigation');
            }
        });
        
        document.addEventListener('mousedown', () => {
            document.body.classList.remove('keyboard-navigation');
        });
    }

    /**
     * Setup ARIA labels
     */
    setupARIALabels() {
        // Add ARIA labels to interactive elements without explicit labels
        const buttons = document.querySelectorAll('button:not([aria-label]):not([aria-labelledby])');
        buttons.forEach(button => {
            const text = button.textContent.trim();
            if (text) {
                button.setAttribute('aria-label', text);
            }
        });
    }

    /**
     * Initialize parallax effects
     */
    initializeParallaxEffects() {
        const parallaxElements = document.querySelectorAll('.parallax');
        
        if (parallaxElements.length > 0) {
            window.addEventListener('scroll', this.throttle(() => {
                const scrollTop = window.pageYOffset;
                
                parallaxElements.forEach(element => {
                    const rate = scrollTop * -0.5;
                    element.style.transform = `translateY(${rate}px)`;
                });
            }, 16));
        }
    }

    /**
     * Utility: Debounce function
     */
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    /**
     * Utility: Throttle function
     */
    throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    /**
     * Utility: Dispatch custom event
     */
    dispatchCustomEvent(eventName, detail) {
        const event = new CustomEvent(eventName, { detail });
        window.dispatchEvent(event);
    }

    /**
     * Handle page load completion
     */
    handlePageLoad() {
        // Remove loading classes
        document.body.classList.remove('loading');
        
        // Add loaded class
        document.body.classList.add('loaded');
    }

    /**
     * Hide loading indicators
     */
    hideLoadingIndicators() {
        const loadingElements = document.querySelectorAll('.loading-indicator');
        loadingElements.forEach(el => {
            el.style.display = 'none';
        });
    }

    /**
     * Start entrance animations
     */
    startEntranceAnimations() {
        const heroContent = document.querySelector('.hero-content');
        if (heroContent) {
            heroContent.classList.add('animate-fade-in-up');
        }
    }

    /**
     * Initialize performance monitoring
     */
    initializePerformanceMonitoring() {
        if ('performance' in window) {
            // Log page load time
            window.addEventListener('load', () => {
                setTimeout(() => {
                    const perfData = performance.timing;
                    const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
                    console.log(`Page load time: ${pageLoadTime}ms`);
                }, 0);
            });
        }
    }

    /**
     * Scroll to top
     */
    scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }

    /**
     * Toggle theme (for future dark mode implementation)
     */
    toggleTheme() {
        document.body.classList.toggle('dark-theme');
        
        const isDark = document.body.classList.contains('dark-theme');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        
        console.log('Theme toggled to:', isDark ? 'dark' : 'light');
    }

    /**
     * Share content
     */
    async shareContent() {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'PhysicsLearn - Interactive Physics Learning Platform',
                    text: 'Explore physics through interactive simulations and educational resources',
                    url: window.location.href
                });
                console.log('Content shared successfully');
            } catch (err) {
                console.log('Error sharing:', err);
            }
        } else {
            // Fallback: copy URL to clipboard
            try {
                await navigator.clipboard.writeText(window.location.href);
                this.showNotification('URL copied to clipboard!');
            } catch (err) {
                console.log('Error copying to clipboard:', err);
            }
        }
    }

    /**
     * Show notification
     */
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        notification.setAttribute('role', 'alert');
        
        document.body.appendChild(notification);
        
        // Show notification
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        // Hide notification after 3 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }

    /**
     * Setup navigation accessibility
     */
    setupNavigationA11y() {
        const navToggle = document.querySelector('.nav-toggle');
        const navMenu = document.querySelector('.nav-menu');
        
        if (navToggle && navMenu) {
            navToggle.setAttribute('aria-expanded', 'false');
            navToggle.setAttribute('aria-controls', 'navigation-menu');
            navMenu.setAttribute('id', 'navigation-menu');
        }
    }

    /**
     * Show form loading state
     */
    showFormLoading(form) {
        const submitButton = form.querySelector('button[type="submit"]');
        if (submitButton) {
            submitButton.disabled = true;
            submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
        }
    }
}

// Initialize the application
const app = new PhysicsLearnApp();

// Export for potential use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PhysicsLearnApp;
}
