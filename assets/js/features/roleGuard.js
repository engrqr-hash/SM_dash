import { Store } from "../core/store.js";

const routeRoles = {
  approvals: ["admin","editor"],
  ads: ["admin","editor"],
  marketplace: ["admin"],
  competitors: ["admin","editor","analyst"],
  influencers: ["admin","editor","analyst"],
  forecast: ["admin","analyst"],
  reports: ["admin","analyst"]
};

export function initRoleGuard() {
  window.addEventListener("hashchange", enforce);
  enforce();
}

function enforce() {
  const route = location.hash.replace("#","");
  const needed = routeRoles[route];
  if (!needed) return;
  const roles = Store.state.roles;
  if (!roles.some(r => needed.includes(r))) {
    location.hash = "#dashboard";
  }
}