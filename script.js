/* =========================================================================
   Acme VA — Interactions
   ========================================================================= */

(() => {
  'use strict';

  // -----------------------------------------------------------------------
  // Sticky nav style change on scroll
  // -----------------------------------------------------------------------
  const nav = document.getElementById('nav');
  const onScroll = () => {
    if (window.scrollY > 20) {
      nav.classList.add('is-scrolled');
    } else {
      nav.classList.remove('is-scrolled');
    }
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // -----------------------------------------------------------------------
  // Scroll-reveal animations (uses IntersectionObserver)
  // -----------------------------------------------------------------------
  const revealTargets = document.querySelectorAll(
    '.section-title, .lede, .service-card, .step, .quote, .metric, .plan, .faq-item, .value, .force__shot'
  );
  revealTargets.forEach(el => el.classList.add('reveal'));

  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });

  revealTargets.forEach(el => io.observe(el));

  // -----------------------------------------------------------------------
  // FAQ: close other items when one opens (accordion behavior)
  // -----------------------------------------------------------------------
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    item.addEventListener('toggle', () => {
      if (item.open) {
        faqItems.forEach(other => {
          if (other !== item) other.open = false;
        });
      }
    });
  });

  // -----------------------------------------------------------------------
  // Smooth scroll for anchor links (offset for fixed nav)
  // -----------------------------------------------------------------------
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target && anchor.getAttribute('href').length > 1) {
        e.preventDefault();
        const offset = 80;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });
})();

// -----------------------------------------------------------------------
// Form submission handler (global so inline onsubmit can find it)
// -----------------------------------------------------------------------
function handleSubmit(e) {
  e.preventDefault();
  const form = e.target;
  const btn = form.querySelector('button[type="submit"]');
  const originalText = btn.innerHTML;
  btn.innerHTML = 'Sending...';
  btn.style.opacity = '0.7';
  btn.disabled = true;

  // Replace this with your real submission endpoint (Formspree, Netlify Forms,
  // your own API, etc). For now we'll simulate success after a short delay.
  setTimeout(() => {
    btn.innerHTML = '✓ Got it — we\'ll be in touch within 4 hours';
    btn.style.background = 'linear-gradient(135deg, #5cb85c, #4a9c4a)';
    form.reset();
    setTimeout(() => {
      btn.innerHTML = originalText;
      btn.style.opacity = '';
      btn.style.background = '';
      btn.disabled = false;
    }, 4000);
  }, 800);
}
