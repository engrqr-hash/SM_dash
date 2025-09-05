import { Store } from "./core/store.js";
import { Router } from "./core/router.js";
import { registerGlobalComponents } from "./core/componentRegistry.js";
import { renderDashboard } from "./views/dashboard.js";
import { renderCalendar } from "./views/calendar.js";
import { renderCompose } from "./views/compose.js";
import { renderAnalytics } from "./views/analytics.js";
import { renderInbox } from "./views/inbox.js";
import { renderMedia } from "./views/media.js";
import { renderContent } from "./views/content.js";
import { renderTeam } from "./views/team.js";
import { renderSettings } from "./views/settings.js";
import { renderBilling } from "./views/billing.js";
import { initGlobalSearch } from "./features/globalSearch.js";
import { initThemeToggle } from "./features/themeToggle.js";
import { toast } from "./ui/toast.js";
import { initMockRealtime } from "./mock/realtime.js";

/**
 * Entry point
 */
window.addEventListener("DOMContentLoaded", () => {
  // Basic global state
  Store.init();

  registerGlobalComponents();

  // Map routes to view renderers
  Router.register({
    dashboard: renderDashboard,
    calendar: renderCalendar,
    compose: renderCompose,
    analytics: renderAnalytics,
    inbox: renderInbox,
    media: renderMedia,
    content: renderContent,
    team: renderTeam,
    settings: renderSettings,
    billing: renderBilling
  });

  // Fallback route
  if (!location.hash) location.hash = "#dashboard";
  Router.resolve();

  document.getElementById("year").textContent = new Date().getFullYear();

  // UI extensions
  initGlobalSearch();
  initThemeToggle();
  initUserMenu();
  initQuickCompose();
  initMockRealtime();

  toast("Welcome back, strategist! 🚀");
});

function initUserMenu() {
  const btn = document.getElementById("userMenuBtn");
  const dd = document.getElementById("userDropdown");
  btn.addEventListener("click", () => {
    const open = dd.hasAttribute("hidden") === false;
    dd.toggleAttribute("hidden", open);
  });
  document.addEventListener("click", e => {
    if (!btn.contains(e.target) && !dd.contains(e.target)) dd.setAttribute("hidden","");
  });
}

function initQuickCompose() {
  const btn = document.getElementById("quickComposeBtn");
  btn.addEventListener("click", () => {
    location.hash = "#compose";
    toast("Ready to create something engaging ✨");
  });
}

// Hot Module Replacement simulation placeholder
if (import.meta.hot) {
  import.meta.hot.accept(() => {
    console.log("HMR update");
  });
}