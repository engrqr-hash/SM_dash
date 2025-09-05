import { Store } from "../core/store.js";
import { formatTimeRelative, shortNumber } from "../utils/format.js";
import { toast } from "../ui/toast.js";

export function renderDashboard(root) {
  const user = Store.get("user");
  const analytics = Store.get("analytics");
  const scheduled = Store.get("scheduled").slice().sort((a,b)=>a.time-b.time);

  const upcoming = scheduled.filter(p => p.time > Date.now()).slice(0,4);

  root.innerHTML = `
    <section class="fade-in">
      <h1>Welcome back, <span class="hl-accent">${user.name.split(" ")[0]}</span></h1>
      <p class="dim small">Timezone: ${user.timezone} · Plan: <strong>${Store.state.plan}</strong> · AI Credits: <strong>${Store.state.aiCredits}</strong></p>

      <div class="grid cols-4" style="margin-top:1.2rem;">
        ${metricCard("Followers", shortNumber(analytics.summary.followers), "+2.4%")}
        ${metricCard("Engagement Rate", analytics.summary.engagementRate+"%", "+0.3%")}
        ${metricCard("Avg Reach (7d)", shortNumber(analytics.summary.avgReach7d), "+6.2%")}
        ${metricCard("Growth (7d)", analytics.summary.growth7d+"%", "Stable")}
      </div>

      <div class="split" style="margin-top:1.2rem;">
        <div class="card">
          <div class="card-header"><div class="card-title">Upcoming Posts</div><button class="btn outline small" data-action="new-post">+ New</button></div>
          ${upcoming.length === 0 ? `<div class="empty-state small"><h3>No scheduled posts</h3><p>Add content to stay consistent.</p></div>` : `
          <ul class="flex col gap-sm" style="margin:0; padding:0; list-style:none;">
            ${upcoming.map(p => `
              <li class="flex between gap-sm" data-id="${p.id}">
                <div style="flex:1; min-width:0;">
                  <div class="small" style="font-weight:600; color:var(--txt-dim); text-transform:uppercase; letter-spacing:.5px;">${p.platform}</div>
                  <div style="font-size:.75rem; white-space:nowrap; text-overflow:ellipsis; overflow:hidden;">${p.content}</div>
                  <div class="dim small">${formatTimeRelative(p.time)}</div>
                </div>
                <button class="icon-btn small" data-action="preview" title="Preview">👁️</button>
              </li>
            `).join("")}
          </ul>`}
        </div>

        <div class="card">
          <div class="card-header"><div class="card-title">Platform Health</div></div>
          <div class="flex col gap-sm">
            ${Object.entries(analytics.platforms).map(([key,val]) => {
              const eng = val.engagement;
              const status = eng > 6 ? "ok" : eng > 3 ? "warn" : "danger";
              return `
              <div class="flex between gap-sm small">
                <div class="flex gap-sm" style="align-items:center;">
                  <span class="status-dot ${status}"></span>
                  <strong style="text-transform:capitalize;">${key}</strong>
                </div>
                <div class="dim">ER: ${eng}% · ${shortNumber(val.followers)}</div>
              </div>`;
            }).join("")}
          </div>
        </div>

        <div class="card">
          <div class="card-header"><div class="card-title">AI Insights</div><button class="btn secondary small" data-action="refresh-ai">Refresh</button></div>
          <ul style="margin:0; padding-left:1rem; font-size:.7rem; line-height:1.35;">
            <li>Reels driving strongest engagement (↑ 7.4% ER)</li>
            <li>LinkedIn articles underperforming relative to peers</li>
            <li>Best slot emerging: Tue & Thu 10–11 AM local</li>
          </ul>
        </div>

        <div class="card">
          <div class="card-header"><div class="card-title">Tasks / Approvals</div></div>
          <div class="empty-state small">
            <h3>Nothing pending</h3>
            <p>All drafts are approved. Great job! ✅</p>
          </div>
        </div>
      </div>
    </section>
  `;

  root.querySelectorAll("[data-action='new-post']").forEach(btn => {
    btn.addEventListener("click", () => {
      location.hash = "#compose";
    });
  });
  root.querySelectorAll("[data-action='preview']").forEach(btn => {
    btn.addEventListener("click", () => toast("Preview coming soon"));
  });
  root.querySelector("[data-action='refresh-ai']")?.addEventListener("click", () => {
    toast("Generating fresh AI insights...");
    setTimeout(()=>toast("AI insights updated."), 1200);
  });
}

function metricCard(label, value, trend) {
  return `
    <div class="card">
      <div class="card-header">
        <div class="card-title">${label}</div>
      </div>
      <div class="metric-value">${value} <span class="metric-trend">${trend}</span></div>
    </div>
  `;
}