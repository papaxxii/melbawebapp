export function initSidebar() {
  const button = document.querySelector('#sidebar-toggle');
  if (!button) return;
  button.addEventListener('click', (ev)=>{
    const open = document.body.classList.toggle('side-nav-open');
    // Update ARIA
    button.setAttribute('aria-expanded', String(open));
    // update modal overlay visibility when toggled
    if (open) document.documentElement.style.overflow = 'hidden';
    else document.documentElement.style.overflow = '';
  });
  // Close sidebar when clicking outside it
  document.addEventListener('click', (ev) => {
    if (!document.body.classList.contains('side-nav-open')) return;
    // if click is inside nav or on toggle, ignore
    const inside = ev.target.closest('.navbar-left') || ev.target.closest('#sidebar-toggle');
    if (!inside) document.body.classList.remove('side-nav-open');
  });
}

// small helper for pages that are loaded as modules
export function toggleSidebar(value) {
  if (value === undefined) document.body.classList.toggle('side-nav-open');
  else if (value) document.body.classList.add('side-nav-open');
  else document.body.classList.remove('side-nav-open');
}
