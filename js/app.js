/**
 * ETC (Ethical Coders) - Minimal Brutalism App Controller
 */

import { initTerminal } from './terminal.js';
import { initWriteups } from './writeups.js';
import { initArsenal } from './arsenal.js';

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Submodules (Particles removed as requested)
  initTerminal();
  initWriteups();
  initArsenal();

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
    threshold: 0.1,
    rootMargin: '0px 0px -30px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // 4. Global Command Search Shortcut (Ctrl+K or Cmd+K)
  const searchInput = document.getElementById('arsenal-search-input');
  window.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      if (searchInput) {
        searchInput.focus();
        searchInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  });

  const headerSearchBtn = document.getElementById('btn-header-search');
  if (headerSearchBtn && searchInput) {
    headerSearchBtn.addEventListener('click', () => {
      searchInput.focus();
      searchInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  }
});
