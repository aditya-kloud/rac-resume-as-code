/* ================================================================
   RaC — Landing Page JS
   No external dependencies — vanilla JS only.
   ================================================================ */

(function () {
  'use strict';

  /* ── 1. Nav: frosted-glass on scroll ─────────────────────────── */
  const nav = document.querySelector('.nav');
  if (nav) {
    const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 50);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // run once on load
  }

  /* ── 2. Section fade-in via IntersectionObserver ─────────────── */
  const fadeEls = document.querySelectorAll('.section-fade');
  if (fadeEls.length && 'IntersectionObserver' in window) {
    const fadeObs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          fadeObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    fadeEls.forEach(el => fadeObs.observe(el));
  } else {
    // Fallback: show all immediately (no IntersectionObserver support)
    fadeEls.forEach(el => el.classList.add('visible'));
  }

  /* ── 3. Feature card stagger on section enter ─────────────────── */
  const featureCards = document.querySelectorAll('.feature-card');
  if (featureCards.length && 'IntersectionObserver' in window) {
    // Hide cards initially (done in JS to avoid FOUC — cards are below fold)
    featureCards.forEach(card => {
      card.style.opacity = '0';
      card.style.transform = 'translateY(32px)';
      card.style.transition = 'opacity 0.55s ease, transform 0.55s ease';
    });

    const featSection = document.querySelector('.features');
    if (featSection) {
      const featObs = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) {
          featureCards.forEach((card, i) => {
            setTimeout(() => {
              card.style.opacity = '1';
              card.style.transform = 'translateY(0)';
            }, i * 75);
          });
          featObs.disconnect();
        }
      }, { threshold: 0.08 });
      featObs.observe(featSection);
    }
  }

  /* ── 4. 3D card tilt on mouse move ───────────────────────────── */
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function attachTilt(selector, maxDeg) {
    if (prefersReducedMotion) return;
    document.querySelectorAll(selector).forEach(card => {
      card.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect();
        const cx = rect.left + rect.width  / 2;
        const cy = rect.top  + rect.height / 2;
        const dx = (e.clientX - cx) / (rect.width  / 2); // -1 to 1
        const dy = (e.clientY - cy) / (rect.height / 2); // -1 to 1
        const rotY =  dx * maxDeg;
        const rotX = -dy * maxDeg;
        card.style.transform = `perspective(700px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale(1.03)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });
  }

  attachTilt('.feature-card',  10);
  attachTilt('.template-card',  8);

  /* ── 5. Hero card parallax on mouse move ─────────────────────── */
  const heroSection = document.querySelector('.hero');
  const resumeCard  = document.querySelector('.resume-card-3d');

  if (heroSection && resumeCard && !prefersReducedMotion) {
    heroSection.addEventListener('mousemove', e => {
      const x = (e.clientX / window.innerWidth  - 0.5) * 12; // -6 to +6
      const y = (e.clientY / window.innerHeight - 0.5) * 10; // -5 to +5
      resumeCard.style.transform = `rotateY(${-18 + x}deg) rotateX(${10 - y}deg)`;
    }, { passive: true });

    heroSection.addEventListener('mouseleave', () => {
      // Remove inline style — CSS keyframe animation resumes
      resumeCard.style.transform = '';
    });
  }

  /* ── 6. Copy prompt button ───────────────────────────────────── */
  const copyBtn  = document.getElementById('promptCopyBtn');
  const promptEl = document.getElementById('promptText');
  if (copyBtn && promptEl) {
    copyBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(promptEl.textContent.trim()).then(() => {
        copyBtn.textContent = 'Copied!';
        copyBtn.classList.add('copied');
        setTimeout(() => {
          copyBtn.textContent = 'Copy';
          copyBtn.classList.remove('copied');
        }, 2000);
      });
    });
  }

  /* ── 7. Smooth-scroll anchor links ───────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

})();
