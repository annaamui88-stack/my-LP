document.addEventListener('DOMContentLoaded', () => {
  const scriptElement = document.querySelector('script[src*="components.js"]');
  let basePath = '../';
  if (scriptElement) {
    const src = scriptElement.getAttribute('src');
    const depth = (src.match(/\.\.\//g) || []).length;
    basePath = '../'.repeat(depth);
  }
  const loadComponent = (elementId, fileName) => {
    const targetElement = document.getElementById(elementId);
    if (!targetElement) return;
    const fullPath = `${basePath}components/${fileName}`;
    fetch(fullPath)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP Error ${response.status}: Gagal memuat ${fullPath}`);
        }
        return response.text();
      })
      .then(html => {
        targetElement.innerHTML = html;
      })
      .catch(error => {
        console.error(`[Component Error]`, error);
      });
  };
  loadComponent('header-component', 'header.html');
  loadComponent('footer-component', 'footer.html');
  loadComponent('navigation-component', 'navigation-blog.html');
  loadComponent('wa-component', 'wa.html');
});
