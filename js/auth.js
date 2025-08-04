/**
 * Authentication functionality
 * Handles login, registration, form validation, and user authentication
 */

class AuthManager {
    constructor() {
        this.currentStep = 1;
        this.totalSteps = 3;
        this.formData = {};
        this.passwordStrength = 0;
        this.usernameAvailable = null;
        
        this.init();
    }
    
    init() {
        this.bindElements();
        this.attachEventListeners();
        this.initializeValidation();
        this.setupPasswordStrength();
        this.setupUsernameCheck();
        this.setupSocialAuth();
    }
    
    bindElements() {
        // Form elements
        this.registerForm = document.getElementById('register-form');
        this.loginForm = document.getElementById('login-form');
        
        // Navigation buttons
        this.nextBtn = document.getElementById('next-btn');
        this.prevBtn = document.getElementById('prev-btn');
        this.submitBtn = document.getElementById('submit-btn');
        
        // Form steps
        this.formSteps = document.querySelectorAll('.form-step');
        this.progressSteps = document.querySelectorAll('.step');
        this.progressFill = document.getElementById('progress-fill');
        
        // Password elements
        this.passwordInput = document.getElementById('password');
        this.confirmPasswordInput = document.getElementById('confirm-password');
        this.passwordToggleButtons = document.querySelectorAll('.password-toggle');
        this.strengthIndicator = document.getElementById('password-strength');
        this.requirementsList = document.querySelectorAll('.requirement');
        
        // Username check
        this.usernameInput = document.getElementById('username');
        this.usernameFeedback = document.getElementById('username-feedback');
        
        // Modal elements
        this.successModal = document.getElementById('success-modal');
        this.continueBtn = document.getElementById('continue-btn');
        this.resendEmailBtn = document.getElementById('resend-email-btn');
        
        // Social auth buttons
        this.socialButtons = document.querySelectorAll('.social-btn');
    }
    
    attachEventListeners() {
        // Multi-step navigation
        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', () => this.nextStep());
        }
        
        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', () => this.prevStep());
        }
        
        // Form submission
        if (this.registerForm) {
            this.registerForm.addEventListener('submit', (e) => this.handleRegistration(e));
        }
        
        if (this.loginForm) {
            this.loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        }
        
        // Password toggle
        this.passwordToggleButtons.forEach(button => {
            button.addEventListener('click', (e) => this.togglePasswordVisibility(e));
        });
        
        // Password strength checking
        if (this.passwordInput) {
            this.passwordInput.addEventListener('input', () => this.checkPasswordStrength());
        }
        
        // Password confirmation
        if (this.confirmPasswordInput) {
            this.confirmPasswordInput.addEventListener('input', () => this.checkPasswordMatch());
        }
        
        // Username availability
        if (this.usernameInput) {
            this.usernameInput.addEventListener('input', () => this.checkUsernameAvailability());
        }
        
        // Real-time validation
        const inputs = document.querySelectorAll('input, select');
        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => this.clearFieldError(input));
        });
        
        // Modal actions
        if (this.continueBtn) {
            this.continueBtn.addEventListener('click', () => this.redirectAfterRegistration());
        }
        
        if (this.resendEmailBtn) {
            this.resendEmailBtn.addEventListener('click', () => this.resendVerificationEmail());
        }
        
        // Social auth
        this.socialButtons.forEach(button => {
            button.addEventListener('click', (e) => this.handleSocialAuth(e));
        });
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => this.handleKeyboardShortcuts(e));
        
        // Auto-save form data
        if (this.registerForm) {
            this.registerForm.addEventListener('input', () => this.autoSaveFormData());
        }
        
        // Load saved form data
        this.loadSavedFormData();
    }
    
    // Multi-step form navigation
    nextStep() {
        if (!this.validateCurrentStep()) {
            return;
        }
        
        if (this.currentStep < this.totalSteps) {
            this.currentStep++;
            this.updateFormStep();
            this.updateProgress();
        }
    }
    
    prevStep() {
        if (this.currentStep > 1) {
            this.currentStep--;
            this.updateFormStep();
            this.updateProgress();
        }
    }
    
    updateFormStep() {
        // Hide all steps
        this.formSteps.forEach(step => {
            step.classList.remove('active');
        });
        
        // Show current step
        const currentStepElement = document.getElementById(`step-${this.currentStep}`);
        if (currentStepElement) {
            currentStepElement.classList.add('active');
        }
        
        // Update navigation buttons
        this.updateNavigationButtons();
        
        // Focus first input in current step
        this.focusFirstInput();
        
        // Update progress indicators
        this.updateProgressSteps();
    }
    
    updateNavigationButtons() {
        // Previous button
        if (this.prevBtn) {
            this.prevBtn.disabled = this.currentStep === 1;
        }
        
        // Next/Submit button
        if (this.currentStep === this.totalSteps) {
            if (this.nextBtn) this.nextBtn.style.display = 'none';
            if (this.submitBtn) this.submitBtn.style.display = 'flex';
        } else {
            if (this.nextBtn) this.nextBtn.style.display = 'flex';
            if (this.submitBtn) this.submitBtn.style.display = 'none';
        }
    }
    
    updateProgress() {
        const progressPercentage = (this.currentStep / this.totalSteps) * 100;
        if (this.progressFill) {
            this.progressFill.style.width = `${progressPercentage}%`;
        }
    }
    
    updateProgressSteps() {
        this.progressSteps.forEach((step, index) => {
            const stepNumber = index + 1;
            
            step.classList.remove('active', 'completed');
            
            if (stepNumber === this.currentStep) {
                step.classList.add('active');
            } else if (stepNumber < this.currentStep) {
                step.classList.add('completed');
            }
        });
    }
    
    focusFirstInput() {
        const currentStepElement = document.getElementById(`step-${this.currentStep}`);
        if (currentStepElement) {
            const firstInput = currentStepElement.querySelector('input, select');
            if (firstInput) {
                setTimeout(() => firstInput.focus(), 100);
            }
        }
    }
    
    // Validation
    validateCurrentStep() {
        const currentStepElement = document.getElementById(`step-${this.currentStep}`);
        if (!currentStepElement) return true;
        
        const inputs = currentStepElement.querySelectorAll('input[required], select[required]');
        let isValid = true;
        
        inputs.forEach(input => {
            if (!this.validateField(input)) {
                isValid = false;
            }
        });
        
        // Additional step-specific validation
        if (this.currentStep === 2) {
            if (!this.validatePassword()) isValid = false;
            if (!this.validatePasswordMatch()) isValid = false;
            if (!this.validateUsername()) isValid = false;
        }
        
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
                    
                case 'firstName':
                case 'lastName':
                    if (value.length < 2) {
                        errorMessage = 'Name must be at least 2 characters long';
                        isValid = false;
                    }
                    break;
                    
                case 'birthDate':
                    if (!this.isValidAge(value)) {
                        errorMessage = 'You must be at least 13 years old to register';
                        isValid = false;
                    }
                    break;
                    
                case 'username':
                    if (!this.isValidUsername(value)) {
                        errorMessage = 'Username must be 3-20 characters, letters, numbers, and underscores only';
                        isValid = false;
                    }
                    break;
                    
                case 'password':
                    if (!this.isValidPassword(value)) {
                        errorMessage = 'Password does not meet requirements';
                        isValid = false;
                    }
                    break;
                    
                case 'confirmPassword':
                    if (value !== this.passwordInput?.value) {
                        errorMessage = 'Passwords do not match';
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
            formGroup.classList.remove('has-error', 'has-success');
            formGroup.classList.add(isValid ? 'has-success' : 'has-error');
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
            formGroup.classList.remove('has-error');
        }
        
        if (errorElement) {
            errorElement.classList.remove('show');
        }
    }
    
    // Password functionality
    togglePasswordVisibility(event) {
        const button = event.currentTarget;
        const passwordInput = button.parentElement.querySelector('input');
        const icon = button.querySelector('i');
        
        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
            icon.classList.remove('fa-eye');
            icon.classList.add('fa-eye-slash');
            button.setAttribute('aria-label', 'Hide password');
        } else {
            passwordInput.type = 'password';
            icon.classList.remove('fa-eye-slash');
            icon.classList.add('fa-eye');
            button.setAttribute('aria-label', 'Show password');
        }
    }
    
    checkPasswordStrength() {
        if (!this.passwordInput) return;
        
        const password = this.passwordInput.value;
        const requirements = this.getPasswordRequirements();
        let strength = 0;
        let metRequirements = 0;
        
        // Check each requirement
        requirements.forEach(req => {
            const element = document.querySelector(`[data-requirement="${req.type}"]`);
            const isMet = req.test(password);
            
            if (element) {
                element.classList.toggle('met', isMet);
            }
            
            if (isMet) {
                metRequirements++;
                strength += req.strength;
            }
        });
        
        // Update strength indicator
        this.updatePasswordStrengthIndicator(strength, metRequirements, requirements.length);
        this.passwordStrength = strength;
    }
    
    getPasswordRequirements() {
        return [
            {
                type: 'length',
                test: (password) => password.length >= 8,
                strength: 20
            },
            {
                type: 'uppercase',
                test: (password) => /[A-Z]/.test(password),
                strength: 20
            },
            {
                type: 'lowercase',
                test: (password) => /[a-z]/.test(password),
                strength: 20
            },
            {
                type: 'number',
                test: (password) => /\d/.test(password),
                strength: 20
            },
            {
                type: 'special',
                test: (password) => /[!@#$%^&*(),.?\":{}|<>]/.test(password),
                strength: 20
            }
        ];
    }
    
    updatePasswordStrengthIndicator(strength, metRequirements, totalRequirements) {
        if (!this.strengthIndicator) return;
        
        const strengthFill = this.strengthIndicator.querySelector('.strength-fill');
        const strengthText = this.strengthIndicator.querySelector('.strength-level');
        
        let level = 'weak';
        let levelClass = 'weak';
        
        if (strength >= 80) {
            level = 'strong';
            levelClass = 'strong';
        } else if (strength >= 60) {
            level = 'good';
            levelClass = 'good';
        } else if (strength >= 40) {
            level = 'fair';
            levelClass = 'fair';
        }
        
        if (strengthFill) {
            strengthFill.className = `strength-fill ${levelClass}`;
        }
        
        if (strengthText) {
            strengthText.textContent = level.charAt(0).toUpperCase() + level.slice(1);
            strengthText.className = `strength-level ${levelClass}`;
        }
    }
    
    checkPasswordMatch() {
        if (!this.confirmPasswordInput || !this.passwordInput) return;
        
        const password = this.passwordInput.value;
        const confirmPassword = this.confirmPasswordInput.value;
        
        if (confirmPassword && password !== confirmPassword) {
            this.showFieldValidation(this.confirmPasswordInput, false, 'Passwords do not match');
        } else if (confirmPassword) {
            this.showFieldValidation(this.confirmPasswordInput, true, '');
        }
    }
    
    validatePassword() {
        if (!this.passwordInput) return true;
        return this.passwordStrength >= 60; // Require at least "good" strength
    }
    
    validatePasswordMatch() {
        if (!this.confirmPasswordInput || !this.passwordInput) return true;
        return this.passwordInput.value === this.confirmPasswordInput.value;
    }
    
    // Username availability
    checkUsernameAvailability() {
        if (!this.usernameInput || !this.usernameFeedback) return;
        
        const username = this.usernameInput.value.trim();
        
        if (username.length < 3) {
            this.usernameFeedback.textContent = '';
            this.usernameFeedback.className = 'input-feedback';
            return;
        }
        
        // Show checking state
        this.usernameFeedback.textContent = 'Checking availability...';
        this.usernameFeedback.className = 'input-feedback checking';
        
        // Simulate API call
        setTimeout(() => {
            const isAvailable = this.simulateUsernameCheck(username);
            
            if (isAvailable) {
                this.usernameFeedback.textContent = '✓ Username is available';
                this.usernameFeedback.className = 'input-feedback available';
                this.usernameAvailable = true;
            } else {
                this.usernameFeedback.textContent = '✗ Username is not available';
                this.usernameFeedback.className = 'input-feedback unavailable';
                this.usernameAvailable = false;
            }
        }, 500);
    }
    
    simulateUsernameCheck(username) {
        // Simulate some taken usernames
        const takenUsernames = ['admin', 'user', 'test', 'demo', 'physics', 'student'];
        return !takenUsernames.includes(username.toLowerCase());
    }
    
    validateUsername() {
        return this.usernameAvailable === true;
    }
    
    // Validation helper functions
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    isValidAge(birthDate) {
        const today = new Date();
        const birth = new Date(birthDate);
        const age = today.getFullYear() - birth.getFullYear();
        const monthDiff = today.getMonth() - birth.getMonth();
        
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
            return age - 1 >= 13;
        }
        
        return age >= 13;
    }
    
    isValidUsername(username) {
        const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
        return usernameRegex.test(username);
    }
    
    isValidPassword(password) {
        return password.length >= 8 &&
               /[A-Z]/.test(password) &&
               /[a-z]/.test(password) &&
               /\d/.test(password) &&
               /[!@#$%^&*(),.?\":{}|<>]/.test(password);
    }
    
    // Form submission
    async handleRegistration(event) {
        event.preventDefault();
        
        if (!this.validateCurrentStep()) {
            return;
        }
        
        // Collect form data
        const formData = new FormData(this.registerForm);
        const userData = Object.fromEntries(formData);
        
        // Add interests array
        const interests = formData.getAll('interests');
        userData.interests = interests;
        
        // Add notifications array
        const notifications = formData.getAll('notifications');
        userData.notifications = notifications;
        
        // Show loading state
        this.setLoadingState(this.submitBtn, true);
        
        try {
            // Simulate API call
            await this.simulateRegistration(userData);
            
            // Clear saved form data
            this.clearSavedFormData();
            
            // Show success modal
            this.showSuccessModal(userData.email);
            
        } catch (error) {
            this.showError('Registration failed. Please try again.');
            console.error('Registration error:', error);
        } finally {
            this.setLoadingState(this.submitBtn, false);
        }
    }
    
    async handleLogin(event) {
        event.preventDefault();
        
        const formData = new FormData(this.loginForm);
        const credentials = Object.fromEntries(formData);
        
        // Show loading state
        const submitButton = this.loginForm.querySelector('button[type=\"submit\"]');
        this.setLoadingState(submitButton, true);
        
        try {
            // Simulate API call
            await this.simulateLogin(credentials);
            
            // Redirect to dashboard or intended page
            this.redirectAfterLogin();
            
        } catch (error) {
            this.showError('Invalid email or password. Please try again.');
            console.error('Login error:', error);
        } finally {
            this.setLoadingState(submitButton, false);
        }
    }
    
    async simulateRegistration(userData) {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Store user data in localStorage (in real app, this would be sent to server)
        localStorage.setItem('user_data', JSON.stringify(userData));
        localStorage.setItem('registration_pending', 'true');
        
        return { success: true, userId: 'user_' + Date.now() };
    }
    
    async simulateLogin(credentials) {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Check credentials (in real app, this would be validated by server)
        if (credentials.email === 'demo@physicslearn.com' && credentials.password === 'demo123') {
            // Store auth token
            localStorage.setItem('user_token', 'token_' + Date.now());
            localStorage.setItem('user_email', credentials.email);
            return { success: true, token: 'demo_token' };
        } else {
            throw new Error('Invalid credentials');
        }
    }
    
    // UI feedback
    setLoadingState(button, isLoading) {
        if (!button) return;
        
        if (isLoading) {
            button.classList.add('loading');
            button.disabled = true;
        } else {
            button.classList.remove('loading');
            button.disabled = false;
        }
    }
    
    showError(message) {
        // Create error notification
        const notification = document.createElement('div');
        notification.className = 'notification error-notification';
        notification.innerHTML = `
            <i class="fas fa-exclamation-circle"></i>
            <span>${message}</span>
            <button class="notification-close">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        document.body.appendChild(notification);
        
        // Show notification
        setTimeout(() => notification.classList.add('show'), 10);
        
        // Auto hide
        setTimeout(() => this.hideNotification(notification), 5000);
        
        // Close button
        notification.querySelector('.notification-close').addEventListener('click', () => {
            this.hideNotification(notification);
        });
    }
    
    hideNotification(notification) {
        notification.classList.add('hiding');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }
    
    showSuccessModal(email) {
        if (!this.successModal) return;
        
        // Update email in modal
        const emailSpan = this.successModal.querySelector('#user-email');
        if (emailSpan) {
            emailSpan.textContent = email;
        }
        
        // Show modal
        this.successModal.classList.add('show');
        this.successModal.setAttribute('aria-hidden', 'false');
        
        // Focus on continue button
        if (this.continueBtn) {
            this.continueBtn.focus();
        }
        
        // Prevent background scrolling
        document.body.style.overflow = 'hidden';
    }
    
    hideSuccessModal() {
        if (!this.successModal) return;
        
        this.successModal.classList.remove('show');
        this.successModal.setAttribute('aria-hidden', 'true');
        
        // Restore background scrolling
        document.body.style.overflow = '';
    }
    
    // Post-registration actions
    redirectAfterRegistration() {
        this.hideSuccessModal();
        
        // Redirect to welcome page or dashboard
        window.location.href = 'index.html?welcome=true';
    }
    
    redirectAfterLogin() {
        // Get intended destination or default to home
        const urlParams = new URLSearchParams(window.location.search);
        const redirect = urlParams.get('redirect') || 'index.html';
        
        window.location.href = redirect;
    }
    
    async resendVerificationEmail() {
        if (!this.resendEmailBtn) return;
        
        this.setLoadingState(this.resendEmailBtn, true);
        
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Show success feedback
            const originalText = this.resendEmailBtn.textContent;
            this.resendEmailBtn.textContent = 'Email Sent!';
            this.resendEmailBtn.style.background = 'var(--success-color)';
            
            setTimeout(() => {
                this.resendEmailBtn.textContent = originalText;
                this.resendEmailBtn.style.background = '';
            }, 3000);
            
        } catch (error) {
            this.showError('Failed to resend email. Please try again.');
        } finally {
            this.setLoadingState(this.resendEmailBtn, false);
        }
    }
    
    // Social authentication
    setupSocialAuth() {
        // Add click handlers for social buttons
        this.socialButtons.forEach(button => {
            button.addEventListener('click', (e) => this.handleSocialAuth(e));
        });
    }
    
    handleSocialAuth(event) {
        event.preventDefault();
        
        const button = event.currentTarget;
        const provider = this.getSocialProvider(button);
        
        // Show loading state
        this.setLoadingState(button, true);
        
        // Simulate OAuth flow
        setTimeout(() => {
            this.setLoadingState(button, false);
            
            // In real app, this would redirect to OAuth provider
            this.showError(`${provider} authentication is not implemented in this demo.`);
        }, 1000);
    }
    
    getSocialProvider(button) {
        if (button.classList.contains('google-btn')) return 'Google';
        if (button.classList.contains('github-btn')) return 'GitHub';
        if (button.classList.contains('microsoft-btn')) return 'Microsoft';
        return 'Unknown';
    }
    
    // Form persistence
    autoSaveFormData() {
        if (!this.registerForm) return;
        
        const formData = new FormData(this.registerForm);
        const data = Object.fromEntries(formData);
        
        // Remove sensitive data
        delete data.password;
        delete data.confirmPassword;
        
        localStorage.setItem('registration_draft', JSON.stringify(data));
    }
    
    loadSavedFormData() {
        const savedData = localStorage.getItem('registration_draft');
        if (!savedData || !this.registerForm) return;
        
        try {
            const data = JSON.parse(savedData);
            
            // Populate form fields
            Object.keys(data).forEach(key => {
                const field = this.registerForm.querySelector(`[name=\"${key}\"]`);
                if (field && field.type !== 'password') {
                    if (field.type === 'checkbox') {
                        field.checked = data[key] === 'on';
                    } else {
                        field.value = data[key];
                    }
                }
            });
            
        } catch (error) {
            console.error('Error loading saved form data:', error);
        }
    }
    
    clearSavedFormData() {
        localStorage.removeItem('registration_draft');
    }
    
    // Keyboard shortcuts
    handleKeyboardShortcuts(event) {
        // Enter key on non-textarea inputs
        if (event.key === 'Enter' && !event.target.matches('textarea')) {
            if (this.currentStep < this.totalSteps) {
                event.preventDefault();
                this.nextStep();
            }
        }
        
        // Escape key to close modal
        if (event.key === 'Escape' && this.successModal?.classList.contains('show')) {
            this.hideSuccessModal();
        }
    }
    
    // Initialization helpers
    initializeValidation() {
        // Set up custom validation messages
        const inputs = document.querySelectorAll('input, select');
        inputs.forEach(input => {
            input.addEventListener('invalid', (e) => {
                e.preventDefault();
                this.validateField(input);
            });
        });
    }
    
    setupPasswordStrength() {
        if (this.passwordInput) {
            // Initial check
            this.checkPasswordStrength();
        }
    }
    
    setupUsernameCheck() {
        if (this.usernameInput) {
            // Debounced username checking
            let timeout;
            this.usernameInput.addEventListener('input', () => {
                clearTimeout(timeout);
                timeout = setTimeout(() => this.checkUsernameAvailability(), 300);
            });
        }
    }
}

// Enhanced form validation
class FormValidator {
    static validators = {
        email: (value) => {
            const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return regex.test(value);
        },
        
        phone: (value) => {
            const regex = /^[\+]?[1-9]?\d{9,15}$/;
            return regex.test(value.replace(/\s/g, ''));
        },
        
        strongPassword: (value) => {
            return value.length >= 8 &&
                   /[A-Z]/.test(value) &&
                   /[a-z]/.test(value) &&
                   /\d/.test(value) &&
                   /[!@#$%^&*(),.?\":{}|<>]/.test(value);
        },
        
        username: (value) => {
            const regex = /^[a-zA-Z0-9_]{3,20}$/;
            return regex.test(value);
        },
        
        age: (birthDate) => {
            const today = new Date();
            const birth = new Date(birthDate);
            const age = today.getFullYear() - birth.getFullYear();
            return age >= 13;
        }
    };
    
    static validate(field, value) {
        const validators = field.dataset.validators?.split(',') || [];
        
        for (const validator of validators) {
            if (this.validators[validator] && !this.validators[validator](value)) {
                return false;
            }
        }
        
        return true;
    }
}

// Password strength calculator
class PasswordStrengthCalculator {
    static calculate(password) {
        let score = 0;
        const checks = [
            { regex: /.{8,}/, points: 25 },          // Length
            { regex: /[a-z]/, points: 20 },          // Lowercase
            { regex: /[A-Z]/, points: 20 },          // Uppercase
            { regex: /\d/, points: 20 },             // Numbers
            { regex: /[^\w\s]/, points: 15 }        // Special chars
        ];
        
        checks.forEach(check => {
            if (check.regex.test(password)) {
                score += check.points;
            }
        });
        
        // Bonus for length
        if (password.length >= 12) score += 10;
        if (password.length >= 16) score += 10;
        
        return Math.min(score, 100);
    }
    
    static getStrengthLevel(score) {
        if (score >= 80) return 'strong';
        if (score >= 60) return 'good';
        if (score >= 40) return 'fair';
        return 'weak';
    }
}

// Initialize authentication manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new AuthManager();
    
    // Add loading animation for page transitions
    const authLinks = document.querySelectorAll('.auth-link, .nav-link');
    authLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            if (link.href && !link.href.startsWith('#')) {
                document.body.classList.add('page-transition');
            }
        });
    });
});
