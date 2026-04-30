async function injectPartials() {
  try {
    const [headerHtml, footerHtml] = await Promise.all([
      fetch('partials/header.html').then(r => r.text()),
      fetch('partials/footer.html').then(r => r.text())
    ]);
    const headerMount = document.getElementById('site-header');
    const footerMount = document.getElementById('site-footer');
    if (headerMount) headerMount.innerHTML = headerHtml;
    if (footerMount) footerMount.innerHTML = footerHtml;

    // Inicializar navegación después de inyectar
    initInjectedNavigation();
  } catch (e) {
    console.error('No se pudieron cargar los parciales', e);
  }
}

function initInjectedNavigation() {
  const header = document.getElementById('header');
  const hamburger = document.querySelector('header .hamburger');
  const headerNavMenu = document.querySelector('header .nav-menu');
  const sideMenu = document.getElementById('side-menu');
  const hamburgerBtn = document.getElementById('hamburger-btn');
  const closeMenu = document.getElementById('close-menu');
  const sideMenuPages = document.getElementById('side-menu-pages');

  // Header dropdown
  if (hamburger && headerNavMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      headerNavMenu.classList.toggle('active');
    });
    headerNavMenu.addEventListener('click', () => {
      headerNavMenu.classList.remove('active');
      hamburger.classList.remove('active');
    });
  }

  // Scroll header style
  if (header) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) header.classList.add('scrolled');
      else header.classList.remove('scrolled');
    });
  }

  // Side menu open/close
  if (hamburgerBtn) {
    hamburgerBtn.addEventListener('click', () => {
      sideMenu && sideMenu.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  }
  if (closeMenu) {
    closeMenu.addEventListener('click', () => {
      sideMenu && sideMenu.classList.remove('open');
      document.body.style.overflow = '';
    });
  }
  window.addEventListener('click', (e) => {
    if (e.target === sideMenu) {
      sideMenu.classList.remove('open');
      document.body.style.overflow = '';
    }
  });
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      sideMenu && sideMenu.classList.remove('open');
      document.body.style.overflow = '';
    }
  });
  const mq = window.matchMedia('(max-width: 900px)');
  const syncSideMenu = () => {
    if (!mq.matches && sideMenu) {
      sideMenu.classList.remove('open');
      document.body.style.overflow = '';
    }
  };
  mq.addEventListener ? mq.addEventListener('change', syncSideMenu) : mq.addListener(syncSideMenu);
  syncSideMenu();

  // 1) Popular menú lateral con enlaces entre páginas (conector principal)
  const pages = [
    { href: 'index.html', label: 'Principal' },
    { href: 'colegio.html', label: 'Colegios' },
    { href: 'evento-economia.html', label: 'Charla: Economía' },
    { href: 'evento-pensamiento.html', label: 'Taller: Pensamiento Crítico' },
    { href: 'investigacion-impacto.html', label: 'Investigación: Educación Cívica' },
    { href: 'investigacion-participacion.html', label: 'Investigación: Participación Joven' },
    { href: 'in.html', label: 'Datapolis Clásico' }
    // { href: 'jovenes.html', label: 'Jóvenes' } // agregar cuando esté lista
  ];
  if (sideMenuPages) {
    sideMenuPages.innerHTML = pages
      .map(p => `<li><a href="${p.href}">${p.label}</a></li>`)
      .join('');
  }

  // 2) Popular el nav superior con subsecciones según la página actual
  const path = location.pathname.split('/').pop() || 'index.html';
  const sectionMap = {
    'index.html': [
      { href: 'index.html#inicio', label: 'Inicio' },
      { href: 'index.html#quienes', label: 'Quiénes Somos' },
      { href: 'index.html#proyectos', label: 'Proyectos' },
      { href: 'index.html#investigaciones', label: 'Investigaciones' },
      { href: 'index.html#eventos', label: 'Eventos' },
      { href: 'index.html#equipo', label: 'Equipo' },
      { href: 'index.html#contacto', label: 'Contacto' }
    ],
    'evento-economia.html': [
      { href: 'index.html#eventos', label: 'Eventos' },
      { href: 'index.html#contacto', label: 'Contacto' }
    ],
    'evento-pensamiento.html': [
      { href: 'index.html#eventos', label: 'Eventos' },
      { href: 'index.html#contacto', label: 'Contacto' }
    ],
    'investigacion-impacto.html': [
      { href: 'index.html#investigaciones', label: 'Investigaciones' },
      { href: 'index.html#contacto', label: 'Contacto' }
    ],
    'investigacion-participacion.html': [
      { href: 'index.html#investigaciones', label: 'Investigaciones' },
      { href: 'index.html#contacto', label: 'Contacto' }
    ],
    'colegio.html': [
      { href: 'index.html#proyectos', label: 'Proyectos' },
      { href: 'index.html#contacto', label: 'Contacto' }
    ],
    'in.html': [
      { href: 'index.html#inicio', label: 'Inicio' },
      { href: 'index.html#proyectos', label: 'Proyectos' },
      { href: 'index.html#contacto', label: 'Contacto' }
    ]
  };
  const sections = sectionMap[path] || sectionMap['index.html'];
  if (headerNavMenu) {
    headerNavMenu.innerHTML = sections
      .map(s => `<li><a href="${s.href}" class="nav-link">${s.label}</a></li>`)
      .join('');
  }
}

document.addEventListener('DOMContentLoaded', injectPartials);

// Inyecta estilos mínimos compartidos para header/hamburguesa/side-menu
(function injectSharedNavCSS(){
  const id = 'shared-header-nav-styles';
  if (document.getElementById(id)) return;
  const css = `
  header .hamburger { display: none; flex-direction: column; cursor: pointer; gap: 6px; padding: 8px; border-radius: 8px; }
  header .hamburger span { width: 28px; height: 3px; background: linear-gradient(90deg, #FFD700, #FFA500); border-radius: 3px; }
  @media (max-width: 900px) {
    header .hamburger { display: flex; }
    header .nav-menu { display: none; position: absolute; top: 64px; right: 12px; background: #fff; border: 1px solid rgba(0,0,0,0.08); border-radius: 12px; box-shadow: 0 10px 30px rgba(0,0,0,0.08); flex-direction: column; gap: 8px; padding: 12px 14px; z-index: 3000; }
    header .nav-menu.active { display: flex; }
  }
  .hamburger-btn { position: fixed; top: 22px; right: 22px; z-index: 3500; width: 44px; height: 44px; display: none; flex-direction: column; justify-content: center; align-items: center; background: rgba(255,255,255,0.92); border-radius: 12px; border: none; box-shadow: 0 2px 12px rgba(0,0,0,0.08); cursor: pointer; }
  .hamburger-btn span { display: block; height: 4px; width: 28px; background: #232323; border-radius: 2px; margin: 4px 0; }
  @media (max-width: 900px) { .hamburger-btn { display: flex; } }
  .side-menu { position: fixed; top: 0; right: 0; width: 320px; max-width: 90vw; height: 100%; background: linear-gradient(135deg, #232323 80%, #ffdd00 100%); color: #fff; z-index: 4000; transform: translateX(100%) !important; transition: transform 0.35s cubic-bezier(.77,0,.18,1); box-shadow: -2px 0 18px rgba(0,0,0,0.18); padding: 48px 0 0 0; display: flex; flex-direction: column; border-radius: 0 0 0 18px; }
  .side-menu.open { transform: translateX(0) !important; }
  .side-menu ul { list-style: none; padding: 0 24px; margin: 0; display: flex; flex-direction: column; gap: 10px; }
  .side-menu a { color: #ffdd00; text-decoration: none; font-weight: 600; padding: 10px 0; }
  .close-menu { position: absolute; top: 18px; right: 18px; background: none; border: none; font-size: 2.2rem; color: #ffdd00; cursor: pointer; }
  `;
  const style = document.createElement('style');
  style.id = id;
  style.textContent = css;
  document.head.appendChild(style);
})();
