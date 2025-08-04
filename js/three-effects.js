/**
 * Three.js Effects and 3D Visualizations
 * Created by Abuzar RaziQ - https://github.com/abuzarraziqgithub
 * Provides 3D quantum atom, molecular structures, and physics visualizations
 */

class ThreeEffectsManager {
    constructor() {
        this.scenes = {};
        this.renderers = {};
        this.cameras = {};
        this.controls = {};
        this.animationFrames = {};
        this.init();
    }

    init() {
        this.createQuantumAtom();
        this.createMolecularStructure();
        this.createWaveFunction();
        this.createParticleField();
        this.createPendulumPreview();
        this.createWavePreview();
        this.createGravityPreview();
        this.setupResize();
    }

    createQuantumAtom() {
        const container = document.getElementById('quantum-atom');
        if (!container) return;

        // Scene setup
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        
        renderer.setSize(container.clientWidth, container.clientHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        container.appendChild(renderer.domElement);

        // Store references
        this.scenes.quantum = scene;
        this.cameras.quantum = camera;
        this.renderers.quantum = renderer;

        // Create atom nucleus
        const nucleusGeometry = new THREE.SphereGeometry(0.3, 32, 32);
        const nucleusMaterial = new THREE.MeshBasicMaterial({ 
            color: 0x4ECDC4,  // Updated to match primary color
            transparent: true,
            opacity: 0.9
        });
        const nucleus = new THREE.Mesh(nucleusGeometry, nucleusMaterial);
        scene.add(nucleus);

        // Create electron orbits
        const electrons = [];
        const orbits = [];
        
        for (let i = 0; i < 3; i++) {
            // Orbit ring
            const orbitGeometry = new THREE.RingGeometry(1 + i * 0.5, 1 + i * 0.5 + 0.02, 64);
            const orbitMaterial = new THREE.MeshBasicMaterial({ 
                color: 0x4ecdc4,
                transparent: true,
                opacity: 0.3,
                side: THREE.DoubleSide
            });
            const orbit = new THREE.Mesh(orbitGeometry, orbitMaterial);
            orbit.rotation.x = Math.PI / 2 + (i * 0.3);
            orbit.rotation.y = i * 0.5;
            scene.add(orbit);
            orbits.push(orbit);

            // Electron
            const electronGeometry = new THREE.SphereGeometry(0.05, 16, 16);
            const electronMaterial = new THREE.MeshBasicMaterial({ 
                color: 0x45b7d1,
                emissive: 0x001122
            });
            const electron = new THREE.Mesh(electronGeometry, electronMaterial);
            scene.add(electron);
            electrons.push({
                mesh: electron,
                radius: 1 + i * 0.5,
                speed: 0.02 + i * 0.01,
                angle: i * Math.PI * 2 / 3,
                tiltX: Math.PI / 2 + (i * 0.3),
                tiltY: i * 0.5
            });
        }

        // Lighting
        const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
        scene.add(ambientLight);

        const pointLight = new THREE.PointLight(0xffffff, 1, 100);
        pointLight.position.set(5, 5, 5);
        scene.add(pointLight);

        // Camera position
        camera.position.z = 5;

        // Animation
        const animate = () => {
            this.animationFrames.quantum = requestAnimationFrame(animate);

            // Rotate nucleus
            nucleus.rotation.x += 0.01;
            nucleus.rotation.y += 0.01;

            // Animate electrons
            electrons.forEach((electron, index) => {
                electron.angle += electron.speed;
                
                const x = Math.cos(electron.angle) * electron.radius * Math.cos(electron.tiltX);
                const y = Math.sin(electron.angle) * electron.radius;
                const z = Math.cos(electron.angle) * electron.radius * Math.sin(electron.tiltX);
                
                electron.mesh.position.set(
                    x * Math.cos(electron.tiltY) - z * Math.sin(electron.tiltY),
                    y,
                    x * Math.sin(electron.tiltY) + z * Math.cos(electron.tiltY)
                );
            });

            // Rotate orbits
            orbits.forEach((orbit, index) => {
                orbit.rotation.z += 0.005 + index * 0.002;
            });

            // Auto-rotate the entire scene
            scene.rotation.y += 0.003;

            renderer.render(scene, camera);
        };

        animate();
    }

    createMolecularStructure() {
        const container = document.getElementById('three-bg');
        if (!container || window.DISABLE_3D_BACKGROUNDS) return;

        // Reduce the number of molecules for better performance
        const moleculeCount = window.PARTICLE_COUNT_MULTIPLIER ? 
            Math.floor(10 * window.PARTICLE_COUNT_MULTIPLIER) : 5;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false }); // Disable antialiasing for performance
        
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5)); // Limit pixel ratio
        renderer.domElement.style.position = 'absolute';
        renderer.domElement.style.top = '0';
        renderer.domElement.style.left = '0';
        renderer.domElement.style.zIndex = '-1';
        renderer.domElement.style.opacity = '0.3'; // Make it more subtle
        container.appendChild(renderer.domElement);

        this.scenes.molecular = scene;
        this.cameras.molecular = camera;
        this.renderers.molecular = renderer;

        // Create fewer floating molecular structures
        const molecules = [];
        
        for (let i = 0; i < moleculeCount; i++) {
            const group = new THREE.Group();
            
            // Central atom
            const centralGeometry = new THREE.SphereGeometry(0.1, 16, 16);
            const centralMaterial = new THREE.MeshBasicMaterial({ 
                color: new THREE.Color().setHSL(Math.random(), 0.7, 0.6),
                transparent: true,
                opacity: 0.6
            });
            const central = new THREE.Mesh(centralGeometry, centralMaterial);
            group.add(central);

            // Surrounding atoms
            const atomCount = Math.floor(Math.random() * 4) + 2;
            for (let j = 0; j < atomCount; j++) {
                const atomGeometry = new THREE.SphereGeometry(0.05, 12, 12);
                const atomMaterial = new THREE.MeshBasicMaterial({ 
                    color: new THREE.Color().setHSL((j / atomCount), 0.7, 0.7),
                    transparent: true,
                    opacity: 0.5
                });
                const atom = new THREE.Mesh(atomGeometry, atomMaterial);
                
                const angle = (j / atomCount) * Math.PI * 2;
                const radius = 0.3 + Math.random() * 0.2;
                atom.position.set(
                    Math.cos(angle) * radius,
                    (Math.random() - 0.5) * 0.2,
                    Math.sin(angle) * radius
                );
                
                group.add(atom);

                // Bond lines
                const bondGeometry = new THREE.CylinderGeometry(0.005, 0.005, radius);
                const bondMaterial = new THREE.MeshBasicMaterial({ 
                    color: 0x666666,
                    transparent: true,
                    opacity: 0.4
                });
                const bond = new THREE.Mesh(bondGeometry, bondMaterial);
                bond.position.set(
                    Math.cos(angle) * radius * 0.5,
                    (Math.random() - 0.5) * 0.1,
                    Math.sin(angle) * radius * 0.5
                );
                bond.lookAt(atom.position);
                group.add(bond);
            }

            // Position in 3D space
            group.position.set(
                (Math.random() - 0.5) * 20,
                (Math.random() - 0.5) * 15,
                (Math.random() - 0.5) * 20
            );
            
            scene.add(group);
            molecules.push({
                group: group,
                rotationSpeed: {
                    x: (Math.random() - 0.5) * 0.02,
                    y: (Math.random() - 0.5) * 0.02,
                    z: (Math.random() - 0.5) * 0.02
                },
                floatSpeed: Math.random() * 0.01 + 0.005,
                floatOffset: Math.random() * Math.PI * 2
            });
        }

        camera.position.z = 10;

        // Animation
        const animate = () => {
            this.animationFrames.molecular = requestAnimationFrame(animate);

            molecules.forEach((molecule, index) => {
                // Rotate molecules
                molecule.group.rotation.x += molecule.rotationSpeed.x;
                molecule.group.rotation.y += molecule.rotationSpeed.y;
                molecule.group.rotation.z += molecule.rotationSpeed.z;

                // Float movement
                molecule.group.position.y += Math.sin(Date.now() * molecule.floatSpeed + molecule.floatOffset) * 0.001;
            });

            renderer.render(scene, camera);
        };

        animate();
    }

    createWaveFunction() {
        // This will be added to simulation pages for wave visualizations
        const container = document.getElementById('wave-function');
        if (!container) return;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        
        renderer.setSize(container.clientWidth, container.clientHeight);
        container.appendChild(renderer.domElement);

        // Create wave geometry
        const geometry = new THREE.PlaneGeometry(8, 8, 64, 64);
        const material = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 },
                amplitude: { value: 0.5 },
                frequency: { value: 2.0 }
            },
            vertexShader: `
                uniform float time;
                uniform float amplitude;
                uniform float frequency;
                
                void main() {
                    vec3 pos = position;
                    pos.z = sin(pos.x * frequency + time) * cos(pos.y * frequency + time) * amplitude;
                    
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
                }
            `,
            fragmentShader: `
                void main() {
                    gl_FragColor = vec4(0.3, 0.7, 1.0, 0.8);
                }
            `,
            transparent: true,
            wireframe: true
        });

        const wave = new THREE.Mesh(geometry, material);
        scene.add(wave);

        camera.position.set(0, 3, 6);
        camera.lookAt(0, 0, 0);

        const animate = () => {
            this.animationFrames.wave = requestAnimationFrame(animate);
            
            material.uniforms.time.value += 0.05;
            
            renderer.render(scene, camera);
        };

        animate();
    }

    createParticleField() {
        // Background particle field for physics feel
        const container = document.getElementById('particle-field');
        if (!container && !document.getElementById('three-bg')) return;

        const targetContainer = container || document.getElementById('three-bg');
        
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        
        renderer.setSize(window.innerWidth, window.innerHeight);
        if (!container) {
            renderer.domElement.style.position = 'absolute';
            renderer.domElement.style.top = '0';
            renderer.domElement.style.left = '0';
            renderer.domElement.style.zIndex = '-2';
        }
        targetContainer.appendChild(renderer.domElement);

        // Create particles
        const particleCount = 1000;
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);
        const sizes = new Float32Array(particleCount);

        for (let i = 0; i < particleCount; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 100;
            positions[i * 3 + 1] = (Math.random() - 0.5) * 100;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 100;

            const color = new THREE.Color();
            color.setHSL(Math.random() * 0.2 + 0.5, 0.7, 0.5);
            colors[i * 3] = color.r;
            colors[i * 3 + 1] = color.g;
            colors[i * 3 + 2] = color.b;

            sizes[i] = Math.random() * 3 + 1;
        }

        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

        const material = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 }
            },
            vertexShader: `
                attribute float size;
                attribute vec3 color;
                varying vec3 vColor;
                uniform float time;
                
                void main() {
                    vColor = color;
                    
                    vec3 pos = position;
                    pos.x += sin(time + position.y * 0.01) * 2.0;
                    pos.y += cos(time + position.x * 0.01) * 2.0;
                    
                    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
                    gl_PointSize = size * (300.0 / -mvPosition.z);
                    gl_Position = projectionMatrix * mvPosition;
                }
            `,
            fragmentShader: `
                varying vec3 vColor;
                
                void main() {
                    float r = distance(gl_PointCoord, vec2(0.5, 0.5));
                    if (r > 0.5) discard;
                    
                    gl_FragColor = vec4(vColor, 1.0 - r * 2.0);
                }
            `,
            transparent: true,
            blending: THREE.AdditiveBlending
        });

        const particles = new THREE.Points(geometry, material);
        scene.add(particles);

        camera.position.z = 50;

        const animate = () => {
            this.animationFrames.particles = requestAnimationFrame(animate);
            
            material.uniforms.time.value += 0.01;
            particles.rotation.y += 0.001;
            
            renderer.render(scene, camera);
        };

        animate();
    }

    createPendulumPreview() {
        const container = document.getElementById('pendulum-preview');
        if (!container) return;

        // Scene setup
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(50, container.clientWidth / container.clientHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false });
        
        renderer.setSize(container.clientWidth, container.clientHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
        container.appendChild(renderer.domElement);

        this.scenes.pendulum = scene;
        this.cameras.pendulum = camera;
        this.renderers.pendulum = renderer;

        // Create pendulum
        const stringGeometry = new THREE.CylinderGeometry(0.01, 0.01, 3, 8);
        const stringMaterial = new THREE.MeshBasicMaterial({ color: 0x888888 });
        const string = new THREE.Mesh(stringGeometry, stringMaterial);
        string.position.y = 0;
        scene.add(string);

        // Pendulum bob
        const bobGeometry = new THREE.SphereGeometry(0.2, 16, 16);
        const bobMaterial = new THREE.MeshBasicMaterial({ color: 0x4ECDC4 });
        const bob = new THREE.Mesh(bobGeometry, bobMaterial);
        bob.position.y = -1.5;
        scene.add(bob);

        // Animation
        camera.position.z = 5;
        let angle = 0;
        const amplitude = Math.PI / 6; // 30 degrees

        const animate = () => {
            this.animationFrames.pendulum = requestAnimationFrame(animate);
            
            angle += 0.02;
            const swing = Math.sin(angle) * amplitude;
            
            bob.position.x = Math.sin(swing) * 1.5;
            bob.position.y = -Math.cos(swing) * 1.5;
            
            string.rotation.z = swing;
            
            renderer.render(scene, camera);
        };

        animate();
    }

    createWavePreview() {
        const container = document.getElementById('wave-preview');
        if (!container) return;

        // Scene setup
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(50, container.clientWidth / container.clientHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false });
        
        renderer.setSize(container.clientWidth, container.clientHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
        container.appendChild(renderer.domElement);

        this.scenes.wave = scene;
        this.cameras.wave = camera;
        this.renderers.wave = renderer;

        // Create wave
        const waveGeometry = new THREE.PlaneGeometry(4, 3, 50, 30);
        const waveMaterial = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 },
                amplitude: { value: 0.3 },
                frequency: { value: 2.0 }
            },
            vertexShader: `
                uniform float time;
                uniform float amplitude;
                uniform float frequency;
                varying vec3 vPosition;
                
                void main() {
                    vPosition = position;
                    vec3 pos = position;
                    pos.z += sin(pos.x * frequency + time) * amplitude;
                    pos.z += cos(pos.y * frequency * 0.5 + time * 1.5) * amplitude * 0.5;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
                }
            `,
            fragmentShader: `
                varying vec3 vPosition;
                
                void main() {
                    float intensity = sin(vPosition.x * 2.0) * 0.5 + 0.5;
                    vec3 color = mix(vec3(0.2, 0.8, 1.0), vec3(1.0, 0.3, 0.8), intensity);
                    gl_FragColor = vec4(color, 0.8);
                }
            `,
            transparent: true,
            wireframe: true
        });

        const wave = new THREE.Mesh(waveGeometry, waveMaterial);
        scene.add(wave);

        camera.position.set(3, 2, 3);
        camera.lookAt(0, 0, 0);

        const animate = () => {
            this.animationFrames.wave = requestAnimationFrame(animate);
            
            waveMaterial.uniforms.time.value += 0.02;
            wave.rotation.z += 0.005;
            
            renderer.render(scene, camera);
        };

        animate();
    }

    createGravityPreview() {
        const container = document.getElementById('gravity-preview');
        if (!container) return;

        // Scene setup
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(50, container.clientWidth / container.clientHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false });
        
        renderer.setSize(container.clientWidth, container.clientHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
        container.appendChild(renderer.domElement);

        this.scenes.gravity = scene;
        this.cameras.gravity = camera;
        this.renderers.gravity = renderer;

        // Create central mass (sun)
        const sunGeometry = new THREE.SphereGeometry(0.3, 16, 16);
        const sunMaterial = new THREE.MeshBasicMaterial({ color: 0xFFD700 });
        const sun = new THREE.Mesh(sunGeometry, sunMaterial);
        scene.add(sun);

        // Create orbiting planets
        const planets = [];
        const planetData = [
            { radius: 0.1, distance: 1.5, speed: 0.02, color: 0x4ECDC4 },
            { radius: 0.08, distance: 2.2, speed: 0.015, color: 0xFF6B9D },
            { radius: 0.06, distance: 2.8, speed: 0.01, color: 0x95E1D3 }
        ];

        planetData.forEach((data, index) => {
            const planetGeometry = new THREE.SphereGeometry(data.radius, 12, 12);
            const planetMaterial = new THREE.MeshBasicMaterial({ color: data.color });
            const planet = new THREE.Mesh(planetGeometry, planetMaterial);
            
            // Create orbit line
            const orbitGeometry = new THREE.RingGeometry(data.distance - 0.02, data.distance + 0.02, 64);
            const orbitMaterial = new THREE.MeshBasicMaterial({ 
                color: 0x444444, 
                transparent: true, 
                opacity: 0.3,
                side: THREE.DoubleSide
            });
            const orbit = new THREE.Mesh(orbitGeometry, orbitMaterial);
            orbit.rotation.x = Math.PI / 2;
            scene.add(orbit);
            
            planets.push({
                mesh: planet,
                distance: data.distance,
                speed: data.speed,
                angle: Math.random() * Math.PI * 2
            });
            scene.add(planet);
        });

        camera.position.set(4, 3, 4);
        camera.lookAt(0, 0, 0);

        const animate = () => {
            this.animationFrames.gravity = requestAnimationFrame(animate);
            
            // Rotate sun
            sun.rotation.y += 0.01;
            
            // Orbit planets
            planets.forEach(planet => {
                planet.angle += planet.speed;
                planet.mesh.position.x = Math.cos(planet.angle) * planet.distance;
                planet.mesh.position.z = Math.sin(planet.angle) * planet.distance;
                planet.mesh.rotation.y += 0.05;
            });
            
            renderer.render(scene, camera);
        };

        animate();
    }

    setupResize() {
        window.addEventListener('resize', () => {
            // Resize all renderers and cameras
            Object.keys(this.renderers).forEach(key => {
                const renderer = this.renderers[key];
                const camera = this.cameras[key];
                
                if (key === 'molecular' || key === 'particles') {
                    // Full window renderers
                    renderer.setSize(window.innerWidth, window.innerHeight);
                    camera.aspect = window.innerWidth / window.innerHeight;
                } else {
                    // Container-based renderers
                    const container = renderer.domElement.parentElement;
                    if (container && container.clientWidth > 0 && container.clientHeight > 0) {
                        renderer.setSize(container.clientWidth, container.clientHeight);
                        camera.aspect = container.clientWidth / container.clientHeight;
                    }
                }
                
                camera.updateProjectionMatrix();
            });
        });
    }

    destroy() {
        // Clean up all animations and renderers
        Object.values(this.animationFrames).forEach(frame => {
            if (frame) cancelAnimationFrame(frame);
        });

        Object.values(this.renderers).forEach(renderer => {
            if (renderer.domElement && renderer.domElement.parentElement) {
                renderer.domElement.parentElement.removeChild(renderer.domElement);
            }
            renderer.dispose();
        });

        this.scenes = {};
        this.renderers = {};
        this.cameras = {};
        this.animationFrames = {};
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.threeEffects = new ThreeEffectsManager();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ThreeEffectsManager;
}
