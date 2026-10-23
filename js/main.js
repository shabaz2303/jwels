/* ============================================
   SURANI JEWELLERS & SONS - Main JS
   Cinematic Animations + Product Showcase Modal
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  window.addEventListener('scroll', () => {
    const nav = document.querySelector('.navbar');
    if (window.scrollY > 50) nav?.classList.add('scrolled');
    else nav?.classList.remove('scrolled');
  });

  createParticles();
  initReveal();
  initKineticText();
  initTilt();
  animateHero();
  initProductModal();

  document.querySelector('.mobile-toggle')?.addEventListener('click', () => {
    const links = document.querySelector('.nav-links');
    if (links) {
      const open = links.style.display === 'flex';
      links.style.display = open ? 'none' : 'flex';
      if (!open) {
        links.style.flexDirection = 'column';
        links.style.position = 'absolute';
        links.style.top = '100%';
        links.style.left = '0';
        links.style.right = '0';
        links.style.background = 'rgba(10,10,12,0.95)';
        links.style.padding = '1.5rem';
        links.style.gap = '1rem';
        links.style.zIndex = '100';
      }
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
  }, { threshold: 0.12 });
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
      if (e.target.closest('a, button')) return;
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const rotateX = (y - rect.height / 2) / 18;
      const rotateY = (rect.width / 2 - x) / 18;
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02,1.02,1.02)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1,1,1)';
    });
  });
}

function animateHero() {
  [
    { el: document.querySelector('.hero-tag'), delay: 200 },
    { el: document.querySelector('.hero-title'), delay: 400 },
    { el: document.querySelector('.hero-subtitle'), delay: 700 },
    { el: document.querySelector('.hero-cta'), delay: 1000 }
  ].forEach(({ el, delay }) => {
    if (!el) return;
    setTimeout(() => {
      el.style.transition = 'all 1s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    }, delay);
  });
}

/* ========== PRODUCT SHOWCASE MODAL ========== */
function initProductModal() {
  document.querySelectorAll('.product-card').forEach(card => {
    card.addEventListener('click', (e) => {
      // Don't open modal if user clicked Explore/Enquire link
      if (e.target.closest('a')) return;

      const img = card.querySelector('.product-img-wrap img');
      const type = card.querySelector('.product-type');
      const title = card.querySelector('.product-title');
      const details = card.querySelector('.product-details');
      const price = card.querySelector('.product-price');

      document.getElementById('modalImg').src = img ? img.src : '';
      document.getElementById('modalImg').alt = title ? title.textContent : '';
      document.getElementById('modalType').textContent = type ? type.textContent : '';
      document.getElementById('modalTitle').textContent = title ? title.textContent : '';
      document.getElementById('modalDetails').textContent = details ? details.textContent : '';
      document.getElementById('modalPrice').textContent = price ? price.textContent : '';

      const modal = document.getElementById('productModal');
      modal.style.display = 'flex';
      document.body.style.overflow = 'hidden';
    });
  });
}

function closeProductModal() {
  const modal = document.getElementById('productModal');
  if (modal) {
    modal.style.display = 'none';
    document.body.style.overflow = '';
  }
}

// Close on Escape
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeProductModal();
});

// Filter tabs
document.addEventListener('click', (e) => {
  if (e.target.classList.contains('filter-tab')) {
    document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
    e.target.classList.add('active');
    const filter = e.target.dataset.filter;
    document.querySelectorAll('[data-category]').forEach(card => {
      card.style.display = (filter === 'all' || card.dataset.category === filter) ? '' : 'none';
    });
  }
});
