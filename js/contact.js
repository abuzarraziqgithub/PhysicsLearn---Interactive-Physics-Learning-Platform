/**
 * Contact Page Functionality
 * Handles contact form submission, validation, and FAQ interactions
 */

class ContactManager {
    constructor() {
        this.contactForm = null;
        this.faqItems = null;
        this.submitButton = null;
        this.formData = {};
        
        this.init();
    }
    
    init() {
        this.bindElements();
        this.attachEventListeners();
        this.initializeValidation();
        this.setupFAQ();
    }
    
    bindElements() {
        this.contactForm = document.getElementById('contact-form');
        this.submitButton = document.querySelector('.submit-btn');
        this.faqItems = document.querySelectorAll('.faq-item');
        this.formInputs = document.querySelectorAll('.contact-form input, .contact-form select, .contact-form textarea');
    }
    
    attachEventListeners() {
        // Form submission
        if (this.contactForm) {
            this.contactForm.addEventListener('submit', (e) => this.handleFormSubmission(e));
        }
        
        // Real-time validation
        this.formInputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => this.clearFieldError(input));
        });
        
        // FAQ interactions
        this.faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            if (question) {
                question.addEventListener('click', () => this.toggleFAQ(item));
            }
        });
        
        // Auto-save form data
        if (this.contactForm) {
            this.contactForm.addEventListener('input', () => this.autoSaveFormData());
        }
        
        // Load saved form data
        this.loadSavedFormData();
    }
    
    async handleFormSubmission(event) {
        event.preventDefault();
        
        if (!this.validateForm()) {
            return;
        }
        
        // Collect form data
        const formData = new FormData(this.contactForm);
        const contactData = Object.fromEntries(formData);
        
        // Show loading state
        this.setLoadingState(true);
        
        try {
            // Simulate API call
            await this.submitContactForm(contactData);
            
            // Show success message
            this.showSuccessMessage();
            
            // Clear form
            this.contactForm.reset();
            this.clearSavedFormData();
            
        } catch (error) {
            this.showErrorMessage('Failed to send message. Please try again.');
            console.error('Contact form error:', error);
        } finally {
            this.setLoadingState(false);
        }
    }
    
    validateForm() {
        let isValid = true;
        
        this.formInputs.forEach(input => {
            if (!this.validateField(input)) {
                isValid = false;
            }
        });
        
        return isValid;
    }
    
    validateField(field) {
        const value = field.value.trim();
        const fieldName = field.name;
        let isValid = true;
        let errorMessage = '';
        
        // Required field check
        if (field.hasAttribute('required') && !value) {
            errorMessage = 'This field is required';
            isValid = false;
        }
        
        // Specific field validation
        if (isValid && value) {
            switch (fieldName) {
                case 'email':
                    if (!this.isValidEmail(value)) {
                        errorMessage = 'Please enter a valid email address';
                        isValid = false;
                    }
                    break;
                    
                case 'name':
                    if (value.length < 2) {
                        errorMessage = 'Name must be at least 2 characters long';
                        isValid = false;
                    }
                    break;
                    
                case 'phone':
                    if (value && !this.isValidPhone(value)) {
                        errorMessage = 'Please enter a valid phone number';
                        isValid = false;
                    }
                    break;
                    
                case 'message':
                    if (value.length < 10) {
                        errorMessage = 'Message must be at least 10 characters long';
                        isValid = false;
                    }
                    break;
            }
        }
        
        this.showFieldValidation(field, isValid, errorMessage);
        return isValid;
    }
    
    showFieldValidation(field, isValid, errorMessage) {
        const formGroup = field.closest('.form-group');
        const errorElement = formGroup?.querySelector('.error-message');
        
        if (formGroup) {
            formGroup.classList.remove('error', 'success');
            formGroup.classList.add(isValid ? 'success' : 'error');
        }
        
        if (errorElement) {
            errorElement.textContent = errorMessage;
            errorElement.classList.toggle('show', !isValid);
        }
    }
    
    clearFieldError(field) {
        const formGroup = field.closest('.form-group');
        const errorElement = formGroup?.querySelector('.error-message');
        
        if (formGroup) {
            formGroup.classList.remove('error');
        }
        
        if (errorElement) {
            errorElement.classList.remove('show');
        }
    }
    
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    isValidPhone(phone) {
        const phoneRegex = /^[\+]?[1-9]?\d{9,15}$/;
        return phoneRegex.test(phone.replace(/\s/g, ''));
    }
    
    async submitContactForm(data) {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Store message data (in real app, this would be sent to server)
        const messageData = {
            ...data,
            timestamp: new Date().toISOString(),
            id: 'msg_' + Date.now()
        };
        
        // Store in localStorage for demo purposes
        const messages = JSON.parse(localStorage.getItem('contact_messages') || '[]');
        messages.push(messageData);
        localStorage.setItem('contact_messages', JSON.stringify(messages));
        
        return { success: true, messageId: messageData.id };
    }
    
    setLoadingState(isLoading) {
        if (!this.submitButton) return;
        
        if (isLoading) {
            this.submitButton.classList.add('loading');
            this.submitButton.disabled = true;
            this.submitButton.innerHTML = '<i class="fas fa-spinner"></i> Sending...';
        } else {
            this.submitButton.classList.remove('loading');
            this.submitButton.disabled = false;
            this.submitButton.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
        }
    }
    
    showSuccessMessage() {
        this.showNotification(
            'Thank you for your message! We\'ll get back to you within 24 hours.',
            'success'
        );
    }
    
    showErrorMessage(message) {
        this.showNotification(message, 'error');
    }
    
    showNotification(message, type = 'info') {
        // Remove existing notifications
        const existingNotifications = document.querySelectorAll('.notification');
        existingNotifications.forEach(notification => notification.remove());
        
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
                <span>${message}</span>
            </div>
            <button class="notification-close" aria-label="Close notification">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        // Add to page
        document.body.appendChild(notification);
        
        // Show notification
        setTimeout(() => notification.classList.add('show'), 10);
        
        // Auto hide after 5 seconds
        setTimeout(() => this.hideNotification(notification), 5000);
        
        // Close button functionality
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => this.hideNotification(notification));
    }
    
    hideNotification(notification) {
        notification.classList.add('hiding');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }
    
    // FAQ functionality
    setupFAQ() {
        // Initialize FAQ state
        this.faqItems.forEach(item => {
            const answer = item.querySelector('.faq-answer');
            if (answer) {
                answer.style.maxHeight = '0';
            }
        });
    }
    
    toggleFAQ(faqItem) {
        const question = faqItem.querySelector('.faq-question');
        const answer = faqItem.querySelector('.faq-answer');
        const icon = question.querySelector('.faq-icon');
        
        const isActive = question.classList.contains('active');
        
        // Close all other FAQ items
        this.faqItems.forEach(item => {
            const q = item.querySelector('.faq-question');
            const a = item.querySelector('.faq-answer');
            const i = q.querySelector('.faq-icon');
            
            q.classList.remove('active');
            a.classList.remove('show');
            a.style.maxHeight = '0';
            if (i) i.style.transform = 'rotate(0deg)';
        });
        
        // Toggle current item
        if (!isActive) {
            question.classList.add('active');
            answer.classList.add('show');
            answer.style.maxHeight = answer.scrollHeight + 'px';
            if (icon) icon.style.transform = 'rotate(180deg)';
        }
    }
    
    // Form persistence
    autoSaveFormData() {
        if (!this.contactForm) return;
        
        const formData = new FormData(this.contactForm);
        const data = Object.fromEntries(formData);
        
        localStorage.setItem('contact_form_draft', JSON.stringify(data));
    }
    
    loadSavedFormData() {
        const savedData = localStorage.getItem('contact_form_draft');
        if (!savedData || !this.contactForm) return;
        
        try {
            const data = JSON.parse(savedData);
            
            // Populate form fields
            Object.keys(data).forEach(key => {
                const field = this.contactForm.querySelector(`[name="${key}"]`);
                if (field && data[key]) {
                    field.value = data[key];
                }
            });
            
        } catch (error) {
            console.error('Error loading saved form data:', error);
        }
    }
    
    clearSavedFormData() {
        localStorage.removeItem('contact_form_draft');
    }
    
    initializeValidation() {
        // Set up custom validation messages
        this.formInputs.forEach(input => {
            input.addEventListener('invalid', (e) => {
                e.preventDefault();
                this.validateField(input);
            });
        });
    }
}

// Enhanced form animations
class ContactAnimations {
    static init() {
        this.animateOnScroll();
        this.addFormInteractions();
    }
    
    static animateOnScroll() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, { threshold: 0.1 });
        
        // Observe contact cards and form sections
        const animatedElements = document.querySelectorAll(
            '.contact-card, .contact-form-section, .faq-item'
        );
        
        animatedElements.forEach(element => {
            observer.observe(element);
        });
    }
    
    static addFormInteractions() {
        // Add focus animations to form fields
        const formFields = document.querySelectorAll('.form-group input, .form-group select, .form-group textarea');
        
        formFields.forEach(field => {
            field.addEventListener('focus', () => {
                field.parentElement.classList.add('focused');
            });
            
            field.addEventListener('blur', () => {
                if (!field.value) {
                    field.parentElement.classList.remove('focused');
                }
            });
            
            // Check if field has value on load
            if (field.value) {
                field.parentElement.classList.add('focused');
            }
        });
    }
}

// Character counter for textarea
class TextareaCounter {
    constructor(textarea, maxLength = 500) {
        this.textarea = textarea;
        this.maxLength = maxLength;
        this.counter = null;
        
        this.init();
    }
    
    init() {
        this.createCounter();
        this.attachEventListeners();
        this.updateCounter();
    }
    
    createCounter() {
        this.counter = document.createElement('div');
        this.counter.className = 'character-counter';
        this.textarea.parentNode.appendChild(this.counter);
    }
    
    attachEventListeners() {
        this.textarea.addEventListener('input', () => this.updateCounter());
    }
    
    updateCounter() {
        const currentLength = this.textarea.value.length;
        const remaining = this.maxLength - currentLength;
        
        this.counter.textContent = `${currentLength}/${this.maxLength}`;
        
        if (remaining < 50) {
            this.counter.classList.add('warning');
        } else {
            this.counter.classList.remove('warning');
        }
        
        if (remaining < 0) {
            this.counter.classList.add('error');
        } else {
            this.counter.classList.remove('error');
        }
    }
}

// Initialize contact page functionality
document.addEventListener('DOMContentLoaded', () => {
    // Initialize main contact manager
    new ContactManager();
    
    // Initialize animations
    ContactAnimations.init();
    
    // Initialize character counter for message textarea
    const messageTextarea = document.querySelector('textarea[name="message"]');
    if (messageTextarea) {
        new TextareaCounter(messageTextarea, 1000);
    }
    
    // Add smooth scrolling for anchor links
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(link.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});

// Export for potential use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ContactManager;
}
