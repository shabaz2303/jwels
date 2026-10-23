/* ============================================
   SURANI JEWELLERS & SONS - Main JS
   Cinematic Animations + Cart + Tilt
   ============================================ */

// ===== CART SYSTEM =====
let cart = JSON.parse(localStorage.getItem('suraniCart')) || [];

function updateCartUI() {
  const countEl = document.querySelector('.cart-count');
  const itemsEl = document.querySelector('.cart-items');
  const totalEl = document.querySelector('.cart-total-amount');
  
  if (countEl) countEl.textContent = cart.reduce((sum, i) => sum + i.qty, 0);
  
  if (itemsEl) {
    if (cart.length === 0) {
      itemsEl.innerHTML = '<p style="color:var(--text-secondary);text-align:center;padding:2rem 0;">Your cart is empty</p>';
    } else {
      itemsEl.innerHTML = cart.map((item, idx) => `
        <div class="cart-item">
          <img src="${item.img}" alt="${item.name}">
          <div class="cart-item-info">
            <h4>${item.name}</h4>
            <p>${item.price}</p>
            <small>Qty: ${item.qty}</small>
          </div>
          <button onclick="removeFromCart(${idx})" style="background:none;border:none;color:#ff6b6b;cursor:pointer;font-size:1.2rem;">×</button>
        </div>
      `).join('');
    }
  }
  
  if (totalEl) {
    const total = cart.reduce((sum, i) => {
      const num = parseFloat(i.price.replace(/[^0-9.]/g, '')) || 0;
      return sum + (num * i.qty);
    }, 0);
    totalEl.textContent = '₹' + total.toLocaleString('en-IN');
  }
  
  localStorage.setItem('suraniCart', JSON.stringify(cart));
}

function addToCart(name, price, img) {
  const existing = cart.find(i => i.name === name);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ name, price, img, qty: 1 });
  }
  updateCartUI();
  
  // Toast feedback
  showToast(`${name} added to cart`);
  
  // Open cart briefly
  document.querySelector('.cart-sidebar')?.classList.add('open');
  document.querySelector('.overlay')?.classList.add('active');
}

function removeFromCart(idx) {
  cart.splice(idx, 1);
  updateCartUI();
}

function showToast(msg) {
  const toast = document.createElement('div');
  toast.style.cssText = `
    position:fixed;bottom:2rem;left:50%;transform:translateX(-50%);
    background:rgba(212,175,55,0.95);color:#000;padding:0.8rem 1.5rem;
    border-radius:4px;font-weight:500;z-index:9999;animation:fadeInUp 0.3s ease;
  `;
  toast.textContent = msg;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 2500);
}

// ===== CART TOGGLE =====
document.addEventListener('DOMContentLoaded', () => {
  updateCartUI();
  
  document.querySelector('.btn-cart')?.addEventListener('click', () => {
    document.querySelector('.cart-sidebar')?.classList.add('open');
    document.querySelector('.overlay')?.classList.add('active');
  });
  
  document.querySelector('.cart-close')?.addEventListener('click', closeCart);
  document.querySelector('.overlay')?.addEventListener('click', closeCart);
  
  function closeCart() {
    document.querySelector('.cart-sidebar')?.classList.remove('open');
    document.querySelector('.overlay')?.classList.remove('active');
  }
  
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
  
  // Tilt effect on product cards
  initTilt();
  
  // Hero entrance
  animateHero();
});

function closeCart() {
  document.querySelector('.cart-sidebar')?.classList.remove('open');
  document.querySelector('.overlay')?.classList.remove('active');
}

// ===== PARTICLES =====
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

// ===== REVEAL ON SCROLL =====
function initReveal() {
  const reveals = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
      }
    });
  }, { threshold: 0.15 });
  
  reveals.forEach(el => observer.observe(el));
}

// ===== KINETIC TEXT =====
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

// ===== 3D TILT =====
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

// ===== HERO ANIMATION =====
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

// ===== FILTER TABS =====
document.addEventListener('click', (e) => {
  if (e.target.classList.contains('filter-tab')) {
    document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
    e.target.classList.add('active');
    
    const filter = e.target.dataset.filter;
    document.querySelectorAll('[data-category]').forEach(card => {
      if (filter === 'all' || card.dataset.category === filter) {
        card.style.display = '';
        setTimeout(() => card.classList.add('active'), 50);
      } else {
        card.style.display = 'none';
      }
    });
  }
});
