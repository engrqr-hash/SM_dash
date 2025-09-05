export function initThemeToggle() {
  const btn = document.getElementById("themeToggle");
  if (!btn) return;
  btn.addEventListener("click", () => {
    const html = document.documentElement;
    const next = html.getAttribute("data-theme") === "light" ? "dark" : "light";
    html.setAttribute("data-theme", next);
    localStorage.setItem("uc_theme", next);
  });
  const persisted = localStorage.getItem("uc_theme");
  if (persisted) document.documentElement.setAttribute("data-theme", persisted);
}