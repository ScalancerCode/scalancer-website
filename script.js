// To change the brand name and tagline, update the values in the BRAND_CONFIG object below. This will automatically update the page title, meta tags, and any elements with the appropriate data attributes.
document.addEventListener('DOMContentLoaded', () => {
  const BRAND_CONFIG = {
    name: "Scalancer",
    tagline: "Engineering the Future of Digital Innovation",
    toUpperCase: "SCALANCER"
  };

  // Update Page Title and Meta Tags
  document.title = `${BRAND_CONFIG.name} | ${BRAND_CONFIG.tagline}`;

  // Update all elements with the 'data-brand-name' attribute
  document.querySelectorAll('[data-brand-name]').forEach(el => {
    el.textContent = BRAND_CONFIG.name;
  });

  // Update all elements with the 'data-brand-upper' attribute
  document.querySelectorAll('[data-brand-upper]').forEach(el => {
    el.textContent = BRAND_CONFIG.toUpperCase;
  });
});


(function () {
  "use strict";

  var header = document.querySelector(".site-header");
  var navToggle = document.querySelector(".nav-toggle");
  var mobileNav = document.getElementById("mobile-nav");
  var yearEl = document.getElementById("year");
  var heroVideo = document.getElementById("hero-video");
  var prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ── Video ────────────────────────────────── */
  if (heroVideo) {
    heroVideo.addEventListener("error", function () {
      heroVideo.style.display = "none";
    });
    var playAttempt = heroVideo.play();
    if (playAttempt && typeof playAttempt.catch === "function") {
      playAttempt.catch(function () {});
    }
  }

  /* ── Year ─────────────────────────────────── */
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /* ── Header scroll ────────────────────────── */
  function updateHeader() {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 24);
  }
  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });

  /* ── Mobile nav ───────────────────────────── */
  if (navToggle && mobileNav) {
    navToggle.addEventListener("click", function () {
      var expanded = navToggle.getAttribute("aria-expanded") === "true";
      navToggle.setAttribute("aria-expanded", String(!expanded));
      mobileNav.hidden = expanded;
    });
    mobileNav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        navToggle.setAttribute("aria-expanded", "false");
        mobileNav.hidden = true;
      });
    });
  }

  /* ── Smooth scroll ────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener("click", function (e) {
      var id = anchor.getAttribute("href");
      if (!id || id === "#") return;
      var target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      var headerH = header ? header.offsetHeight : 0;
      var top = target.getBoundingClientRect().top + window.scrollY - headerH - 12;
      window.scrollTo({ top: top, behavior: prefersReducedMotion ? "auto" : "smooth" });
    });
  });

  /* ── Hero entrance ────────────────────────── */
  function revealHeroElements() {
    document.querySelectorAll("[data-reveal-hero]").forEach(function (el, i) {
      setTimeout(function () {
        el.classList.add("hero-in");
      }, prefersReducedMotion ? 0 : i * 120);
    });
  }
  if (document.readyState === "complete") {
    setTimeout(revealHeroElements, 80);
  } else {
    window.addEventListener("load", function () {
      setTimeout(revealHeroElements, 80);
    });
  }

  /* ── Scroll reveal ────────────────────────── */
  var revealEls = document.querySelectorAll("[data-reveal]");
  if (revealEls.length && "IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        io.unobserve(entry.target);
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });

    revealEls.forEach(function (el, i) {
      el.style.transitionDelay = prefersReducedMotion ? "0ms" : Math.min(i * 60, 280) + "ms";
      io.observe(el);
    });
  } else {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* ── Typewriter ───────────────────────────── */
  var typingEl = document.getElementById("typing-text");
  if (typingEl) {
    var typingText =
      "We believe great systems start with clear thinking and careful design. A close-knit team of engineers working from initial sketches to fully deployed solutions — using a structured, engineering-led approach.";
    var typingIndex = 0;

    if (prefersReducedMotion) {
      typingEl.textContent = typingText;
      typingEl.classList.add("typing-text--static");
    } else {
      function runTypeEffect() {
        if (typingIndex < typingText.length) {
          typingEl.textContent += typingText.charAt(typingIndex);
          typingIndex++;
          var delay = 22;
          if (typingIndex > 1 && typingText.charAt(typingIndex - 2) === "." && typingText.charAt(typingIndex - 1) === " ") {
            delay = 380;
          }
          setTimeout(runTypeEffect, delay);
        } else {
          typingEl.classList.add("typing-text--complete");
          setTimeout(function () {
            typingEl.classList.remove("typing-text--complete");
            typingEl.textContent = "";
            typingIndex = 0;
            setTimeout(runTypeEffect, 600);
          }, 3400);
        }
      }

      function startTyping() {
        typingEl.classList.add("typing-text--ready");
        setTimeout(runTypeEffect, 100);
      }

      if (document.readyState === "complete") {
        setTimeout(startTyping, 900);
      } else {
        window.addEventListener("load", function () { setTimeout(startTyping, 900); });
      }
    }
  }

  /* ── Request form toggle ──────────────────── */
  var btnRequest = document.getElementById("btn-request-service");
  var formWrapper = document.getElementById("service-form-wrapper");
  if (btnRequest && formWrapper) {
    btnRequest.addEventListener("click", function () {
      if (formWrapper.hidden) {
        formWrapper.hidden = false;
        void formWrapper.offsetWidth;
        formWrapper.classList.add("is-open");
        var headerH = header ? header.offsetHeight : 0;
        var top = formWrapper.getBoundingClientRect().top + window.scrollY - headerH - 24;
        window.scrollTo({ top: top, behavior: prefersReducedMotion ? "auto" : "smooth" });
      } else {
        formWrapper.classList.remove("is-open");
        setTimeout(function () { formWrapper.hidden = true; }, 400);
      }
    });
  }

  /* ── Active nav highlight ─────────────────── */
  var sections = document.querySelectorAll("section[id]");
  var navLinks = document.querySelectorAll(".nav a");
  if (sections.length && navLinks.length && "IntersectionObserver" in window) {
    var navObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          navLinks.forEach(function (link) {
            link.classList.toggle("active", link.getAttribute("href") === "#" + entry.target.id);
          });
        }
      });
    }, { rootMargin: "-40% 0px -55% 0px", threshold: 0 });
    sections.forEach(function (s) { navObserver.observe(s); });
  }

  document.querySelectorAll('.why-row').forEach(row => {
  row.addEventListener('mousemove', e => {
    const rect = row.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    row.style.setProperty('--mouse-x', `${x}%`);
    row.style.setProperty('--mouse-y', `${y}%`);
  });
});

})();


//LEGACY CODE BELOW

const overlay = document.getElementById('legal-overlay');
const privacyModal = document.getElementById('modal-privacy');
const termsModal = document.getElementById('modal-terms');

// Open Privacy
document.getElementById('open-privacy').addEventListener('click', () => {
  overlay.classList.add('active');
  privacyModal.classList.add('active');
  document.body.style.overflow = 'hidden';
});

// Open Terms
document.getElementById('open-terms').addEventListener('click', () => {
  overlay.classList.add('active');
  termsModal.classList.add('active');
  document.body.style.overflow = 'hidden';
});

// Close functionality
document.querySelectorAll('.modal-close, .legal-overlay').forEach(element => {
  element.addEventListener('click', (e) => {
    // Only close if clicking the background or the close button
    if (e.target === overlay || e.target.classList.contains('modal-close')) {
      overlay.classList.remove('active');
      document.querySelectorAll('.legal-modal').forEach(m => m.classList.remove('active'));
      document.body.style.overflow = 'auto';
    }
  });
});

// Optimized Reveal Logic
const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -50px 0px" // Triggers slightly before entering view
};

const revealOnScroll = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = "1";
      entry.target.style.transform = "translateY(0)";
      // Once revealed, stop observing to save memory
      revealOnScroll.unobserve(entry.target);
    }
  });
}, observerOptions);

document.querySelectorAll('.social-film-row').forEach(row => {
  // Set initial state via JS to prevent flash
  row.style.opacity = "0";
  row.style.transform = "translateY(30px)";
  row.style.transition = "all 0.8s cubic-bezier(0.16, 1, 0.3, 1)";
  revealOnScroll.observe(row);
});

// Handle form submission via AJAX
const serviceForm = document.querySelector('.service-form-kinetic');
const feedbackDiv = document.getElementById('form-feedback');

if (serviceForm && feedbackDiv) {
  serviceForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const submitBtn = serviceForm.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.innerHTML;

    // Loading state
    submitBtn.innerHTML = '<span class="btn-txt">Transmitting...</span>';
    submitBtn.disabled = true;
    feedbackDiv.style.display = 'none';
    feedbackDiv.className = 'form-feedback';

    const formData = new FormData(serviceForm);
    const data = Object.fromEntries(formData.entries());

    try {
      const response = await fetch('api/service-request.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(data)
      });

      const result = await response.json();

      if (response.ok && result.success) {
        // Success
        feedbackDiv.textContent = 'Request submitted successfully';
        feedbackDiv.style.color = '#fff';
        feedbackDiv.style.background = 'rgba(46, 213, 115, 0.2)';
        feedbackDiv.style.border = '1px solid rgba(46, 213, 115, 0.4)';
        feedbackDiv.style.display = 'block';
        serviceForm.reset();
      } else {
        // Error from server
        feedbackDiv.textContent = result.error || 'An error occurred. Please try again.';
        feedbackDiv.style.color = '#fff';
        feedbackDiv.style.background = 'rgba(255, 71, 87, 0.2)';
        feedbackDiv.style.border = '1px solid rgba(255, 71, 87, 0.4)';
        feedbackDiv.style.display = 'block';
      }
    } catch (error) {
      // Network Error
      feedbackDiv.textContent = 'Failed to connect to the server. Please try again.';
      feedbackDiv.style.color = '#fff';
      feedbackDiv.style.background = 'rgba(255, 71, 87, 0.2)';
      feedbackDiv.style.border = '1px solid rgba(255, 71, 87, 0.4)';
      feedbackDiv.style.display = 'block';
    } finally {
      // Revert loading state
      submitBtn.innerHTML = originalBtnText;
      submitBtn.disabled = false;
    }
  });
}