/* =========================
   MENU BURGER (mobile)
========================= */
const burger = document.getElementById("burger");
const menu = document.getElementById("menu");

if (burger && menu) {
  burger.addEventListener("click", () => {
    const expanded = burger.getAttribute("aria-expanded") === "true";
    burger.setAttribute("aria-expanded", String(!expanded));
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
   SUR LIGNAGE MENU AU SCROLL (FIABLE)
   -> IntersectionObserver
========================= */
const navLinks = document.querySelectorAll(".nav-link");
const sections = document.querySelectorAll("section[id]");

function setActive(id) {
  navLinks.forEach(link => {
    const href = link.getAttribute("href") || "";
    link.classList.toggle("active", href === `#${id}`);
  });
}

// Valeur par défaut
setActive("accueil");

if ("IntersectionObserver" in window) {
  const spyObserver = new IntersectionObserver(
    entries => {
      // On prend la section la plus visible parmi celles intersectées
      const visible = entries
        .filter(e => e.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

      if (visible?.target?.id) {
        setActive(visible.target.id);
      }

      // Cas particulier : si on est tout en bas, on force Contact actif
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 2) {
        setActive("contact");
      }
    },
    {
      // On "vise" la zone milieu d'écran, stable même avec padding/sections longues
      root: null,
      threshold: [0.2, 0.35, 0.5, 0.65],
      rootMargin: "-35% 0px -55% 0px"
    }
  );

  sections.forEach(section => spyObserver.observe(section));
} else {
  // Fallback si navigateur ancien
  function setActiveLinkFallback() {
    let currentId = "accueil";
    const y = window.scrollY + 150;

    sections.forEach(section => {
      if (section.offsetTop <= y) currentId = section.id;
    });

    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 2) {
      currentId = "contact";
    }

    setActive(currentId);
  }

  window.addEventListener("scroll", setActiveLinkFallback);
  window.addEventListener("load", setActiveLinkFallback);
}

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
          el.textContent = String(target);
          clearInterval(interval);
        } else {
          el.textContent = String(current);
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
      "<p>Suivi simple : indicateurs, qualité des données, export.</p>"
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
  year.textContent = String(new Date().getFullYear());
}
