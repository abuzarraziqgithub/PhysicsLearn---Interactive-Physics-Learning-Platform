/**
 * Quantum Physics Simulations with 3D Visualizations
 * Created by Abuzar RaziQ - https://github.com/abuzarraziqgithub
 * Advanced quantum mechanics simulations using Three.js
 */

class QuantumSimulations {
    constructor() {
        this.scenes = {};
        this.renderers = {};
        this.cameras = {};
        this.animations = {};
        this.controls = {};
        this.init();
    }

    init() {
        document.addEventListener('DOMContentLoaded', () => {
            this.setupQuantumAtom();
            this.setupWaveParticleDuality();
            this.setupQuantumTunneling();
            this.setupControlEventListeners();
        });
    }

    /**
     * 3D Quantum Atom Model Simulation
     */
    setupQuantumAtom() {
        const container = document.getElementById('quantum-atom-simulation');
        if (!container) return;

        // Scene setup
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x000011);
        
        const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ antialias: true });
        
        renderer.setSize(container.clientWidth, container.clientHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        container.appendChild(renderer.domElement);

        // Store references
        this.scenes.quantumAtom = scene;
        this.cameras.quantumAtom = camera;
        this.renderers.quantumAtom = renderer;

        // Create nucleus
        const nucleusGeometry = new THREE.SphereGeometry(0.2, 32, 32);
        const nucleusMaterial = new THREE.MeshBasicMaterial({ 
            color: 0xff6b6b,
            transparent: true,
            opacity: 0.9
        });
        const nucleus = new THREE.Mesh(nucleusGeometry, nucleusMaterial);
        scene.add(nucleus);

        // Orbital system
        const orbitals = this.createOrbitals(scene);
        this.controls.quantumAtom = { nucleus, orbitals };

        // Lighting
        const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
        scene.add(ambientLight);

        const pointLight = new THREE.PointLight(0xffffff, 1, 100);
        pointLight.position.set(10, 10, 10);
        scene.add(pointLight);

        // Camera position
        camera.position.set(5, 5, 5);
        camera.lookAt(0, 0, 0);

        // Animation loop
        const animate = () => {
            this.animations.quantumAtom = requestAnimationFrame(animate);
            
            // Rotate nucleus
            nucleus.rotation.x += 0.01;
            nucleus.rotation.y += 0.01;

            // Animate orbitals
            this.animateOrbitals(orbitals);

            renderer.render(scene, camera);
        };

        animate();
        this.hideLoading(container);
    }

    /**
     * Create different orbital types
     */
    createOrbitals(scene) {
        const orbitals = {
            s: [],
            p: [],
            d: [],
            f: [],
            electrons: []
        };

        // S-orbital (spherical)
        const sOrbitalGeometry = new THREE.SphereGeometry(1, 32, 32);
        const sOrbitalMaterial = new THREE.MeshBasicMaterial({ 
            color: 0x4ecdc4,
            transparent: true,
            opacity: 0.2,
            wireframe: true
        });
        const sOrbital = new THREE.Mesh(sOrbitalGeometry, sOrbitalMaterial);
        scene.add(sOrbital);
        orbitals.s.push(sOrbital);

        // P-orbitals (dumbbell shaped)
        for (let i = 0; i < 3; i++) {
            const pOrbital = this.createPOrbital();
            if (i === 1) pOrbital.rotation.z = Math.PI / 2;
            if (i === 2) pOrbital.rotation.y = Math.PI / 2;
            pOrbital.visible = false;
            scene.add(pOrbital);
            orbitals.p.push(pOrbital);
        }

        // Create electrons
        for (let i = 0; i < 10; i++) {
            const electronGeometry = new THREE.SphereGeometry(0.03, 16, 16);
            const electronMaterial = new THREE.MeshBasicMaterial({ 
                color: 0x45b7d1,
                emissive: 0x001122
            });
            const electron = new THREE.Mesh(electronGeometry, electronMaterial);
            electron.userData = {
                angle: (i / 10) * Math.PI * 2,
                radius: 1 + Math.random() * 0.5,
                speed: 0.02 + Math.random() * 0.01,
                orbital: 's'
            };
            scene.add(electron);
            orbitals.electrons.push(electron);
        }

        return orbitals;
    }

    /**
     * Create P-orbital shape
     */
    createPOrbital() {
        const geometry = new THREE.LatheGeometry([
            new THREE.Vector2(0, -1.5),
            new THREE.Vector2(0.5, -1),
            new THREE.Vector2(0.8, -0.5),
            new THREE.Vector2(0.9, 0),
            new THREE.Vector2(0.8, 0.5),
            new THREE.Vector2(0.5, 1),
            new THREE.Vector2(0, 1.5)
        ], 32);

        const material = new THREE.MeshBasicMaterial({ 
            color: 0xff9ff3,
            transparent: true,
            opacity: 0.3,
            wireframe: true
        });

        return new THREE.Mesh(geometry, material);
    }

    /**
     * Animate orbital electrons
     */
    animateOrbitals(orbitals) {
        orbitals.electrons.forEach((electron, index) => {
            electron.userData.angle += electron.userData.speed;
            
            const radius = electron.userData.radius;
            const angle = electron.userData.angle;
            
            if (electron.userData.orbital === 's') {
                // Spherical motion
                const phi = angle;
                const theta = Math.sin(angle * 2) * Math.PI;
                
                electron.position.set(
                    radius * Math.sin(theta) * Math.cos(phi),
                    radius * Math.cos(theta),
                    radius * Math.sin(theta) * Math.sin(phi)
                );
            } else if (electron.userData.orbital === 'p') {
                // Figure-8 motion
                const x = radius * Math.sin(angle * 2);
                const y = radius * Math.cos(angle) * Math.sin(angle * 2);
                electron.position.set(x, y, 0);
            }
        });
    }

    /**
     * Wave-Particle Duality Simulation
     */
    setupWaveParticleDuality() {
        const container = document.getElementById('wave-particle-simulation');
        if (!container) return;

        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x001122);
        
        const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ antialias: true });
        
        renderer.setSize(container.clientWidth, container.clientHeight);
        container.appendChild(renderer.domElement);

        // Store references
        this.scenes.waveParticle = scene;
        this.cameras.waveParticle = camera;
        this.renderers.waveParticle = renderer;

        // Create wave representation
        const waveGeometry = new THREE.PlaneGeometry(8, 2, 64, 8);
        const waveMaterial = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 },
                wavelength: { value: 1.0 },
                amplitude: { value: 0.3 }
            },
            vertexShader: `
                uniform float time;
                uniform float wavelength;
                uniform float amplitude;
                
                void main() {
                    vec3 pos = position;
                    pos.z = sin(pos.x * 2.0 * 3.14159 / wavelength + time * 2.0) * amplitude;
                    
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
                }
            `,
            fragmentShader: `
                void main() {
                    gl_FragColor = vec4(0.3, 0.8, 1.0, 0.8);
                }
            `,
            transparent: true,
            wireframe: true
        });

        const wave = new THREE.Mesh(waveGeometry, waveMaterial);
        wave.position.y = 1;
        scene.add(wave);

        // Create particle representation
        const particles = [];
        for (let i = 0; i < 50; i++) {
            const particleGeometry = new THREE.SphereGeometry(0.02, 8, 8);
            const particleMaterial = new THREE.MeshBasicMaterial({ 
                color: 0xff6b6b,
                transparent: true,
                opacity: 0.8
            });
            const particle = new THREE.Mesh(particleGeometry, particleMaterial);
            particle.position.set(
                (Math.random() - 0.5) * 8,
                -1 + Math.random() * 0.2,
                (Math.random() - 0.5) * 2
            );
            particle.userData = {
                velocity: new THREE.Vector3(
                    0.02 + Math.random() * 0.02,
                    (Math.random() - 0.5) * 0.01,
                    (Math.random() - 0.5) * 0.01
                )
            };
            scene.add(particle);
            particles.push(particle);
        }

        this.controls.waveParticle = { wave, particles, waveMaterial };

        camera.position.set(0, 3, 8);
        camera.lookAt(0, 0, 0);

        // Animation
        const animate = () => {
            this.animations.waveParticle = requestAnimationFrame(animate);
            
            // Update wave
            waveMaterial.uniforms.time.value += 0.05;
            
            // Update particles
            particles.forEach(particle => {
                particle.position.add(particle.userData.velocity);
                if (particle.position.x > 4) {
                    particle.position.x = -4;
                }
            });
            
            renderer.render(scene, camera);
        };

        animate();
        this.hideLoading(container);
    }

    /**
     * Quantum Tunneling Simulation
     */
    setupQuantumTunneling() {
        const container = document.getElementById('tunneling-simulation');
        if (!container) return;

        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x000033);
        
        const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ antialias: true });
        
        renderer.setSize(container.clientWidth, container.clientHeight);
        container.appendChild(renderer.domElement);

        // Store references
        this.scenes.tunneling = scene;
        this.cameras.tunneling = camera;
        this.renderers.tunneling = renderer;

        // Create potential barrier
        const barrierGeometry = new THREE.BoxGeometry(1, 3, 0.1);
        const barrierMaterial = new THREE.MeshBasicMaterial({ 
            color: 0xff4757,
            transparent: true,
            opacity: 0.7
        });
        const barrier = new THREE.Mesh(barrierGeometry, barrierMaterial);
        scene.add(barrier);

        // Create wave function visualization
        const wavePoints = [];
        for (let i = -5; i <= 5; i += 0.1) {
            wavePoints.push(new THREE.Vector3(i, 0, 0));
        }
        
        const waveGeometry = new THREE.BufferGeometry().setFromPoints(wavePoints);
        const waveMaterial = new THREE.LineBasicMaterial({ 
            color: 0x4ecdc4,
            linewidth: 2
        });
        const waveLine = new THREE.Line(waveGeometry, waveMaterial);
        scene.add(waveLine);

        // Create particle
        const particleGeometry = new THREE.SphereGeometry(0.05, 16, 16);
        const particleMaterial = new THREE.MeshBasicMaterial({ 
            color: 0x45b7d1,
            emissive: 0x001122
        });
        const particle = new THREE.Mesh(particleGeometry, particleMaterial);
        particle.position.x = -4;
        scene.add(particle);

        this.controls.tunneling = { barrier, waveLine, particle, waveGeometry };

        camera.position.set(0, 2, 8);
        camera.lookAt(0, 0, 0);

        // Animation
        let particleDirection = 1;
        const animate = () => {
            this.animations.tunneling = requestAnimationFrame(animate);
            
            // Move particle
            particle.position.x += 0.02 * particleDirection;
            
            // Check boundaries
            if (particle.position.x > 4) {
                particleDirection = -1;
            } else if (particle.position.x < -4) {
                particleDirection = 1;
            }

            // Update wave function based on particle position
            this.updateWaveFunction(particle.position.x, waveGeometry);
            
            renderer.render(scene, camera);
        };

        animate();
        this.hideLoading(container);
    }

    /**
     * Update wave function visualization
     */
    updateWaveFunction(particleX, geometry) {
        const positions = geometry.attributes.position.array;
        
        for (let i = 0; i < positions.length; i += 3) {
            const x = positions[i];
            const distance = Math.abs(x - particleX);
            
            // Simulate wave function amplitude
            if (Math.abs(x) < 0.5) { // Inside barrier
                positions[i + 1] = Math.exp(-distance) * Math.sin(x * 10) * 0.5;
            } else { // Outside barrier
                positions[i + 1] = Math.cos(x * 3 - particleX) * 0.8;
            }
        }
        
        geometry.attributes.position.needsUpdate = true;
    }

    /**
     * Setup control event listeners
     */
    setupControlEventListeners() {
        // Quantum Atom controls
        this.setupSliderControl('quantum-energy-level', (value) => {
            if (this.controls.quantumAtom) {
                this.updateEnergyLevel(parseInt(value));
            }
        });

        this.setupSelectControl('quantum-orbital', (value) => {
            if (this.controls.quantumAtom) {
                this.updateOrbitalType(value);
            }
        });

        this.setupSliderControl('quantum-electrons', (value) => {
            if (this.controls.quantumAtom) {
                this.updateElectronCount(parseInt(value));
            }
        });

        // Wave-Particle controls
        this.setupSliderControl('particle-wavelength', (value) => {
            if (this.controls.waveParticle) {
                this.controls.waveParticle.waveMaterial.uniforms.wavelength.value = parseFloat(value);
            }
        });

        this.setupSliderControl('particle-speed', (value) => {
            if (this.controls.waveParticle) {
                this.controls.waveParticle.particles.forEach(particle => {
                    particle.userData.velocity.x = parseFloat(value) * 0.02;
                });
            }
        });

        // Tunneling controls
        this.setupSliderControl('barrier-height', (value) => {
            if (this.controls.tunneling) {
                this.controls.tunneling.barrier.scale.y = parseFloat(value) / 5;
            }
        });

        this.setupSliderControl('barrier-width', (value) => {
            if (this.controls.tunneling) {
                this.controls.tunneling.barrier.scale.x = parseFloat(value);
            }
        });
    }

    /**
     * Update energy level visualization
     */
    updateEnergyLevel(level) {
        const { orbitals } = this.controls.quantumAtom;
        
        orbitals.electrons.forEach((electron, index) => {
            if (index < level * 2) {
                electron.visible = true;
                electron.userData.radius = 0.8 + (level - 1) * 0.4;
            } else {
                electron.visible = false;
            }
        });
    }

    /**
     * Update orbital type display
     */
    updateOrbitalType(orbitalType) {
        const { orbitals } = this.controls.quantumAtom;
        
        // Hide all orbitals
        orbitals.s.forEach(orbital => orbital.visible = false);
        orbitals.p.forEach(orbital => orbital.visible = false);
        
        // Show selected orbital type
        if (orbitalType === 's') {
            orbitals.s.forEach(orbital => orbital.visible = true);
            orbitals.electrons.forEach(electron => {
                electron.userData.orbital = 's';
            });
        } else if (orbitalType === 'p') {
            orbitals.p.forEach(orbital => orbital.visible = true);
            orbitals.electrons.forEach(electron => {
                electron.userData.orbital = 'p';
            });
        }
    }

    /**
     * Update electron count
     */
    updateElectronCount(count) {
        const { orbitals } = this.controls.quantumAtom;
        
        orbitals.electrons.forEach((electron, index) => {
            electron.visible = index < count;
        });
    }

    /**
     * Utility functions
     */
    setupSliderControl(id, callback) {
        const slider = document.getElementById(id);
        const valueDisplay = document.getElementById(id + '-value');
        
        if (slider && valueDisplay) {
            slider.addEventListener('input', (e) => {
                const value = e.target.value;
                valueDisplay.textContent = value;
                callback(value);
            });
        }
    }

    setupSelectControl(id, callback) {
        const select = document.getElementById(id);
        
        if (select) {
            select.addEventListener('change', (e) => {
                callback(e.target.value);
            });
        }
    }

    hideLoading(container) {
        const loading = container.querySelector('.canvas-loading');
        if (loading) {
            loading.style.display = 'none';
        }
    }

    /**
     * Resize handling
     */
    handleResize() {
        Object.keys(this.renderers).forEach(key => {
            const renderer = this.renderers[key];
            const camera = this.cameras[key];
            const container = renderer.domElement.parentElement;
            
            if (container) {
                const width = container.clientWidth;
                const height = container.clientHeight;
                
                renderer.setSize(width, height);
                camera.aspect = width / height;
                camera.updateProjectionMatrix();
            }
        });
    }

    /**
     * Cleanup
     */
    destroy() {
        Object.values(this.animations).forEach(frame => {
            if (frame) cancelAnimationFrame(frame);
        });

        Object.values(this.renderers).forEach(renderer => {
            if (renderer.domElement && renderer.domElement.parentElement) {
                renderer.domElement.parentElement.removeChild(renderer.domElement);
            }
            renderer.dispose();
        });
    }
}

// Initialize quantum simulations
window.addEventListener('resize', () => {
    if (window.quantumSims) {
        window.quantumSims.handleResize();
    }
});

// Create instance when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.quantumSims = new QuantumSimulations();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = QuantumSimulations;
}
