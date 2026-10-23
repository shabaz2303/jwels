/* ============================================
   SURANI JEWELLERS & SONS - Main JS
   Cinematic Animations + Tilt (No Cart)
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  // Navbar scroll
  window.addEventListener('scroll', () => {
    const nav = document.querySelector('.navbar');
    if (window.scrollY > 50) nav?.classList.add('scrolled');
    else nav?.classList.remove('scrolled');
  });
  
  // Hero particles
  createParticles();
  
  // Reveal on scroll
  initReveal();
  
  // Kinetic text
  initKineticText();
  
  // Tilt effect
  initTilt();
  
  // Hero entrance
  animateHero();
  
  // Mobile menu toggle
  document.querySelector('.mobile-toggle')?.addEventListener('click', () => {
    const links = document.querySelector('.nav-links');
    if (links) {
      links.style.display = links.style.display === 'flex' ? 'none' : 'flex';
      links.style.flexDirection = 'column';
      links.style.position = 'absolute';
      links.style.top = '100%';
      links.style.left = '0';
      links.style.right = '0';
      links.style.background = 'rgba(10,10,12,0.95)';
      links.style.padding = '1.5rem';
      links.style.gap = '1rem';
    }
  });
});

function createParticles() {
  const container = document.querySelector('.hero-particles');
  if (!container) return;
  for (let i = 0; i < 40; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    p.style.left = Math.random() * 100 + '%';
    p.style.top = Math.random() * 100 + '%';
    p.style.animationDelay = Math.random() * 8 + 's';
    p.style.animationDuration = (6 + Math.random() * 6) + 's';
    p.style.width = p.style.height = (1 + Math.random() * 2) + 'px';
    container.appendChild(p);
  }
}

function initReveal() {
  const reveals = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('active');
    });
  }, { threshold: 0.15 });
  reveals.forEach(el => observer.observe(el));
}

function initKineticText() {
  document.querySelectorAll('.kinetic').forEach(el => {
    const text = el.textContent;
    el.innerHTML = '';
    text.split(' ').forEach((word, i) => {
      const span = document.createElement('span');
      span.className = 'kinetic-word';
      span.textContent = word + ' ';
      span.style.transitionDelay = (i * 0.08) + 's';
      el.appendChild(span);
    });
  });
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll('.kinetic-word').forEach(w => w.classList.add('visible'));
      }
    });
  }, { threshold: 0.3 });
  document.querySelectorAll('.kinetic').forEach(el => observer.observe(el));
}

function initTilt() {
  document.querySelectorAll('.product-card, .category-card, .split-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = (y - centerY) / 18;
      const rotateY = (centerX - x) / 18;
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
    });
  });
}

function animateHero() {
  const elements = [
    { el: document.querySelector('.hero-tag'), delay: 200 },
    { el: document.querySelector('.hero-title'), delay: 400 },
    { el: document.querySelector('.hero-subtitle'), delay: 700 },
    { el: document.querySelector('.hero-cta'), delay: 1000 }
  ];
  elements.forEach(({ el, delay }) => {
    if (!el) return;
    setTimeout(() => {
      el.style.transition = 'all 1s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    }, delay);
  });
}

document.addEventListener('click', (e) => {
  if (e.target.classList.contains('filter-tab')) {
    document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
    e.target.classList.add('active');
    const filter = e.target.dataset.filter;
    document.querySelectorAll('[data-category]').forEach(card => {
      if (filter === 'all' || card.dataset.category === filter) {
        card.style.display = '';
      } else {
        card.style.display = 'none';
      }
    });
  }
});
