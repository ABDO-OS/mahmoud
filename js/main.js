const revealItems = document.querySelectorAll("[data-reveal]");
const counters = document.querySelectorAll("[data-count]");
const navLinks = document.querySelectorAll(".nav-links a");
const sections = [...navLinks]
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);

const formatNumber = (value) => new Intl.NumberFormat("en-US").format(value);

const animateCounter = (counter) => {
  if (counter.dataset.done) return;

  counter.dataset.done = "true";
  const target = Number(counter.dataset.count);
  const suffix = counter.dataset.suffix || "";
  const duration = 1200;
  const start = performance.now();

  const tick = (now) => {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.round(target * eased);

    counter.textContent = `${formatNumber(current)}${suffix}`;

    if (progress < 1) {
      requestAnimationFrame(tick);
    }
  };

  requestAnimationFrame(tick);
};

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      entry.target.classList.add("is-visible");
      revealObserver.unobserve(entry.target);
    });
  },
  { threshold: 0.18 }
);

const counterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) animateCounter(entry.target);
    });
  },
  { threshold: 0.6 }
);

const updateActiveNav = () => {
  const current = sections.findLast((section) => section.offsetTop <= window.scrollY + 160);
  if (!current) return;

  navLinks.forEach((link) => {
    link.classList.toggle("is-active", link.getAttribute("href") === `#${current.id}`);
  });
};

revealItems.forEach((item, index) => {
  item.style.transitionDelay = `${Math.min(index % 4, 3) * 70}ms`;
  revealObserver.observe(item);
});

counters.forEach((counter) => counterObserver.observe(counter));
window.addEventListener("scroll", updateActiveNav, { passive: true });
updateActiveNav();
