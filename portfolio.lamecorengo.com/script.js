// Personal details are intentionally centralized here for easy editing.
const SITE = {
  email: "elorengo26@gmail.com",
};

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const coarsePointer = window.matchMedia("(hover: none), (pointer: coarse)").matches;

const themeToggle = document.querySelector("[data-theme-toggle]");
const themeColorMeta = document.querySelector('meta[name="theme-color"]');
const applyTheme = (theme, persist = false) => {
  const selectedTheme = theme === "light" ? "light" : "dark";
  document.documentElement.dataset.theme = selectedTheme;
  const switchLabel = `Switch to ${selectedTheme === "light" ? "dark" : "light"} mode`;
  themeToggle.setAttribute("aria-label", "Light appearance");
  themeToggle.setAttribute("title", switchLabel);
  themeToggle.setAttribute("aria-pressed", String(selectedTheme === "light"));
  themeColorMeta.setAttribute("content", selectedTheme === "light" ? "#F5F4F0" : "#050505");
  if (persist) {
    try {
      localStorage.setItem("lameck-portfolio-theme", selectedTheme);
    } catch {
      // Keep the in-page selection working when storage is unavailable.
    }
  }
};

applyTheme(document.documentElement.dataset.theme);
themeToggle.addEventListener("click", () => {
  applyTheme(document.documentElement.dataset.theme === "light" ? "dark" : "light", true);
});

// Keep the real portrait when available, with a quiet monogram fallback for a missing asset.
const heroPortrait = document.querySelector(".hero-portrait-image");
const heroPortraitFallback = document.querySelector(".hero-portrait-fallback");
if (heroPortrait && heroPortraitFallback) {
  const showPortraitFallback = () => {
    heroPortrait.hidden = true;
    heroPortraitFallback.hidden = false;
    heroPortrait.closest(".hero-portrait-frame")?.classList.add("is-missing");
  };
  heroPortrait.addEventListener("error", showPortraitFallback, { once: true });
  if (heroPortrait.complete && heroPortrait.naturalWidth === 0) showPortraitFallback();
}

document.querySelectorAll("[data-year]").forEach((node) => {
  node.textContent = String(new Date().getFullYear());
});

document.querySelectorAll("[data-email]").forEach((node) => {
  node.textContent = SITE.email;
});
document.querySelectorAll("[data-email-link]").forEach((node) => {
  node.href = `mailto:${SITE.email}`;
});

// Reveal content as it enters view. With reduced motion the content is visible from first paint.
if (!reduceMotion && "IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.13, rootMargin: "0px 0px -36px 0px" });
  document.querySelectorAll(".reveal").forEach((element) => revealObserver.observe(element));
} else {
  document.querySelectorAll(".reveal").forEach((element) => element.classList.add("is-visible"));
}

// Keep the reading position visible without intercepting or smoothing native scroll.
const progressBar = document.querySelector("#progress-bar");
const navigationSections = ["work", "about", "capabilities", "background", "contact"]
  .map((id) => document.getElementById(id))
  .filter(Boolean);
const navigationLinks = document.querySelectorAll('.desktop-nav a[href^="#"], .mobile-menu nav a[href^="#"]');
const updateActiveNavigation = () => {
  const marker = window.innerHeight * 0.34;
  let activeId = "";
  navigationSections.forEach((section) => {
    const bounds = section.getBoundingClientRect();
    if (bounds.top <= marker && bounds.bottom > marker) activeId = section.id;
  });
  navigationLinks.forEach((link) => {
    if (link.getAttribute("href") === `#${activeId}`) {
      link.setAttribute("aria-current", "location");
    } else {
      link.removeAttribute("aria-current");
    }
  });
};
let progressQueued = false;
const updateProgress = () => {
  if (progressQueued) return;
  progressQueued = true;
  requestAnimationFrame(() => {
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const progress = scrollable > 0 ? Math.min(100, (window.scrollY / scrollable) * 100) : 0;
    progressBar.style.width = `${progress}%`;
    updateActiveNavigation();
    progressQueued = false;
  });
};
window.addEventListener("scroll", updateProgress, { passive: true });
window.addEventListener("resize", updateProgress, { passive: true });
updateProgress();

// Small, deliberate magnetic movement on mouse and keyboard focus.
if (!coarsePointer && !reduceMotion) {
  document.querySelectorAll(".magnetic").forEach((element) => {
    let frame = 0;
    const moveTowardPointer = (event) => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const rect = element.getBoundingClientRect();
        const dx = event.clientX - (rect.left + rect.width / 2);
        const dy = event.clientY - (rect.top + rect.height / 2);
        element.style.setProperty("--mag-x", `${Math.max(-7, Math.min(7, dx * 0.12))}px`);
        element.style.setProperty("--mag-y", `${Math.max(-5, Math.min(5, dy * 0.14))}px`);
      });
    };
    const reset = () => {
      cancelAnimationFrame(frame);
      element.style.setProperty("--mag-x", "0px");
      element.style.setProperty("--mag-y", "0px");
    };
    element.addEventListener("pointermove", moveTowardPointer);
    element.addEventListener("pointerleave", reset);
    element.addEventListener("blur", reset);
    element.addEventListener("focus", () => {
      element.style.setProperty("--mag-x", "0px");
      element.style.setProperty("--mag-y", "-2px");
    });
  });
}

// Reflective lighting and restrained perspective follow the pointer on desktop.
if (!coarsePointer && !reduceMotion) {
  const tilts = document.querySelectorAll("[data-tilt]");
  tilts.forEach((surface) => {
    const visual = surface.matches(".hero-art") ? surface : surface.querySelector(".project-visual");
    if (!visual) return;
    let frame = 0;
    const onMove = (event) => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const rect = visual.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width;
        const y = (event.clientY - rect.top) / rect.height;
        visual.style.setProperty("--tilt-x", `${(0.5 - y) * 3.2}deg`);
        visual.style.setProperty("--tilt-y", `${(x - 0.5) * 3.8}deg`);
        if (visual.classList.contains("hero-art")) {
          visual.style.setProperty("--light-x", `${x * 100}%`);
          visual.style.setProperty("--light-y", `${y * 100}%`);
        }
      });
    };
    const reset = () => {
      cancelAnimationFrame(frame);
      visual.style.setProperty("--tilt-x", "0deg");
      visual.style.setProperty("--tilt-y", "0deg");
      if (visual.classList.contains("hero-art")) {
        visual.style.setProperty("--light-x", "48%");
        visual.style.setProperty("--light-y", "38%");
      }
    };
    visual.addEventListener("pointermove", onMove);
    visual.addEventListener("pointerleave", reset);
  });
}

// A quiet cursor halo supplements the native cursor; it never replaces interaction semantics.
const cursorAura = document.querySelector(".cursor-aura");
if (cursorAura && !coarsePointer) {
  let cursorFrame = 0;
  window.addEventListener("pointermove", (event) => {
    cancelAnimationFrame(cursorFrame);
    cursorFrame = requestAnimationFrame(() => {
      cursorAura.style.left = `${event.clientX}px`;
      cursorAura.style.top = `${event.clientY}px`;
      cursorAura.classList.add("is-visible");
    });
  }, { passive: true });
  window.addEventListener("pointerleave", () => cursorAura.classList.remove("is-visible"));
  document.querySelectorAll("a,button").forEach((element) => {
    element.addEventListener("pointerenter", () => cursorAura.classList.add("is-hover"));
    element.addEventListener("pointerleave", () => cursorAura.classList.remove("is-hover"));
    element.addEventListener("pointerdown", () => cursorAura.classList.add("is-hover"));
    element.addEventListener("pointerup", () => cursorAura.classList.remove("is-hover"));
  });
}

// Mobile menu uses real links, closes on selection, and returns focus to its trigger.
const menuToggle = document.querySelector(".menu-toggle");
const mobileMenu = document.querySelector(".mobile-menu");
const setMenuOpen = (open) => {
  menuToggle.setAttribute("aria-expanded", String(open));
  menuToggle.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
  mobileMenu.setAttribute("aria-hidden", String(!open));
  mobileMenu.classList.toggle("is-open", open);
  document.body.classList.toggle("menu-open", open);
};
menuToggle.addEventListener("click", () => setMenuOpen(menuToggle.getAttribute("aria-expanded") !== "true"));
mobileMenu.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => setMenuOpen(false));
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && menuToggle.getAttribute("aria-expanded") === "true") {
    setMenuOpen(false);
    menuToggle.focus();
  }
});

// Copy-to-clipboard has both success and failure feedback for insecure/local contexts.
const copyButton = document.querySelector("[data-copy-email]");
const copyFeedback = document.querySelector(".copy-feedback");
let feedbackTimer;
copyButton.addEventListener("click", async () => {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(SITE.email);
    } else {
      const field = document.createElement("textarea");
      field.value = SITE.email;
      field.setAttribute("readonly", "");
      field.style.position = "fixed";
      field.style.opacity = "0";
      document.body.appendChild(field);
      field.select();
      const copied = document.execCommand("copy");
      field.remove();
      if (!copied) throw new Error("Clipboard unavailable");
    }
    copyFeedback.textContent = "COPIED";
  } catch {
    copyFeedback.textContent = "SELECT THE EMAIL ABOVE";
  }
  clearTimeout(feedbackTimer);
  feedbackTimer = window.setTimeout(() => { copyFeedback.textContent = ""; }, 2600);
});
