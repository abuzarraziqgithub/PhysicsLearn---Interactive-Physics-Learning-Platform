/**
 * Performance Optimization and Smooth Experience Manager
 * Created by Abuzar RaziQ - https://github.com/abuzarraziqgithub
 * Ensures optimal performance across all devices and browsers
 */

class PerformanceManager {
    constructor() {
        this.isLowEndDevice = false;
        this.preferReducedMotion = false;
        this.connectionSpeed = 'fast';
        this.deviceCapabilities = {};
        this.init();
    }

    init() {
        this.detectDeviceCapabilities();
        this.setupPerformanceOptimizations();
        this.monitorPerformance();
        this.setupAdaptiveLoading();
    }

    /**
     * Detect device capabilities and performance characteristics
     */
    detectDeviceCapabilities() {
        // Detect reduced motion preference
        this.preferReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        // Detect connection speed
        if ('connection' in navigator) {
            const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
            this.connectionSpeed = connection.effectiveType || 'unknown';
        }

        // Detect device memory (if available)
        const deviceMemory = navigator.deviceMemory || 4; // Default to 4GB if not available
        
        // Detect hardware concurrency
        const hardwareConcurrency = navigator.hardwareConcurrency || 4;

        // Determine if it's a low-end device
        this.isLowEndDevice = deviceMemory <= 2 || hardwareConcurrency <= 2 || 
                             this.connectionSpeed === 'slow-2g' || this.connectionSpeed === '2g';

        this.deviceCapabilities = {
            memory: deviceMemory,
            cores: hardwareConcurrency,
            connection: this.connectionSpeed,
            pixelRatio: window.devicePixelRatio || 1,
            maxTextureSize: this.getMaxTextureSize(),
            webGL: this.hasWebGLSupport(),
            webGL2: this.hasWebGL2Support()
        };

        console.log('Device capabilities detected:', this.deviceCapabilities);
    }

    /**
     * Setup performance optimizations based on device capabilities
     */
    setupPerformanceOptimizations() {
        // Optimize 3D rendering for low-end devices
        if (this.isLowEndDevice) {
            this.enableLowEndOptimizations();
        }

        // Reduce animations for users who prefer reduced motion
        if (this.preferReducedMotion) {
            this.disableAnimations();
        }

        // Optimize based on connection speed
        if (this.connectionSpeed === 'slow-2g' || this.connectionSpeed === '2g') {
            this.enableSlowConnectionOptimizations();
        }

        // Setup intersection observer with performance optimizations
        this.setupOptimizedIntersectionObserver();
    }

    /**
     * Enable optimizations for low-end devices
     */
    enableLowEndOptimizations() {
        document.documentElement.classList.add('low-end-device');

        // Reduce particle count significantly
        window.PARTICLE_COUNT_MULTIPLIER = 0.1;
        
        // Lower rendering quality for 3D scenes
        window.RENDERER_PIXEL_RATIO = 1;
        
        // Disable complex shaders
        window.USE_SIMPLE_SHADERS = true;
        
        // Reduce animation frame rate
        window.ANIMATION_FRAME_RATE = 30;

        // Disable heavy 3D backgrounds
        window.DISABLE_3D_BACKGROUNDS = true;

        console.log('Low-end device optimizations enabled');
    }

    /**
     * Disable animations for accessibility
     */
    disableAnimations() {
        document.documentElement.classList.add('reduce-motion');
        
        // Disable GSAP animations
        if (typeof gsap !== 'undefined') {
            gsap.globalTimeline.timeScale(0);
        }

        console.log('Animations disabled for accessibility');
    }

    /**
     * Enable optimizations for slow connections
     */
    enableSlowConnectionOptimizations() {
        document.documentElement.classList.add('slow-connection');
        
        // Disable heavy 3D effects
        window.DISABLE_3D_EFFECTS = true;
        
        // Use lower quality textures
        window.USE_LOW_QUALITY_TEXTURES = true;
        
        // Lazy load everything
        window.AGGRESSIVE_LAZY_LOADING = true;

        console.log('Slow connection optimizations enabled');
    }

    /**
     * Setup optimized intersection observer
     */
    setupOptimizedIntersectionObserver() {
        if (!('IntersectionObserver' in window)) return;

        const options = {
            threshold: this.isLowEndDevice ? [0, 0.5] : [0, 0.25, 0.5, 0.75, 1],
            rootMargin: this.isLowEndDevice ? '50px' : '100px'
        };

        this.performanceObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const element = entry.target;
                
                if (entry.isIntersecting) {
                    // Element is visible, start animations/loading
                    element.classList.add('in-viewport');
                    this.handleElementEnterViewport(element);
                } else {
                    // Element is not visible, pause animations
                    element.classList.remove('in-viewport');
                    this.handleElementExitViewport(element);
                }
            });
        }, options);

        // Observe all animated elements
        document.querySelectorAll('.animate-on-scroll, .feature-card, .simulation-card').forEach(el => {
            this.performanceObserver.observe(el);
        });
    }

    /**
     * Handle element entering viewport
     */
    handleElementEnterViewport(element) {
        // Start or resume animations for this element
        if (element.hasAttribute('data-gsap-timeline')) {
            const timelineId = element.getAttribute('data-gsap-timeline');
            const timeline = gsap.getById(timelineId);
            if (timeline) timeline.play();
        }

        // Load high-resolution images if needed
        const images = element.querySelectorAll('img[data-src-hd]');
        images.forEach(img => {
            if (!this.isLowEndDevice && this.connectionSpeed !== 'slow-2g') {
                img.src = img.dataset.srcHd;
            }
        });
    }

    /**
     * Handle element exiting viewport
     */
    handleElementExitViewport(element) {
        // Pause animations for this element to save resources
        if (element.hasAttribute('data-gsap-timeline')) {
            const timelineId = element.getAttribute('data-gsap-timeline');
            const timeline = gsap.getById(timelineId);
            if (timeline) timeline.pause();
        }
    }

    /**
     * Monitor performance metrics
     */
    monitorPerformance() {
        // Monitor frame rate
        this.frameCount = 0;
        this.lastTime = performance.now();
        this.fps = 60;

        const monitorFPS = () => {
            this.frameCount++;
            const currentTime = performance.now();
            
            if (currentTime - this.lastTime >= 1000) {
                this.fps = Math.round((this.frameCount * 1000) / (currentTime - this.lastTime));
                this.frameCount = 0;
                this.lastTime = currentTime;
                
                // Adjust quality based on FPS
                this.adjustQualityBasedOnFPS();
            }
            
            requestAnimationFrame(monitorFPS);
        };

        monitorFPS();

        // Monitor memory usage (if available)
        if (performance.memory) {
            setInterval(() => {
                const memoryInfo = performance.memory;
                const memoryUsage = memoryInfo.usedJSHeapSize / memoryInfo.jsHeapSizeLimit;
                
                if (memoryUsage > 0.8) {
                    this.enableMemoryOptimizations();
                }
            }, 5000);
        }
    }

    /**
     * Adjust quality based on current FPS
     */
    adjustQualityBasedOnFPS() {
        if (this.fps < 30 && !this.isLowEndDevice) {
            console.warn('Low FPS detected, enabling performance optimizations');
            this.enableLowEndOptimizations();
            this.isLowEndDevice = true;
        } else if (this.fps > 55 && this.isLowEndDevice) {
            console.log('Good FPS detected, disabling some optimizations');
            this.disableSomeOptimizations();
        }
    }

    /**
     * Enable memory optimizations
     */
    enableMemoryOptimizations() {
        console.warn('High memory usage detected, enabling memory optimizations');
        
        // Reduce particle count further
        window.PARTICLE_COUNT_MULTIPLIER = Math.min(window.PARTICLE_COUNT_MULTIPLIER || 1, 0.5);
        
        // Clean up unused textures and geometries
        if (window.threeEffects) {
            window.threeEffects.cleanupResources();
        }
        
        // Trigger garbage collection if possible
        if (window.gc) {
            window.gc();
        }
    }

    /**
     * Setup adaptive loading based on connection
     */
    setupAdaptiveLoading() {
        // Preload critical resources on fast connections
        if (this.connectionSpeed === '4g' || this.connectionSpeed === '5g') {
            this.preloadCriticalResources();
        }

        // Setup lazy loading with performance considerations
        this.setupLazyLoading();
    }

    /**
     * Preload critical resources
     */
    preloadCriticalResources() {
        const criticalResources = [
            'css/enhanced-animations.css',
            'js/three-effects.js',
            'js/smooth-scroll.js'
        ];

        criticalResources.forEach(resource => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.href = resource;
            link.as = resource.endsWith('.css') ? 'style' : 'script';
            document.head.appendChild(link);
        });
    }

    /**
     * Setup performance-aware lazy loading
     */
    setupLazyLoading() {
        if ('loading' in HTMLImageElement.prototype) {
            // Native lazy loading is supported
            document.querySelectorAll('img[data-src]').forEach(img => {
                img.loading = 'lazy';
                img.src = img.dataset.src;
            });
        } else {
            // Fallback to intersection observer
            this.setupImageLazyLoading();
        }
    }

    /**
     * Setup image lazy loading with intersection observer
     */
    setupImageLazyLoading() {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    
                    // Choose appropriate image quality based on device capabilities
                    if (this.isLowEndDevice || this.connectionSpeed === 'slow-2g') {
                        img.src = img.dataset.srcLow || img.dataset.src;
                    } else {
                        img.src = img.dataset.srcHd || img.dataset.src;
                    }
                    
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });

        document.querySelectorAll('img[data-src]').forEach(img => {
            img.classList.add('lazy');
            imageObserver.observe(img);
        });
    }

    /**
     * Utility methods for WebGL detection
     */
    hasWebGLSupport() {
        try {
            const canvas = document.createElement('canvas');
            return !!(window.WebGLRenderingContext && canvas.getContext('webgl'));
        } catch (e) {
            return false;
        }
    }

    hasWebGL2Support() {
        try {
            const canvas = document.createElement('canvas');
            return !!(window.WebGL2RenderingContext && canvas.getContext('webgl2'));
        } catch (e) {
            return false;
        }
    }

    getMaxTextureSize() {
        if (!this.hasWebGLSupport()) return 1024;
        
        try {
            const canvas = document.createElement('canvas');
            const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
            return gl.getParameter(gl.MAX_TEXTURE_SIZE);
        } catch (e) {
            return 1024;
        }
    }

    /**
     * Disable some optimizations when performance improves
     */
    disableSomeOptimizations() {
        window.PARTICLE_COUNT_MULTIPLIER = Math.min((window.PARTICLE_COUNT_MULTIPLIER || 0.3) * 1.5, 1);
        window.RENDERER_PIXEL_RATIO = Math.min(window.devicePixelRatio, 2);
    }

    /**
     * Public API for external components
     */
    getOptimizedSettings() {
        return {
            particleCount: Math.floor(1000 * (window.PARTICLE_COUNT_MULTIPLIER || 1)),
            pixelRatio: window.RENDERER_PIXEL_RATIO || Math.min(window.devicePixelRatio, 2),
            animationFrameRate: window.ANIMATION_FRAME_RATE || 60,
            useSimpleShaders: window.USE_SIMPLE_SHADERS || false,
            disable3D: window.DISABLE_3D_EFFECTS || false
        };
    }

    /**
     * Clean up resources
     */
    destroy() {
        if (this.performanceObserver) {
            this.performanceObserver.disconnect();
        }
    }
}

// Initialize performance manager
document.addEventListener('DOMContentLoaded', () => {
    window.performanceManager = new PerformanceManager();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PerformanceManager;
}
