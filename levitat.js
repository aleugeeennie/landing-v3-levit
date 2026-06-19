/* =========================================================
   LEVITAT — V3 · JS único (index.html + thankyou.html)
   Sin popup de formulario. Forms inline → thankyou + Calendly.
   ========================================================= */

/* ---------- CONFIG ----------
   Pega aquí tu enlace de Calendly para que se incruste en la
   página de gracias. Déjalo vacío ("") para mostrar el
   placeholder + continuar por WhatsApp.                       */
const CALENDLY_URL = 'https://calendly.com/levitatcondos/llamada';
const WHATSAPP_URL = 'https://wa.me/529981708202';
const WHATSAPP_MSG = 'Hola, me interesa LEVITAT en Playa del Carmen.';
const LEAD_KEY = 'levitat-lead-v3';

(() => {
  const $  = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const prefersReduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const coarse = matchMedia('(pointer: coarse)').matches;
  const body = document.body;

  /* ---------- Scroll progress + nav state ---------- */
  const nav = $('#nav');
  const progress = $('.scroll-progress span');
  function onScroll(){
    const max = Math.max(1, document.documentElement.scrollHeight - innerHeight);
    if(progress) progress.style.width = `${(scrollY / max) * 100}%`;
    nav?.classList.toggle('is-scrolled', scrollY > 24);
  }
  addEventListener('scroll', onScroll, {passive:true}); onScroll();

  /* ---------- Mobile menu ---------- */
  const toggle = $('#navToggle');
  toggle?.addEventListener('click', () => {
    const open = !body.classList.contains('menu-open');
    body.classList.toggle('menu-open', open);
    toggle.setAttribute('aria-expanded', String(open));
  });
  $$('#mobilePanel a, #mobilePanel button').forEach(el => el.addEventListener('click', () => {
    body.classList.remove('menu-open');
    toggle?.setAttribute('aria-expanded', 'false');
  }));

  /* ---------- Hero cinematic reveal ---------- */
  const hero = $('.hero');
  if(hero) requestAnimationFrame(() => setTimeout(() => hero.classList.add('is-ready'), 80));

  /* ---------- Reveal observer + counters ---------- */
  const counterRun = new WeakSet();
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if(!e.isIntersecting) return;
      e.target.classList.add('is-visible');
      if(e.target.classList.contains('counter')) animateCounter(e.target);
      e.target.querySelectorAll?.('.counter').forEach(animateCounter);
    });
  }, {threshold:.14, rootMargin:'0px 0px -6% 0px'});
  $$('.reveal,.counter,[data-lines]').forEach(el => io.observe(el));

  function animateCounter(el){
    if(counterRun.has(el)) return;
    counterRun.add(el);
    const end = Number(el.dataset.count || 0);
    const dec = Number(el.dataset.dec || 0);
    const suffix = el.dataset.suffix || '';
    const prefix = el.dataset.prefix || '';
    if(prefersReduced){ el.textContent = prefix + end.toFixed(dec) + suffix; return; }
    const start = performance.now(), dur = 1300;
    const ease = t => 1 - Math.pow(1 - t, 3);
    (function tick(now){
      const p = Math.min(1, (now - start) / dur);
      const v = end * ease(p);
      el.textContent = prefix + (dec ? v.toFixed(dec) : Math.round(v)) + suffix;
      if(p < 1) requestAnimationFrame(tick);
    })(start);
  }

  /* ---------- Smooth anchor scroll ---------- */
  $$('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href');
      if(id.length < 2) return;
      const t = $(id);
      if(!t) return;
      e.preventDefault();
      const y = t.getBoundingClientRect().top + scrollY - 84;
      scrollTo({top:y, behavior:'smooth'});
    });
  });
  // CTAs that should jump to a form
  $$('.js-to-form').forEach(b => b.addEventListener('click', e => {
    e.preventDefault();
    const t = $('#contacto') || $('#hero-form');
    if(t){ const y = t.getBoundingClientRect().top + scrollY - 80; scrollTo({top:y, behavior:'smooth'}); }
  }));

  /* ---------- FAQ accordion ---------- */
  $$('.faq-item').forEach(item => {
    const q = $('.faq-q', item), a = $('.faq-a', item);
    q?.addEventListener('click', () => {
      const open = item.classList.toggle('is-open');
      a.style.maxHeight = open ? a.scrollHeight + 'px' : 0;
    });
    if(item.classList.contains('is-open') && a) a.style.maxHeight = a.scrollHeight + 'px';
  });

  /* ---------- Magnetic buttons ---------- */
  if(!coarse && !prefersReduced){
    $$('.magnetic').forEach(el => {
      el.addEventListener('mousemove', e => {
        const r = el.getBoundingClientRect();
        el.style.transform = `translate3d(${(e.clientX - r.left - r.width/2)*.25}px,${(e.clientY - r.top - r.height/2)*.35}px,0)`;
      });
      el.addEventListener('mouseleave', () => el.style.transform = '');
    });
  }

  /* ---------- Particles (dark sections) ---------- */
  function initParticles(canvas){
    if(prefersReduced) return;
    const ctx = canvas.getContext('2d');
    let w=0,h=0,dpr=1,parts=[];
    const colors = ['rgba(153,217,217,.5)','rgba(255,255,255,.3)','rgba(120,121,122,.4)'];
    function resize(){
      dpr = Math.min(2, devicePixelRatio || 1);
      const r = canvas.getBoundingClientRect();
      w = canvas.width = Math.floor(r.width*dpr);
      h = canvas.height = Math.floor(r.height*dpr);
      parts = Array.from({length: Math.min(46, Math.floor(r.width/26))}, () => ({
        x:Math.random()*w, y:Math.random()*h, r:(Math.random()*1.8+.7)*dpr,
        vx:(Math.random()-.5)*.16*dpr, vy:(Math.random()-.5)*.16*dpr,
        c:colors[Math.floor(Math.random()*colors.length)]
      }));
    }
    function draw(){
      ctx.clearRect(0,0,w,h);
      parts.forEach(p => {
        p.x+=p.vx; p.y+=p.vy;
        if(p.x<0||p.x>w) p.vx*=-1;
        if(p.y<0||p.y>h) p.vy*=-1;
        ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2); ctx.fillStyle=p.c; ctx.fill();
      });
      requestAnimationFrame(draw);
    }
    resize(); draw(); addEventListener('resize', resize, {passive:true});
  }
  $$('canvas.particles').forEach(initParticles);

  /* ---------- Model carousel ---------- */
  (function(){
    const root = $('#modelCarousel');
    if(!root) return;
    const tabs   = $$('.mc-tab', root);
    const tracks = $$('.mc-track', root);
    const panels = $$('.mc-panel', root);
    const prev   = $('.mc-prev', root);
    const next   = $('.mc-next', root);
    const curEl  = $('.mc-cur', root);
    const totEl  = $('.mc-total', root);
    const reduce = prefersReduced;
    let model = tabs[0]?.dataset.model || 'estudio';
    const index = {}; tabs.forEach(t => index[t.dataset.model] = 0);
    let timer = null;
    const track = () => tracks.find(t => t.dataset.model === model);
    const slides = () => $$('.mc-slide', track());
    function update(){
      const n = slides().length, i = index[model];
      track().style.transform = `translateX(-${i*100}%)`;
      if(curEl) curEl.textContent = i+1;
      if(totEl) totEl.textContent = n;
    }
    function go(i){ const n = slides().length; index[model] = (i+n)%n; update(); }
    function step(d){ go(index[model]+d); }
    function restart(){ if(reduce) return; clearInterval(timer); timer = setInterval(() => step(1), 5500); }
    function switchModel(m){
      if(m === model) return;
      model = m;
      tabs.forEach(t => t.classList.toggle('is-active', t.dataset.model === m));
      tracks.forEach(t => { const on = t.dataset.model === m; t.hidden = !on; });
      panels.forEach(p => p.hidden = p.dataset.model !== m);
      update(); restart();
    }
    tabs.forEach(t => t.addEventListener('click', () => switchModel(t.dataset.model)));
    prev?.addEventListener('click', () => { step(-1); restart(); });
    next?.addEventListener('click', () => { step(1); restart(); });
    root.addEventListener('mouseenter', () => clearInterval(timer));
    root.addEventListener('mouseleave', restart);
    let sx = null;
    const stage = $('.mc-stage', root);
    stage?.addEventListener('touchstart', e => sx = e.touches[0].clientX, {passive:true});
    stage?.addEventListener('touchend', e => {
      if(sx === null) return;
      const dx = e.changedTouches[0].clientX - sx;
      if(Math.abs(dx) > 45){ step(dx<0?1:-1); restart(); }
      sx = null;
    }, {passive:true});
    update(); restart();
  })();

  /* ---------- Lead forms → thankyou ---------- */
  $$('form.lead-form').forEach(form => {
    form.addEventListener('submit', e => {
      e.preventDefault();
      if(!form.checkValidity()){ form.reportValidity(); return; }
      const data = Object.fromEntries(new FormData(form).entries());
      try { sessionStorage.setItem(LEAD_KEY, JSON.stringify(data)); } catch(_){}
      window.location.href = 'thankyou.html';
    });
  });

  /* ---------- THANK YOU PAGE ---------- */
  if(body.classList.contains('thankyou-page')){
    // WhatsApp links
    const waBtn = $('#tyWhatsapp');
    if(waBtn) waBtn.href = `${WHATSAPP_URL}?text=${encodeURIComponent('Hola, acabo de enviar mi solicitud en Levitat. Me gustaría agendar mi visita.')}`;

    // Calendly embed (or placeholder)
    const slot = $('#calendlySlot');
    if(slot && CALENDLY_URL){
      slot.innerHTML = '';
      const widget = document.createElement('div');
      widget.className = 'calendly-inline-widget';
      widget.style.minWidth = '320px';
      widget.style.height = '100%';
      widget.setAttribute('data-url', `${CALENDLY_URL}?hide_gdpr_banner=1&background_color=161a1b&text_color=ffffff&primary_color=99d9d9`);
      slot.appendChild(widget);
      const s = document.createElement('script');
      s.src = 'https://assets.calendly.com/assets/external/widget.js';
      s.async = true;
      document.body.appendChild(s);
    }

    // Confetti
    if(!prefersReduced) requestAnimationFrame(() => setTimeout(fireConfetti, 250));
  }

  function fireConfetti(){
    const canvas = $('#confettiCanvas');
    if(!canvas) return;
    const ctx = canvas.getContext('2d');
    const dpr = Math.min(2, devicePixelRatio || 1);
    canvas.width = innerWidth*dpr; canvas.height = innerHeight*dpr;
    canvas.classList.add('is-live');
    const colors = ['#99d9d9','#7fcccc','#ffffff','#98989a'];
    const parts = Array.from({length:140}, () => ({
      x: innerWidth*0.3*dpr + Math.random()*innerWidth*0.4*dpr, y: -20*dpr,
      vx:(Math.random()-.5)*9*dpr, vy:(Math.random()*4+3)*dpr, g:(Math.random()*.2+.18)*dpr,
      s:(Math.random()*7+4)*dpr, rot:Math.random()*Math.PI, vr:(Math.random()-.5)*.3,
      c:colors[Math.floor(Math.random()*colors.length)], life:0, max:160+Math.random()*80
    }));
    let frame = 0;
    (function tick(){
      ctx.clearRect(0,0,canvas.width,canvas.height);
      let alive = false;
      parts.forEach(p => {
        if(p.life > p.max) return;
        alive = true; p.life++; p.vy += p.g; p.x += p.vx; p.y += p.vy; p.vx *= .99; p.rot += p.vr;
        ctx.save(); ctx.globalAlpha = Math.max(0, 1 - p.life/p.max);
        ctx.translate(p.x,p.y); ctx.rotate(p.rot); ctx.fillStyle = p.c;
        ctx.fillRect(-p.s/2,-p.s/2,p.s,p.s*.6); ctx.restore();
      });
      frame++;
      if(alive && frame < 320) requestAnimationFrame(tick);
      else { ctx.clearRect(0,0,canvas.width,canvas.height); canvas.classList.remove('is-live'); }
    })();
  }
})();
