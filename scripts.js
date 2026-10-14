/**
 * DHIRAJ SUNIL MAHAJAN - CREATIVE MOTION & INTERACTION ENGINE
 * ---------------------------------------------------------------------
 * High-performance 3D Canvas Constellation, Rotating Typewriter Engine,
 * First-Screen Compact Cards, Interactive Case Study Tabs, Theme Toggle,
 * Custom Desktop Cursor, and Back-to-Top Navigation.
 */

document.addEventListener('DOMContentLoaded', () => {
  initHeroCanvas();
  initHeadlineAnimation();
  initThemeToggle();
  initCustomCursor();
  initBackToTop();
  renderCreativePortfolio();
  initCaseStudyTabs();
  initClipboardToast();
  initScrollSpy();
  initMobileMenu();
  initContactForm();
  initCardTilt();
  initAnimatedCounters();
  initScrollReveals();

  if (window.lucide) {
    lucide.createIcons();
  }
});

/* ==========================================================================
   1. INTERACTIVE 3D DATA CONSTELLATION & PARTICLE FIELD
   ========================================================================== */
function initHeroCanvas() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const ctx = canvas.getContext('2d');
  let width, height;
  let animationFrameId;
  let mouse = { x: null, y: null, targetX: null, targetY: null, radius: 150 };

  const particles = [];
  const particleCount = window.innerWidth < 768 ? 40 : 80;
  const colors = ['#39D9FF', '#4F8CFF', '#9B5CFF', '#39D9FF', '#FFFFFF'];

  function resize() {
    width = canvas.width = canvas.parentElement.offsetWidth || window.innerWidth;
    height = canvas.height = canvas.parentElement.offsetHeight || 650;
  }
  resize();
  window.addEventListener('resize', resize, { passive: true });

  window.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    if (e.clientY >= rect.top && e.clientY <= rect.bottom) {
      mouse.targetX = e.clientX - rect.left;
      mouse.targetY = e.clientY - rect.top;
    }
  }, { passive: true });

  window.addEventListener('mouseleave', () => {
    mouse.targetX = null;
    mouse.targetY = null;
  });

  class DataParticle {
    constructor() {
      this.reset();
    }
    reset() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.z = Math.random() * 2 + 0.5;
      this.vx = (Math.random() - 0.5) * 0.6 * this.z;
      this.vy = (Math.random() - 0.5) * 0.6 * this.z;
      this.radius = Math.random() * 2 + 1.2;
      this.color = colors[Math.floor(Math.random() * colors.length)];
      this.baseAlpha = Math.random() * 0.5 + 0.3;
    }
    update() {
      if (prefersReducedMotion) return;

      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0) this.x = width;
      if (this.x > width) this.x = 0;
      if (this.y < 0) this.y = height;
      if (this.y > height) this.y = 0;

      if (mouse.x !== null && mouse.y !== null) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouse.radius) {
          const force = (mouse.radius - dist) / mouse.radius;
          this.x -= (dx / dist) * force * 3 * this.z;
          this.y -= (dy / dist) * force * 3 * this.z;
        }
      }
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius * (this.z * 0.8), 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.globalAlpha = this.baseAlpha;
      ctx.shadowBlur = 10;
      ctx.shadowColor = this.color;
      ctx.fill();
      ctx.shadowBlur = 0;
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new DataParticle());
  }

  function render() {
    ctx.clearRect(0, 0, width, height);

    if (mouse.targetX !== null) {
      if (mouse.x === null) {
        mouse.x = mouse.targetX;
        mouse.y = mouse.targetY;
      } else {
        mouse.x += (mouse.targetX - mouse.x) * 0.05;
        mouse.y += (mouse.targetY - mouse.y) * 0.05;
      }
    } else {
      mouse.x = null;
      mouse.y = null;
    }

    if (mouse.x !== null && mouse.y !== null) {
      const cursorGlow = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, mouse.radius);
      cursorGlow.addColorStop(0, 'rgba(57, 217, 255, 0.12)');
      cursorGlow.addColorStop(0.5, 'rgba(155, 92, 255, 0.05)');
      cursorGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = cursorGlow;
      ctx.beginPath();
      ctx.arc(mouse.x, mouse.y, mouse.radius, 0, Math.PI * 2);
      ctx.fill();
    }

    const maxDist = 115;
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < maxDist) {
          const avgZ = (particles[i].z + particles[j].z) / 2;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = particles[i].color;
          ctx.globalAlpha = (1 - dist / maxDist) * 0.22 * (avgZ / 1.5);
          ctx.lineWidth = 0.75 * (avgZ / 1.4);
          ctx.stroke();
        }
      }
    }

    particles.forEach(p => {
      p.update();
      p.draw();
    });

    if (!prefersReducedMotion) {
      animationFrameId = requestAnimationFrame(render);
    }
  }

  render();
}

/* ==========================================================================
   2. ROTATING MULTI-PHRASE TYPEWRITER ENGINE (EXACT 4 TITLES)
   ========================================================================== */
function initHeadlineAnimation() {
  const headlineEl = document.getElementById('typing-role-text');
  if (!headlineEl) return;

  const phrases = [
    "AI & Data Science Student",
    "Python Developer",
    "Data Analysis Enthusiast",
    "Aspiring Data Scientist"
  ];
  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  const typeSpeed = 75;
  const backSpeed = 45;
  const pauseEnd = 2000;

  function loop() {
    const currentPhrase = phrases[phraseIndex];
    if (isDeleting) {
      headlineEl.textContent = currentPhrase.substring(0, charIndex - 1);
      charIndex--;
    } else {
      headlineEl.textContent = currentPhrase.substring(0, charIndex + 1);
      charIndex++;
    }

    if (!isDeleting && charIndex === currentPhrase.length) {
      isDeleting = true;
      setTimeout(loop, pauseEnd);
      return;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      setTimeout(loop, 400);
      return;
    }

    const currentSpeed = isDeleting ? backSpeed : typeSpeed;
    setTimeout(loop, currentSpeed);
  }

  setTimeout(loop, 500);
}

/* ==========================================================================
   3. LIGHT / DARK THEME TOGGLE
   ========================================================================== */
function initThemeToggle() {
  const themeToggles = document.querySelectorAll('.theme-toggle-btn');
  const html = document.documentElement;

  const savedTheme = localStorage.getItem('dhiraj-theme') || 'dark';
  if (savedTheme === 'light') {
    html.classList.add('light');
  } else {
    html.classList.remove('light');
  }
  updateThemeIcons();

  themeToggles.forEach(btn => {
    btn.addEventListener('click', () => {
      html.classList.toggle('light');
      const isLight = html.classList.contains('light');
      localStorage.setItem('dhiraj-theme', isLight ? 'light' : 'dark');
      updateThemeIcons();
    });
  });

  function updateThemeIcons() {
    const isLight = html.classList.contains('light');
    themeToggles.forEach(btn => {
      btn.innerHTML = isLight
        ? '<i data-lucide="moon" class="w-4 h-4 text-purple-600"></i>'
        : '<i data-lucide="sun" class="w-4 h-4 text-amber-300"></i>';
    });
    if (window.lucide) {
      lucide.createIcons();
    }
  }
}

/* ==========================================================================
   4. CUSTOM DESKTOP CURSOR (SMOOTH LAGGING RING)
   ========================================================================== */
function initCustomCursor() {
  const dot = document.getElementById('custom-cursor-dot');
  const ring = document.getElementById('custom-cursor-ring');
  if (!dot || !ring) return;

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced || window.matchMedia('(pointer: coarse)').matches) {
    dot.style.display = 'none';
    ring.style.display = 'none';
    return;
  }

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let ringX = mouseX;
  let ringY = mouseY;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
  }, { passive: true });

  function renderCursor() {
    ringX += (mouseX - ringX) * 0.15;
    ringY += (mouseY - ringY) * 0.15;
    ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`;
    requestAnimationFrame(renderCursor);
  }
  requestAnimationFrame(renderCursor);

  function attachHoverListeners() {
    const targets = document.querySelectorAll('a, button, input, textarea, .hero-card-compact, .glass-panel, .cyber-tab-btn, .achievement-card');
    targets.forEach(el => {
      el.addEventListener('mouseenter', () => ring.classList.add('cursor-hover'));
      el.addEventListener('mouseleave', () => ring.classList.remove('cursor-hover'));
    });
  }
  setTimeout(attachHoverListeners, 600);
}

/* ==========================================================================
   5. BACK TO TOP BUTTON
   ========================================================================== */
function initBackToTop() {
  const btn = document.getElementById('back-to-top-btn');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    if (window.pageYOffset > 380) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ==========================================================================
   6. DYNAMIC DATA RENDERING (HERO, CARDS, SKILLS, CASE STUDY, CODECHEF)
   ========================================================================== */
function renderCreativePortfolio() {
  const data = window.portfolioData;
  if (!data) return;

  // Personal Text
  document.querySelectorAll('.data-fullName').forEach(el => el.textContent = data.personal.fullName);
  document.querySelectorAll('.data-tagline').forEach(el => el.textContent = data.personal.tagline);
  document.querySelectorAll('.data-shortIntro').forEach(el => el.textContent = data.personal.shortIntro);
  document.querySelectorAll('.data-cgpa').forEach(el => el.textContent = data.personal.cgpa);
  document.querySelectorAll('.data-branch').forEach(el => el.textContent = data.personal.branch);
  document.querySelectorAll('.data-year').forEach(el => el.textContent = data.personal.year);
  document.querySelectorAll('.data-location').forEach(el => el.textContent = data.personal.location);
  document.querySelectorAll('.data-institution').forEach(el => el.textContent = data.personal.institution);

  // Email Links
  document.querySelectorAll('.data-email').forEach(el => {
    el.textContent = data.personal.email;
    if (el.tagName === 'A') el.href = `mailto:${data.personal.email}`;
  });

  // Social Links
  document.querySelectorAll('.data-github-link').forEach(el => el.href = data.personal.socialLinks.github);
  document.querySelectorAll('.data-linkedin-link').forEach(el => el.href = data.personal.socialLinks.linkedin);
  document.querySelectorAll('.data-codechef-link').forEach(el => el.href = data.personal.socialLinks.codechef);

  // Resume Download Links
  document.querySelectorAll('.data-resume-download-jpg').forEach(el => {
    el.href = data.personal.resumeFile || 'Dhiraj_resume.jpg';
    el.setAttribute('download', 'Dhiraj_resume.jpg');
  });
  document.querySelectorAll('.data-resume-download-pdf').forEach(el => {
    el.href = data.personal.resumePdf || 'Dhiraj_Sunil_Mahajan_Resume.pdf';
    el.setAttribute('download', 'Dhiraj_Sunil_Mahajan_Resume.pdf');
  });
  document.querySelectorAll('.data-resume-view').forEach(el => {
    el.href = data.personal.resumeFile || 'Dhiraj_resume.jpg';
    el.target = '_blank';
    el.rel = 'noopener noreferrer';
  });

  // Portrait Photo with cache-busting
  const portraitImg = document.getElementById('hero-portrait');
  if (portraitImg) {
    portraitImg.src = data.personal.profilePhoto + '?v=' + Date.now();
  }

  // FIRST SCREEN: 4 COMPACT CARDS WITH RICH GRAPHICS
  const heroCardsContainer = document.getElementById('hero-compact-cards');
  if (heroCardsContainer && data.heroCards) {
    heroCardsContainer.innerHTML = data.heroCards.map(c => {
      let graphicHtml = '';
      if (c.id === 'academic') {
        graphicHtml = `
          <div class="flex items-center gap-3 my-2">
            <div class="relative w-12 h-12 flex-shrink-0 flex items-center justify-center">
              <svg class="w-12 h-12 -rotate-90 transform" viewBox="0 0 44 44">
                <defs>
                  <linearGradient id="gaugeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#39D9FF" />
                    <stop offset="100%" stop-color="#4F8CFF" />
                  </linearGradient>
                </defs>
                <circle cx="22" cy="22" r="18" fill="none" stroke="rgba(255,255,255,0.08)" stroke-width="3.5" />
                <circle cx="22" cy="22" r="18" fill="none" stroke="url(#gaugeGrad)" stroke-width="3.5" stroke-dasharray="113.1" stroke-dashoffset="14.7" stroke-linecap="round" />
              </svg>
              <div class="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span class="text-xs font-mono font-black text-white leading-none">8.7</span>
                <span class="text-[7.5px] font-mono text-cyan-400 leading-none mt-0.5">/10</span>
              </div>
            </div>
            <div>
              <h4 class="text-sm font-bold text-white tracking-tight leading-snug">${c.title}</h4>
              <p class="text-xs font-mono font-semibold text-cyan-300 mt-0.5">${c.highlight}</p>
            </div>
          </div>
        `;
      } else if (c.id === 'skills') {
        graphicHtml = `
          <div class="my-2">
            <h4 class="text-sm font-bold text-white tracking-tight leading-snug">${c.title}</h4>
            <div class="flex flex-wrap gap-1.5 mt-2">
              <span class="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-blue-500/15 text-blue-300 border border-blue-500/30 flex items-center gap-1">
                <span class="w-1.5 h-1.5 rounded-full bg-blue-400"></span>Python
              </span>
              <span class="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 flex items-center gap-1">
                <span class="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>SQL
              </span>
              <span class="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-purple-500/15 text-purple-300 border border-purple-500/30 flex items-center gap-1">
                <span class="w-1.5 h-1.5 rounded-full bg-purple-400"></span>Pandas
              </span>
              <span class="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                <span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>NumPy
              </span>
            </div>
          </div>
        `;
      } else if (c.id === 'project') {
        graphicHtml = `
          <div class="flex items-center gap-3 my-2">
            <div class="relative w-12 h-12 flex-shrink-0 flex items-center justify-center rounded-2xl bg-purple-950/60 border border-purple-500/30 text-purple-400 shadow-lg shadow-purple-500/10">
              <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="4" cy="12" r="2.5" fill="#39D9FF" stroke="#39D9FF" />
                <circle cx="12" cy="6" r="2.5" fill="#4F8CFF" stroke="#4F8CFF" />
                <circle cx="12" cy="18" r="2.5" fill="#4F8CFF" stroke="#4F8CFF" />
                <circle cx="20" cy="12" r="2.5" fill="#9B5CFF" stroke="#9B5CFF" />
                <path d="M6.5 11L9.5 7.5" stroke="#39D9FF" stroke-width="1.5" />
                <path d="M6.5 13L9.5 16.5" stroke="#39D9FF" stroke-width="1.5" />
                <path d="M14.5 7.5L17.5 11" stroke="#9B5CFF" stroke-width="1.5" />
                <path d="M14.5 16.5L17.5 13" stroke="#9B5CFF" stroke-width="1.5" />
              </svg>
            </div>
            <div>
              <h4 class="text-sm font-bold text-white tracking-tight leading-snug">${c.title}</h4>
              <p class="text-xs font-mono font-semibold text-purple-300 mt-0.5">${c.highlight}</p>
            </div>
          </div>
        `;
      } else if (c.id === 'coding') {
        graphicHtml = `
          <div class="flex items-center gap-3 my-2">
            <div class="relative w-12 h-12 flex-shrink-0 flex items-center justify-center rounded-2xl bg-amber-950/60 border border-amber-500/35 text-amber-400 shadow-lg shadow-amber-500/10">
              <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L4 6v6c0 5.5 3.5 10 8 11 4.5-1 8-5.5 8-11V6l-8-4z" stroke="#F59E0B" stroke-width="1.8" fill="rgba(245, 158, 11, 0.15)" />
                <path d="M12 7.5l1 2.2 2.4.3-1.7 1.7.4 2.4-2.1-1.1-2.1 1.1.4-2.4-1.7-1.7 2.4-.3z" fill="#F59E0B" />
              </svg>
            </div>
            <div>
              <h4 class="text-sm font-bold text-white tracking-tight leading-snug">${c.title}</h4>
              <p class="text-xs font-mono font-semibold text-amber-300 mt-0.5">${c.highlight}</p>
            </div>
          </div>
        `;
      }

      return `
        <div class="hero-card-compact flex flex-col justify-between">
          <div class="flex items-center justify-between gap-2 mb-2">
            <span class="text-[10px] font-mono uppercase font-bold text-cyan-400 tracking-wider">${c.category}</span>
            <span class="text-[9px] font-mono px-2 py-0.5 rounded-full bg-white/[0.06] text-slate-300 border border-white/[0.08]">${c.badge}</span>
          </div>
          ${graphicHtml}
          <div class="pt-2 mt-1 border-t border-white/[0.06] flex items-center justify-between text-[11px] text-slate-400">
            <span>${c.subtext}</span>
            ${c.link ? `<a href="${c.link}" target="_blank" rel="noopener noreferrer" class="text-amber-400 hover:underline flex items-center gap-1 font-mono font-bold">Visit <i data-lucide="external-link" class="w-3 h-3"></i></a>` : ''}
          </div>
        </div>
      `;
    }).join('');
  }

  // ABOUT ME: STORY, HIGHLIGHTS, ROADMAP
  const aboutStory = document.getElementById('about-story');
  if (aboutStory && data.about.story) {
    aboutStory.innerHTML = data.about.story.map(p => `
      <p class="text-slate-300 text-sm sm:text-base leading-relaxed mb-4">${p}</p>
    `).join('');
  }

  const aboutHighlights = document.getElementById('about-highlights');
  if (aboutHighlights && data.about.highlights) {
    aboutHighlights.innerHTML = data.about.highlights.map(h => `
      <div class="glass-panel p-4 flex flex-col justify-between">
        <div>
          <span class="text-[11px] font-mono uppercase font-bold text-cyan-400 tracking-wider block mb-1">${h.label}</span>
          <div class="text-base sm:text-lg font-extrabold text-white tracking-tight">${h.value}</div>
        </div>
        <p class="text-xs text-slate-400 mt-2 leading-relaxed">${h.detail}</p>
      </div>
    `).join('');
  }

  const aboutRoadmap = document.getElementById('about-roadmap');
  if (aboutRoadmap && data.about.roadmap) {
    aboutRoadmap.innerHTML = data.about.roadmap.map(item => `
      <div class="roadmap-step-card flex items-start gap-3">
        <span class="text-xs font-mono font-bold px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800/60 shrink-0">${item.step}</span>
        <div>
          <div class="flex items-center gap-2 mb-1">
            <h4 class="text-sm font-bold text-white">${item.skill}</h4>
            <span class="text-[10px] font-mono px-2 py-0.2 rounded-full bg-white/[0.06] text-slate-300">${item.status}</span>
          </div>
          <p class="text-xs text-slate-400 leading-relaxed">${item.desc}</p>
        </div>
      </div>
    `).join('');
  }

  // SKILLS SECTION: 4 CATEGORIES (PROGRAMMING, DATA ANALYSIS, DATABASE, CURRENT LEARNING)
  const skillsContainer = document.getElementById('skills-container');
  if (skillsContainer && data.skillsCategories) {
    skillsContainer.innerHTML = data.skillsCategories.map(cat => {
      return `
        <div class="glass-panel tilt-card p-6">
          <div class="flex items-center justify-between mb-4 pb-3 border-b border-white/[0.08]">
            <div class="flex items-center gap-3">
              <div class="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-400/30 flex items-center justify-center text-cyan-400">
                <i data-lucide="${cat.icon}" class="w-4 h-4"></i>
              </div>
              <h3 class="font-bold text-base sm:text-lg text-white">${cat.category}</h3>
            </div>
            <span class="text-[10px] font-mono font-semibold px-2.5 py-1 rounded-full bg-cyan-950/70 text-cyan-300 border border-cyan-500/30">
              ${cat.status}
            </span>
          </div>

          <div class="space-y-3">
            ${cat.skills.map(s => `
              <div class="p-3.5 rounded-xl bg-black/40 border border-white/[0.06] hover:border-white/[0.15] transition-colors">
                <div class="flex items-center justify-between mb-1">
                  <span class="text-sm font-bold text-white font-mono">${s.name}</span>
                  <span class="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full ${s.status === 'In Progress' ? 'bg-amber-950/80 text-amber-300 border border-amber-500/30' : 'bg-cyan-950/60 text-cyan-300 border border-cyan-500/30'}">
                    ${s.status}
                  </span>
                </div>
                <p class="text-xs text-slate-400 leading-normal">${s.desc}</p>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    }).join('');
  }

  // FEATURED PROJECT: CUSTOMER CHURN PREDICTION SYSTEM
  const proj = data.featuredProject;
  if (proj) {
    document.querySelectorAll('.data-project-title').forEach(el => el.textContent = proj.title);
    document.querySelectorAll('.data-project-subtitle').forEach(el => el.textContent = proj.subtitle);
    document.querySelectorAll('.data-project-desc').forEach(el => el.textContent = proj.description);
    document.querySelectorAll('.data-project-problem').forEach(el => el.textContent = proj.problemStatement);
    document.querySelectorAll('.data-project-dataset').forEach(el => el.textContent = proj.datasetInfo);

    const stackContainer = document.getElementById('project-tech-stack');
    if (stackContainer && proj.techStack) {
      stackContainer.innerHTML = proj.techStack.map(t => `
        <span class="pill-cyan">${t}</span>
      `).join('');
    }

    renderCaseStudyTab('overview');
  }

  // DEDICATED CODECHEF PROFILE SECTION
  const codechef = data.codechef;
  if (codechef) {
    document.querySelectorAll('.data-codechef-handle').forEach(el => el.textContent = codechef.handle);
    document.querySelectorAll('.data-codechef-rating').forEach(el => el.textContent = codechef.currentRating);
    document.querySelectorAll('.data-codechef-peak').forEach(el => el.textContent = codechef.peakRating);
    document.querySelectorAll('.data-codechef-division').forEach(el => el.textContent = codechef.division);
    document.querySelectorAll('.data-codechef-stars').forEach(el => el.textContent = codechef.stars);
    document.querySelectorAll('.data-codechef-contests').forEach(el => el.textContent = codechef.contestsParticipated);
    document.querySelectorAll('.data-codechef-contest-range').forEach(el => el.textContent = codechef.contestRange);
    document.querySelectorAll('.data-codechef-focus').forEach(el => el.textContent = codechef.problemsFocus);
    document.querySelectorAll('.data-codechef-languages').forEach(el => el.textContent = codechef.primaryLanguages);
    document.querySelectorAll('.data-codechef-note').forEach(el => el.textContent = codechef.ratingTierNote);

    const ccHighlights = document.getElementById('codechef-highlights');
    if (ccHighlights && codechef.highlights) {
      ccHighlights.innerHTML = codechef.highlights.map(h => {
        const isNumeric = /^\d+$/.test(h.value);
        return `
        <div class="p-3.5 rounded-xl bg-black/40 border border-white/[0.06] hover:border-amber-400/30 transition-colors">
          <span class="text-[10px] font-mono uppercase text-slate-500 block mb-0.5">${h.label}</span>
          <span class="text-xl font-mono font-bold text-amber-400 ${isNumeric ? 'counter-val' : ''}" ${isNumeric ? `data-counter="${h.value}"` : ''}>${h.value}</span>
          <span class="text-[10px] font-mono text-slate-400 block mt-0.5">${h.detail}</span>
        </div>
      `;
      }).join('');
    }
  }

  // ACHIEVEMENTS & CERTIFICATIONS SECTION
  const achievementsContainer = document.getElementById('achievements-container');
  if (achievementsContainer && data.achievements) {
    achievementsContainer.innerHTML = data.achievements.map(ach => {
      const hasCertificate = ach.previewImage && ach.pdfFile;
      return `
        <div class="glass-panel tilt-card p-6 sm:p-7 flex flex-col justify-between group relative overflow-hidden ${hasCertificate ? 'border-cyan-500/35' : ''}">
          <div>
            <div class="flex items-center justify-between gap-2 mb-3">
              <span class="pill-amber text-[10px]">${ach.badge}</span>
              <span class="text-xs font-mono text-slate-400">${ach.period}</span>
            </div>

            ${hasCertificate ? `
              <!-- Certificate Image Preview with Zoom Overlay -->
              <div class="mb-4 rounded-2xl overflow-hidden border border-white/[0.12] bg-black/60 relative group/img shadow-xl">
                <a href="${ach.previewImage}" target="_blank" rel="noopener noreferrer" title="Click to view full certificate">
                  <img src="${ach.previewImage}" alt="${ach.title}" class="w-full h-48 sm:h-56 object-cover object-top transition-transform duration-300 group-hover/img:scale-105" loading="lazy" />
                  <div class="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent opacity-0 group-hover/img:opacity-100 transition-opacity flex items-end justify-between p-3.5">
                    <span class="text-[11px] font-mono text-cyan-300 font-bold flex items-center gap-1.5 bg-[#080B18]/90 px-3 py-1 rounded-full border border-cyan-400/40 shadow-lg">
                      <i data-lucide="zoom-in" class="w-3.5 h-3.5"></i> Open Full View
                    </span>
                    ${ach.certificateId ? `<span class="text-[10px] font-mono text-amber-300 bg-black/80 px-2.5 py-0.5 rounded-full border border-amber-500/30">ID: ${ach.certificateId}</span>` : ''}
                  </div>
                </a>
              </div>
            ` : ''}

            <div class="flex items-start gap-3 mb-2">
              <div class="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-400/30 flex items-center justify-center text-amber-400 shrink-0 mt-0.5 shadow-md shadow-amber-500/10">
                <i data-lucide="${ach.icon}" class="w-4 h-4"></i>
              </div>
              <div>
                <h4 class="text-base font-bold text-white tracking-tight leading-snug">${ach.title}</h4>
                <span class="text-xs font-mono text-cyan-400 block mt-0.5">${ach.organization}</span>
              </div>
            </div>

            ${ach.highlight ? `
              <div class="my-2.5 px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/[0.06] text-xs font-mono text-amber-300 flex items-center gap-1.5">
                <i data-lucide="check-circle" class="w-3.5 h-3.5 text-amber-400 shrink-0"></i>
                <span class="truncate">${ach.highlight}</span>
              </div>
            ` : ''}

            <p class="text-xs sm:text-sm text-slate-300 leading-relaxed mb-4">${ach.description}</p>
          </div>

          ${hasCertificate ? `
            <div class="pt-3 mt-1 border-t border-white/[0.08] flex flex-wrap items-center justify-between gap-2.5">
              <div class="text-[11px] font-mono text-slate-400 flex items-center gap-1.5">
                <span class="w-2 h-2 rounded-full bg-emerald-400"></span>
                <span>Verified PDF</span>
                ${ach.certificateId ? `&bull; <code class="text-cyan-300 text-[10px]">${ach.certificateId}</code>` : ''}
              </div>
              <div class="flex items-center gap-2">
                <a href="${ach.previewImage}" target="_blank" rel="noopener noreferrer" class="btn-outline-glass text-xs py-1.5 px-3">
                  <i data-lucide="eye" class="w-3.5 h-3.5 text-cyan-400 mr-1"></i>
                  <span>View</span>
                </a>
                <a href="${ach.pdfFile}" download="${ach.pdfFile}" class="btn-primary-glow text-xs py-1.5 px-3.5">
                  <i data-lucide="download" class="w-3.5 h-3.5 mr-1"></i>
                  <span>Download PDF</span>
                </a>
              </div>
            </div>
          ` : (ach.link ? `
            <div class="pt-3 mt-1 border-t border-white/[0.08] flex items-center justify-end">
              <a href="${ach.link}" target="_blank" rel="noopener noreferrer" class="text-amber-400 hover:underline flex items-center gap-1 text-xs font-mono font-bold">
                <span>View Profile</span>
                <i data-lucide="external-link" class="w-3 h-3"></i>
              </a>
            </div>
          ` : '')}
        </div>
      `;
    }).join('');
  }

  // EDUCATION CARD
  const edu = data.education;
  if (edu) {
    const degEl = document.getElementById('edu-degree');
    if (degEl) degEl.textContent = `${edu.degree} - ${edu.branch}`;
    const instEl = document.getElementById('edu-institution');
    if (instEl) instEl.textContent = `${edu.institution} • ${edu.location}`;
    const periodEl = document.getElementById('edu-period');
    if (periodEl) periodEl.textContent = `${edu.year} • CGPA: ${edu.cgpa}`;

    const cwContainer = document.getElementById('edu-coursework');
    if (cwContainer && edu.coursework) {
      cwContainer.innerHTML = edu.coursework.map(c => `
        <span class="pill-purple">${c}</span>
      `).join('');
    }
  }

  if (window.lucide) {
    lucide.createIcons();
  }

  initCardTilt();
  initAnimatedCounters();
  initScrollReveals();
}

/* ==========================================================================
   7. CASE STUDY TABS
   ========================================================================== */
function initCaseStudyTabs() {
  const tabs = document.querySelectorAll('.cyber-tab-btn');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const tabKey = tab.getAttribute('data-tab');
      renderCaseStudyTab(tabKey);
      if (window.lucide) {
        lucide.createIcons();
      }
    });
  });
}

function renderCaseStudyTab(tabKey) {
  const container = document.getElementById('case-study-tab-content');
  const proj = window.portfolioData && window.portfolioData.featuredProject;
  if (!container || !proj) return;

  if (tabKey === 'overview') {
    container.innerHTML = `
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        ${proj.components.map(comp => `
          <div class="pipeline-step-node">
            <div class="flex items-center gap-2.5 mb-2">
              <div class="w-7 h-7 rounded-lg bg-cyan-950 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
                <i data-lucide="${comp.icon}" class="w-3.5 h-3.5"></i>
              </div>
              <h5 class="text-sm font-bold text-white">${comp.title}</h5>
            </div>
            <p class="text-xs text-slate-300 leading-relaxed">${comp.desc}</p>
          </div>
        `).join('')}
      </div>
    `;
  } else if (tabKey === 'features') {
    container.innerHTML = `
      <div class="space-y-3">
        <span class="text-xs font-mono uppercase font-bold text-cyan-400 block mb-2">Core Implemented Functionality:</span>
        ${proj.keyFeatures.map((feat, idx) => `
          <div class="pipeline-step-node flex items-start gap-3 border-l-2 border-l-cyan-400">
            <span class="text-xs font-mono font-bold px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800/60 shrink-0">Feature 0${idx + 1}</span>
            <p class="text-xs sm:text-sm text-slate-300 leading-relaxed">${feat}</p>
          </div>
        `).join('')}
      </div>
    `;
  }
}

/* ==========================================================================
   8. CLIPBOARD TOAST FEEDBACK
   ========================================================================== */
function initClipboardToast() {
  const copyBtn = document.getElementById('copy-email-btn');
  const toast = document.getElementById('creative-toast');

  if (!copyBtn) return;

  copyBtn.addEventListener('click', () => {
    const data = window.portfolioData;
    const email = data ? data.personal.email : 'pateldhiru805@gmail.com';

    navigator.clipboard.writeText(email).then(() => {
      showToast(`Copied ${email} to clipboard!`);
    }).catch(() => {
      showToast(`Email: ${email}`);
    });
  });

  function showToast(msg) {
    if (!toast) return;
    toast.querySelector('span').textContent = msg;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 2800);
  }
}

/* ==========================================================================
   9. SCROLLSPY & NAVIGATION
   ========================================================================== */
function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  function updateActiveNav() {
    let current = '';
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
      const top = section.offsetTop - 140;
      const height = section.offsetHeight;
      if (scrollY >= top && scrollY < top + height) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('text-cyan-400', 'font-bold', 'active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('text-cyan-400', 'font-bold', 'active');
      }
    });
  }

  window.addEventListener('scroll', updateActiveNav, { passive: true });
  updateActiveNav();
}

/* ==========================================================================
   10. MOBILE MENU DRAWER
   ========================================================================== */
function initMobileMenu() {
  const btn = document.getElementById('mobile-menu-btn');
  const drawer = document.getElementById('mobile-drawer');
  const links = document.querySelectorAll('.mobile-link');

  if (!btn || !drawer) return;

  btn.addEventListener('click', () => {
    drawer.classList.toggle('hidden');
  });

  links.forEach(l => {
    l.addEventListener('click', () => {
      drawer.classList.add('hidden');
    });
  });
}

/* ==========================================================================
   11. CONTACT FORM
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('contact-form');
  const alertEl = document.getElementById('contact-alert');

  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('contact-name').value.trim();
    const email = document.getElementById('contact-email').value.trim();
    const message = document.getElementById('contact-message').value.trim();

    if (!name || !email || !message) {
      alert('Please fill out all fields.');
      return;
    }

    const data = window.portfolioData;
    const recipient = data ? data.personal.email : 'pateldhiru805@gmail.com';
    const mailto = `mailto:${recipient}?subject=Portfolio Inquiry from ${encodeURIComponent(name)}&body=${encodeURIComponent(`From: ${name} (${email})\n\nMessage:\n${message}`)}`;

    if (alertEl) {
      alertEl.classList.remove('hidden');
      alertEl.innerHTML = `
        <div class="p-3.5 rounded-xl bg-cyan-950/70 border border-cyan-500/50 text-cyan-200 text-xs flex items-center gap-2">
          <i data-lucide="check" class="w-4 h-4 text-cyan-400 shrink-0"></i>
          <span>Thank you, <strong>${name}</strong>! Opening your email client to send your message to <strong>${recipient}</strong>.</span>
        </div>
      `;
      if (window.lucide) lucide.createIcons();
    }

    setTimeout(() => {
      window.location.href = mailto;
    }, 600);

    form.reset();
  });
}

/* Fallback for portrait image */
window.handlePortraitError = function(imgElement) {
  imgElement.onerror = null;
  imgElement.src = 'public/placeholder-avatar.svg';
  console.info('Using fallback avatar.');
};

/* ==========================================================================
   12. 3D CARD PERSPECTIVE TILT & CURSOR GLARE
   ========================================================================== */
function initCardTilt() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (window.innerWidth < 768) return;

  const cards = document.querySelectorAll('.tilt-card');
  cards.forEach(card => {
    if (card.dataset.tiltInit === 'true') return;
    card.dataset.tiltInit = 'true';

    let glare = card.querySelector('.tilt-glare');
    if (!glare) {
      glare = document.createElement('div');
      glare.className = 'tilt-glare';
      card.appendChild(glare);
    }

    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -6; // Subtle 6 deg max
      const rotateY = ((x - centerX) / centerX) * 6;

      card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.015, 1.015, 1.015)`;

      const glareX = (x / rect.width) * 100;
      const glareY = (y / rect.height) * 100;
      glare.style.background = `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(57, 217, 255, 0.18) 0%, rgba(155, 92, 255, 0.08) 50%, transparent 80%)`;
      glare.style.opacity = '1';
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
      glare.style.opacity = '0';
    });
  });
}

/* ==========================================================================
   13. ANIMATED NUMERICAL COUNTERS FOR VERIFIED METRICS
   ========================================================================== */
function initAnimatedCounters() {
  const counterEls = document.querySelectorAll('.counter-val, [data-counter]');
  if (!counterEls.length) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        obs.unobserve(el);
        animateCounter(el);
      }
    });
  }, { threshold: 0.15 });

  counterEls.forEach(el => {
    if (el.dataset.counterObserved === 'true') return;
    el.dataset.counterObserved = 'true';
    observer.observe(el);
  });

  function animateCounter(el) {
    const rawVal = el.getAttribute('data-counter') || el.textContent.replace(/[^0-9.]/g, '');
    const target = parseFloat(rawVal);
    if (isNaN(target)) return;

    const isDecimal = rawVal.includes('.');
    const decimals = isDecimal ? rawVal.split('.')[1].length : 0;
    const duration = 1200;
    const startTime = performance.now();

    function update(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // easeOutCubic
      const ease = 1 - Math.pow(1 - progress, 3);
      const current = target * ease;

      el.textContent = current.toFixed(decimals);

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        el.textContent = target.toFixed(decimals);
      }
    }
    requestAnimationFrame(update);
  }
}

/* ==========================================================================
   14. SCROLL REVEAL OBSERVER
   ========================================================================== */
function initScrollReveals() {
  const revealEls = document.querySelectorAll('.reveal-init');
  if (!revealEls.length) return;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    revealEls.forEach(el => el.classList.add('is-revealed'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-revealed');
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
  });

  revealEls.forEach(el => observer.observe(el));
}

