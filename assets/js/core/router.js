/**
 * Basic hash router
 */
export const Router = {
  routes: {},
  current: null,

  register(mapping) {
    Object.assign(this.routes, mapping);
    window.addEventListener("hashchange", () => this.resolve());
  },

  resolve() {
    const hash = location.hash.replace("#", "") || "dashboard";
    const view = document.getElementById("viewContainer");
    const fn = this.routes[hash];
    this.highlightNav(hash);
    if (!fn) {
      view.innerHTML = `<div class="empty-state fade-in"><h3>Not Found</h3><p>Route "${hash}" not registered.</p></div>`;
      return;
    }
    this.current = hash;
    requestAnimationFrame(() => fn(view));
    view.focus();
  },

  highlightNav(route) {
    document.querySelectorAll(".nav a").forEach(a => {
      a.classList.toggle("active", a.getAttribute("data-route") === route);
    });
  }
};