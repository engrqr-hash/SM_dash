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
import { renderStrategy } from "./views/strategy.js";
import { renderCompetitors } from "./views/competitors.js";
import { renderInfluencers } from "./views/influencers.js";
import { renderAds } from "./views/ads.js";
import { renderReports } from "./views/reports.js";
import { renderApprovals } from "./views/approvals.js";
import { renderMarketplace } from "./views/marketplace.js";
import { renderForecast } from "./views/forecast.js";

import { initGlobalSearch } from "./features/globalSearch.js";
import { initThemeToggle } from "./features/themeToggle.js";
import { toast } from "./ui/toast.js";
import { initMockRealtime } from "./mock/realtime.js";
import { initDragDropCalendar } from "./features/dragDropCalendar.js";
import { initEvergreenWorker } from "./features/evergreenWorker.js";
import { initRoleGuard } from "./features/roleGuard.js";
import { EventBus } from "./core/events.js";

window.addEventListener("DOMContentLoaded", () => {
  Store.init();
  registerGlobalComponents();

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
    billing: renderBilling,
    strategy: renderStrategy,
    competitors: renderCompetitors,
    influencers: renderInfluencers,
    ads: renderAds,
    reports: renderReports,
    approvals: renderApprovals,
    marketplace: renderMarketplace,
    forecast: renderForecast
  });

  if (!location.hash) location.hash = "#dashboard";
  Router.resolve();

  document.getElementById("year").textContent = new Date().getFullYear();
  initGlobalSearch();
  initThemeToggle();
  initUserMenu();
  initQuickCompose();
  initMockRealtime();
  initDragDropCalendar();
  initEvergreenWorker();
  initRoleGuard();

  updateAICreditsBadge();

  Store.subscribe(updateAICreditsBadge);

  toast("Power features loaded ⚡");
});

function updateAICreditsBadge() {
  const badge = document.getElementById("aiCreditsBadge");
  if (!badge) return;
  const credits = Store.state.aiCredits;
  badge.textContent = "AI: " + credits;
  badge.classList.toggle("danger", credits < 20);
}

function initUserMenu() {
  const btn = document.getElementById("userMenuBtn");
  const dd = document.getElementById("userDropdown");
  btn.addEventListener("click", () => {
    dd.toggleAttribute("hidden");
  });
  document.addEventListener("click", e => {
    if (!btn.contains(e.target) && !dd.contains(e.target)) dd.setAttribute("hidden","");
  });
  dd.addEventListener("click", e => {
    const act = e.target.dataset.action;
    if (act === "logout") {
      toast("Simulated logout");
    }
  });
}

function initQuickCompose() {
  document.getElementById("quickComposeBtn").addEventListener("click", () => {
    location.hash = "#compose";
    toast("Compose ready ✨");
  });
}

EventBus.on("ai:consume", amt => {
  Store.update("aiCredits", (Store.state.aiCredits - amt));
  if (Store.state.aiCredits < 10) {
    toast("AI credits low. Consider upgrading.", { type:"warn" });
  }
});