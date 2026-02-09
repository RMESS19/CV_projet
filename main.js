// Helper: select
const $ = (q, root = document) => root.querySelector(q);
const $$ = (q, root = document) => [...root.querySelectorAll(q)];

// Burger menu
const burger = $("#burger");
const menu = $("#menu");

if (burger && menu) {
  burger.addEventListener("click", () => {
    const open = menu.classList.toggle("open");
    burger.setAttribute("aria-expanded", open ? "true" : "false");
  });

  // close menu on click
  $$(".nav-link", menu).forEach(a => {
    a.addEventListener("click", () => {
      menu.classList.remove("open");
      burger.setAttribute("aria-expanded", "false");
    });
  });
}

// Active nav link on scroll
const sections = ["accueil","profil","competences","parcours","realisations","contact"]
  .map(id => document.getElementById(id))
  .filter(Boolean);

const navLinks = $$(".nav-link");

function setActiveLink() {
  const y = window.scrollY + 120; // header offset
  let currentId = "accueil";
  for (const s of sections) {
    if (s.offsetTop <= y) currentId = s.id;
  }
  navLinks.forEach(a => {
    const href = a.getAttribute("href") || "";
    a.classList.toggle("active", href === `#${currentId}`);
  });
}
window.addEventListener("scroll", setActiveLink);
setActiveLink();

// Reveal on scroll (IntersectionObserver)
const revealEls = $$(".reveal");
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add("in");
      io.unobserve(e.target);
    }
  });
}, { threshold: 0.12 });

revealEls.forEach(el => io.observe(el));

// Skills bars animate when visible
const bars = $$(".bar");
const ioBars = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    const bar = e.target;
    const pct = bar.getAttribute("data-progress") || "0";
    const fill = $(".fill", bar);
    if (fill) fill.style.width = `${pct}%`;
    ioBars.unobserve(bar);
  });
}, { threshold: 0.35 });

bars.forEach(b => ioBars.observe(b));

// Counters
function animateCounter(el, to, duration = 900) {
  const from = 0;
  const start = performance.now();
  function tick(now) {
    const t = Math.min((now - start) / duration, 1);
    const val = Math.floor(from + (to - from) * (t * (2 - t))); // easeOut
    el.textContent = String(val);
    if (t < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}
const counters = $$("[data-counter]");
const ioCounters = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    const el = e.target;
    const to = parseInt(el.getAttribute("data-counter") || "0", 10);
    animateCounter(el, to);
    ioCounters.unobserve(el);
  });
}, { threshold: 0.6 });
counters.forEach(c => ioCounters.observe(c));

// Modal projects
const modal = $("#modal");
const modalContent = $("#modalContent");

const projectsData = {
  1: {
    title: "CV Web + GitHub Pages",
    desc: "CV responsive avec animations au scroll, barres de compétences animées, modale projets et déploiement GitHub Pages.",
    list: ["Navigation sticky + liens actifs", "Animations IntersectionObserver", "Structure simple (HTML/CSS/JS)"]
  },
  2: {
    title: "Automatisation inventaire",
    desc: "Scripts + documentation pour standardiser et fiabiliser l’inventaire et les procédures.",
    list: ["Workflow clair", "Réduction erreurs", "Gain de temps"]
  },
  3: {
    title: "Dashboard / suivi",
    desc: "Suivi d’indicateurs, exports, lecture claire des données pour piloter les actions.",
    list: ["KPI simples", "Visualisation", "Process orienté utilisateur"]
  }
};

function openModal(html) {
  if (!modal || !modalContent) return;
  modalContent.innerHTML = html;
  modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}
function closeModal() {
  if (!modal) return;
  modal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

$$(".project").forEach(btn => {
  btn.addEventListener("click", () => {
    const id = btn.getAttribute("data-project");
    const p = projectsData[id];
    if (!p) return;
    const html = `
      <h3>${p.title}</h3>
      <p>${p.desc}</p>
      <ul>${p.list.map(x => `<li>${x}</li>`).join("")}</ul>
      <p class="small muted">Astuce : ajoute des liens GitHub / démo dans cette modale.</p>
    `;
    openModal(html);
  });
});

if (modal) {
  modal.addEventListener("click", (e) => {
    const t = e.target;
    if (t && t.getAttribute && t.getAttribute("data-close") === "true") closeModal();
  });
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.getAttribute("aria-hidden") === "false") closeModal();
  });
}

// Back to top
const toTop = $("#toTop");
function updateToTop() {
  if (!toTop) return;
  toTop.classList.toggle("show", window.scrollY > 600);
}
window.addEventListener("scroll", updateToTop);
updateToTop();

if (toTop) {
  toTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
}

// Footer year
const year = $("#year");
if (year) year.textContent = String(new Date().getFullYear());

// Contact form (demo)
const form = $("#contactForm");
const hint = $("#formHint");
if (form) {
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (hint) hint.textContent = "Message prêt (démo). Pour envoyer vraiment, il faut un backend (PHP / API).";
  });
}
