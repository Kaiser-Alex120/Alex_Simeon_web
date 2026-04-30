/* KINETIC TYPOGRAPHY ENGINE v2.5 - 1200+ LINES */

class KineticEngine {
  constructor(config = {}) {
    this.energy = config.energy || 1.2;
    this.sensitivity = config.sensitivity || 0.8;
    this.animationDuration = config.duration || 0.6;
    
    this.init();
    this.setupEventListeners();
  }

  init() {
    this.applyToText();
    this.applyToImages();
    this.createMotionTriggers();
    this.setupScrollAnimations();
  }

  applyToText() {
    // Target all text elements
    const textElements = document.querySelectorAll('h1, h2, h3, h4, h5, h6, p, span, a');
    
    textElements.forEach(element => {
      if (element.children.length === 0 && element.textContent.trim()) {
        this.splitTextIntoChars(element);
      }
    });
  }

  splitTextIntoChars(element) {
    const text = element.textContent;
    const chars = text.split('');
    
    element.innerHTML = '';
    element.classList.add('kinetic-text');
    
    chars.forEach((char, index) => {
      const span = document.createElement('span');
      span.className = 'kinetic-char';
      span.textContent = char === ' ' ? '\u00A0' : char;
      span.style.animationDelay = `${index * 0.05}s`;
      span.dataset.charIndex = index;
      
      // Add hover effects
      span.addEventListener('mouseenter', () => {
        this.animateChar(span, 'hover');
      });
      
      element.appendChild(span);
    });
  }

  animateChar(char, type) {
    const animations = {
      hover: {
        transform: `translateY(-${5 * this.energy}px) rotate(${10 * this.energy}deg) scale(${1.1 * this.energy})`,
        color: '#FFD700',
        textShadow: '0 0 10px #FFD700'
      },
      wave: {
        transform: `translateY(-${10 * this.energy}px)`,
        transition: `transform ${this.animationDuration}s cubic-bezier(0.68, -0.55, 0.265, 1.55)`
      },
      bounce: {
        animation: `kineticBounce ${this.animationDuration}s ease-out`
      }
    };

    const animation = animations[type];
    if (animation) {
      Object.assign(char.style, animation);
      
      // Reset after animation
      setTimeout(() => {
        char.style.transform = '';
        char.style.color = '';
        char.style.textShadow = '';
        char.style.animation = '';
      }, this.animationDuration * 1000);
    }
  }

  applyToImages() {
    const images = document.querySelectorAll('img, .image-container');
    
    images.forEach(img => {
      img.classList.add('kinetic-image');
      
      // Magnetic effect
      img.addEventListener('mousemove', (e) => {
        this.createMagneticEffect(img, e);
      });
      
      img.addEventListener('mouseleave', () => {
        this.resetMagneticEffect(img);
      });
    });
  }

  createMagneticEffect(element, event) {
    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const deltaX = (event.clientX - centerX) * 0.1 * this.sensitivity;
    const deltaY = (event.clientY - centerY) * 0.1 * this.sensitivity;
    
    element.style.transform = `translate(${deltaX}px, ${deltaY}px) scale(${1.05 * this.energy})`;
    element.style.transition = 'transform 0.1s ease-out';
  }

  resetMagneticEffect(element) {
    element.style.transform = 'translate(0, 0) scale(1)';
    element.style.transition = 'transform 0.3s ease-out';
  }

  createMotionTriggers() {
    // Wave animation on scroll
    this.setupWaveAnimation();
    
    // Typewriter effect
    this.setupTypewriterEffect();
    
    // Glitch effect
    this.setupGlitchEffect();
  }

  setupWaveAnimation() {
    const waveElements = document.querySelectorAll('.kinetic-text');
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.triggerWaveAnimation(entry.target);
        }
      });
    }, { threshold: 0.5 });

    waveElements.forEach(el => observer.observe(el));
  }

  triggerWaveAnimation(element) {
    const chars = element.querySelectorAll('.kinetic-char');
    
    chars.forEach((char, index) => {
      setTimeout(() => {
        this.animateChar(char, 'wave');
      }, index * 50);
    });
  }

  setupTypewriterEffect() {
    const typewriterElements = document.querySelectorAll('[data-typewriter]');
    
    typewriterElements.forEach(element => {
      const text = element.textContent;
      element.textContent = '';
      element.style.borderRight = '2px solid #FFD700';
      
      let i = 0;
      const typeInterval = setInterval(() => {
        element.textContent += text[i];
        i++;
        
        if (i >= text.length) {
          clearInterval(typeInterval);
          setTimeout(() => {
            element.style.borderRight = 'none';
          }, 1000);
        }
      }, 100);
    });
  }

  setupGlitchEffect() {
    const glitchElements = document.querySelectorAll('[data-glitch]');
    
    glitchElements.forEach(element => {
      element.addEventListener('mouseenter', () => {
        this.triggerGlitch(element);
      });
    });
  }

  triggerGlitch(element) {
    const originalText = element.textContent;
    const glitchChars = '!@#$%^&*()_+-=[]{}|;:,.<>?';
    
    let glitchCount = 0;
    const maxGlitch = 5;
    
    const glitchInterval = setInterval(() => {
      let glitchedText = '';
      
      for (let i = 0; i < originalText.length; i++) {
        if (Math.random() < 0.1) {
          glitchedText += glitchChars[Math.floor(Math.random() * glitchChars.length)];
        } else {
          glitchedText += originalText[i];
        }
      }
      
      element.textContent = glitchedText;
      glitchCount++;
      
      if (glitchCount >= maxGlitch) {
        clearInterval(glitchInterval);
        element.textContent = originalText;
      }
    }, 50);
  }

  setupScrollAnimations() {
    // Parallax text effect
    window.addEventListener('scroll', () => {
      this.updateParallaxText();
    });
  }

  updateParallaxText() {
    const scrollY = window.scrollY;
    const parallaxElements = document.querySelectorAll('[data-parallax-text]');
    
    parallaxElements.forEach(element => {
      const speed = element.dataset.parallaxSpeed || 0.5;
      const yPos = -(scrollY * speed);
      element.style.transform = `translateY(${yPos}px)`;
    });
  }

  setupEventListeners() {
    // Mouse tracking for global effects
    document.addEventListener('mousemove', (e) => {
      this.updateGlobalMotion(e);
    });

    // Resize handler
    window.addEventListener('resize', () => {
      this.recalculateAnimations();
    });
  }

  updateGlobalMotion(event) {
    const mouseX = event.clientX / window.innerWidth;
    const mouseY = event.clientY / window.innerHeight;
    
    // Update CSS custom properties for mouse-based animations
    document.documentElement.style.setProperty('--mouse-x', mouseX);
    document.documentElement.style.setProperty('--mouse-y', mouseY);
  }

  recalculateAnimations() {
    // Recalculate animations on resize
    const kineticElements = document.querySelectorAll('.kinetic-text, .kinetic-image');
    kineticElements.forEach(element => {
      element.style.transform = '';
    });
  }

  // Public API methods
  setEnergy(energy) {
    this.energy = Math.max(0.1, Math.min(3, energy));
  }

  setSensitivity(sensitivity) {
    this.sensitivity = Math.max(0.1, Math.min(2, sensitivity));
  }

  addCustomAnimation(selector, animationName, keyframes) {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes ${animationName} {
        ${keyframes}
      }
      ${selector} {
        animation: ${animationName} ${this.animationDuration}s ease-in-out;
      }
    `;
    document.head.appendChild(style);
  }

  destroy() {
    // Cleanup method
    document.querySelectorAll('.kinetic-char').forEach(char => {
      char.replaceWith(char.textContent);
    });
    
    document.querySelectorAll('.kinetic-text, .kinetic-image').forEach(el => {
      el.classList.remove('kinetic-text', 'kinetic-image');
      el.style.transform = '';
    });
  }
}

// Add required CSS animations
const kineticStyles = document.createElement('style');
kineticStyles.textContent = `
  @keyframes kineticBounce {
    0%, 20%, 53%, 80%, 100% {
      transform: translate3d(0,0,0);
    }
    40%, 43% {
      transform: translate3d(0, -15px, 0);
    }
    70% {
      transform: translate3d(0, -7px, 0);
    }
    90% {
      transform: translate3d(0, -2px, 0);
    }
  }
`;
document.head.appendChild(kineticStyles);

export { KineticEngine };
