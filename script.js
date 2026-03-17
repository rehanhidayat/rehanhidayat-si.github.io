/* =============================================
   script.js — Rehan Hidayat Portfolio
   ============================================= */

/* ── PRELOADER ── */
window.addEventListener('load', () => {
  const p = document.getElementById('preloader');
  if (!p) return;
  p.style.opacity = '0';
  p.style.transition = 'opacity 500ms';
  setTimeout(() => p.remove(), 520);
});

/* ── SCROLL PROGRESS BAR ── */
window.addEventListener('scroll', () => {
  const scrolled = document.documentElement.scrollTop;
  const total = document.documentElement.scrollHeight - window.innerHeight;
  const bar = document.getElementById('progressTop');
  if (bar) bar.style.width = (scrolled / total * 100) + '%';
});

/* ── THEME TOGGLE ── */
const themeBtn = document.getElementById('themeBtn');
let dark = true;
if (themeBtn) {
  themeBtn.addEventListener('click', () => {
    dark = !dark;
    document.documentElement.dataset.theme = dark ? '' : 'light';
    themeBtn.textContent = dark ? '🌙' : '☀️';
    themeBtn.setAttribute('aria-pressed', String(!dark));
  });
}

/* ── MOBILE MENU ── */
const mobileBtn = document.getElementById('mobileBtn');
if (mobileBtn) {
  mobileBtn.addEventListener('click', () => {
    document.getElementById('navList').classList.toggle('show');
  });
}

/* ── REVEAL ON SCROLL (IntersectionObserver) ── */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');

      // Animate skill progress bars inside revealed elements
      entry.target.querySelectorAll('.progress').forEach(bar => {
        const val = bar.dataset.value;
        if (val) bar.querySelector('span').style.width = val + '%';
      });

      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('[data-reveal]').forEach(el => revealObserver.observe(el));

/* ── CURSOR TRAIL ── */
const trail = document.getElementById('cursorTrail');
if (trail) {
  document.addEventListener('mousemove', e => {
    trail.style.left = e.clientX + 'px';
    trail.style.top  = e.clientY + 'px';
  });
}

/* ── TYPING EFFECT ── */
const phrases = [
  'Graphic Designer 🎨',
  'UI/UX Enthusiast ✏️',
  'Web Developer 🌐',
  'Creative Thinker 💡'
];
let phraseIndex = 0;
let charIndex   = 0;
let isDeleting  = false;

const typedEl = document.getElementById('typedText');
if (typedEl) {
  setInterval(() => {
    const phrase = phrases[phraseIndex];
    if (!isDeleting) {
      typedEl.textContent = phrase.slice(0, ++charIndex);
      if (charIndex === phrase.length) isDeleting = true;
    } else {
      typedEl.textContent = phrase.slice(0, --charIndex);
      if (charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
      }
    }
  }, 80);
}

/* ── FOOTER YEAR ── */
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

/* ── CONTACT FORM ── */
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const note = document.getElementById('formNote');
    note.textContent = '✅ Pesan terkirim! Terima kasih, Rehan akan segera membalas.';
    this.reset();
    setTimeout(() => { note.textContent = ''; }, 5000);
  });
}

/* ── RIPPLE EFFECT ── */
document.querySelectorAll('.ripple').forEach(btn => {
  btn.addEventListener('click', function (e) {
    const rect = this.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top  - size / 2;
    const ripple = document.createElement('span');
    ripple.style.cssText = `
      position:absolute; border-radius:50%;
      width:${size}px; height:${size}px;
      left:${x}px; top:${y}px;
      background:rgba(255,255,255,0.25);
      transform:scale(0); animation:rippleAnim 600ms ease forwards;
      pointer-events:none;
    `;
    this.appendChild(ripple);
    setTimeout(() => ripple.remove(), 620);
  });
});

// Inject ripple keyframes once
if (!document.getElementById('rippleStyle')) {
  const style = document.createElement('style');
  style.id = 'rippleStyle';
  style.textContent = `@keyframes rippleAnim { to { transform:scale(2.5); opacity:0; } }`;
  document.head.appendChild(style);
}

/* ── CARD TILT (pointer parallax) ── */
document.querySelectorAll('[data-tilt]').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const cx = rect.left + rect.width  / 2;
    const cy = rect.top  + rect.height / 2;
    const dx = (e.clientX - cx) / (rect.width  / 2);
    const dy = (e.clientY - cy) / (rect.height / 2);
    card.style.transform = `perspective(800px) rotateY(${dx * 8}deg) rotateX(${-dy * 8}deg) scale(1.02)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});
