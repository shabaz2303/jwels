/* SURANI JEWELLERS - Main JS */

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
  initCategoryFilter();

  document.querySelector('.mobile-toggle')?.addEventListener('click', () => {
    const links = document.querySelector('.nav-links');
    if (links) {
      const open = links.style.display === 'flex';
      links.style.display = open ? 'none' : 'flex';
      if (!open) {
        Object.assign(links.style, {
          flexDirection: 'column', position: 'absolute', top: '100%',
          left: '0', right: '0', background: 'rgba(10,10,12,0.95)',
          padding: '1.5rem', gap: '1rem', zIndex: '100'
        });
      }
    }
  });
});

function createParticles() {
  const c = document.querySelector('.hero-particles');
  if (!c) return;
  for (let i = 0; i < 40; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    p.style.cssText = `left:${Math.random()*100}%;top:${Math.random()*100}%;animation-delay:${Math.random()*8}s;animation-duration:${6+Math.random()*6}s;width:${1+Math.random()*2}px;height:${1+Math.random()*2}px`;
    c.appendChild(p);
  }
}

function initReveal() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('active'); });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
}

function initKineticText() {
  document.querySelectorAll('.kinetic').forEach(el => {
    const t = el.textContent;
    el.innerHTML = '';
    t.split(' ').forEach((w, i) => {
      const s = document.createElement('span');
      s.className = 'kinetic-word';
      s.textContent = w + ' ';
      s.style.transitionDelay = (i * 0.08) + 's';
      el.appendChild(s);
    });
  });
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) e.target.querySelectorAll('.kinetic-word').forEach(w => w.classList.add('visible'));
    });
  }, { threshold: 0.3 });
  document.querySelectorAll('.kinetic').forEach(el => obs.observe(el));
}

function initTilt() {
  document.querySelectorAll('.product-card, .category-card, .split-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      if (e.target.closest('a,button')) return;
      const r = card.getBoundingClientRect();
      const rx = (e.clientY - r.top - r.height/2) / 18;
      const ry = (r.width/2 - (e.clientX - r.left)) / 18;
      card.style.transform = `perspective(1000px) rotateX(${rx}deg) rotateY(${ry}deg) scale3d(1.02,1.02,1.02)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1,1,1)';
    });
  });
}

function animateHero() {
  [
    ['.hero-tag', 200], ['.hero-title', 400], ['.hero-subtitle', 700], ['.hero-cta', 1000]
  ].forEach(([sel, d]) => {
    const el = document.querySelector(sel);
    if (!el) return;
    setTimeout(() => {
      el.style.transition = 'all 1s cubic-bezier(0.25,0.46,0.45,0.94)';
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    }, d);
  });
}

/* Category click → scroll to products + filter */
function initCategoryFilter() {
  document.querySelectorAll('.category-card').forEach(card => {
    card.style.cursor = 'pointer';
    card.addEventListener('click', () => {
      const h3 = card.querySelector('h3');
      const name = h3 ? h3.textContent.toLowerCase() : '';
      let filter = 'all';
      if (name.includes('necklace') || name.includes('chain')) filter = 'necklace';
      else if (name.includes('earring')) filter = 'earring';
      else if (name.includes('ring') && !name.includes('toe')) filter = 'ring';
      else if (name.includes('bracelet') || name.includes('bangle') || name.includes('kada')) filter = 'bracelet';
      else if (name.includes('bridal') || name.includes('polki')) filter = 'bridal';
      else if (name.includes("men")) filter = 'men';
      else if (name.includes('nose')) filter = 'nose';
      else if (name.includes('anklet') || name.includes('toe')) filter = 'anklet';
      else if (name.includes('kids')) filter = 'kids';
      else if (name.includes('religious') || name.includes('coin')) filter = 'religious';
      else if (name.includes('tikka') || name.includes('matha')) filter = 'tikka';
      else if (name.includes('waist') || name.includes('body')) filter = 'body';

      // Scroll to featured products section
      const productsSection = document.querySelector('.product-grid');
      if (productsSection) {
        productsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }

      // Highlight matching products briefly
      document.querySelectorAll('.product-card').forEach(p => {
        const cat = p.dataset.category || '';
        if (filter === 'all' || cat === filter || cat.includes(filter)) {
          p.style.display = '';
          p.style.outline = '2px solid rgba(212,175,55,0.5)';
          setTimeout(() => p.style.outline = '', 2000);
        } else {
          // still show all, just highlight matches
          p.style.display = '';
        }
      });
    });
  });
}

/* Product Modal */
function initProductModal() {
  document.querySelectorAll('.product-card').forEach(card => {
    card.addEventListener('click', e => {
      if (e.target.closest('a')) return;
      const img = card.querySelector('.product-img-wrap img');
      const type = card.querySelector('.product-type');
      const title = card.querySelector('.product-title');
      const details = card.querySelector('.product-details');
      const price = card.querySelector('.product-price');
      document.getElementById('modalImg').src = img?.src || '';
      document.getElementById('modalImg').alt = title?.textContent || '';
      document.getElementById('modalType').textContent = type?.textContent || '';
      document.getElementById('modalTitle').textContent = title?.textContent || '';
      document.getElementById('modalDetails').textContent = details?.textContent || '';
      document.getElementById('modalPrice').textContent = price?.textContent || '';
      document.getElementById('productModal').style.display = 'flex';
      document.body.style.overflow = 'hidden';
    });
  });
}

function closeProductModal() {
  const m = document.getElementById('productModal');
  if (m) { m.style.display = 'none'; document.body.style.overflow = ''; }
}

document.addEventListener('keydown', e => { if (e.key === 'Escape') closeProductModal(); });

document.addEventListener('click', e => {
  if (e.target.classList.contains('filter-tab')) {
    document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
    e.target.classList.add('active');
    const filter = e.target.dataset.filter;
    document.querySelectorAll('[data-category]').forEach(card => {
      // only filter diamond section cards
      if (card.closest('#diamonds')) {
        card.style.display = (filter === 'all' || card.dataset.category === filter) ? '' : 'none';
      }
    });
  }
});
