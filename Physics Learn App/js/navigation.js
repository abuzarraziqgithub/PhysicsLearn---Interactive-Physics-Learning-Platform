/**
 * PhysicsLearn - Navigation System
 * Handles advanced navigation functionality, mobile menu, and keyboard navigation
 */

class NavigationSystem {
    constructor() {
        this.isMenuOpen = false;
        this.currentPage = this.getCurrentPage();
        this.init();
    }

    /**
     * Initialize navigation system
     */
    init() {
        this.setupEventListeners();
        this.setupKeyboardNavigation();
        this.setupScrollNavigation();
        this.setupAccessibility();
        this.updateActiveNavigation();
    }

    /**
     * Get current page from URL
     */
    getCurrentPage() {
        const path = window.location.pathname;
        const page = path.split('/').pop() || 'index.html';
        return page.replace('.html', '');
    }

    /**
     * Setup event listeners
     */
    setupEventListeners() {
        // Mobile menu toggle
        const navToggle = document.querySelector('.nav-toggle');
        const navMenu = document.querySelector('.nav-menu');

        if (navToggle && navMenu) {
            navToggle.addEventListener('click', (e) => {
                e.preventDefault();
                this.toggleMobileMenu();
            });

            // Close menu when clicking outside
            document.addEventListener('click', (e) => {
                if (this.isMenuOpen && 
                    !navToggle.contains(e.target) && 
                    !navMenu.contains(e.target)) {
                    this.closeMobileMenu();
                }
            });

            // Handle window resize
            window.addEventListener('resize', () => {
                if (window.innerWidth > 768 && this.isMenuOpen) {
                    this.closeMobileMenu();
                }
            });
        }

        // Navigation link clicks
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                this.handleNavLinkClick(e, link);
            });
        });

        // Logo click
        const logo = document.querySelector('.logo');
        if (logo) {
            logo.addEventListener('click', (e) => {
                this.handleLogoClick(e);
            });
        }
    }

    /**
     * Setup keyboard navigation
     */
    setupKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            switch (e.key) {
                case 'Escape':
                    if (this.isMenuOpen) {
                        this.closeMobileMenu();
                    }
                    break;
                
                case 'Tab':
                    this.handleTabNavigation(e);
                    break;
                
                case 'Enter':
                case ' ':
                    this.handleEnterSpaceNavigation(e);
                    break;
            }
        });

        // Focus visible indicator
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                document.body.classList.add('keyboard-focus');
            }
        });

        document.addEventListener('mousedown', () => {
            document.body.classList.remove('keyboard-focus');
        });
    }

    /**
     * Setup scroll-based navigation
     */
    setupScrollNavigation() {
        let lastScrollTop = 0;
        const header = document.querySelector('.header');
        
        window.addEventListener('scroll', () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            // Hide/show header on scroll
            if (scrollTop > lastScrollTop && scrollTop > 100) {
                header.classList.add('header-hidden');
            } else {
                header.classList.remove('header-hidden');
            }
            
            // Add shadow when scrolled
            if (scrollTop > 10) {
                header.classList.add('header-scrolled');
            } else {
                header.classList.remove('header-scrolled');
            }
            
            lastScrollTop = scrollTop;
            
            // Update active section for single-page navigation
            this.updateActiveSectionOnScroll();
        });
    }

    /**
     * Setup accessibility features
     */
    setupAccessibility() {
        const navToggle = document.querySelector('.nav-toggle');
        const navMenu = document.querySelector('.nav-menu');

        if (navToggle && navMenu) {
            // Set initial ARIA attributes
            navToggle.setAttribute('aria-label', 'Toggle navigation menu');
            navToggle.setAttribute('aria-expanded', 'false');
            navToggle.setAttribute('aria-controls', 'main-navigation');
            
            navMenu.setAttribute('id', 'main-navigation');
            navMenu.setAttribute('role', 'navigation');
            navMenu.setAttribute('aria-label', 'Main navigation');
        }

        // Add skip link
        this.addSkipLink();
        
        // Enhance link accessibility
        this.enhanceLinkAccessibility();
    }

    /**
     * Add skip link for accessibility
     */
    addSkipLink() {
        const existingSkipLink = document.querySelector('.skip-link');
        if (existingSkipLink) return;

        const skipLink = document.createElement('a');
        skipLink.href = '#main-content';
        skipLink.className = 'skip-link';
        skipLink.textContent = 'Skip to main content';
        skipLink.setAttribute('aria-label', 'Skip to main content');
        
        // Style the skip link
        skipLink.style.cssText = `
            position: absolute;
            top: -40px;
            left: 6px;
            background: var(--primary-color, #3b82f6);
            color: white;
            padding: 8px;
            text-decoration: none;
            border-radius: 4px;
            z-index: 10000;
            transition: top 0.3s;
        `;

        skipLink.addEventListener('focus', () => {
            skipLink.style.top = '6px';
        });

        skipLink.addEventListener('blur', () => {
            skipLink.style.top = '-40px';
        });

        skipLink.addEventListener('click', (e) => {
            e.preventDefault();
            const mainContent = document.querySelector('#main-content') || 
                              document.querySelector('main') ||
                              document.querySelector('[role="main"]');
            
            if (mainContent) {
                mainContent.focus();
                mainContent.scrollIntoView({ behavior: 'smooth' });
            }
        });

        document.body.insertBefore(skipLink, document.body.firstChild);
    }

    /**
     * Enhance link accessibility
     */
    enhanceLinkAccessibility() {
        const externalLinks = document.querySelectorAll('a[href^="http"]:not([href*="' + window.location.hostname + '"])');
        
        externalLinks.forEach(link => {
            // Add external link indicator
            if (!link.getAttribute('aria-label') && !link.getAttribute('title')) {
                const linkText = link.textContent.trim();
                link.setAttribute('aria-label', `${linkText} (opens in new window)`);
                link.setAttribute('target', '_blank');
                link.setAttribute('rel', 'noopener noreferrer');
            }
        });
    }

    /**
     * Toggle mobile menu
     */
    toggleMobileMenu() {
        if (this.isMenuOpen) {
            this.closeMobileMenu();
        } else {
            this.openMobileMenu();
        }
    }

    /**
     * Open mobile menu
     */
    openMobileMenu() {
        const navToggle = document.querySelector('.nav-toggle');
        const navMenu = document.querySelector('.nav-menu');
        
        if (!navToggle || !navMenu) return;

        // Update UI
        navToggle.classList.add('active');
        navMenu.classList.add('active');
        document.body.classList.add('nav-open');
        
        // Update ARIA
        navToggle.setAttribute('aria-expanded', 'true');
        
        // Prevent body scroll
        document.body.style.overflow = 'hidden';
        
        // Focus management
        const firstNavLink = navMenu.querySelector('.nav-link');
        if (firstNavLink) {
            setTimeout(() => firstNavLink.focus(), 100);
        }
        
        this.isMenuOpen = true;
        
        // Trap focus within menu
        this.trapFocusInMenu(navMenu);
        
        // Dispatch custom event
        this.dispatchNavigationEvent('menuOpened');
    }

    /**
     * Close mobile menu
     */
    closeMobileMenu() {
        const navToggle = document.querySelector('.nav-toggle');
        const navMenu = document.querySelector('.nav-menu');
        
        if (!navToggle || !navMenu) return;

        // Update UI
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.classList.remove('nav-open');
        
        // Update ARIA
        navToggle.setAttribute('aria-expanded', 'false');
        
        // Restore body scroll
        document.body.style.overflow = '';
        
        // Return focus to toggle button
        navToggle.focus();
        
        this.isMenuOpen = false;
        
        // Remove focus trap
        this.removeFocusTrap();
        
        // Dispatch custom event
        this.dispatchNavigationEvent('menuClosed');
    }

    /**
     * Trap focus within menu
     */
    trapFocusInMenu(menu) {
        const focusableElements = menu.querySelectorAll(
            'a[href], button, [tabindex]:not([tabindex="-1"])'
        );
        
        const firstFocusable = focusableElements[0];
        const lastFocusable = focusableElements[focusableElements.length - 1];
        
        this.focusTrapHandler = (e) => {
            if (e.key === 'Tab') {
                if (e.shiftKey) {
                    if (document.activeElement === firstFocusable) {
                        e.preventDefault();
                        lastFocusable.focus();
                    }
                } else {
                    if (document.activeElement === lastFocusable) {
                        e.preventDefault();
                        firstFocusable.focus();
                    }
                }
            }
        };
        
        document.addEventListener('keydown', this.focusTrapHandler);
    }

    /**
     * Remove focus trap
     */
    removeFocusTrap() {
        if (this.focusTrapHandler) {
            document.removeEventListener('keydown', this.focusTrapHandler);
            this.focusTrapHandler = null;
        }
    }

    /**
     * Handle navigation link clicks
     */
    handleNavLinkClick(e, link) {
        const href = link.getAttribute('href');
        
        // Close mobile menu if open
        if (this.isMenuOpen) {
            this.closeMobileMenu();
        }
        
        // Handle hash links (same page navigation)
        if (href && href.startsWith('#')) {
            e.preventDefault();
            this.scrollToSection(href);
            this.updateActiveNavigation(href);
            return;
        }
        
        // Handle external links
        if (href && href.startsWith('http') && !href.includes(window.location.hostname)) {
            // External link - let it open normally but track it
            this.trackExternalLink(href);
            return;
        }
        
        // Handle internal page navigation
        if (href && href.endsWith('.html')) {
            this.handlePageNavigation(e, href);
        }
    }

    /**
     * Handle logo click
     */
    handleLogoClick(e) {
        const href = e.target.closest('a').getAttribute('href');
        
        if (href === 'index.html' && this.currentPage === 'index') {
            e.preventDefault();
            this.scrollToTop();
        }
    }

    /**
     * Handle tab navigation
     */
    handleTabNavigation(e) {
        // Special handling for skip link
        const skipLink = document.querySelector('.skip-link');
        if (document.activeElement === skipLink && !e.shiftKey) {
            e.preventDefault();
            const mainContent = document.querySelector('main') || 
                              document.querySelector('[role="main"]');
            if (mainContent) {
                mainContent.focus();
            }
        }
    }

    /**
     * Handle Enter/Space navigation
     */
    handleEnterSpaceNavigation(e) {
        if (e.target.classList.contains('nav-toggle')) {
            e.preventDefault();
            this.toggleMobileMenu();
        }
    }

    /**
     * Scroll to section
     */
    scrollToSection(hash) {
        const target = document.querySelector(hash);
        if (!target) return;
        
        const headerHeight = document.querySelector('.header').offsetHeight;
        const targetPosition = target.offsetTop - headerHeight - 20;
        
        // Smooth scroll
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
        
        // Update URL without triggering page reload
        if (history.pushState) {
            history.pushState(null, null, hash);
        }
        
        // Update focus for accessibility
        setTimeout(() => {
            target.focus();
            target.setAttribute('tabindex', '-1'); // Make it focusable
        }, 500);
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
     * Update active navigation
     */
    updateActiveNavigation(activeHash = null) {
        const navLinks = document.querySelectorAll('.nav-link');
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            link.setAttribute('aria-current', 'false');
            
            const href = link.getAttribute('href');
            
            // Check for exact match with current page
            if (href === `${this.currentPage}.html` || 
                (href === 'index.html' && this.currentPage === 'index')) {
                link.classList.add('active');
                link.setAttribute('aria-current', 'page');
            }
            
            // Check for hash match
            if (activeHash && href === activeHash) {
                link.classList.add('active');
                link.setAttribute('aria-current', 'location');
            }
        });
    }

    /**
     * Update active section on scroll (for single-page navigation)
     */
    updateActiveSectionOnScroll() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
        
        if (sections.length === 0 || navLinks.length === 0) return;
        
        let currentSection = '';
        const scrollPosition = window.pageYOffset + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            
            if (scrollPosition >= sectionTop && 
                scrollPosition < sectionTop + sectionHeight) {
                currentSection = `#${section.id}`;
            }
        });
        
        // Update navigation
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === currentSection) {
                link.classList.add('active');
            }
        });
    }

    /**
     * Handle page navigation with loading state
     */
    handlePageNavigation(e, href) {
        // Add loading state
        document.body.classList.add('page-loading');
        
        // Track navigation
        this.trackPageNavigation(href);
        
        // Let the browser handle the navigation
        // The loading state will be removed when the new page loads
    }

    /**
     * Track external link clicks
     */
    trackExternalLink(href) {
        console.log('External link clicked:', href);
        
        // Here you could integrate with analytics
        if (typeof gtag !== 'undefined') {
            gtag('event', 'click', {
                event_category: 'outbound',
                event_label: href
            });
        }
    }

    /**
     * Track page navigation
     */
    trackPageNavigation(href) {
        console.log('Internal navigation:', href);
        
        // Here you could integrate with analytics
        if (typeof gtag !== 'undefined') {
            gtag('event', 'page_view', {
                page_title: document.title,
                page_location: href
            });
        }
    }

    /**
     * Dispatch custom navigation event
     */
    dispatchNavigationEvent(eventType, detail = {}) {
        const event = new CustomEvent(`navigation:${eventType}`, {
            detail: {
                currentPage: this.currentPage,
                isMenuOpen: this.isMenuOpen,
                ...detail
            }
        });
        
        window.dispatchEvent(event);
    }

    /**
     * Get navigation state
     */
    getState() {
        return {
            currentPage: this.currentPage,
            isMenuOpen: this.isMenuOpen
        };
    }

    /**
     * Destroy navigation system
     */
    destroy() {
        this.removeFocusTrap();
        
        // Remove event listeners
        const navToggle = document.querySelector('.nav-toggle');
        if (navToggle) {
            navToggle.removeEventListener('click', this.toggleMobileMenu);
        }
        
        // Reset body styles
        document.body.style.overflow = '';
        document.body.classList.remove('nav-open', 'keyboard-focus');
    }
}

// Initialize navigation system
document.addEventListener('DOMContentLoaded', () => {
    window.navigationSystem = new NavigationSystem();
});

// Clean up on page unload
window.addEventListener('beforeunload', () => {
    if (window.navigationSystem) {
        window.navigationSystem.destroy();
    }
});

// Export for potential use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = NavigationSystem;
}
