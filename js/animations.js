/**
 * PhysicsLearn - Enhanced Animation System
 * Interactive physics simulations using p5.js with GSAP integration
 * Created by Abuzar RaziQ - https://github.com/abuzarraziqgithub
 */

class PhysicsAnimations {
    constructor() {
        this.animations = new Map();
        this.gsapTimelines = new Map();
        this.init();
    }

    /**
     * Initialize animations
     */
    init() {
        // Register GSAP plugins
        if (typeof gsap !== 'undefined') {
            gsap.registerPlugin(ScrollTrigger, TextPlugin);
            this.setupGSAPAnimations();
        }

        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.setupAnimations();
            });
        } else {
            this.setupAnimations();
        }
    }

    /**
     * Setup GSAP-powered animations
     */
    setupGSAPAnimations() {
        this.createEntranceAnimations();
        this.createScrollAnimations();
        this.createHoverAnimations();
        this.createTextAnimations();
    }

    /**
     * Create smooth entrance animations
     */
    createEntranceAnimations() {
        // Hero content animation
        const heroTl = gsap.timeline({ delay: 0.5 });
        heroTl.from('.hero-title', {
            duration: 1.2,
            y: 100,
            opacity: 0,
            ease: 'power3.out'
        })
        .from('.hero-description', {
            duration: 1,
            y: 50,
            opacity: 0,
            ease: 'power2.out'
        }, '-=0.8')
        .from('.hero-actions .btn', {
            duration: 0.8,
            y: 30,
            opacity: 0,
            stagger: 0.2,
            ease: 'power2.out'
        }, '-=0.6')
        .from('.hero-visual', {
            duration: 1.5,
            scale: 0.8,
            opacity: 0,
            ease: 'power2.out'
        }, '-=1');

        this.gsapTimelines.set('hero', heroTl);

        // Navigation animation
        gsap.from('.nav-link', {
            duration: 0.6,
            y: -20,
            opacity: 0,
            stagger: 0.1,
            ease: 'power2.out',
            delay: 0.2
        });

        gsap.from('.logo', {
            duration: 0.8,
            x: -30,
            opacity: 0,
            ease: 'power2.out'
        });
    }

    /**
     * Create scroll-triggered animations
     */
    createScrollAnimations() {
        // Feature cards animation
        gsap.utils.toArray('.feature-card').forEach((card, index) => {
            gsap.from(card, {
                duration: 0.8,
                y: 80,
                opacity: 0,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: card,
                    start: 'top 85%',
                    end: 'bottom 20%',
                    toggleActions: 'play none none reverse'
                },
                delay: index * 0.1
            });
        });

        // Simulation cards animation
        gsap.utils.toArray('.simulation-card').forEach((card, index) => {
            gsap.from(card, {
                duration: 1,
                scale: 0.8,
                opacity: 0,
                rotationY: 15,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: card,
                    start: 'top 85%',
                    end: 'bottom 20%',
                    toggleActions: 'play none none reverse'
                },
                delay: index * 0.15
            });
        });

        // Stats counter animation with GSAP
        gsap.utils.toArray('.stat-number').forEach(stat => {
            const target = parseInt(stat.getAttribute('data-target'));
            
            gsap.from(stat, {
                duration: 2,
                textContent: 0,
                ease: 'power2.out',
                snap: { textContent: 1 },
                scrollTrigger: {
                    trigger: stat,
                    start: 'top 85%',
                    end: 'bottom 20%',
                    toggleActions: 'play none none reverse'
                },
                onUpdate: function() {
                    stat.textContent = Math.round(this.targets()[0].textContent).toLocaleString();
                }
            });
        });

        // Section title animations
        gsap.utils.toArray('.section-title').forEach(title => {
            gsap.from(title, {
                duration: 1,
                y: 50,
                opacity: 0,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: title,
                    start: 'top 85%',
                    end: 'bottom 20%',
                    toggleActions: 'play none none reverse'
                }
            });
        });

        // Parallax effects for hero background
        gsap.to('.three-container', {
            yPercent: -50,
            ease: 'none',
            scrollTrigger: {
                trigger: '.hero',
                start: 'top bottom',
                end: 'bottom top',
                scrub: true
            }
        });

        // Floating animation for quantum atom
        gsap.to('#quantum-atom', {
            y: -20,
            duration: 3,
            ease: 'power1.inOut',
            yoyo: true,
            repeat: -1
        });
    }

    /**
     * Create hover animations
     */
    createHoverAnimations() {
        // Button hover effects
        gsap.utils.toArray('.btn').forEach(button => {
            const tl = gsap.timeline({ paused: true });
            
            tl.to(button, {
                duration: 0.3,
                scale: 1.05,
                ease: 'power2.out'
            })
            .to(button, {
                duration: 0.2,
                boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
                ease: 'power2.out'
            }, 0);

            button.addEventListener('mouseenter', () => tl.play());
            button.addEventListener('mouseleave', () => tl.reverse());
        });

        // Card hover effects
        gsap.utils.toArray('.feature-card, .simulation-card').forEach(card => {
            const tl = gsap.timeline({ paused: true });
            
            tl.to(card, {
                duration: 0.4,
                y: -10,
                scale: 1.02,
                ease: 'power2.out'
            })
            .to(card.querySelector('.feature-icon, .simulation-preview'), {
                duration: 0.4,
                rotation: 5,
                ease: 'power2.out'
            }, 0);

            card.addEventListener('mouseenter', () => tl.play());
            card.addEventListener('mouseleave', () => tl.reverse());
        });

        // Navigation link hover effects
        gsap.utils.toArray('.nav-link').forEach(link => {
            const tl = gsap.timeline({ paused: true });
            
            tl.to(link, {
                duration: 0.3,
                color: '#4ecdc4',
                ease: 'power2.out'
            });

            link.addEventListener('mouseenter', () => tl.play());
            link.addEventListener('mouseleave', () => tl.reverse());
        });
    }

    /**
     * Create text animations
     */
    createTextAnimations() {
        // Typewriter effect for hero subtitle
        const heroDescription = document.querySelector('.hero-description');
        if (heroDescription) {
            const originalText = heroDescription.textContent;
            heroDescription.textContent = '';
            
            gsap.to(heroDescription, {
                duration: 3,
                text: originalText,
                ease: 'none',
                delay: 2
            });
        }

        // Glitch effect for highlight text
        gsap.utils.toArray('.highlight').forEach(highlight => {
            const tl = gsap.timeline({ repeat: -1, repeatDelay: 5 });
            
            tl.to(highlight, {
                duration: 0.1,
                skewX: 5,
                ease: 'power2.inOut'
            })
            .to(highlight, {
                duration: 0.1,
                skewX: -5,
                ease: 'power2.inOut'
            })
            .to(highlight, {
                duration: 0.1,
                skewX: 0,
                ease: 'power2.inOut'
            });
        });
    }

    /**
     * Setup all animations
     */
    setupAnimations() {
        this.createHeroAnimation();
        this.createPendulumPreview();
        this.createWavePreview();
        this.createGravityPreview();
    }

    /**
     * Create hero section animation
     */
    createHeroAnimation() {
        const container = document.getElementById('hero-animation');
        if (!container) return;

        const sketch = (p) => {
            let particles = [];
            let time = 0;
            let width, height;

            p.setup = () => {
                width = container.offsetWidth;
                height = container.offsetHeight;
                p.createCanvas(width, height);
                
                // Create particles representing atoms/molecules
                for (let i = 0; i < 50; i++) {
                    particles.push(new Particle(p, width, height));
                }
            };

            p.draw = () => {
                // Create gradient background
                for (let i = 0; i <= height; i++) {
                    let inter = p.map(i, 0, height, 0, 1);
                    let c = p.lerpColor(p.color(59, 130, 246, 50), p.color(16, 185, 129, 30), inter);
                    p.stroke(c);
                    p.line(0, i, width, i);
                }

                time += 0.01;

                // Update and draw particles
                particles.forEach(particle => {
                    particle.update(time);
                    particle.display();
                });

                // Draw connecting lines between nearby particles
                this.drawConnections(p, particles);
            };

            p.windowResized = () => {
                width = container.offsetWidth;
                height = container.offsetHeight;
                p.resizeCanvas(width, height);
            };
        };

        this.animations.set('hero', new p5(sketch, container));
    }

    /**
     * Draw connections between particles
     */
    drawConnections(p, particles) {
        p.stroke(59, 130, 246, 100);
        p.strokeWeight(1);

        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                let d = p.dist(
                    particles[i].x, particles[i].y,
                    particles[j].x, particles[j].y
                );

                if (d < 80) {
                    let alpha = p.map(d, 0, 80, 150, 0);
                    p.stroke(59, 130, 246, alpha);
                    p.line(
                        particles[i].x, particles[i].y,
                        particles[j].x, particles[j].y
                    );
                }
            }
        }
    }

    /**
     * Create pendulum preview animation
     */
    createPendulumPreview() {
        const container = document.getElementById('pendulum-preview');
        if (!container) return;

        const sketch = (p) => {
            let angle = p.PI / 4;
            let angleVel = 0;
            let angleAcc = 0;
            let r = 100;
            let gravity = 0.4;
            let damping = 0.995;
            let cx, cy;

            p.setup = () => {
                const width = container.offsetWidth;
                const height = container.offsetHeight;
                p.createCanvas(width, height);
                cx = width / 2;
                cy = 40;
            };

            p.draw = () => {
                p.background(248, 250, 252);

                // Physics calculations
                angleAcc = (-1 * gravity / r) * p.sin(angle);
                angleVel += angleAcc;
                angleVel *= damping;
                angle += angleVel;

                // Calculate pendulum position
                let x = cx + r * p.sin(angle);
                let y = cy + r * p.cos(angle);

                // Draw string
                p.stroke(100);
                p.strokeWeight(2);
                p.line(cx, cy, x, y);

                // Draw pivot point
                p.fill(59, 130, 246);
                p.noStroke();
                p.ellipse(cx, cy, 8, 8);

                // Draw pendulum bob
                p.fill(16, 185, 129);
                p.ellipse(x, y, 20, 20);

                // Add energy trail
                p.stroke(16, 185, 129, 100);
                p.strokeWeight(1);
                p.noFill();
                p.arc(cx, cy, r * 2, r * 2, 
                     p.PI/2 - p.PI/4, p.PI/2 + p.PI/4);
            };
        };

        this.animations.set('pendulum', new p5(sketch, container));
    }

    /**
     * Create wave interference preview
     */
    createWavePreview() {
        const container = document.getElementById('wave-preview');
        if (!container) return;

        const sketch = (p) => {
            let time = 0;
            let waves = [];

            p.setup = () => {
                const width = container.offsetWidth;
                const height = container.offsetHeight;
                p.createCanvas(width, height);
                
                // Create two wave sources
                waves.push({
                    x: width * 0.3,
                    y: height * 0.5,
                    frequency: 0.05,
                    amplitude: 30
                });
                
                waves.push({
                    x: width * 0.7,
                    y: height * 0.5,
                    frequency: 0.05,
                    amplitude: 30
                });
            };

            p.draw = () => {
                p.background(248, 250, 252);
                time += 1;

                // Draw wave interference pattern
                p.loadPixels();
                
                for (let x = 0; x < p.width; x += 2) {
                    for (let y = 0; y < p.height; y += 2) {
                        let totalWave = 0;
                        
                        waves.forEach(wave => {
                            let distance = p.dist(x, y, wave.x, wave.y);
                            let waveValue = wave.amplitude * 
                                          p.sin(wave.frequency * distance - time * 0.1);
                            totalWave += waveValue;
                        });
                        
                        // Map wave value to color
                        let brightness = p.map(totalWave, -60, 60, 0, 255);
                        let blue = p.map(totalWave, -60, 60, 100, 255);
                        
                        p.fill(brightness, brightness, blue, 150);
                        p.noStroke();
                        p.rect(x, y, 2, 2);
                    }
                }

                // Draw wave sources
                waves.forEach((wave, index) => {
                    p.fill(index === 0 ? 59 : 16, index === 0 ? 130 : 185, index === 0 ? 246 : 129);
                    p.noStroke();
                    p.ellipse(wave.x, wave.y, 12, 12);
                    
                    // Draw expanding circles
                    p.noFill();
                    p.stroke(index === 0 ? 59 : 16, index === 0 ? 130 : 185, index === 0 ? 246 : 129, 100);
                    for (let i = 1; i <= 3; i++) {
                        let radius = (time * 2 + i * 20) % 100;
                        p.ellipse(wave.x, wave.y, radius, radius);
                    }
                });
            };
        };

        this.animations.set('waves', new p5(sketch, container));
    }

    /**
     * Create gravity field preview
     */
    createGravityPreview() {
        const container = document.getElementById('gravity-preview');
        if (!container) return;

        const sketch = (p) => {
            let planets = [];
            let particles = [];

            p.setup = () => {
                const width = container.offsetWidth;
                const height = container.offsetHeight;
                p.createCanvas(width, height);

                // Create central mass
                planets.push({
                    x: width / 2,
                    y: height / 2,
                    mass: 100,
                    radius: 15
                });

                // Create orbiting particles
                for (let i = 0; i < 5; i++) {
                    let angle = (p.TWO_PI / 5) * i;
                    let distance = 60 + i * 15;
                    particles.push(new OrbitingParticle(p, planets[0], angle, distance));
                }
            };

            p.draw = () => {
                p.background(248, 250, 252, 50);

                // Draw gravitational field lines (simplified)
                p.stroke(59, 130, 246, 30);
                p.strokeWeight(1);
                p.noFill();
                
                for (let radius = 30; radius < 150; radius += 20) {
                    p.ellipse(planets[0].x, planets[0].y, radius * 2, radius * 2);
                }

                // Update and draw particles
                particles.forEach(particle => {
                    particle.update();
                    particle.display();
                });

                // Draw central mass
                p.fill(16, 185, 129);
                p.noStroke();
                p.ellipse(planets[0].x, planets[0].y, planets[0].radius * 2);

                // Add glow effect
                p.fill(16, 185, 129, 50);
                p.ellipse(planets[0].x, planets[0].y, planets[0].radius * 3);
            };
        };

        this.animations.set('gravity', new p5(sketch, container));
    }

    /**
     * Pause all animations
     */
    pauseAll() {
        this.animations.forEach(animation => {
            animation.noLoop();
        });
    }

    /**
     * Resume all animations
     */
    resumeAll() {
        this.animations.forEach(animation => {
            animation.loop();
        });
    }

    /**
     * Remove all animations
     */
    removeAll() {
        this.animations.forEach(animation => {
            animation.remove();
        });
        this.animations.clear();
    }
}

/**
 * Particle class for hero animation
 */
class Particle {
    constructor(p, canvasWidth, canvasHeight) {
        this.p = p;
        this.x = p.random(canvasWidth);
        this.y = p.random(canvasHeight);
        this.vx = p.random(-0.5, 0.5);
        this.vy = p.random(-0.5, 0.5);
        this.size = p.random(2, 6);
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.hue = p.random(200, 260);
    }

    update(time) {
        // Add some wave motion
        this.vx += this.p.sin(time + this.x * 0.01) * 0.01;
        this.vy += this.p.cos(time + this.y * 0.01) * 0.01;

        this.x += this.vx;
        this.y += this.vy;

        // Bounce off edges
        if (this.x < 0 || this.x > this.canvasWidth) this.vx *= -1;
        if (this.y < 0 || this.y > this.canvasHeight) this.vy *= -1;

        // Keep particles in bounds
        this.x = this.p.constrain(this.x, 0, this.canvasWidth);
        this.y = this.p.constrain(this.y, 0, this.canvasHeight);
    }

    display() {
        this.p.fill(this.hue, 180, 255, 200);
        this.p.noStroke();
        this.p.ellipse(this.x, this.y, this.size);
    }
}

/**
 * Orbiting particle class for gravity animation
 */
class OrbitingParticle {
    constructor(p, planet, startAngle, distance) {
        this.p = p;
        this.planet = planet;
        this.angle = startAngle;
        this.distance = distance;
        this.speed = this.p.sqrt(planet.mass / distance) * 0.02;
        this.trail = [];
        this.maxTrailLength = 20;
    }

    update() {
        this.angle += this.speed;
        
        let x = this.planet.x + this.p.cos(this.angle) * this.distance;
        let y = this.planet.y + this.p.sin(this.angle) * this.distance;
        
        // Add to trail
        this.trail.push({ x: x, y: y });
        if (this.trail.length > this.maxTrailLength) {
            this.trail.shift();
        }
    }

    display() {
        // Draw trail
        this.p.stroke(59, 130, 246, 100);
        this.p.strokeWeight(1);
        this.p.noFill();
        
        if (this.trail.length > 1) {
            this.p.beginShape();
            this.trail.forEach(point => {
                this.p.vertex(point.x, point.y);
            });
            this.p.endShape();
        }

        // Draw particle
        let currentPos = this.trail[this.trail.length - 1];
        if (currentPos) {
            this.p.fill(59, 130, 246);
            this.p.noStroke();
            this.p.ellipse(currentPos.x, currentPos.y, 6);
        }
    }
}

// Initialize animations when the page loads
document.addEventListener('DOMContentLoaded', () => {
    window.physicsAnimations = new PhysicsAnimations();
});

// Handle visibility change to pause/resume animations for performance
document.addEventListener('visibilitychange', () => {
    if (window.physicsAnimations) {
        if (document.hidden) {
            window.physicsAnimations.pauseAll();
        } else {
            window.physicsAnimations.resumeAll();
        }
    }
});

// Export for potential use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PhysicsAnimations;
}
