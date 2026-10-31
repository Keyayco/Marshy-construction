/* ==========================================================================
   Marshy Construction Benoni — main.js
   Vanilla ES6+. No dependencies.
   ========================================================================== */

(() => {
  "use strict";

  const WHATSAPP_NUMBER = "27846432660";
  const DEFAULT_WA_MESSAGE =
    "Hi Marshy Construction, I found your website and would like to enquire about a construction project.";

  /* ---------- Mobile navigation ---------- */
  const navToggle = document.getElementById("nav-toggle");
  const siteNav = document.getElementById("site-nav");

  const closeNav = () => {
    siteNav.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.setAttribute("aria-label", "Open menu");
  };

  if (navToggle && siteNav) {
    navToggle.addEventListener("click", () => {
      const isOpen = siteNav.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
      navToggle.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
    });

    // Close when a nav link is chosen.
    siteNav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", closeNav);
    });

    // Close on Escape.
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeNav();
    });
  }

  /* ---------- Subtle reveal on scroll ---------- */
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const revealTargets = document.querySelectorAll(
    ".service-card, .gallery-item, .value-item, .section-head"
  );

  if (!prefersReducedMotion && "IntersectionObserver" in window && revealTargets.length) {
    revealTargets.forEach((el) => el.classList.add("reveal"));

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );

    revealTargets.forEach((el) => observer.observe(el));
  }

  /* ---------- Quote form → WhatsApp enquiry ---------- */
  const form = document.getElementById("quote-form");

  const showError = (field, message) => {
    const errorEl = form.querySelector(`[data-error-for="${field.id}"]`);
    if (errorEl) errorEl.textContent = message;
    field.setAttribute("aria-invalid", message ? "true" : "false");
  };

  const validateField = (field) => {
    const value = field.value.trim();

    switch (field.id) {
      case "f-name":
        if (!value) return "Please enter your name.";
        if (value.length > 80) return "Name must be under 80 characters.";
        return "";
      case "f-phone":
        if (!value) return "Please enter a phone number so we can reply.";
        if (!/^[+()\d\s-]{7,20}$/.test(value)) return "Please enter a valid phone number.";
        return "";
      case "f-message":
        if (!value) return "Please tell us briefly about your project.";
        if (value.length > 800) return "Message must be under 800 characters.";
        return "";
      default:
        return "";
    }
  };

  if (form) {
    const fields = form.querySelectorAll("input, textarea");

    fields.forEach((field) => {
      field.addEventListener("blur", () => showError(field, validateField(field)));
      field.addEventListener("input", () => {
        if (field.getAttribute("aria-invalid") === "true") {
          showError(field, validateField(field));
        }
      });
    });

    form.addEventListener("submit", (event) => {
      event.preventDefault();

      let firstInvalid = null;
      fields.forEach((field) => {
        const error = validateField(field);
        showError(field, error);
        if (error && !firstInvalid) firstInvalid = field;
      });

      if (firstInvalid) {
        firstInvalid.focus();
        return;
      }

      const name = form.elements.name.value.trim();
      const phone = form.elements.phone.value.trim();
      const projectType = form.elements.projectType.value;
      const message = form.elements.message.value.trim();

      const lines = [
        DEFAULT_WA_MESSAGE,
        "",
        `Name: ${name}`,
        `Phone: ${phone}`,
        `Project type: ${projectType}`,
        "",
        message,
      ];

      const url =
        "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(lines.join("\n"));

      window.open(url, "_blank", "noopener");
    });
  }

  /* ---------- Footer year ---------- */
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());
})();
