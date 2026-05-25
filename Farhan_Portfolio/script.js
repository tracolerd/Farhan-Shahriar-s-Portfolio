/* ══════════════════════════════════════════════
   FARHAN SHAHRIAR — PORTFOLIO SCRIPT
   GSAP + ScrollTrigger · VanillaTilt · Cursor
   Ripple · Social Links · Contact Form
══════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  /* ─────────────────────────────────────
     CUSTOM CURSOR
  ───────────────────────────────────── */
  const dot  = document.getElementById('cursorDot');
  const ring = document.getElementById('cursorRing');

  if (dot && ring && window.matchMedia('(hover: hover)').matches) {
    let mouseX = 0, mouseY = 0;
    let ringX  = 0, ringY  = 0;

    document.addEventListener('mousemove', e => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.left = mouseX + 'px';
      dot.style.top  = mouseY + 'px';
    });

    const animateCursor = () => {
      ringX += (mouseX - ringX) * 0.14;
      ringY += (mouseY - ringY) * 0.14;
      ring.style.left = ringX + 'px';
      ring.style.top  = ringY + 'px';
      requestAnimationFrame(animateCursor);
    };
    animateCursor();

    // Hover enlargement on interactive elements
    const hoverTargets = document.querySelectorAll('a, button, [data-tilt], input, textarea');
    hoverTargets.forEach(el => {
      el.addEventListener('mouseenter', () => ring.classList.add('hovered'));
      el.addEventListener('mouseleave', () => ring.classList.remove('hovered'));
    });
  }

  /* ─────────────────────────────────────
     NAVBAR — scroll state & hamburger
  ───────────────────────────────────── */
  const navbar     = document.getElementById('navbar');
  const hamburger  = document.getElementById('hamburger');
  const navLinks   = document.getElementById('navLinks');

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });

  hamburger.addEventListener('click', () => {
    const isOpen = hamburger.classList.toggle('open');
    navLinks.classList.toggle('open', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Close mobile nav on link click
  navLinks.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  /* ─────────────────────────────────────
     RIPPLE EFFECT
  ───────────────────────────────────── */
  document.querySelectorAll('.ripple').forEach(el => {
    el.addEventListener('click', function (e) {
      const rect   = this.getBoundingClientRect();
      const size   = Math.max(rect.width, rect.height) * 2;
      const x      = e.clientX - rect.left - size / 2;
      const y      = e.clientY - rect.top  - size / 2;
      const wave   = document.createElement('span');
      wave.classList.add('ripple-wave');
      wave.style.cssText = `width:${size}px;height:${size}px;left:${x}px;top:${y}px;`;
      this.appendChild(wave);
      wave.addEventListener('animationend', () => wave.remove());
    });
  });

  /* ─────────────────────────────────────
     GSAP — HERO + SCROLL ANIMATIONS
     Hero elements use .hero-el class (NOT data-animate)
     ScrollTrigger ONLY targets [data-animate] outside .hero
  ───────────────────────────────────── */
  if (typeof gsap !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);

    /* ── animateHero: runs ONCE on page load ── */
    function animateHero() {
      const heroEls = document.querySelectorAll('.hero-el');
      heroEls.forEach(el => {
        const delay = parseFloat(el.dataset.heroDelay || 0);
        gsap.fromTo(el,
          { opacity: 0, y: 28 },
          {
            opacity: 1,
            y: 0,
            duration: 0.85,
            delay: 0.25 + delay,
            ease: 'power3.out',
            onComplete: () => {
              // Lock in final state — no further animation can override
              el.classList.add('hero-visible');
              gsap.set(el, { clearProps: 'all' });
            }
          }
        );
      });
    }

    // Fire hero animation immediately on load
    animateHero();

    /* ── ScrollTrigger: ONLY for sections outside .hero ── */
    document.querySelectorAll('[data-animate]').forEach(el => {
      // Hard guard — never touch hero section elements
      if (el.closest('.hero')) return;

      const delay = parseFloat(el.dataset.delay || 0);
      const xFrom = el.dataset.animate === 'fade-left'  ? -32
                  : el.dataset.animate === 'fade-right' ? 32 : 0;
      const yFrom = el.dataset.animate === 'fade-up' ? 32 : 0;

      ScrollTrigger.create({
        trigger: el,
        start: 'top 88%',
        once: true,
        onEnter: () => {
          gsap.fromTo(el,
            { opacity: 0, x: xFrom, y: yFrom },
            {
              opacity: 1, x: 0, y: 0,
              duration: 0.75,
              delay,
              ease: 'power2.out',
              onComplete: () => {
                el.classList.add('animated');
                gsap.set(el, { clearProps: 'all' });
              }
            }
          );
        }
      });
    });

    // Skill bar animation on scroll
    document.querySelectorAll('.skill-bar').forEach(bar => {
      ScrollTrigger.create({
        trigger: bar,
        start: 'top 85%',
        once: true,
        onEnter: () => bar.classList.add('animated')
      });
    });

    // GPA ring animation
    document.querySelectorAll('.ring-fill').forEach(ringEl => {
      const targetOffset = getComputedStyle(ringEl).strokeDashoffset;
      const dashArray    = getComputedStyle(ringEl).strokeDasharray;
      gsap.set(ringEl, { strokeDashoffset: dashArray });
      ScrollTrigger.create({
        trigger: ringEl,
        start: 'top 85%',
        once: true,
        onEnter: () => {
          gsap.to(ringEl, { strokeDashoffset: targetOffset, duration: 1.2, ease: 'power2.out' });
        }
      });
    });

    // Refresh after everything is set up
    ScrollTrigger.refresh();

  } else {
    /* ── Fallback: no GSAP — use IntersectionObserver ── */

    // Show hero elements immediately
    document.querySelectorAll('.hero-el').forEach((el, i) => {
      setTimeout(() => {
        el.style.transition = 'opacity 0.7s ease, transform 0.7s ease';
        el.classList.add('hero-visible');
      }, 250 + i * 120);
    });

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animated');
          if (entry.target.classList.contains('skill-bar')) {
            entry.target.classList.add('animated');
          }
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    document.querySelectorAll('[data-animate], .skill-bar').forEach(el => {
      if (!el.closest('.hero')) observer.observe(el);
    });
  }
  /* ─────────────────────────────────────
     VANILLA TILT (3D hover effect)
  ───────────────────────────────────── */
  if (typeof VanillaTilt !== 'undefined') {
    VanillaTilt.init(document.querySelectorAll('[data-tilt]'), {
      max:       8,
      speed:     500,
      glare:     false,
      'max-glare': 0.1
    });
  }

  /* ─────────────────────────────────────
     ACTIVE NAV LINK (scroll spy)
  ───────────────────────────────────── */
  const sections   = document.querySelectorAll('section[id]');
  const navAnchors = document.querySelectorAll('.nav-link[href^="#"]');

  const spyObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navAnchors.forEach(a => a.classList.remove('active'));
        const active = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
        if (active) active.classList.add('active');
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(s => spyObserver.observe(s));

  // Active nav style (add CSS inline)
  const style = document.createElement('style');
  style.textContent = `.nav-link.active:not(.nav-cta) { background: var(--parchment); color: var(--espresso); }`;
  document.head.appendChild(style);

  /* ─────────────────────────────────────
     SOCIAL LINKS — hardcoded in HTML
     No JS management needed
  ───────────────────────────────────── */


  /* ─────────────────────────────────────
     CONTACT FORM (mailto fallback)
  ───────────────────────────────────── */
  const sendBtn = document.getElementById('sendMsgBtn');
  const formNote = document.getElementById('formNote');

  if (sendBtn) {
    sendBtn.addEventListener('click', () => {
      const name    = document.getElementById('senderName').value.trim();
      const email   = document.getElementById('senderEmail').value.trim();
      const subject = document.getElementById('msgSubject').value.trim();
      const body    = document.getElementById('msgBody').value.trim();

      if (!name || !email || !body) {
        formNote.textContent = 'Please fill in your name, email, and message.';
        formNote.style.color = '#9C6B3C';
        return;
      }

      // Email validation
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        formNote.textContent = 'Please enter a valid email address.';
        formNote.style.color = '#9C6B3C';
        return;
      }

      const mailBody = `Name: ${name}\nEmail: ${email}\n\n${body}`;
      const mailto   = `mailto:farhanshahriarefaz@gmail.com?subject=${encodeURIComponent(subject || 'Portfolio Enquiry')}&body=${encodeURIComponent(mailBody)}`;
      window.location.href = mailto;

      formNote.textContent = 'Your email client has been opened. Thank you!';
      formNote.style.color = '#6B3F1A';
    });
  }

  /* ─────────────────────────────────────
     HERO IMAGE — graceful placeholder
  ───────────────────────────────────── */
  const portrait = document.getElementById('heroPortrait');
  if (portrait) {
    portrait.addEventListener('error', () => {
      // Show a styled placeholder SVG if image not found
      portrait.style.display = 'none';
      const placeholder = document.createElement('div');
      placeholder.style.cssText = `
        width: 100%; min-height: 420px;
        display: flex; flex-direction: column;
        align-items: center; justify-content: center;
        border-radius: 1.5rem;
        background: linear-gradient(160deg, rgba(237,224,204,0.6), rgba(200,169,126,0.25));
        border: 2px dashed rgba(200,169,126,0.5);
        color: #9C6B3C; font-family: 'DM Sans', sans-serif;
        gap: 0.75rem; padding: 2rem; text-align: center;
      `;
      placeholder.innerHTML = `
        <svg width="72" height="72" viewBox="0 0 24 24" fill="none" stroke="#C8A97E" stroke-width="1" stroke-linecap="round">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
          <circle cx="12" cy="7" r="4"/>
        </svg>
        <strong style="font-size:1rem;color:#6B3F1A;">Place your photo here</strong>
        <span style="font-size:0.8rem;color:#9C6B3C;">Add <code>farhan-suit.png</code> (transparent background) to the project folder</span>
      `;
      portrait.parentNode.appendChild(placeholder);
    });
  }

  /* ─────────────────────────────────────
     SMOOTH PARALLAX on hero deco rings
  ───────────────────────────────────── */
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    document.querySelectorAll('.hero-deco').forEach((el, i) => {
      el.style.transform = `translateY(calc(-50% + ${y * (0.08 + i * 0.04)}px))`;
    });
  }, { passive: true });

});
