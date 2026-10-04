/**
 * ETC (Ethical Coders) - Minimal Brutalism App Controller
 */

import { initWriteups } from './writeups.js';

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Writeups Module
  initWriteups();

  // 2. Mobile Navigation Toggle
  const mobileToggleBtn = document.getElementById('btn-mobile-menu');
  const mobileDrawer = document.getElementById('mobile-nav-drawer');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  if (mobileToggleBtn && mobileDrawer) {
    mobileToggleBtn.addEventListener('click', () => {
      const isOpen = mobileDrawer.classList.toggle('is-open');
      mobileToggleBtn.classList.toggle('is-active', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : 'auto';
    });

    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileDrawer.classList.remove('is-open');
        mobileToggleBtn.classList.remove('is-active');
        document.body.style.overflow = 'auto';
      });
    });
  }

  // 3. Minimal Scroll Reveal Transitions
  const revealElements = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.08,
    rootMargin: '0px 0px -20px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));
});
