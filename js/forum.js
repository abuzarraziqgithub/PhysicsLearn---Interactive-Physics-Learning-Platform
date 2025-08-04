/**
 * Forum functionality
 * Handles forum interactions, search, filtering, and dynamic content
 */

class ForumManager {
    constructor() {
        this.searchInput = null;
        this.filterButtons = null;
        this.discussionItems = null;
        this.sortSelect = null;
        this.currentFilter = 'all';
        this.currentSort = 'recent';
        this.searchTimeout = null;
        
        this.init();
    }
    
    init() {
        this.bindElements();
        this.attachEventListeners();
        this.initializeTooltips();
        this.loadForumData();
        this.setupInfiniteScroll();
    }
    
    bindElements() {
        this.searchInput = document.querySelector('.search-input');
        this.filterButtons = document.querySelectorAll('.filter-btn');
        this.discussionItems = document.querySelectorAll('.discussion-item');
        this.sortSelect = document.querySelector('.sort-select');
        this.newTopicBtn = document.querySelector('.new-topic-btn');
        this.categoryCards = document.querySelectorAll('.category-card');
        this.paginationBtns = document.querySelectorAll('.page-btn');
    }
    
    attachEventListeners() {
        // Search functionality
        if (this.searchInput) {
            this.searchInput.addEventListener('input', (e) => {
                this.handleSearch(e.target.value);
            });
            
            this.searchInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    this.performSearch(e.target.value);
                }
            });
        }
        
        // Filter buttons
        this.filterButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.handleFilter(e.target.dataset.filter, e.target);
            });
        });
        
        // Sort functionality
        if (this.sortSelect) {
            this.sortSelect.addEventListener('change', (e) => {
                this.handleSort(e.target.value);
            });
        }
        
        // New topic button
        if (this.newTopicBtn) {
            this.newTopicBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.openNewTopicModal();
            });
        }
        
        // Discussion item interactions
        this.discussionItems.forEach(item => {
            item.addEventListener('click', (e) => {
                if (!e.target.closest('a')) {
                    this.openDiscussion(item);
                }
            });
            
            item.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.openDiscussion(item);
                }
            });
        });
        
        // Category card interactions
        this.categoryCards.forEach(card => {
            card.addEventListener('click', (e) => {
                if (!e.target.closest('a')) {
                    const categoryLink = card.querySelector('.category-link');
                    if (categoryLink) {
                        window.location.href = categoryLink.href;
                    }
                }
            });
            
            // Add hover effects
            card.addEventListener('mouseenter', () => {
                this.animateCard(card, 'hover');
            });
            
            card.addEventListener('mouseleave', () => {
                this.animateCard(card, 'leave');
            });
        });
        
        // Pagination
        this.paginationBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                this.handlePagination(btn);
            });
        });
        
        // Like/dislike functionality
        this.setupVotingSystem();
        
        // Live search suggestions
        this.setupSearchSuggestions();
        
        // Keyboard shortcuts
        this.setupKeyboardShortcuts();
    }
    
    handleSearch(query) {
        // Clear previous timeout
        if (this.searchTimeout) {
            clearTimeout(this.searchTimeout);
        }
        
        // Debounce search
        this.searchTimeout = setTimeout(() => {
            this.performSearch(query);
        }, 300);
    }
    
    performSearch(query) {
        const trimmedQuery = query.trim().toLowerCase();
        
        if (trimmedQuery === '') {
            this.showAllDiscussions();
            return;
        }
        
        // Filter discussions based on search query
        this.discussionItems.forEach(item => {
            const title = item.querySelector('.discussion-link').textContent.toLowerCase();
            const excerpt = item.querySelector('.discussion-excerpt').textContent.toLowerCase();
            const author = item.querySelector('.author').textContent.toLowerCase();
            
            const matches = title.includes(trimmedQuery) || 
                          excerpt.includes(trimmedQuery) || 
                          author.includes(trimmedQuery);
            
            if (matches) {
                item.style.display = 'flex';
                this.highlightSearchTerms(item, trimmedQuery);
            } else {
                item.style.display = 'none';
            }
        });
        
        this.updateResultsCount();
        this.trackSearchAnalytics(trimmedQuery);
    }
    
    highlightSearchTerms(item, query) {
        const title = item.querySelector('.discussion-link');
        const excerpt = item.querySelector('.discussion-excerpt');
        
        // Remove existing highlights
        this.removeHighlights(item);
        
        // Add new highlights
        if (title && query.length > 2) {
            title.innerHTML = this.addHighlight(title.textContent, query);
        }
        
        if (excerpt && query.length > 2) {
            excerpt.innerHTML = this.addHighlight(excerpt.textContent, query);
        }
    }
    
    addHighlight(text, query) {
        const regex = new RegExp(`(${this.escapeRegex(query)})`, 'gi');
        return text.replace(regex, '<mark class="search-highlight">$1</mark>');
    }
    
    removeHighlights(item) {
        const highlights = item.querySelectorAll('.search-highlight');
        highlights.forEach(highlight => {
            highlight.outerHTML = highlight.textContent;
        });
    }
    
    escapeRegex(string) {
        return string.replace(/[.*+?^${}()|[\\]\\]/g, '\\$&');
    }
    
    handleFilter(filter, button) {
        // Update active button
        this.filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        
        this.currentFilter = filter;
        
        // Filter discussions
        this.discussionItems.forEach(item => {
            const badges = item.querySelectorAll('.discussion-badge');
            let shouldShow = false;
            
            switch (filter) {
                case 'all':
                    shouldShow = true;
                    break;
                case 'questions':
                    shouldShow = Array.from(badges).some(badge => 
                        badge.classList.contains('question') || 
                        badge.textContent.toLowerCase().includes('question')
                    );
                    break;
                case 'discussions':
                    shouldShow = !Array.from(badges).some(badge => 
                        badge.classList.contains('question') || 
                        badge.classList.contains('solved')
                    );
                    break;
                case 'solved':
                    shouldShow = Array.from(badges).some(badge => 
                        badge.classList.contains('solved')
                    );
                    break;
                case 'unanswered':
                    const replyCount = this.getReplyCount(item);
                    shouldShow = replyCount === 0;
                    break;
            }
            
            item.style.display = shouldShow ? 'flex' : 'none';
        });
        
        this.updateResultsCount();
        this.animateFilterTransition();
    }
    
    handleSort(sortType) {
        this.currentSort = sortType;
        
        const discussionsList = document.querySelector('.discussions-list');
        const items = Array.from(this.discussionItems);
        
        items.sort((a, b) => {
            switch (sortType) {
                case 'recent':
                    return this.compareByDate(a, b);
                case 'popular':
                    return this.compareByPopularity(a, b);
                case 'unanswered':
                    return this.compareByReplies(a, b);
                case 'solved':
                    return this.compareBySolved(a, b);
                default:
                    return 0;
            }
        });
        
        // Animate and reorder
        this.animateSortTransition(() => {
            items.forEach(item => discussionsList.appendChild(item));
        });
    }
    
    compareByDate(a, b) {
        const timeA = this.getTimestamp(a);
        const timeB = this.getTimestamp(b);
        return timeB - timeA; // Most recent first
    }
    
    compareByPopularity(a, b) {
        const popularityA = this.getPopularityScore(a);
        const popularityB = this.getPopularityScore(b);
        return popularityB - popularityA; // Most popular first
    }
    
    compareByReplies(a, b) {
        const repliesA = this.getReplyCount(a);
        const repliesB = this.getReplyCount(b);
        return repliesA - repliesB; // Least replies first (unanswered)
    }
    
    compareBySolved(a, b) {
        const solvedA = this.isSolved(a);
        const solvedB = this.isSolved(b);
        return solvedB - solvedA; // Solved first
    }
    
    getTimestamp(item) {
        const timeElement = item.querySelector('.timestamp');
        if (!timeElement) return 0;
        
        const timeText = timeElement.textContent.toLowerCase();
        
        // Convert relative time to timestamp
        if (timeText.includes('hour')) {
            const hours = parseInt(timeText);
            return Date.now() - (hours * 60 * 60 * 1000);
        } else if (timeText.includes('day')) {
            const days = parseInt(timeText);
            return Date.now() - (days * 24 * 60 * 60 * 1000);
        } else if (timeText.includes('min')) {
            const minutes = parseInt(timeText);
            return Date.now() - (minutes * 60 * 1000);
        }
        
        return Date.now();
    }
    
    getPopularityScore(item) {
        const stats = item.querySelectorAll('.discussion-stats span');
        let score = 0;
        
        stats.forEach(stat => {
            const text = stat.textContent;
            if (text.includes('👍') || stat.querySelector('.fa-thumbs-up')) {
                score += parseInt(text.replace(/\\D/g, '')) * 3; // Likes weight more
            } else if (text.includes('💬') || stat.querySelector('.fa-reply')) {
                score += parseInt(text.replace(/\\D/g, '')) * 2; // Replies
            } else if (text.includes('👁') || stat.querySelector('.fa-eye')) {
                score += parseInt(text.replace(/\\D/g, '')); // Views
            }
        });
        
        return score;
    }
    
    getReplyCount(item) {
        const replyElement = item.querySelector('.fa-reply')?.parentElement;
        if (!replyElement) return 0;
        return parseInt(replyElement.textContent.replace(/\\D/g, '')) || 0;
    }
    
    isSolved(item) {
        return item.querySelector('.discussion-badge.solved') !== null;
    }
    
    openDiscussion(item) {
        const link = item.querySelector('.discussion-link');
        if (link) {
            // Add loading state
            item.classList.add('loading');
            
            // Animate out
            this.animateDiscussionOpen(item, () => {
                window.location.href = link.href;
            });
        }
    }
    
    openNewTopicModal() {
        // Check if user is logged in
        if (!this.isUserLoggedIn()) {
            this.showLoginPrompt();
            return;
        }
        
        // Create and show modal
        const modal = this.createNewTopicModal();
        document.body.appendChild(modal);
        
        // Animate modal in
        requestAnimationFrame(() => {
            modal.classList.add('show');
        });
        
        // Focus on title input
        const titleInput = modal.querySelector('#topic-title');
        if (titleInput) {
            titleInput.focus();
        }
    }
    
    createNewTopicModal() {
        const modal = document.createElement('div');
        modal.className = 'modal new-topic-modal';
        modal.innerHTML = `
            <div class="modal-overlay"></div>
            <div class="modal-content">
                <div class="modal-header">
                    <h2>Start New Discussion</h2>
                    <button class="modal-close" aria-label="Close modal">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <form class="new-topic-form">
                    <div class="form-group">
                        <label for="topic-title">Title</label>
                        <input type="text" id="topic-title" name="title" 
                               placeholder="Enter a descriptive title" required>
                    </div>
                    <div class="form-group">
                        <label for="topic-category">Category</label>
                        <select id="topic-category" name="category" required>
                            <option value="">Select a category</option>
                            <option value="classical">Classical Mechanics</option>
                            <option value="waves">Waves & Oscillations</option>
                            <option value="electromagnetism">Electromagnetism</option>
                            <option value="thermodynamics">Thermodynamics</option>
                            <option value="quantum">Quantum Physics</option>
                            <option value="problems">Problem Solving</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="topic-content">Content</label>
                        <textarea id="topic-content" name="content" rows="8" 
                                  placeholder="Describe your question or topic in detail..." required></textarea>
                    </div>
                    <div class="form-group">
                        <label class="checkbox-label">
                            <input type="checkbox" name="is-question"> This is a question
                        </label>
                    </div>
                    <div class="modal-actions">
                        <button type="button" class="btn btn-outline cancel-btn">Cancel</button>
                        <button type="submit" class="btn btn-primary">Post Discussion</button>
                    </div>
                </form>
            </div>
        `;
        
        // Add event listeners
        const closeBtn = modal.querySelector('.modal-close');
        const cancelBtn = modal.querySelector('.cancel-btn');
        const overlay = modal.querySelector('.modal-overlay');
        const form = modal.querySelector('.new-topic-form');
        
        [closeBtn, cancelBtn, overlay].forEach(element => {
            element.addEventListener('click', () => this.closeModal(modal));
        });
        
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.submitNewTopic(form, modal);
        });
        
        return modal;
    }
    
    closeModal(modal) {
        modal.classList.add('closing');
        setTimeout(() => {
            if (modal.parentNode) {
                modal.parentNode.removeChild(modal);
            }
        }, 300);
    }
    
    submitNewTopic(form, modal) {
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        
        // Show loading state
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Posting...';
        submitBtn.disabled = true;
        
        // Simulate API call
        setTimeout(() => {
            this.showSuccessMessage('Your discussion has been posted successfully!');
            this.closeModal(modal);
            
            // Add new discussion to the list
            this.addNewDiscussionToList(data);
        }, 1500);
    }
    
    addNewDiscussionToList(data) {
        const discussionsList = document.querySelector('.discussions-list');
        const newDiscussion = this.createDiscussionElement(data);
        
        // Add with animation
        newDiscussion.style.opacity = '0';
        newDiscussion.style.transform = 'translateY(-20px)';
        discussionsList.insertBefore(newDiscussion, discussionsList.firstChild);
        
        requestAnimationFrame(() => {
            newDiscussion.style.transition = 'all 0.3s ease';
            newDiscussion.style.opacity = '1';
            newDiscussion.style.transform = 'translateY(0)';
        });
    }
    
    createDiscussionElement(data) {
        const discussion = document.createElement('article');
        discussion.className = 'discussion-item new-discussion';
        discussion.tabIndex = 0;
        
        discussion.innerHTML = `
            <div class="discussion-avatar">
                <img src="https://via.placeholder.com/40x40/3b82f6/ffffff?text=You" alt="Your avatar" class="avatar">
            </div>
            <div class="discussion-content">
                <h3 class="discussion-title">
                    <a href="#" class="discussion-link">${data.title}</a>
                    ${data['is-question'] ? '<span class="discussion-badge question">Question</span>' : ''}
                    <span class="discussion-badge new">New</span>
                </h3>
                <p class="discussion-excerpt">${data.content.substring(0, 150)}...</p>
                <div class="discussion-meta">
                    <span class="author">by <strong>You</strong></span>
                    <span class="category">in <a href="#" class="category-link">${this.getCategoryName(data.category)}</a></span>
                    <span class="timestamp">just now</span>
                    <div class="discussion-stats">
                        <span><i class="fas fa-thumbs-up"></i> 0</span>
                        <span><i class="fas fa-reply"></i> 0</span>
                        <span><i class="fas fa-eye"></i> 1</span>
                    </div>
                </div>
            </div>
        `;
        
        return discussion;
    }
    
    getCategoryName(categoryValue) {
        const categories = {
            'classical': 'Classical Mechanics',
            'waves': 'Waves & Oscillations',
            'electromagnetism': 'Electromagnetism',
            'thermodynamics': 'Thermodynamics',
            'quantum': 'Quantum Physics',
            'problems': 'Problem Solving'
        };
        return categories[categoryValue] || categoryValue;
    }
    
    setupVotingSystem() {
        const voteButtons = document.querySelectorAll('.discussion-stats span');
        
        voteButtons.forEach(button => {
            if (button.querySelector('.fa-thumbs-up')) {
                button.style.cursor = 'pointer';
                button.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.handleVote(button, 'like');
                });
            }
        });
    }
    
    handleVote(button, type) {
        if (!this.isUserLoggedIn()) {
            this.showLoginPrompt();
            return;
        }
        
        const currentCount = parseInt(button.textContent.replace(/\\D/g, ''));
        const newCount = currentCount + 1;
        
        // Update UI
        button.innerHTML = `<i class="fas fa-thumbs-up"></i> ${newCount}`;
        button.classList.add('voted');
        
        // Animate
        button.style.transform = 'scale(1.1)';
        setTimeout(() => {
            button.style.transform = 'scale(1)';
        }, 150);
        
        // Show feedback
        this.showVoteFeedback(button);
    }
    
    showVoteFeedback(element) {
        const feedback = document.createElement('div');
        feedback.className = 'vote-feedback';
        feedback.textContent = '+1';
        
        const rect = element.getBoundingClientRect();
        feedback.style.position = 'fixed';
        feedback.style.left = rect.left + 'px';
        feedback.style.top = (rect.top - 30) + 'px';
        feedback.style.zIndex = '9999';
        feedback.style.color = 'var(--success-color)';
        feedback.style.fontWeight = 'bold';
        feedback.style.pointerEvents = 'none';
        feedback.style.opacity = '1';
        feedback.style.transform = 'translateY(0)';
        feedback.style.transition = 'all 0.5s ease';
        
        document.body.appendChild(feedback);
        
        requestAnimationFrame(() => {
            feedback.style.opacity = '0';
            feedback.style.transform = 'translateY(-20px)';
        });
        
        setTimeout(() => {
            if (feedback.parentNode) {
                feedback.parentNode.removeChild(feedback);
            }
        }, 500);
    }
    
    setupSearchSuggestions() {
        if (!this.searchInput) return;
        
        const suggestionsContainer = document.createElement('div');
        suggestionsContainer.className = 'search-suggestions';
        this.searchInput.parentNode.appendChild(suggestionsContainer);
        
        this.searchInput.addEventListener('input', (e) => {
            const query = e.target.value.trim();
            if (query.length > 2) {
                this.showSearchSuggestions(query, suggestionsContainer);
            } else {
                this.hideSearchSuggestions(suggestionsContainer);
            }
        });
        
        this.searchInput.addEventListener('blur', () => {
            setTimeout(() => {
                this.hideSearchSuggestions(suggestionsContainer);
            }, 150);
        });
    }
    
    showSearchSuggestions(query, container) {
        // Mock suggestions based on existing content
        const suggestions = this.generateSearchSuggestions(query);
        
        if (suggestions.length === 0) {
            this.hideSearchSuggestions(container);
            return;
        }
        
        container.innerHTML = suggestions.map(suggestion => 
            `<div class="suggestion-item" data-query="${suggestion}">${suggestion}</div>`
        ).join('');
        
        container.style.display = 'block';
        
        // Add click handlers
        container.querySelectorAll('.suggestion-item').forEach(item => {
            item.addEventListener('click', () => {
                this.searchInput.value = item.dataset.query;
                this.performSearch(item.dataset.query);
                this.hideSearchSuggestions(container);
            });
        });
    }
    
    generateSearchSuggestions(query) {
        const commonTopics = [
            'momentum conservation',
            'wave interference',
            'electric field',
            'quantum tunneling',
            'thermodynamics laws',
            'simple harmonic motion',
            'electromagnetic waves',
            'Newton\'s laws',
            'energy conservation',
            'magnetic field'
        ];
        
        return commonTopics
            .filter(topic => topic.toLowerCase().includes(query.toLowerCase()))
            .slice(0, 5);
    }
    
    hideSearchSuggestions(container) {
        container.style.display = 'none';
        container.innerHTML = '';
    }
    
    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Ctrl/Cmd + K for search focus
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                if (this.searchInput) {
                    this.searchInput.focus();
                    this.searchInput.select();
                }
            }
            
            // N for new topic
            if (e.key === 'n' && !e.target.matches('input, textarea')) {
                e.preventDefault();
                this.openNewTopicModal();
            }
            
            // Escape to clear search
            if (e.key === 'Escape' && this.searchInput === document.activeElement) {
                this.searchInput.value = '';
                this.showAllDiscussions();
                this.searchInput.blur();
            }
        });
    }
    
    // Utility functions
    showAllDiscussions() {
        this.discussionItems.forEach(item => {
            item.style.display = 'flex';
            this.removeHighlights(item);
        });
        this.updateResultsCount();
    }
    
    updateResultsCount() {
        const visibleItems = Array.from(this.discussionItems).filter(item => 
            item.style.display !== 'none'
        );
        
        // Update or create results counter
        let counter = document.querySelector('.results-counter');
        if (!counter) {
            counter = document.createElement('div');
            counter.className = 'results-counter';
            const header = document.querySelector('.section-header');
            if (header) {
                header.appendChild(counter);
            }
        }
        
        counter.textContent = `${visibleItems.length} discussion${visibleItems.length !== 1 ? 's' : ''}`;
    }
    
    isUserLoggedIn() {
        // Mock authentication check
        return localStorage.getItem('user_token') !== null;
    }
    
    showLoginPrompt() {
        const message = 'Please log in to interact with discussions.';
        this.showNotification(message, 'info', () => {
            window.location.href = 'login.html';
        });
    }
    
    showSuccessMessage(message) {
        this.showNotification(message, 'success');
    }
    
    showNotification(message, type = 'info', action = null) {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check' : 'info'}"></i>
            <span>${message}</span>
            ${action ? '<button class="notification-action">Take Action</button>' : ''}
            <button class="notification-close" aria-label="Close notification">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        document.body.appendChild(notification);
        
        // Show notification
        requestAnimationFrame(() => {
            notification.classList.add('show');
        });
        
        // Auto hide after 5 seconds
        setTimeout(() => {
            this.hideNotification(notification);
        }, 5000);
        
        // Event listeners
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => this.hideNotification(notification));
        
        if (action) {
            const actionBtn = notification.querySelector('.notification-action');
            actionBtn.addEventListener('click', () => {
                action();
                this.hideNotification(notification);
            });
        }
    }
    
    hideNotification(notification) {
        notification.classList.add('hiding');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }
    
    // Animation functions
    animateCard(card, type) {
        if (type === 'hover') {
            card.style.transform = 'translateY(-4px)';
        } else {
            card.style.transform = 'translateY(0)';
        }
    }
    
    animateFilterTransition() {
        const discussionsList = document.querySelector('.discussions-list');
        discussionsList.style.opacity = '0.7';
        
        setTimeout(() => {
            discussionsList.style.opacity = '1';
        }, 150);
    }
    
    animateSortTransition(callback) {
        const discussionsList = document.querySelector('.discussions-list');
        discussionsList.style.transition = 'opacity 0.2s ease';
        discussionsList.style.opacity = '0.5';
        
        setTimeout(() => {
            callback();
            discussionsList.style.opacity = '1';
        }, 200);
    }
    
    animateDiscussionOpen(item, callback) {
        item.style.transition = 'transform 0.2s ease, opacity 0.2s ease';
        item.style.transform = 'scale(0.98)';
        item.style.opacity = '0.8';
        
        setTimeout(callback, 200);
    }
    
    handlePagination(button) {
        // Remove active state from all buttons
        this.paginationBtns.forEach(btn => btn.classList.remove('active'));
        
        // Add active state to clicked button
        if (button.classList.contains('page-btn')) {
            button.classList.add('active');
        }
        
        // Smooth scroll to top
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
        
        // Show loading state
        this.showLoadingState();
        
        // Simulate page load
        setTimeout(() => {
            this.hideLoadingState();
        }, 500);
    }
    
    showLoadingState() {
        const discussionsList = document.querySelector('.discussions-list');
        discussionsList.style.opacity = '0.5';
        discussionsList.style.pointerEvents = 'none';
    }
    
    hideLoadingState() {
        const discussionsList = document.querySelector('.discussions-list');
        discussionsList.style.opacity = '1';
        discussionsList.style.pointerEvents = 'auto';
    }
    
    initializeTooltips() {
        // Add tooltips to various elements
        const tooltipElements = document.querySelectorAll('[data-tooltip]');
        tooltipElements.forEach(element => {
            this.addTooltip(element);
        });
    }
    
    addTooltip(element) {
        element.addEventListener('mouseenter', (e) => {
            const tooltip = document.createElement('div');
            tooltip.className = 'tooltip';
            tooltip.textContent = element.dataset.tooltip;
            document.body.appendChild(tooltip);
            
            const rect = element.getBoundingClientRect();
            tooltip.style.left = rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2) + 'px';
            tooltip.style.top = rect.top - tooltip.offsetHeight - 8 + 'px';
            
            setTimeout(() => tooltip.classList.add('show'), 10);
        });
        
        element.addEventListener('mouseleave', () => {
            const tooltip = document.querySelector('.tooltip');
            if (tooltip) {
                tooltip.remove();
            }
        });
    }
    
    loadForumData() {
        // Mock data loading - in real app this would fetch from API
        this.updateOnlineUsersCount();
        this.loadRecentActivity();
        this.updateCategoryStats();
    }
    
    updateOnlineUsersCount() {
        const onlineCountElements = document.querySelectorAll('.stat-number');
        if (onlineCountElements.length > 3) {
            // Simulate real-time updates
            setInterval(() => {
                const currentText = onlineCountElements[3].textContent.replace(/,/g, '');
                const currentCount = parseInt(currentText) || 1234; // Default fallback
                const variation = Math.floor(Math.random() * 10) - 5;
                const newCount = Math.max(1000, currentCount + variation);
                onlineCountElements[3].textContent = newCount.toLocaleString();
            }, 30000);
        }
    }
    
    loadRecentActivity() {
        // Update activity feed every 2 minutes
        setInterval(() => {
            this.addNewActivity();
        }, 120000);
    }
    
    addNewActivity() {
        const activityFeed = document.querySelector('.activity-feed');
        if (!activityFeed) return;
        
        const activities = [
            { icon: 'reply', user: 'Dr. Smith', action: 'replied to', topic: 'Quantum mechanics basics' },
            { icon: 'thumbs-up', user: 'Alice Johnson', action: 'liked', topic: 'Wave interference demo' },
            { icon: 'plus', user: 'Bob Wilson', action: 'started', topic: 'Heat transfer problem' }
        ];
        
        const randomActivity = activities[Math.floor(Math.random() * activities.length)];
        
        const activityItem = document.createElement('div');
        activityItem.className = 'activity-item new-activity';
        activityItem.innerHTML = `
            <i class="fas fa-${randomActivity.icon} activity-icon"></i>
            <div class="activity-content">
                <span class="username">${randomActivity.user}</span> ${randomActivity.action}
                <a href="#" class="activity-link">${randomActivity.topic}</a>
                <span class="activity-time">just now</span>
            </div>
        `;
        
        activityFeed.insertBefore(activityItem, activityFeed.firstChild);
        
        // Remove oldest activity if more than 5
        const activities_list = activityFeed.querySelectorAll('.activity-item');
        if (activities_list.length > 5) {
            activityFeed.removeChild(activities_list[activities_list.length - 1]);
        }
        
        // Animate new activity
        activityItem.style.opacity = '0';
        activityItem.style.transform = 'translateX(-20px)';
        
        requestAnimationFrame(() => {
            activityItem.style.transition = 'all 0.3s ease';
            activityItem.style.opacity = '1';
            activityItem.style.transform = 'translateX(0)';
        });
    }
    
    updateCategoryStats() {
        // Update category statistics periodically
        setInterval(() => {
            const categoryStats = document.querySelectorAll('.category-stats span');
            categoryStats.forEach(stat => {
                if (Math.random() < 0.1) { // 10% chance to update
                    const currentNumber = parseInt(stat.textContent.replace(/\\D/g, ''));
                    const newNumber = currentNumber + 1;
                    stat.innerHTML = stat.innerHTML.replace(currentNumber.toString(), newNumber.toString());
                }
            });
        }, 60000);
    }
    
    setupInfiniteScroll() {
        // Implement infinite scroll for discussions
        let loading = false;
        
        window.addEventListener('scroll', () => {
            if (loading) return;
            
            const scrollTop = window.pageYOffset;
            const windowHeight = window.innerHeight;
            const documentHeight = document.documentElement.scrollHeight;
            
            if (scrollTop + windowHeight >= documentHeight - 100) {
                loading = true;
                this.loadMoreDiscussions().then(() => {
                    loading = false;
                });
            }
        });
    }
    
    async loadMoreDiscussions() {
        // Show loading indicator
        const loader = document.createElement('div');
        loader.className = 'discussions-loader';
        loader.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading more discussions...';
        
        const discussionsList = document.querySelector('.discussions-list');
        discussionsList.appendChild(loader);
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Remove loader
        loader.remove();
        
        // Add mock discussions (in real app, this would be API data)
        for (let i = 0; i < 5; i++) {
            const mockDiscussion = this.createMockDiscussion();
            discussionsList.appendChild(mockDiscussion);
        }
    }
    
    createMockDiscussion() {
        const topics = [
            'Understanding wave-particle duality',
            'Help with projectile motion calculations',
            'Electromagnetic induction explained',
            'Thermodynamics efficiency problems',
            'Quantum entanglement questions'
        ];
        
        const authors = ['John Doe', 'Jane Smith', 'Mike Johnson', 'Sarah Wilson', 'Tom Brown'];
        const categories = ['Quantum Physics', 'Classical Mechanics', 'Electromagnetism', 'Thermodynamics'];
        
        const discussion = document.createElement('article');
        discussion.className = 'discussion-item';
        discussion.tabIndex = 0;
        
        const randomTopic = topics[Math.floor(Math.random() * topics.length)];
        const randomAuthor = authors[Math.floor(Math.random() * authors.length)];
        const randomCategory = categories[Math.floor(Math.random() * categories.length)];
        
        discussion.innerHTML = `
            <div class="discussion-avatar">
                <img src="https://via.placeholder.com/40x40/3b82f6/ffffff?text=${randomAuthor.charAt(0)}" alt="User avatar" class="avatar">
            </div>
            <div class="discussion-content">
                <h3 class="discussion-title">
                    <a href="#" class="discussion-link">${randomTopic}</a>
                </h3>
                <p class="discussion-excerpt">This is a sample discussion about ${randomTopic.toLowerCase()}. Looking for help and insights from the community.</p>
                <div class="discussion-meta">
                    <span class="author">by <strong>${randomAuthor}</strong></span>
                    <span class="category">in <a href="#" class="category-link">${randomCategory}</a></span>
                    <span class="timestamp">${Math.floor(Math.random() * 24)} hours ago</span>
                    <div class="discussion-stats">
                        <span><i class="fas fa-thumbs-up"></i> ${Math.floor(Math.random() * 20)}</span>
                        <span><i class="fas fa-reply"></i> ${Math.floor(Math.random() * 15)}</span>
                        <span><i class="fas fa-eye"></i> ${Math.floor(Math.random() * 200)}</span>
                    </div>
                </div>
            </div>
        `;
        
        return discussion;
    }
    
    trackSearchAnalytics(query) {
        // Track search analytics (in real app, send to analytics service)
        console.log('Search performed:', query);
        
        // Store recent searches in localStorage
        const recentSearches = JSON.parse(localStorage.getItem('forum_recent_searches') || '[]');
        recentSearches.unshift(query);
        
        // Keep only last 10 searches
        const limitedSearches = recentSearches.slice(0, 10);
        localStorage.setItem('forum_recent_searches', JSON.stringify(limitedSearches));
    }
}

// Initialize forum when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ForumManager();
});
