/**
 * Financial Education Page - Interactive Effects
 * Vanilla JavaScript - No dependencies required
 */

// ============================================================================
// 1. 3D TILT EFFECT
// ============================================================================
class TiltEffect {
    constructor(element) {
        this.element = element;
        this.width = element.offsetWidth;
        this.height = element.offsetHeight;
        this.settings = {
            maxTilt: 15,
            perspective: 1000,
            scale: 1.05,
            speed: 400,
            glare: true,
            maxGlare: 0.3
        };
        
        this.init();
    }
    
    init() {
        this.element.style.transform = 'perspective(1000px)';
        this.element.addEventListener('mouseenter', this.handleMouseEnter.bind(this));
        this.element.addEventListener('mousemove', this.handleMouseMove.bind(this));
        this.element.addEventListener('mouseleave', this.handleMouseLeave.bind(this));
    }
    
    handleMouseEnter() {
        this.width = this.element.offsetWidth;
        this.height = this.element.offsetHeight;
    }
    
    handleMouseMove(e) {
        const rect = this.element.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const percentageX = x / this.width;
        const percentageY = y / this.height;
        
        const tiltX = (percentageY - 0.5) * this.settings.maxTilt * 2;
        const tiltY = (percentageX - 0.5) * -this.settings.maxTilt * 2;
        
        this.element.style.transform = `
            perspective(${this.settings.perspective}px)
            rotateX(${tiltX}deg)
            rotateY(${tiltY}deg)
            scale3d(${this.settings.scale}, ${this.settings.scale}, ${this.settings.scale})
        `;
        
        // Glare effect
        if (this.settings.glare) {
            const glareElement = this.element.querySelector('.card-glare');
            if (glareElement) {
                const glareOpacity = (percentageX + percentageY) / 2 * this.settings.maxGlare;
                glareElement.style.opacity = glareOpacity;
                glareElement.style.background = `
                    radial-gradient(circle at ${percentageX * 100}% ${percentageY * 100}%, 
                    rgba(255, 221, 53, ${glareOpacity}), transparent 80%)
                `;
            }
        }
    }
    
    handleMouseLeave() {
        this.element.style.transform = `
            perspective(${this.settings.perspective}px)
            rotateX(0deg)
            rotateY(0deg)
            scale3d(1, 1, 1)
        `;
        
        const glareElement = this.element.querySelector('.card-glare');
        if (glareElement) {
            glareElement.style.opacity = 0;
        }
    }
}

// ============================================================================
// 2. COUNTER ANIMATION
// ============================================================================
class CounterAnimation {
    constructor(element) {
        this.element = element;
        this.target = parseInt(element.getAttribute('data-counter')) || 0;
        this.current = 0;
        this.duration = 2000; // 2 seconds
        this.hasAnimated = false;
    }
    
    animate() {
        if (this.hasAnimated) return;
        this.hasAnimated = true;
        
        const startTime = performance.now();
        const step = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / this.duration, 1);
            
            // Easing function (easeOutExpo)
            const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
            
            this.current = Math.floor(easeProgress * this.target);
            this.element.textContent = this.current;
            
            if (progress < 1) {
                requestAnimationFrame(step);
            } else {
                this.element.textContent = this.target;
            }
        };
        
        requestAnimationFrame(step);
    }
    
    reset() {
        this.hasAnimated = false;
        this.current = 0;
        this.element.textContent = '0';
    }
}

// ============================================================================
// 3. PARTICLE SYSTEM
// ============================================================================
class ParticleSystem {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;
        
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.particleCount = 50;
        this.maxDistance = 100;
        
        this.resize();
        this.createParticles();
        this.animate();
        
        window.addEventListener('resize', () => this.resize());
    }
    
    resize() {
        this.canvas.width = this.canvas.offsetWidth;
        this.canvas.height = this.canvas.offsetHeight;
    }
    
    createParticles() {
        this.particles = [];
        for (let i = 0; i < this.particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                radius: Math.random() * 2 + 1
            });
        }
    }
    
    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Update and draw particles
        this.particles.forEach((particle, i) => {
            particle.x += particle.vx;
            particle.y += particle.vy;
            
            // Bounce off edges
            if (particle.x < 0 || particle.x > this.canvas.width) particle.vx *= -1;
            if (particle.y < 0 || particle.y > this.canvas.height) particle.vy *= -1;
            
            // Draw particle
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
            this.ctx.fillStyle = 'rgba(255, 221, 53, 0.3)';
            this.ctx.fill();
            
            // Draw connections
            this.particles.slice(i + 1).forEach(otherParticle => {
                const dx = particle.x - otherParticle.x;
                const dy = particle.y - otherParticle.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < this.maxDistance) {
                    this.ctx.beginPath();
                    this.ctx.moveTo(particle.x, particle.y);
                    this.ctx.lineTo(otherParticle.x, otherParticle.y);
                    this.ctx.strokeStyle = `rgba(255, 221, 53, ${0.15 * (1 - distance / this.maxDistance)})`;
                    this.ctx.lineWidth = 0.5;
                    this.ctx.stroke();
                }
            });
        });
        
        requestAnimationFrame(() => this.animate());
    }
}

// ============================================================================
// 4. SCROLL REVEAL ANIMATION
// ============================================================================
class ScrollReveal {
    constructor(elements, options = {}) {
        this.elements = typeof elements === 'string' 
            ? document.querySelectorAll(elements) 
            : elements;
        
        this.options = {
            threshold: 0.15,
            rootMargin: '0px',
            animateOnce: true,
            ...options
        };
        
        this.observer = new IntersectionObserver(
            this.handleIntersection.bind(this),
            {
                threshold: this.options.threshold,
                rootMargin: this.options.rootMargin
            }
        );
        
        this.init();
    }
    
    init() {
        this.elements.forEach(element => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(30px)';
            this.observer.observe(element);
        });
    }
    
    handleIntersection(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.transition = 'opacity 0.8s ease-out, transform 0.8s ease-out';
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                
                // Trigger counter animation if element has data-counter
                const counterElement = entry.target.querySelector('[data-counter]');
                if (counterElement && counterElement.counterInstance) {
                    counterElement.counterInstance.animate();
                }
                
                if (this.options.animateOnce) {
                    this.observer.unobserve(entry.target);
                }
            }
        });
    }
}

// ============================================================================
// 5. PARALLAX EFFECT
// ============================================================================
class ParallaxScroll {
    constructor(elements, speed = 0.5) {
        this.elements = typeof elements === 'string' 
            ? document.querySelectorAll(elements) 
            : elements;
        this.speed = speed;
        
        this.init();
    }
    
    init() {
        window.addEventListener('scroll', () => this.update());
    }
    
    update() {
        const scrollY = window.pageYOffset;
        
        this.elements.forEach(element => {
            const rect = element.getBoundingClientRect();
            const elementY = rect.top + scrollY;
            const offset = (scrollY - elementY) * this.speed;
            
            element.style.transform = `translateY(${offset}px)`;
        });
    }
}

// ============================================================================
// 6. MAGNETIC BUTTON EFFECT
// ============================================================================
class MagneticButton {
    constructor(element) {
        this.element = element;
        this.strength = 20;
        
        this.init();
    }
    
    init() {
        this.element.addEventListener('mousemove', this.handleMouseMove.bind(this));
        this.element.addEventListener('mouseleave', this.handleMouseLeave.bind(this));
    }
    
    handleMouseMove(e) {
        const rect = this.element.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        const moveX = x / rect.width * this.strength;
        const moveY = y / rect.height * this.strength;
        
        this.element.style.transform = `translate(${moveX}px, ${moveY}px)`;
    }
    
    handleMouseLeave() {
        this.element.style.transform = 'translate(0, 0)';
    }
}

// ============================================================================
// INITIALIZATION
// ============================================================================
document.addEventListener('DOMContentLoaded', () => {
    
    // Initialize 3D Tilt Effect on strategy cards
    const cards = document.querySelectorAll('.strategy-card[data-tilt]');
    cards.forEach(card => {
        new TiltEffect(card);
        
        // Add delay to each card based on index
        const index = parseInt(card.getAttribute('data-index')) || 0;
        card.style.transitionDelay = `${index * 0.1}s`;
    });
    
    // Initialize Counter Animations
    const counters = document.querySelectorAll('[data-counter]');
    counters.forEach(counter => {
        counter.counterInstance = new CounterAnimation(counter);
    });
    
    // Initialize Scroll Reveal
    new ScrollReveal('.strategy-card', {
        threshold: 0.15,
        animateOnce: true
    });
    
    new ScrollReveal('.section-header', {
        threshold: 0.2,
        animateOnce: true
    });
    
    // Initialize Particle System
    const particleCanvas = document.getElementById('particles-canvas');
    if (particleCanvas) {
        new ParticleSystem('particles-canvas');
    }
    
    // Initialize Magnetic Buttons
    const magneticButtons = document.querySelectorAll('.btn-interface');
    magneticButtons.forEach(btn => {
        new MagneticButton(btn);
    });
    
    // Add stagger animation to cards
    cards.forEach((card, index) => {
        setTimeout(() => {
            card.classList.add('visible');
        }, index * 150);
    });
    
    console.log('✨ Financial Education Effects Initialized');
});

// Export for potential use in other scripts
window.FinancialEffects = {
    TiltEffect,
    CounterAnimation,
    ParticleSystem,
    ScrollReveal,
    ParallaxScroll,
    MagneticButton
};
