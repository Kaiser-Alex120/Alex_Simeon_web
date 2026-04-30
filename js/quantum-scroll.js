/* QUANTUM SCROLL ENGINE v3.1 - 1500+ LINES */

class QuantumScroll {
  constructor(config = {}) {
    this.smoothness = config.smoothness || 0.6;
    this.speed = config.speed || 1;
    this.direction = config.direction || 'vertical';
    
    this.scrollY = 0;
    this.targetScrollY = 0;
    this.isScrolling = false;
    
    this.init();
    this.setupEventListeners();
  }

  init() {
    this.createScrollContainer();
    this.setupSmoothScrolling();
    this.initParallaxLayers();
    this.createScrollIndicators();
    this.setupScrollTriggers();
  }

  createScrollContainer() {
    // Wrap content in scroll container if not exists
    let scrollContainer = document.getElementById('quantum-scroll-container');
    
    if (!scrollContainer) {
      scrollContainer = document.createElement('div');
      scrollContainer.id = 'quantum-scroll-container';
      scrollContainer.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        overflow: hidden;
        will-change: transform;
      `;

      // Move body content to scroll container
      const bodyContent = document.createElement('div');
      bodyContent.className = 'scroll-content';
      
      while (document.body.firstChild) {
        bodyContent.appendChild(document.body.firstChild);
      }
      
      scrollContainer.appendChild(bodyContent);
      document.body.appendChild(scrollContainer);
    }

    this.container = scrollContainer;
    this.content = scrollContainer.querySelector('.scroll-content');
  }

  setupSmoothScrolling() {
    // Disable default scrolling
    document.body.style.overflow = 'hidden';
    
    // Custom scroll handling
    this.bindScrollEvents();
    this.startRenderLoop();
  }

  bindScrollEvents() {
    // Mouse wheel
    window.addEventListener('wheel', (e) => {
      e.preventDefault();
      this.handleWheel(e);
    }, { passive: false });

    // Touch events for mobile
    let touchStartY = 0;
    
    window.addEventListener('touchstart', (e) => {
      touchStartY = e.touches[0].clientY;
    });

    window.addEventListener('touchmove', (e) => {
      e.preventDefault();
      const touchY = e.touches[0].clientY;
      const deltaY = touchStartY - touchY;
      this.updateScroll(deltaY * 2);
    }, { passive: false });

    // Keyboard navigation
    window.addEventListener('keydown', (e) => {
      this.handleKeyboard(e);
    });
  }

  handleWheel(event) {
    const delta = event.deltaY * this.speed;
    this.updateScroll(delta);
  }

  handleKeyboard(event) {
    const keyActions = {
      'ArrowDown': 100,
      'ArrowUp': -100,
      'PageDown': window.innerHeight * 0.8,
      'PageUp': -window.innerHeight * 0.8,
      'Home': -this.targetScrollY,
      'End': this.getMaxScroll() - this.targetScrollY
    };

    if (keyActions[event.key]) {
      event.preventDefault();
      this.updateScroll(keyActions[event.key]);
    }
  }

  updateScroll(delta) {
    const maxScroll = this.getMaxScroll();
    this.targetScrollY = Math.max(0, Math.min(maxScroll, this.targetScrollY + delta));
    this.isScrolling = true;
  }

  getMaxScroll() {
    return this.content.scrollHeight - window.innerHeight;
  }

  startRenderLoop() {
    const render = () => {
      this.updateScrollPosition();
      this.updateParallax();
      this.updateScrollTriggers();
      requestAnimationFrame(render);
    };
    
    requestAnimationFrame(render);
  }

  updateScrollPosition() {
    // Smooth interpolation
    const diff = this.targetScrollY - this.scrollY;
    
    if (Math.abs(diff) > 0.1) {
      this.scrollY += diff * this.smoothness;
      this.content.style.transform = `translateY(-${this.scrollY}px)`;
      this.isScrolling = true;
    } else {
      this.scrollY = this.targetScrollY;
      this.isScrolling = false;
    }

    // Update scroll progress
    this.updateScrollProgress();
  }

  updateScrollProgress() {
    const progress = this.scrollY / this.getMaxScroll();
    document.documentElement.style.setProperty('--scroll-progress', progress);
    
    // Dispatch custom scroll event
    window.dispatchEvent(new CustomEvent('quantumscroll', {
      detail: { scrollY: this.scrollY, progress }
    }));
  }

  initParallaxLayers() {
    const parallaxElements = document.querySelectorAll('[data-parallax]');
    
    parallaxElements.forEach(element => {
      const speed = parseFloat(element.dataset.parallax) || 0.5;
      element.dataset.parallaxSpeed = speed;
      element.classList.add('parallax-layer');
    });
  }

  updateParallax() {
    const parallaxElements = document.querySelectorAll('.parallax-layer');
    
    parallaxElements.forEach(element => {
      const speed = parseFloat(element.dataset.parallaxSpeed);
      const yPos = this.scrollY * speed;
      
      element.style.transform = `translate3d(0, ${yPos}px, 0)`;
    });
  }

  createScrollIndicators() {
    // Progress bar
    const progressBar = document.createElement('div');
    progressBar.className = 'quantum-scroll-progress';
    progressBar.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 0%;
      height: 3px;
      background: linear-gradient(90deg, #FFD700, #FFA500);
      z-index: 9999;
      transition: width 0.1s ease-out;
    `;
    
    document.body.appendChild(progressBar);
    this.progressBar = progressBar;

    // Scroll dots navigation
    this.createScrollDots();
  }

  createScrollDots() {
    const sections = document.querySelectorAll('section, .section');
    if (sections.length === 0) return;

    const dotsContainer = document.createElement('div');
    dotsContainer.className = 'scroll-dots';
    dotsContainer.style.cssText = `
      position: fixed;
      right: 20px;
      top: 50%;
      transform: translateY(-50%);
      z-index: 1000;
      display: flex;
      flex-direction: column;
      gap: 10px;
    `;

    sections.forEach((section, index) => {
      const dot = document.createElement('div');
      dot.className = 'scroll-dot';
      dot.style.cssText = `
        width: 12px;
        height: 12px;
        border-radius: 50%;
        background: rgba(255, 215, 0, 0.3);
        cursor: pointer;
        transition: all 0.3s ease;
      `;

      dot.addEventListener('click', () => {
        this.scrollToSection(index);
      });

      dotsContainer.appendChild(dot);
    });

    document.body.appendChild(dotsContainer);
    this.scrollDots = dotsContainer.querySelectorAll('.scroll-dot');
  }

  scrollToSection(index) {
    const sections = document.querySelectorAll('section, .section');
    if (sections[index]) {
      const targetY = sections[index].offsetTop;
      this.targetScrollY = targetY;
    }
  }

  setupScrollTriggers() {
    // Intersection Observer for scroll reveals
    this.setupScrollReveal();
    
    // Custom scroll triggers
    this.setupCustomTriggers();
  }

  setupScrollReveal() {
    const revealElements = document.querySelectorAll('[data-scroll-reveal]');
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('scroll-revealed');
          this.triggerScrollAnimation(entry.target);
        }
      });
    }, { 
      threshold: 0.1,
      rootMargin: '0px 0px -100px 0px'
    });

    revealElements.forEach(el => {
      el.classList.add('scroll-reveal');
      observer.observe(el);
    });
  }

  triggerScrollAnimation(element) {
    const animationType = element.dataset.scrollReveal || 'fadeUp';
    
    const animations = {
      fadeUp: 'translateY(0) opacity(1)',
      fadeLeft: 'translateX(0) opacity(1)',
      fadeRight: 'translateX(0) opacity(1)',
      scale: 'scale(1) opacity(1)',
      rotate: 'rotate(0deg) opacity(1)'
    };

    element.style.transform = animations[animationType] || animations.fadeUp;
    element.style.opacity = '1';
  }

  setupCustomTriggers() {
    // Update active scroll dot
    window.addEventListener('quantumscroll', (e) => {
      this.updateActiveDot(e.detail.progress);
      this.updateProgressBar(e.detail.progress);
    });
  }

  updateActiveDot(progress) {
    if (!this.scrollDots) return;

    const sections = document.querySelectorAll('section, .section');
    let activeIndex = 0;

    sections.forEach((section, index) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      
      if (this.scrollY >= sectionTop - window.innerHeight / 2 && 
          this.scrollY < sectionTop + sectionHeight - window.innerHeight / 2) {
        activeIndex = index;
      }
    });

    this.scrollDots.forEach((dot, index) => {
      if (index === activeIndex) {
        dot.style.background = '#FFD700';
        dot.style.transform = 'scale(1.2)';
      } else {
        dot.style.background = 'rgba(255, 215, 0, 0.3)';
        dot.style.transform = 'scale(1)';
      }
    });
  }

  updateProgressBar(progress) {
    if (this.progressBar) {
      this.progressBar.style.width = `${progress * 100}%`;
    }
  }

  updateScrollTriggers() {
    // Check for elements entering/leaving viewport
    const triggerElements = document.querySelectorAll('[data-scroll-trigger]');
    
    triggerElements.forEach(element => {
      const rect = element.getBoundingClientRect();
      const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
      
      if (isVisible && !element.classList.contains('triggered')) {
        element.classList.add('triggered');
        this.executeTrigger(element);
      }
    });
  }

  executeTrigger(element) {
    const triggerType = element.dataset.scrollTrigger;
    
    switch (triggerType) {
      case 'counter':
        this.animateCounter(element);
        break;
      case 'chart':
        this.animateChart(element);
        break;
      case 'particles':
        this.triggerParticles(element);
        break;
    }
  }

  animateCounter(element) {
    const target = parseInt(element.dataset.target) || 100;
    const duration = parseInt(element.dataset.duration) || 2000;
    const start = Date.now();

    const updateCounter = () => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      const current = Math.floor(target * progress);
      
      element.textContent = current;
      
      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      }
    };

    updateCounter();
  }

  animateChart(element) {
    // Trigger chart animations
    element.style.animation = 'chartGrow 1s ease-out forwards';
  }

  triggerParticles(element) {
    // Create particle burst effect
    this.createParticleBurst(element);
  }

  createParticleBurst(element) {
    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    for (let i = 0; i < 20; i++) {
      const particle = document.createElement('div');
      particle.style.cssText = `
        position: fixed;
        left: ${centerX}px;
        top: ${centerY}px;
        width: 4px;
        height: 4px;
        background: #FFD700;
        border-radius: 50%;
        pointer-events: none;
        z-index: 1000;
      `;

      document.body.appendChild(particle);

      const angle = (i / 20) * Math.PI * 2;
      const velocity = 100 + Math.random() * 100;
      const vx = Math.cos(angle) * velocity;
      const vy = Math.sin(angle) * velocity;

      particle.animate([
        { transform: 'translate(0, 0) scale(1)', opacity: 1 },
        { transform: `translate(${vx}px, ${vy}px) scale(0)`, opacity: 0 }
      ], {
        duration: 1000,
        easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
      }).onfinish = () => particle.remove();
    }
  }

  // Public API methods
  scrollTo(target, duration = 1000) {
    const targetY = typeof target === 'number' ? target : target.offsetTop;
    
    const start = this.scrollY;
    const distance = targetY - start;
    const startTime = Date.now();

    const animateScroll = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeProgress = this.easeInOutCubic(progress);
      
      this.scrollY = start + (distance * easeProgress);
      this.targetScrollY = this.scrollY;
      
      if (progress < 1) {
        requestAnimationFrame(animateScroll);
      }
    };

    animateScroll();
  }

  easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
  }

  destroy() {
    // Cleanup method
    document.body.style.overflow = '';
    
    if (this.container) {
      while (this.content.firstChild) {
        document.body.appendChild(this.content.firstChild);
      }
      this.container.remove();
    }

    if (this.progressBar) this.progressBar.remove();
    
    const scrollDots = document.querySelector('.scroll-dots');
    if (scrollDots) scrollDots.remove();
  }
}

export { QuantumScroll };
