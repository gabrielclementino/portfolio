const header = document.querySelector('[data-header]');
const menuToggle = document.querySelector('[data-menu-toggle]');
const nav = document.querySelector('[data-nav]');

const updateHeader = () => {
  header?.classList.toggle('is-scrolled', window.scrollY > 30);
};

updateHeader();
window.addEventListener('scroll', updateHeader, { passive: true });

menuToggle?.addEventListener('click', () => {
  const isOpen = nav.classList.toggle('is-open');
  menuToggle.setAttribute('aria-expanded', String(isOpen));
});

nav?.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    nav.classList.remove('is-open');
    menuToggle?.setAttribute('aria-expanded', 'false');
  });
});

const revealItems = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealItems.forEach((item) => revealObserver.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add('is-visible'));
}

const filters = document.querySelectorAll('[data-filter]');
const projects = document.querySelectorAll('[data-category]');
const projectList = document.querySelector('.project-list');
filters.forEach((filter) => {
  filter.addEventListener('click', () => {
    const selected = filter.dataset.filter;

    filters.forEach((button) => {
      const isActive = button === filter;
      button.classList.toggle('is-active', isActive);
      button.setAttribute('aria-pressed', String(isActive));
    });

    projectList?.classList.add('is-filtered');
    projects.forEach((project) => {
      const shouldShow = project.dataset.category === selected;
      project.classList.toggle('is-hidden', !shouldShow);
    });
  });
});

// Some portfolio previews run inside a sandbox that blocks links with
// target="_blank". Open dashboards in a new tab when possible and fall back
// to the current page so the visitor is never left with a button that appears
// to do nothing.
document.querySelectorAll('.project-link').forEach((link) => {
  const projectTitle = link.closest('.project-card')?.querySelector('.project-meta span')?.textContent?.trim();
  const linkLabel = link.textContent.replace(/\s+/g, ' ').trim();

  link.setAttribute('aria-label', `${linkLabel}${projectTitle ? `, ${projectTitle}` : ''}; abre em nova aba`);

  link.addEventListener('click', (event) => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
      return;
    }

    event.preventDefault();

    try {
      const dashboardWindow = window.open(link.href, '_blank');

      if (dashboardWindow) {
        dashboardWindow.opener = null;
        return;
      }
    } catch (error) {
      // The same-tab fallback below also covers sandbox security errors.
    }

    window.location.assign(link.href);
  });
});

document.querySelectorAll('[data-year]').forEach((node) => {
  node.textContent = String(new Date().getFullYear());
});
