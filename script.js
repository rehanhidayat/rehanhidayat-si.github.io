/* script.js (upgraded)
   - Preloader
   - Theme toggle persisted
   - Mesh background + lightweight particles
   - Cursor trail
   - Parallax tilt on hero card and project hover
   - Reveal on scroll with stagger + elastic easing
   - Progress bars animate on reveal
   - Ripple effect for buttons
   - Typing effect
   - Smooth nav scrolling + mobile menu
   - Contact form basic validation (demo)
*/

/* ----------------- helpers ----------------- */
const $ = (s, root = document) => root.querySelector(s);
const $$ = (s, root = document) => Array.from((root || document).querySelectorAll(s));

/* ----------------- preloader ----------------- */
window.addEventListener('load', () => {
  const pre = $('#preloader');
  if(pre){
    pre.style.opacity = '0';
    pre.setAttribute('aria-hidden','true');
    setTimeout(()=> pre.remove(), 700);
  }
});

/* ----------------- theme toggle ----------------- */
const THEME = 'rh_theme_v2';
const root = document.documentElement;
const themeBtn = $('#themeBtn');

function applyTheme(mode){
  if(mode === 'light'){ root.setAttribute('data-theme','light'); themeBtn.textContent = '☀️'; themeBtn.setAttribute('aria-pressed','true'); }
  else { root.removeAttribute('data-theme'); themeBtn.textContent = '🌙'; themeBtn.setAttribute('aria-pressed','false'); }
  localStorage.setItem(THEME, mode);
}
(function initTheme(){
  const saved = localStorage.getItem(THEME);
  if(saved) applyTheme(saved);
  else applyTheme('dark');
})();
themeBtn.addEventListener('click', ()=> {
  const cur = root.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
  applyTheme(cur === 'light' ? 'dark' : 'light');
});

/* ----------------- mobile menu ----------------- */
const mobileBtn = $('#mobileBtn');
const navList = $('#navList');
if(mobileBtn){
  mobileBtn.addEventListener('click', () => navList.classList.toggle('show'));
  navList.addEventListener('click', e => { if(e.target.tagName === 'A') navList.classList.remove('show'); });
}

/* ----------------- smooth nav scroll ----------------- */
document.addEventListener('click', (e) => {
  const a = e.target.closest('a[href^="#"]');
  if(!a) return;
  const href = a.getAttribute('href');
  if(href === '#') return;
  e.preventDefault();
  const target = document.querySelector(href);
  if(target) target.scrollIntoView({behavior:'smooth', block:'start'});
});

/* ----------------- typing effect ----------------- */
const typed = $('#typedText');
const words = ['Graphic Designer', 'UI/UX Designer', 'Web Creator', 'Product Designer'];
let wi = 0, ci = 0, del = false;
function typingTick(){
  if(!typed) return;
  const w = words[wi % words.length];
  typed.textContent = w.slice(0, ci);
  if(!del){ ci++; if(ci > w.length){ del = true; setTimeout(typingTick, 900); return; } }
  else { ci--; if(ci === 0){ del = false; wi++; } }
  setTimeout(typingTick, del ? 50 : 90);
}
typingTick();

/* ----------------- cursor trail ----------------- */
const cursor = $('#cursorTrail');
if(cursor){
  let last = {x: window.innerWidth/2, y: window.innerHeight/2};
  let pos = {...last};
  document.addEventListener('mousemove', (e) => { last.x = e.clientX; last.y = e.clientY; });
  function follow(){
    pos.x += (last.x - pos.x) * 0.18;
    pos.y += (last.y - pos.y) * 0.18;
    cursor.style.transform = `translate(${pos.x}px, ${pos.y}px)`;
    requestAnimationFrame(follow);
  }
  follow();
}

/* ----------------- progress top update ----------------- */
const progressTop = $('#progressTop');
function updateProgress(){
  const doc = document.documentElement;
  const scrolled = doc.scrollTop / (doc.scrollHeight - doc.clientHeight);
  if(progressTop) progressTop.style.width = `${Math.min(100, Math.max(0, scrolled * 100))}%`;
}
document.addEventListener('scroll', () => requestAnimationFrame(updateProgress));
updateProgress();

/* ----------------- reveal on scroll with stagger & elastics ----------------- */
const revealEls = $$('[data-reveal]');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if(entry.isIntersecting){
      const el = entry.target;
      const idx = Number(el.getAttribute('data-index') || 0);
      // stagger effect
      el.style.transitionDelay = `${idx * 80}ms`;
      el.classList.add('visible');
      revealObserver.unobserve(el);
    }
  });
}, {threshold: 0.14});
revealEls.forEach(el => revealObserver.observe(el));

/* ----------------- progress bars ----------------- */
const progressEls = $$('.progress');
const progObs = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if(entry.isIntersecting){
      const p = entry.target;
      const v = Number(p.getAttribute('data-value')) || 0;
      const bar = p.querySelector('span');
      if(bar) bar.style.width = `${v}%`;
      progObs.unobserve(p);
    }
  });
}, {threshold: 0.35});
progressEls.forEach(p => progObs.observe(p));

/* ----------------- ripple on buttons ----------------- */
document.addEventListener('pointerdown', (e) => {
  const r = e.target.closest('.ripple');
  if(!r) return;
  const rect = r.getBoundingClientRect();
  const after = r;
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  // create ripple pseudo by updating ::after via transform with inline style
  after.style.setProperty('--ripple-x', x + 'px');
  after.style.setProperty('--ripple-y', y + 'px');
  // animate by toggling class
  after.classList.remove('ripple-animate');
  void after.offsetWidth;
  after.classList.add('ripple-animate');
});

/* CSS hook: .ripple::after uses --ripple-x/y; class ripple-animate triggers transform (handled in CSS) */
/* (CSS included in style.css uses .ripple::after with transform: translate and scale) */

/* ----------------- tilt (pointer parallax) for elements with [data-tilt] ----------------- */
function setupTilt(selector){
  const nodes = $$(selector);
  nodes.forEach(el => {
    el.addEventListener('pointermove', (ev) => {
      const rect = el.getBoundingClientRect();
      const px = (ev.clientX - rect.left) / rect.width;
      const py = (ev.clientY - rect.top) / rect.height;
      const rotateX = (py - 0.5) * 10; // tilt intensity
      const rotateY = (px - 0.5) * -12;
      el.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(8px)`;
    });
    el.addEventListener('pointerleave', () => {
      el.style.transform = '';
    });
  });
}
setupTilt('[data-tilt]');

/* also apply tilt-on-hover for project cards */
setupTilt('.project');

/* ----------------- lightweight particles (canvas) ----------------- */
(function particles(){
  const canvas = document.getElementById('particleCanvas');
  if(!canvas) return;
  const ctx = canvas.getContext('2d');
  let w = canvas.width = innerWidth;
  let h = canvas.height = innerHeight;
  const particles = [];
  const count = Math.max(28, Math.floor((w*h) / 90000)); // scale by screen
  for(let i=0;i<count;i++){
    particles.push({
      x: Math.random()*w,
      y: Math.random()*h,
      r: 0.6 + Math.random()*2.2,
      vx: (Math.random()-0.5)*0.2,
      vy: -0.15 - Math.random()*0.35,
      life: Math.random()*1.2
    });
  }
  function resize(){ w = canvas.width = innerWidth; h = canvas.height = innerHeight; }
  window.addEventListener('resize', resize);
  function draw(){
    ctx.clearRect(0,0,w,h);
    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.life -= 0.002;
      if(p.y < -20 || p.life <= 0 || p.x < -50 || p.x > w+50){
        p.x = Math.random()*w;
        p.y = h + 20 + Math.random()*60;
        p.vx = (Math.random()-0.5)*0.2;
        p.vy = -0.15 - Math.random()*0.35;
        p.r = 0.6 + Math.random()*2.2;
        p.life = 1 + Math.random()*1.2;
      }
      const g = ctx.createRadialGradient(p.x,p.y,0,p.x,p.y,p.r*8);
      g.addColorStop(0, 'rgba(255,255,255,0.06)');
      g.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(p.x,p.y,p.r*4,0,Math.PI*2);
      ctx.fill();
    });
    requestAnimationFrame(draw);
  }
  draw();
})();

/* ----------------- mesh canvas (animated nodes & lines) ----------------- */
(function mesh(){
  const canvas = document.getElementById('meshCanvas');
  if(!canvas) return;
  const ctx = canvas.getContext('2d');
  let w = canvas.width = innerWidth;
  let h = canvas.height = innerHeight;
  window.addEventListener('resize', ()=>{ w = canvas.width = innerWidth; h = canvas.height = innerHeight; init(); });

  let points = [];
  function init(){
    points = [];
    const gap = Math.max(90, Math.min(150, Math.floor(Math.min(w,h)/10)));
    for(let x=0;x<w;x+=gap){
      for(let y=0;y<h;y+=gap){
        points.push({ox:x,oy:y,x:x+(Math.random()-0.5)*gap*0.6,y:y+(Math.random()-0.5)*gap*0.6,t:Math.random()*Math.PI*2,s:0.6+Math.random()*1.2});
      }
    }
  }
  function draw(){
    ctx.clearRect(0,0,w,h);
    // background soft gradient
    const g = ctx.createLinearGradient(0,0,w,h);
    g.addColorStop(0, 'rgba(8,10,30,0.12)');
    g.addColorStop(0.5, 'transparent');
    g.addColorStop(1, 'rgba(6,12,30,0.12)');
    ctx.fillStyle = g;
    ctx.fillRect(0,0,w,h);

    for(let i=0;i<points.length;i++){
      const p = points[i];
      p.t += 0.006 * p.s;
      const nx = p.ox + Math.sin(p.t)*18*p.s;
      const ny = p.oy + Math.cos(p.t)*16*p.s;
      // connect neighbors
      for(let j=i+1;j<Math.min(i+6, points.length); j++){
        const q = points[j];
        const d = Math.hypot(nx - q.x, ny - q.y);
        if(d < 140){
          ctx.strokeStyle = `rgba(255,255,255,${0.015 + (1 - d/140)*0.05})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(nx, ny);
          ctx.lineTo(q.x, q.y);
          ctx.stroke();
        }
      }
      // node
      ctx.fillStyle = 'rgba(255,255,255,0.02)';
      ctx.beginPath();
      ctx.arc(nx, ny, 2.2, 0, Math.PI*2);
      ctx.fill();
    }
    requestAnimationFrame(draw);
  }
  init();
  draw();
})();

/* ----------------- project hover parallax (image move) ----------------- */
$$('.project').forEach(card => {
  const img = card.querySelector('img');
  card.addEventListener('pointermove', (e) => {
    const rect = card.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    if(img){
      const tx = (px - 0.5) * 12;
      const ty = (py - 0.5) * 10;
      img.style.transform = `translate(${tx}px, ${ty}px) scale(1.05)`;
      img.style.transition = 'transform 220ms ease-out';
    }
  });
  card.addEventListener('pointerleave', () => {
    if(img){ img.style.transform = ''; img.style.transition = 'transform 420ms ease'; }
  });
});

/* ----------------- ripple CSS toggling (for ::after animation) ----------------- */
document.addEventListener('animationend', (e) => {
  if(e.target.classList && e.target.classList.contains('ripple-animate')){
    // clear after animation completes to reset
    e.target.classList.remove('ripple-animate');
  }
});

/* ----------------- contact form (demo) ----------------- */
const contactForm = $('#contactForm');
const formNote = $('#formNote');
if(contactForm){
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = contactForm.name?.value?.trim();
    const email = contactForm.email?.value?.trim();
    const message = contactForm.message?.value?.trim();
    if(!name || !email || !message){ formNote.textContent = 'Mohon isi semua bidang.'; return; }
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(!re.test(email)){ formNote.textContent = 'Masukkan email valid.'; return; }
    formNote.textContent = 'Terima kasih! Pesan diterima (demo).';
    contactForm.reset();
    setTimeout(()=> formNote.textContent = '', 4000);
  });
}

/* ----------------- footer year ----------------- */
const yearEl = $('#year');
if(yearEl) yearEl.textContent = new Date().getFullYear();

/* ----------------- accessibility/perf note ----------------- */
console.info('Portofolio (upgraded) loaded. Avatar: DiceBear character SVG. For production, connect contact form to backend (Formspree/Netlify) and serve assets via CDN for best perf.');
