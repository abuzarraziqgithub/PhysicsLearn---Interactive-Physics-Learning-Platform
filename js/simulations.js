/**
 * PhysicsLearn - Simulations System
 * Handles all interactive physics simulations using p5.js
 */

class SimulationsSystem {
    constructor() {
        this.simulations = new Map();
        this.isInitialized = false;
        this.currentCategory = 'all';
        this.init();
    }

    /**
     * Initialize the simulations system
     */
    init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.setup();
            });
        } else {
            this.setup();
        }
    }

    /**
     * Setup simulations
     */
    setup() {
        this.setupCategoryFilters();
        this.setupControlEventListeners();
        this.initializeSimulations();
        this.setupLoadMoreButton();
        this.isInitialized = true;
    }

    /**
     * Setup category filters
     */
    setupCategoryFilters() {
        const categoryFilters = document.querySelectorAll('.category-filter');
        
        categoryFilters.forEach(filter => {
            filter.addEventListener('click', (e) => {
                this.handleCategoryFilter(e.target);
            });
        });
    }

    /**
     * Handle category filter selection
     */
    handleCategoryFilter(button) {
        // Update active state
        document.querySelectorAll('.category-filter').forEach(filter => {
            filter.classList.remove('active');
            filter.setAttribute('aria-pressed', 'false');
        });
        
        button.classList.add('active');
        button.setAttribute('aria-pressed', 'true');
        
        // Filter simulations
        const category = button.getAttribute('data-category');
        this.currentCategory = category;
        this.filterSimulations(category);
    }

    /**
     * Filter simulations by category
     */
    filterSimulations(category) {
        const simulationCards = document.querySelectorAll('.simulation-card');
        
        simulationCards.forEach(card => {
            const cardCategory = card.getAttribute('data-category');
            
            if (category === 'all' || cardCategory === category) {
                card.style.display = 'block';
                card.classList.add('animate-in');
            } else {
                card.style.display = 'none';
                card.classList.remove('animate-in');
            }
        });
        
        // Update results count
        this.updateResultsCount();
    }

    /**
     * Update results count
     */
    updateResultsCount() {
        const visibleCards = document.querySelectorAll('.simulation-card[style="display: block"], .simulation-card:not([style*="display: none"])');
        const count = visibleCards.length;
        
        // You could add a results counter here if desired
        console.log(`Showing ${count} simulations`);
    }

    /**
     * Setup control event listeners
     */
    setupControlEventListeners() {
        // Range input controls
        const rangeInputs = document.querySelectorAll('input[type="range"]');
        rangeInputs.forEach(input => {
            input.addEventListener('input', (e) => {
                this.handleRangeInput(e.target);
            });
        });

        // Checkbox controls
        const checkboxInputs = document.querySelectorAll('input[type="checkbox"]');
        checkboxInputs.forEach(input => {
            input.addEventListener('change', (e) => {
                this.handleCheckboxInput(e.target);
            });
        });

        // Control buttons
        const controlButtons = document.querySelectorAll('.control-buttons .btn');
        controlButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                this.handleControlButton(e.target);
            });
        });
    }

    /**
     * Handle range input changes
     */
    handleRangeInput(input) {
        const value = input.value;
        const valueDisplay = document.getElementById(input.id + '-value');
        
        if (valueDisplay) {
            valueDisplay.textContent = value;
        }
        
        // Update simulation parameter
        const simulationId = this.getSimulationIdFromControl(input.id);
        const parameter = this.getParameterFromControl(input.id);
        
        if (simulationId && parameter) {
            this.updateSimulationParameter(simulationId, parameter, parseFloat(value));
        }
    }

    /**
     * Handle checkbox input changes
     */
    handleCheckboxInput(input) {
        const isChecked = input.checked;
        const simulationId = this.getSimulationIdFromControl(input.id);
        const parameter = this.getParameterFromControl(input.id);
        
        if (simulationId && parameter) {
            this.updateSimulationParameter(simulationId, parameter, isChecked);
        }
    }

    /**
     * Handle control button clicks
     */
    handleControlButton(button) {
        const buttonId = button.id;
        const action = this.getActionFromButton(buttonId);
        const simulationId = this.getSimulationIdFromControl(buttonId);
        
        if (simulationId && action) {
            switch (action) {
                case 'start':
                    this.startSimulation(simulationId);
                    break;
                case 'pause':
                    this.pauseSimulation(simulationId);
                    break;
                case 'reset':
                    this.resetSimulation(simulationId);
                    break;
            }
        }
    }

    /**
     * Initialize all simulations
     */
    initializeSimulations() {
        this.createPendulumSimulation();
        this.createWaveSimulation();
        this.createGravitySimulation();
        this.createElectricFieldSimulation();
    }

    /**
     * Create pendulum simulation
     */
    createPendulumSimulation() {
        const container = document.getElementById('pendulum-simulation');
        if (!container) return;

        const sketch = (p) => {
            let pendulum;
            let isRunning = false;

            p.setup = () => {
                const width = container.offsetWidth;
                const height = container.offsetHeight;
                p.createCanvas(width, height);
                
                // Initialize pendulum
                pendulum = new PendulumSimulation(p, width, height);
                
                // Hide loading indicator
                this.hideLoadingIndicator(container);
            };

            p.draw = () => {
                p.background(248, 250, 252);
                
                if (isRunning) {
                    pendulum.update();
                }
                
                pendulum.display();
                
                // Display information
                this.displayPendulumInfo(p, pendulum);
            };

            p.windowResized = () => {
                const width = container.offsetWidth;
                const height = container.offsetHeight;
                p.resizeCanvas(width, height);
                pendulum.resize(width, height);
            };

            // Expose control methods
            this.simulations.set('pendulum', {
                sketch: p,
                start: () => { isRunning = true; },
                pause: () => { isRunning = false; },
                reset: () => { pendulum.reset(); isRunning = false; },
                updateParameter: (param, value) => {
                    switch (param) {
                        case 'length':
                            pendulum.setLength(value);
                            break;
                        case 'angle':
                            pendulum.setInitialAngle(value * p.PI / 180);
                            break;
                        case 'gravity':
                            pendulum.setGravity(value);
                            break;
                    }
                }
            });
        };

        new p5(sketch, container);
    }

    /**
     * Create wave simulation
     */
    createWaveSimulation() {
        const container = document.getElementById('wave-simulation');
        if (!container) return;

        const sketch = (p) => {
            let waveSystem;
            let isRunning = false;

            p.setup = () => {
                const width = container.offsetWidth;
                const height = container.offsetHeight;
                p.createCanvas(width, height);
                
                waveSystem = new WaveInterferenceSimulation(p, width, height);
                this.hideLoadingIndicator(container);
            };

            p.draw = () => {
                p.background(248, 250, 252);
                
                if (isRunning) {
                    waveSystem.update();
                }
                
                waveSystem.display();
            };

            p.windowResized = () => {
                const width = container.offsetWidth;
                const height = container.offsetHeight;
                p.resizeCanvas(width, height);
                waveSystem.resize(width, height);
            };

            this.simulations.set('wave', {
                sketch: p,
                start: () => { isRunning = true; },
                pause: () => { isRunning = false; },
                reset: () => { waveSystem.reset(); isRunning = false; },
                updateParameter: (param, value) => {
                    switch (param) {
                        case 'frequency1':
                            waveSystem.setFrequency1(value);
                            break;
                        case 'frequency2':
                            waveSystem.setFrequency2(value);
                            break;
                        case 'amplitude':
                            waveSystem.setAmplitude(value);
                            break;
                    }
                }
            });
        };

        new p5(sketch, container);
    }

    /**
     * Create gravity simulation
     */
    createGravitySimulation() {
        const container = document.getElementById('gravity-simulation');
        if (!container) return;

        const sketch = (p) => {
            let gravitySystem;
            let isRunning = false;

            p.setup = () => {
                const width = container.offsetWidth;
                const height = container.offsetHeight;
                p.createCanvas(width, height);
                
                gravitySystem = new GravitySimulation(p, width, height);
                this.hideLoadingIndicator(container);
            };

            p.draw = () => {
                p.background(248, 250, 252);
                
                if (isRunning) {
                    gravitySystem.update();
                }
                
                gravitySystem.display();
            };

            p.windowResized = () => {
                const width = container.offsetWidth;
                const height = container.offsetHeight;
                p.resizeCanvas(width, height);
                gravitySystem.resize(width, height);
            };

            this.simulations.set('gravity', {
                sketch: p,
                start: () => { isRunning = true; },
                pause: () => { isRunning = false; },
                reset: () => { gravitySystem.reset(); isRunning = false; },
                updateParameter: (param, value) => {
                    switch (param) {
                        case 'mass':
                            gravitySystem.setCentralMass(value);
                            break;
                        case 'particles':
                            gravitySystem.setParticleCount(parseInt(value));
                            break;
                        case 'speed':
                            gravitySystem.setSpeed(value);
                            break;
                    }
                }
            });
        };

        new p5(sketch, container);
    }

    /**
     * Create electric field simulation
     */
    createElectricFieldSimulation() {
        const container = document.getElementById('electric-simulation');
        if (!container) return;

        const sketch = (p) => {
            let electricSystem;
            let isRunning = false;

            p.setup = () => {
                const width = container.offsetWidth;
                const height = container.offsetHeight;
                p.createCanvas(width, height);
                
                electricSystem = new ElectricFieldSimulation(p, width, height);
                this.hideLoadingIndicator(container);
            };

            p.draw = () => {
                p.background(248, 250, 252);
                
                if (isRunning) {
                    electricSystem.update();
                }
                
                electricSystem.display();
            };

            p.windowResized = () => {
                const width = container.offsetWidth;
                const height = container.offsetHeight;
                p.resizeCanvas(width, height);
                electricSystem.resize(width, height);
            };

            this.simulations.set('electric', {
                sketch: p,
                start: () => { isRunning = true; },
                pause: () => { isRunning = false; },
                reset: () => { electricSystem.reset(); isRunning = false; },
                updateParameter: (param, value) => {
                    switch (param) {
                        case 'charge1':
                            electricSystem.setCharge1(value);
                            break;
                        case 'charge2':
                            electricSystem.setCharge2(value);
                            break;
                        case 'field-lines':
                            electricSystem.showFieldLines(value);
                            break;
                    }
                }
            });
        };

        new p5(sketch, container);
    }

    /**
     * Hide loading indicator
     */
    hideLoadingIndicator(container) {
        const loadingElement = container.querySelector('.canvas-loading');
        if (loadingElement) {
            loadingElement.style.display = 'none';
        }
    }

    /**
     * Display pendulum information
     */
    displayPendulumInfo(p, pendulum) {
        p.fill(0);
        p.textAlign(p.LEFT);
        p.textSize(14);
        p.text(`Period: ${pendulum.getPeriod().toFixed(2)}s`, 10, 20);
        p.text(`Energy: ${pendulum.getEnergy().toFixed(2)}J`, 10, 40);
    }

    /**
     * Setup load more button
     */
    setupLoadMoreButton() {
        const loadMoreButton = document.getElementById('load-more-simulations');
        if (loadMoreButton) {
            loadMoreButton.addEventListener('click', () => {
                this.loadMoreSimulations();
            });
        }
    }

    /**
     * Load more simulations (placeholder for future expansion)
     */
    loadMoreSimulations() {
        console.log('Loading more simulations...');
        // This would typically fetch additional simulations from a server
        // For now, we'll just show a message
        this.showNotification('More simulations coming soon!', 'info');
    }

    /**
     * Utility methods
     */
    getSimulationIdFromControl(controlId) {
        const parts = controlId.split('-');
        return parts[0];
    }

    getParameterFromControl(controlId) {
        const parts = controlId.split('-');
        return parts.slice(1).join('-');
    }

    getActionFromButton(buttonId) {
        const parts = buttonId.split('-');
        return parts[parts.length - 1];
    }

    /**
     * Simulation control methods
     */
    startSimulation(simulationId) {
        const simulation = this.simulations.get(simulationId);
        if (simulation) {
            simulation.start();
        }
    }

    pauseSimulation(simulationId) {
        const simulation = this.simulations.get(simulationId);
        if (simulation) {
            simulation.pause();
        }
    }

    resetSimulation(simulationId) {
        const simulation = this.simulations.get(simulationId);
        if (simulation) {
            simulation.reset();
        }
    }

    updateSimulationParameter(simulationId, parameter, value) {
        const simulation = this.simulations.get(simulationId);
        if (simulation && simulation.updateParameter) {
            simulation.updateParameter(parameter, value);
        }
    }

    /**
     * Show notification
     */
    showNotification(message, type = 'info') {
        // Reuse the notification system from main.js
        if (window.app && window.app.showNotification) {
            window.app.showNotification(message, type);
        } else {
            console.log(`${type.toUpperCase()}: ${message}`);
        }
    }

    /**
     * Pause all simulations (for performance)
     */
    pauseAll() {
        this.simulations.forEach(simulation => {
            if (simulation.pause) {
                simulation.pause();
            }
        });
    }

    /**
     * Resume all simulations
     */
    resumeAll() {
        // Note: This doesn't automatically start all simulations,
        // just resumes the p5 sketches
        this.simulations.forEach(simulation => {
            if (simulation.sketch && simulation.sketch.loop) {
                simulation.sketch.loop();
            }
        });
    }

    /**
     * Destroy all simulations
     */
    destroy() {
        this.simulations.forEach(simulation => {
            if (simulation.sketch && simulation.sketch.remove) {
                simulation.sketch.remove();
            }
        });
        this.simulations.clear();
    }
}

/**
 * Pendulum Simulation Class
 */
class PendulumSimulation {
    constructor(p, width, height) {
        this.p = p;
        this.width = width;
        this.height = height;
        this.length = 150;
        this.gravity = 9.8;
        this.angle = this.p.PI / 6;
        this.angleVel = 0;
        this.angleAcc = 0;
        this.damping = 0.999;
        this.cx = width / 2;
        this.cy = 50;
        this.trail = [];
        this.maxTrailLength = 50;
        this.reset();
    }

    update() {
        this.angleAcc = (-this.gravity / (this.length * 10)) * this.p.sin(this.angle);
        this.angleVel += this.angleAcc;
        this.angleVel *= this.damping;
        this.angle += this.angleVel;

        // Add to trail
        const x = this.cx + this.length * this.p.sin(this.angle);
        const y = this.cy + this.length * this.p.cos(this.angle);
        this.trail.push({ x, y });
        
        if (this.trail.length > this.maxTrailLength) {
            this.trail.shift();
        }
    }

    display() {
        const x = this.cx + this.length * this.p.sin(this.angle);
        const y = this.cy + this.length * this.p.cos(this.angle);

        // Draw trail
        this.p.stroke(59, 130, 246, 100);
        this.p.strokeWeight(2);
        this.p.noFill();
        
        if (this.trail.length > 1) {
            this.p.beginShape();
            this.trail.forEach(point => {
                this.p.vertex(point.x, point.y);
            });
            this.p.endShape();
        }

        // Draw string
        this.p.stroke(100);
        this.p.strokeWeight(2);
        this.p.line(this.cx, this.cy, x, y);

        // Draw pivot
        this.p.fill(59, 130, 246);
        this.p.noStroke();
        this.p.ellipse(this.cx, this.cy, 10, 10);

        // Draw bob
        this.p.fill(16, 185, 129);
        this.p.ellipse(x, y, 25, 25);

        // Draw arc showing range
        this.p.noFill();
        this.p.stroke(200);
        this.p.strokeWeight(1);
        this.p.arc(this.cx, this.cy, this.length * 2, this.length * 2, 
                   this.p.PI/2 - this.p.PI/3, this.p.PI/2 + this.p.PI/3);
    }

    setLength(length) {
        this.length = length * 100; // Convert to pixels
    }

    setInitialAngle(angle) {
        this.initialAngle = angle;
        this.reset();
    }

    setGravity(gravity) {
        this.gravity = gravity;
    }

    reset() {
        this.angle = this.initialAngle || this.p.PI / 6;
        this.angleVel = 0;
        this.angleAcc = 0;
        this.trail = [];
    }

    resize(width, height) {
        this.width = width;
        this.height = height;
        this.cx = width / 2;
    }

    getPeriod() {
        return 2 * this.p.PI * this.p.sqrt(this.length / (this.gravity * 100));
    }

    getEnergy() {
        const kinetic = 0.5 * this.angleVel * this.angleVel;
        const potential = this.gravity * (1 - this.p.cos(this.angle));
        return kinetic + potential;
    }
}

/**
 * Wave Interference Simulation Class
 */
class WaveInterferenceSimulation {
    constructor(p, width, height) {
        this.p = p;
        this.width = width;
        this.height = height;
        this.time = 0;
        this.frequency1 = 0.5;
        this.frequency2 = 0.5;
        this.amplitude = 30;
        this.sources = [
            { x: width * 0.3, y: height * 0.5 },
            { x: width * 0.7, y: height * 0.5 }
        ];
    }

    update() {
        this.time += 1;
    }

    display() {
        // Draw wave interference pattern
        for (let x = 0; x < this.width; x += 4) {
            for (let y = 0; y < this.height; y += 4) {
                let totalWave = 0;
                
                this.sources.forEach((source, index) => {
                    const distance = this.p.dist(x, y, source.x, source.y);
                    const frequency = index === 0 ? this.frequency1 : this.frequency2;
                    const waveValue = this.amplitude * 
                                    this.p.sin(frequency * distance - this.time * 0.1);
                    totalWave += waveValue;
                });
                
                const brightness = this.p.map(totalWave, -this.amplitude * 2, this.amplitude * 2, 0, 255);
                const blue = this.p.map(totalWave, -this.amplitude * 2, this.amplitude * 2, 100, 255);
                
                this.p.fill(brightness * 0.8, brightness * 0.9, blue, 150);
                this.p.noStroke();
                this.p.rect(x, y, 4, 4);
            }
        }

        // Draw sources
        this.sources.forEach((source, index) => {
            this.p.fill(index === 0 ? [59, 130, 246] : [16, 185, 129]);
            this.p.noStroke();
            this.p.ellipse(source.x, source.y, 15, 15);
        });
    }

    setFrequency1(freq) {
        this.frequency1 = freq;
    }

    setFrequency2(freq) {
        this.frequency2 = freq;
    }

    setAmplitude(amp) {
        this.amplitude = amp;
    }

    reset() {
        this.time = 0;
    }

    resize(width, height) {
        this.width = width;
        this.height = height;
        this.sources = [
            { x: width * 0.3, y: height * 0.5 },
            { x: width * 0.7, y: height * 0.5 }
        ];
    }
}

/**
 * Gravity Simulation Class
 */
class GravitySimulation {
    constructor(p, width, height) {
        this.p = p;
        this.width = width;
        this.height = height;
        this.centralMass = 100;
        this.speed = 1;
        this.particles = [];
        this.createParticles(5);
    }

    createParticles(count) {
        this.particles = [];
        const centerX = this.width / 2;
        const centerY = this.height / 2;
        
        for (let i = 0; i < count; i++) {
            const angle = (this.p.TWO_PI / count) * i;
            const distance = 60 + i * 15;
            this.particles.push({
                angle: angle,
                distance: distance,
                speed: this.p.sqrt(this.centralMass / distance) * 0.02,
                trail: []
            });
        }
    }

    update() {
        const centerX = this.width / 2;
        const centerY = this.height / 2;
        
        this.particles.forEach(particle => {
            particle.angle += particle.speed * this.speed;
            
            const x = centerX + this.p.cos(particle.angle) * particle.distance;
            const y = centerY + this.p.sin(particle.angle) * particle.distance;
            
            particle.trail.push({ x, y });
            if (particle.trail.length > 30) {
                particle.trail.shift();
            }
        });
    }

    display() {
        const centerX = this.width / 2;
        const centerY = this.height / 2;

        // Draw gravitational field lines
        this.p.stroke(59, 130, 246, 30);
        this.p.strokeWeight(1);
        this.p.noFill();
        
        for (let radius = 30; radius < 150; radius += 20) {
            this.p.ellipse(centerX, centerY, radius * 2, radius * 2);
        }

        // Draw particles and trails
        this.particles.forEach(particle => {
            // Draw trail
            this.p.stroke(59, 130, 246, 100);
            this.p.strokeWeight(1);
            this.p.noFill();
            
            if (particle.trail.length > 1) {
                this.p.beginShape();
                particle.trail.forEach(point => {
                    this.p.vertex(point.x, point.y);
                });
                this.p.endShape();
            }

            // Draw particle
            const currentPos = particle.trail[particle.trail.length - 1];
            if (currentPos) {
                this.p.fill(59, 130, 246);
                this.p.noStroke();
                this.p.ellipse(currentPos.x, currentPos.y, 8, 8);
            }
        });

        // Draw central mass
        this.p.fill(16, 185, 129);
        this.p.noStroke();
        const size = this.p.map(this.centralMass, 50, 200, 15, 25);
        this.p.ellipse(centerX, centerY, size, size);
    }

    setCentralMass(mass) {
        this.centralMass = mass;
        // Recalculate particle speeds
        this.particles.forEach(particle => {
            particle.speed = this.p.sqrt(this.centralMass / particle.distance) * 0.02;
        });
    }

    setParticleCount(count) {
        this.createParticles(count);
    }

    setSpeed(speed) {
        this.speed = speed;
    }

    reset() {
        this.particles.forEach(particle => {
            particle.trail = [];
            particle.angle = Math.random() * this.p.TWO_PI;
        });
    }

    resize(width, height) {
        this.width = width;
        this.height = height;
    }
}

/**
 * Electric Field Simulation Class
 */
class ElectricFieldSimulation {
    constructor(p, width, height) {
        this.p = p;
        this.width = width;
        this.height = height;
        this.charge1 = 5;
        this.charge2 = -5;
        this.showLines = true;
        this.fieldLines = [];
        this.generateFieldLines();
    }

    generateFieldLines() {
        this.fieldLines = [];
        const charge1Pos = { x: this.width * 0.3, y: this.height * 0.5 };
        const charge2Pos = { x: this.width * 0.7, y: this.height * 0.5 };
        
        // Generate field lines from positive charge
        if (this.charge1 > 0) {
            for (let angle = 0; angle < this.p.TWO_PI; angle += this.p.TWO_PI / 12) {
                const line = [];
                let x = charge1Pos.x + this.p.cos(angle) * 10;
                let y = charge1Pos.y + this.p.sin(angle) * 10;
                
                for (let i = 0; i < 50; i++) {
                    line.push({ x, y });
                    
                    // Calculate field direction
                    const field = this.calculateFieldAt(x, y);
                    const magnitude = this.p.sqrt(field.x * field.x + field.y * field.y);
                    
                    if (magnitude > 0) {
                        x += (field.x / magnitude) * 3;
                        y += (field.y / magnitude) * 3;
                    }
                    
                    if (x < 0 || x > this.width || y < 0 || y > this.height) break;
                }
                
                this.fieldLines.push(line);
            }
        }
    }

    calculateFieldAt(x, y) {
        const charge1Pos = { x: this.width * 0.3, y: this.height * 0.5 };
        const charge2Pos = { x: this.width * 0.7, y: this.height * 0.5 };
        
        let fieldX = 0;
        let fieldY = 0;
        
        // Field from charge 1
        const dx1 = x - charge1Pos.x;
        const dy1 = y - charge1Pos.y;
        const r1 = this.p.sqrt(dx1 * dx1 + dy1 * dy1);
        if (r1 > 0) {
            const field1 = this.charge1 / (r1 * r1);
            fieldX += field1 * dx1 / r1;
            fieldY += field1 * dy1 / r1;
        }
        
        // Field from charge 2
        const dx2 = x - charge2Pos.x;
        const dy2 = y - charge2Pos.y;
        const r2 = this.p.sqrt(dx2 * dx2 + dy2 * dy2);
        if (r2 > 0) {
            const field2 = this.charge2 / (r2 * r2);
            fieldX += field2 * dx2 / r2;
            fieldY += field2 * dy2 / r2;
        }
        
        return { x: fieldX, y: fieldY };
    }

    update() {
        // Electric field is static, but we could animate charges if needed
    }

    display() {
        const charge1Pos = { x: this.width * 0.3, y: this.height * 0.5 };
        const charge2Pos = { x: this.width * 0.7, y: this.height * 0.5 };

        // Draw field lines
        if (this.showLines) {
            this.p.stroke(100, 100, 255, 150);
            this.p.strokeWeight(1);
            this.p.noFill();
            
            this.fieldLines.forEach(line => {
                if (line.length > 1) {
                    this.p.beginShape();
                    line.forEach(point => {
                        this.p.vertex(point.x, point.y);
                    });
                    this.p.endShape();
                }
            });
        }

        // Draw charges
        this.p.noStroke();
        
        // Charge 1
        this.p.fill(this.charge1 > 0 ? [255, 100, 100] : [100, 100, 255]);
        this.p.ellipse(charge1Pos.x, charge1Pos.y, 20, 20);
        this.p.fill(255);
        this.p.textAlign(this.p.CENTER, this.p.CENTER);
        this.p.text(this.charge1 > 0 ? '+' : '−', charge1Pos.x, charge1Pos.y);
        
        // Charge 2
        this.p.fill(this.charge2 > 0 ? [255, 100, 100] : [100, 100, 255]);
        this.p.ellipse(charge2Pos.x, charge2Pos.y, 20, 20);
        this.p.fill(255);
        this.p.text(this.charge2 > 0 ? '+' : '−', charge2Pos.x, charge2Pos.y);
    }

    setCharge1(charge) {
        this.charge1 = charge;
        this.generateFieldLines();
    }

    setCharge2(charge) {
        this.charge2 = charge;
        this.generateFieldLines();
    }

    showFieldLines(show) {
        this.showLines = show;
    }

    reset() {
        this.generateFieldLines();
    }

    resize(width, height) {
        this.width = width;
        this.height = height;
        this.generateFieldLines();
    }
}

// Initialize simulations system
document.addEventListener('DOMContentLoaded', () => {
    window.simulationsSystem = new SimulationsSystem();
});

// Handle page visibility for performance
document.addEventListener('visibilitychange', () => {
    if (window.simulationsSystem) {
        if (document.hidden) {
            window.simulationsSystem.pauseAll();
        } else {
            window.simulationsSystem.resumeAll();
        }
    }
});

// Clean up on page unload
window.addEventListener('beforeunload', () => {
    if (window.simulationsSystem) {
        window.simulationsSystem.destroy();
    }
});

// Export for potential use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SimulationsSystem;
}
