/* =========================
   MENU BURGER (mobile)
========================= */
const burger = document.getElementById("burger");
const menu = document.getElementById("menu");

if (burger && menu) {
  burger.addEventListener("click", () => {
    const expanded = burger.getAttribute("aria-expanded") === "true";
    burger.setAttribute("aria-expanded", !expanded);
    menu.classList.toggle("open");
  });

  // Fermer le menu au clic sur un lien
  document.querySelectorAll(".nav-link").forEach(link => {
    link.addEventListener("click", () => {
      menu.classList.remove("open");
      burger.setAttribute("aria-expanded", "false");
    });
  });
}

/* =========================
   SUR LIGNAGE MENU AU SCROLL
========================= */
const sections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll(".nav-link");

function setActiveLink() {
  let currentId = "";

  sections.forEach(section => {
    const sectionTop = section.offsetTop - 120; // offset header
    const sectionHeight = section.offsetHeight;

    if (
      window.scrollY >= sectionTop &&
      window.scrollY < sectionTop + sectionHeight
    ) {
      currentId = section.getAttribute("id");
    }
  });

  navLinks.forEach(link => {
    const href = link.getAttribute("href");
    link.classList.toggle("active", href === `#${currentId}`);
  });

  // 🔧 CAS PARTICULIER : tout en bas de la page → Contact actif
  if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 2) {
    navLinks.forEach(link => link.classList.remove("active"));
    document
      .querySelector('.nav-link[href="#contact"]')
      ?.classList.add("active");
  }
}

window.addEventListener("scroll", setActiveLink);
window.addEventListener("load", setActiveLink);

/* =========================
   BOUTON RETOUR EN HAUT
========================= */
const toTop = document.getElementById("toTop");

if (toTop) {
  window.addEventListener("scroll", () => {
    toTop.classList.toggle("show", window.scrollY > 400);
  });

  toTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

/* =========================
   ANIMATION BARRES DE COMPÉTENCES
========================= */
const skillBars = document.querySelectorAll(".bar");

const observer = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const bar = entry.target;
        const value = bar.getAttribute("data-progress");
        const fill = bar.querySelector(".fill");
        if (fill) {
          fill.style.width = value + "%";
        }
        observer.unobserve(bar);
      }
    });
  },
  { threshold: 0.6 }
);

skillBars.forEach(bar => observer.observe(bar));

/* =========================
   COMPTEURS HERO
========================= */
const counters = document.querySelectorAll("[data-counter]");

const counterObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;

      const el = entry.target;
      const target = +el.dataset.counter;
      let current = 0;
      const step = Math.max(1, Math.floor(target / 40));

      const interval = setInterval(() => {
        current += step;
        if (current >= target) {
          el.textContent = target;
          clearInterval(interval);
        } else {
          el.textContent = current;
        }
      }, 20);

      counterObserver.unobserve(el);
    });
  },
  { threshold: 0.8 }
);

counters.forEach(c => counterObserver.observe(c));

/* =========================
   MODALE PROJETS
========================= */
const modal = document.getElementById("modal");
const modalContent = document.getElementById("modalContent");

const projects = {
  1: {
    title: "CV Web + GitHub Pages",
    content:
      "<p>Site vitrine responsive avec animations, navigation active et déploiement via GitHub Pages.</p>"
  },
  2: {
    title: "Automatisation inventaire",
    content:
      "<p>Scripts et documentation pour fiabiliser l’inventaire et réduire les erreurs.</p>"
  },
  3: {
    title: "Dashboard / suivi",
    content:
      "<p>Suivi simple des indicateurs, qualité des données et reporting.</p>"
  }
};

document.querySelectorAll(".project").forEach(btn => {
  btn.addEventListener("click", () => {
    const id = btn.dataset.project;
    if (!projects[id]) return;

    modalContent.innerHTML = `
      <h3>${projects[id].title}</h3>
      ${projects[id].content}
    `;
    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
  });
});

// Fermeture modale
document.querySelectorAll("[data-close]").forEach(el => {
  el.addEventListener("click", () => {
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
  });
});

/* =========================
   FOOTER YEAR
========================= */
const year = document.getElementById("year");
if (year) {
  year.textContent = new Date().getFullYear();
}
