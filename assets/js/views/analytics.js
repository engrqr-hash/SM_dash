import { Store } from "../core/store.js";
import { shortNumber } from "../utils/format.js";
import { toast } from "../ui/toast.js";

export function renderAnalytics(root) {
  const analytics = Store.get("analytics");

  root.innerHTML = `
    <section class="fade-in">
      <h1>Analytics & Insights</h1>
      <p class="dim small">Engagement, reach, conversions, platform-specific deep dives.</p>

      <div class="grid cols-4" style="margin-top:1rem;">
        ${metric("Followers", shortNumber(analytics.summary.followers))}
        ${metric("Engagement Rate", analytics.summary.engagementRate+"%")}
        ${metric("Avg Reach (7d)", shortNumber(analytics.summary.avgReach7d))}
        ${metric("Growth 7d", analytics.summary.growth7d+"%")}
      </div>

      <div class="split" style="margin-top:1.3rem;">
        <div class="card">
          <div class="card-header">
            <div class="card-title">Platform Breakdown</div>
            <button class="btn small outline" data-action="export">Export CSV</button>
          </div>
          <div class="scroll-x">
            <table class="table">
              <thead><tr><th>Platform</th><th>Followers</th><th>ER</th><th>Quality</th></tr></thead>
              <tbody>
                ${Object.entries(analytics.platforms).map(([k,v]) => `
                  <tr>
                    <td style="text-transform:capitalize;">${k}</td>
                    <td>${shortNumber(v.followers)}</td>
                    <td>${v.engagement}%</td>
                    <td>${quality(v.engagement)}</td>
                  </tr>
                `).join("")}
              </tbody>
            </table>
          </div>
        </div>

        <div class="card">
          <div class="card-header"><div class="card-title">AI Insight Feed</div><button class="btn secondary small" data-action="refresh">Refresh</button></div>
          <ul style="font-size:.7rem; line-height:1.4; padding-left:1rem; margin:0;">
            <li>Experiment: Increase Reels frequency to 4x/week.</li>
            <li>Optimize: LinkedIn headlines under 68 chars perform better.</li>
            <li>Strategy: Repurpose top TikTok Short for YouTube cross-post.</li>
            <li>Timing: Saturday midday dip — reduce weekend slots.</li>
          </ul>
        </div>
      </div>
    </section>
  `;

  root.querySelector("[data-action='export']").addEventListener("click", () => {
    toast("Export job queued (simulation).");
  });
  root.querySelector("[data-action='refresh']").addEventListener("click", () => {
    toast("Fetching new AI insights...");
    setTimeout(()=>toast("AI insights updated"), 900);
  });
}

function metric(label, value) {
  return `
    <div class="card">
      <div class="card-title">${label}</div>
      <div style="font-size:1.3rem; font-weight:600; margin-top:.3rem;">${value}</div>
    </div>
  `;
}

function quality(er) {
  if (er >= 6) return "High";
  if (er >= 4) return "Medium";
  return "Low";
}