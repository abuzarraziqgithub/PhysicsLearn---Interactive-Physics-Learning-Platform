/**
 * Particles.js Configuration
 * Created by Abuzar RaziQ - https://github.com/abuzarraziqgithub
 * Provides beautiful particle background effects
 */

class ParticlesManager {
    constructor() {
        this.init();
    }

    init() {
        // Check if particles should be disabled for performance
        if (window.DISABLE_3D_BACKGROUNDS || 
            (window.performanceManager && window.performanceManager.isLowEndDevice)) {
            console.log('Particles disabled for performance');
            return;
        }

        // Check if particles.js is available
        if (typeof particlesJS !== 'undefined') {
            this.setupParticles();
        } else {
            console.warn('Particles.js not loaded');
        }
    }

    setupParticles() {
        particlesJS('particles-js', {
            particles: {
                number: {
                    value: 30, // Significantly reduced from 80
                    density: {
                        enable: true,
                        value_area: 1200 // Increased area for better distribution
                    }
                },
                color: {
                    value: ['#4ecdc4', '#45b7d1']
                },
                shape: {
                    type: 'circle',
                    stroke: {
                        width: 0,
                        color: '#000000'
                    }
                },
                opacity: {
                    value: 0.2, // Reduced opacity
                    random: true,
                    anim: {
                        enable: true,
                        speed: 0.5, // Slower animation
                        opacity_min: 0.05,
                        sync: false
                    }
                },
                size: {
                    value: 2, // Smaller particles
                    random: true,
                    anim: {
                        enable: true,
                        speed: 1, // Slower animation
                        size_min: 0.3,
                        sync: false
                    }
                },
                line_linked: {
                    enable: true,
                    distance: 120, // Reduced distance
                    color: '#4ecdc4',
                    opacity: 0.15, // Reduced opacity
                    width: 0.5 // Thinner lines
                },
                move: {
                    enable: true,
                    speed: 2,
                    direction: 'none',
                    random: true,
                    straight: false,
                    out_mode: 'out',
                    bounce: false,
                    attract: {
                        enable: false,
                        rotateX: 600,
                        rotateY: 1200
                    }
                }
            },
            interactivity: {
                detect_on: 'canvas',
                events: {
                    onhover: {
                        enable: true,
                        mode: 'grab'
                    },
                    onclick: {
                        enable: true,
                        mode: 'push'
                    },
                    resize: true
                },
                modes: {
                    grab: {
                        distance: 140,
                        line_linked: {
                            opacity: 0.5
                        }
                    },
                    bubble: {
                        distance: 400,
                        size: 40,
                        duration: 2,
                        opacity: 8,
                        speed: 3
                    },
                    repulse: {
                        distance: 200,
                        duration: 0.4
                    },
                    push: {
                        particles_nb: 4
                    },
                    remove: {
                        particles_nb: 2
                    }
                }
            },
            retina_detect: true
        });

        // Custom physics-themed particle shapes for special sections
        this.setupPhysicsParticles();
    }

    setupPhysicsParticles() {
        // Add custom particle effects for different physics sections
        const physicsSection = document.querySelector('.physics-section');
        if (physicsSection) {
            particlesJS('physics-particles', {
                particles: {
                    number: {
                        value: 50,
                        density: {
                            enable: true,
                            value_area: 600
                        }
                    },
                    color: {
                        value: '#ff6b6b'
                    },
                    shape: {
                        type: ['circle', 'triangle'],
                        stroke: {
                            width: 2,
                            color: '#ff6b6b'
                        }
                    },
                    opacity: {
                        value: 0.4,
                        random: true,
                        anim: {
                            enable: true,
                            speed: 1.5,
                            opacity_min: 0.1,
                            sync: false
                        }
                    },
                    size: {
                        value: 4,
                        random: true,
                        anim: {
                            enable: true,
                            speed: 3,
                            size_min: 1,
                            sync: false
                        }
                    },
                    line_linked: {
                        enable: true,
                        distance: 120,
                        color: '#ff6b6b',
                        opacity: 0.3,
                        width: 1.5
                    },
                    move: {
                        enable: true,
                        speed: 1.5,
                        direction: 'none',
                        random: true,
                        straight: false,
                        out_mode: 'bounce',
                        bounce: true,
                        attract: {
                            enable: true,
                            rotateX: 300,
                            rotateY: 600
                        }
                    }
                },
                interactivity: {
                    detect_on: 'canvas',
                    events: {
                        onhover: {
                            enable: true,
                            mode: 'bubble'
                        },
                        onclick: {
                            enable: true,
                            mode: 'repulse'
                        },
                        resize: true
                    },
                    modes: {
                        grab: {
                            distance: 200,
                            line_linked: {
                                opacity: 0.8
                            }
                        },
                        bubble: {
                            distance: 250,
                            size: 8,
                            duration: 2,
                            opacity: 0.8,
                            speed: 3
                        },
                        repulse: {
                            distance: 150,
                            duration: 0.4
                        }
                    }
                },
                retina_detect: true
            });
        }
    }

    // Method to dynamically change particle colors based on section
    updateParticleTheme(theme) {
        const themes = {
            quantum: {
                colors: ['#9b59b6', '#8e44ad', '#663399'],
                linkColor: '#9b59b6'
            },
            mechanics: {
                colors: ['#3498db', '#2980b9', '#1abc9c'],
                linkColor: '#3498db'
            },
            thermodynamics: {
                colors: ['#e74c3c', '#c0392b', '#ff7675'],
                linkColor: '#e74c3c'
            },
            waves: {
                colors: ['#1abc9c', '#16a085', '#00b894'],
                linkColor: '#1abc9c'
            }
        };

        if (themes[theme] && window.pJSDom && window.pJSDom[0]) {
            const particles = window.pJSDom[0].pJS.particles;
            particles.color.value = themes[theme].colors;
            particles.line_linked.color = themes[theme].linkColor;
        }
    }

    // Create floating equation particles
    createEquationParticles(container, equations) {
        if (!container) return;

        const particleContainer = document.createElement('div');
        particleContainer.className = 'equation-particles';
        particleContainer.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 1;
        `;

        equations.forEach((equation, index) => {
            const particle = document.createElement('div');
            particle.className = 'equation-particle';
            particle.textContent = equation;
            particle.style.cssText = `
                position: absolute;
                color: rgba(76, 205, 196, 0.6);
                font-size: ${12 + Math.random() * 8}px;
                font-family: 'Courier New', monospace;
                pointer-events: none;
                animation: floatEquation ${10 + Math.random() * 10}s infinite linear;
                animation-delay: ${Math.random() * 5}s;
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
            `;

            particleContainer.appendChild(particle);
        });

        container.appendChild(particleContainer);

        // Add CSS animation if not already present
        if (!document.querySelector('#equation-animations')) {
            const style = document.createElement('style');
            style.id = 'equation-animations';
            style.textContent = `
                @keyframes floatEquation {
                    0% {
                        transform: translateY(100vh) rotate(0deg);
                        opacity: 0;
                    }
                    10% {
                        opacity: 0.6;
                    }
                    90% {
                        opacity: 0.6;
                    }
                    100% {
                        transform: translateY(-100px) rotate(360deg);
                        opacity: 0;
                    }
                }

                .equation-particles {
                    overflow: hidden;
                }
            `;
            document.head.appendChild(style);
        }
    }

    destroy() {
        // Clean up particles
        if (window.pJSDom) {
            window.pJSDom.forEach(pJS => {
                if (pJS.pJS) {
                    pJS.pJS.fn.vendors.destroypJS();
                }
            });
        }
    }
}

// Initialize particles when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Small delay to ensure particles.js library is loaded
    setTimeout(() => {
        window.particlesManager = new ParticlesManager();
    }, 100);
});

// Common physics equations for floating effects
const physicsEquations = [
    'E = mc²',
    'F = ma',
    'E = ħω',
    'Ψ = Ae^(ikx)',
    'PV = nRT',
    'ΔS ≥ 0',
    'v = fλ',
    '∇²Ψ = 0',
    'F = qE',
    'H = E + PV'
];

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ParticlesManager, physicsEquations };
}
