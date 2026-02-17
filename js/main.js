document.getElementById('year')?.append(String(new Date().getFullYear()));

(function(){
  document.querySelectorAll('[data-faq-category]').forEach(function(category){
    var header = category.querySelector('.faq-category-header');
    var body = category.querySelector('.faq-category-body');
    var chevron = category.querySelector('.faq-chevron');
    if(!header || !body) return;
    header.addEventListener('click', function(){
      var open = body.hidden;
      body.hidden = !open;
      header.setAttribute('aria-expanded', open ? 'true' : 'false');
      if(chevron) chevron.style.transform = open ? 'rotate(180deg)' : '';
    });
  });
})();

(function(){
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.nav');
  const menu = document.getElementById('nav-menu');
  if(!toggle || !nav || !menu) return;
  function open(){ nav.classList.add('open'); toggle.setAttribute('aria-expanded','true'); toggle.setAttribute('aria-label','Close menu'); }
  function close(){ nav.classList.remove('open'); toggle.setAttribute('aria-expanded','false'); toggle.setAttribute('aria-label','Open menu'); }
  function toggleMenu(e){ e.preventDefault(); e.stopPropagation(); nav.classList.contains('open') ? close() : open(); }
  toggle.addEventListener('click', toggleMenu, true);
  menu.querySelectorAll('a').forEach(function(a){ a.addEventListener('click', close); });
  document.addEventListener('click', function(e){ if(nav.classList.contains('open') && !nav.contains(e.target)) close(); });
  window.addEventListener('resize', function(){ if(window.innerWidth > 900) close(); });
})();

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

(function(){
  const counters = Array.from(document.querySelectorAll('.pros-count[data-count-target]'));
  if(!counters.length) return;

  const startValue = 100;
  const durationMs = 1400;
  let hasAnimated = false;

  function animateCounter(counter){
    const target = Number(counter.getAttribute('data-count-target'));
    if(!Number.isFinite(target) || target <= startValue){
      counter.textContent = `${startValue}+`;
      return;
    }

    const start = performance.now();
    function step(now){
      const progress = Math.min((now - start) / durationMs, 1);
      const value = Math.floor(startValue + (target - startValue) * progress);
      counter.textContent = `${value}+`;
      if(progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  function runCounters(){
    if(hasAnimated) return;
    hasAnimated = true;
    counters.forEach(animateCounter);
  }

  if(prefersReducedMotion){
    counters.forEach(function(counter){
      const target = Number(counter.getAttribute('data-count-target'));
      counter.textContent = `${Number.isFinite(target) ? target : startValue}+`;
    });
    return;
  }

  const badges = document.querySelector('.pros-badges');
  if(!badges){
    runCounters();
    return;
  }

  const observer = new IntersectionObserver(function(entries, obs){
    entries.forEach(function(entry){
      if(!entry.isIntersecting) return;
      runCounters();
      obs.unobserve(entry.target);
    });
  }, { threshold: 0.35 });

  observer.observe(badges);
})();

if(!prefersReducedMotion){
  const revealTargets = document.querySelectorAll('section .container > *:not(script), .card');
  revealTargets.forEach((node, index)=>{
    node.classList.add('reveal');
    node.classList.add(`reveal-delay-${index % 4}`);
  });

  const observer = new IntersectionObserver((entries, obs)=>{
    entries.forEach((entry)=>{
      if(!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      obs.unobserve(entry.target);
    });
  },{
    threshold:0.12,
    rootMargin:'0px 0px -8% 0px'
  });

  revealTargets.forEach((node)=>observer.observe(node));

  const parallaxBgs = document.querySelectorAll('[data-parallax]');
  if(parallaxBgs.length){
    const updateParallax = ()=>{
      parallaxBgs.forEach((parallaxBg)=>{
        const section = parallaxBg.closest('.parallax-section');
        if(!section) return;
        const rect = section.getBoundingClientRect();
        const progress = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
        const shift = (progress - 0.5) * 160;
        parallaxBg.style.transform = `translate3d(0, ${shift.toFixed(2)}px, 0)`;
      });
    };
    updateParallax();
    window.addEventListener('scroll', updateParallax, { passive:true });
    window.addEventListener('resize', updateParallax);
  }

  const playbook = document.querySelector('[data-playbook]');
  if(playbook){
    const line = playbook.querySelector('[data-playbook-line]');
    const progressEl = playbook.querySelector('[data-playbook-progress]');
    const ball = playbook.querySelector('[data-playbook-ball]');
    const steps = Array.from(playbook.querySelectorAll('[data-playbook-step]'));

    const clamp = (value, min, max)=>Math.min(max, Math.max(min, value));

    const updatePlaybook = ()=>{
      if(!line || !progressEl || !ball || steps.length === 0) return;

      const rect = playbook.getBoundingClientRect();
      const raw = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
      const progress = clamp(raw, 0, 1);
      const isMobile = window.matchMedia('(max-width: 900px)').matches;

      if(isMobile){
        const travel = playbook.offsetHeight;
        const y = progress * travel;
        progressEl.style.height = `${(progress * 100).toFixed(2)}%`;
        ball.style.top = `${Math.min(y, travel)}px`;
      }else{
        const travel = line.clientWidth;
        const x = progress * travel;
        progressEl.style.width = `${(progress * 100).toFixed(2)}%`;
        ball.style.left = `${x.toFixed(1)}px`;
      }

      const maxIndex = steps.length - 1;
      steps.forEach((step, index)=>{
        const threshold = maxIndex === 0 ? 0 : index / maxIndex;
        step.classList.toggle('is-active', progress >= threshold - 0.06);
      });
    };

    updatePlaybook();
    window.addEventListener('scroll', updatePlaybook, { passive:true });
    window.addEventListener('resize', updatePlaybook);
  }
}
