import { Store } from "../core/store.js";
import { nanoid } from "../utils/id.js";
import { toast } from "../ui/toast.js";

export function renderAds(root) {
  const campaigns = Store.get("campaigns").slice();
  root.innerHTML = `
    <section class="fade-in">
      <h1>Ad Campaign Management</h1>
      <p class="dim small">Budget tracking, ROI simulation.</p>
      <form id="campForm" class="inline-form" style="margin:.8rem 0;">
        <input name="name" placeholder="Campaign Name" required />
        <select name="platform">
          <option value="facebook">Facebook</option>
          <option value="instagram">Instagram</option>
          <option value="linkedin">LinkedIn</option>
          <option value="tiktok">TikTok</option>
        </select>
        <input name="budget" type="number" placeholder="Budget" required />
        <button class="btn small">Add Campaign</button>
      </form>
      <div class="grid cols-flex">
        ${campaigns.map(c=>card(c)).join("") || `<div class="empty-state small" style="grid-column:1/-1;"><h3>No Campaigns</h3><p>Create one to begin tracking.</p></div>`}
      </div>
    </section>
  `;

  root.querySelector("#campForm").addEventListener("submit", e => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const camp = {
      id:"camp_"+nanoid(),
      name: fd.get("name"),
      platform: fd.get("platform"),
      budget: +fd.get("budget"),
      spent: 0,
      impressions:0,
      clicks:0,
      conversions:0,
      status:"active"
    };
    Store.push("campaigns", camp);
    toast("Campaign added");
    renderAds(root);
  });

  root.querySelectorAll("[data-action='simulate']").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.id;
      const list = Store.get("campaigns").slice();
      const camp = list.find(c=>c.id===id);
      if (!camp) return;
      // simple growth simulation
      const spendInc = Math.min( (camp.budget - camp.spent), Math.random()* (camp.budget*.1));
      camp.spent += spendInc;
      camp.impressions += Math.round(spendInc * (200 + Math.random()*300));
      camp.clicks += Math.round(spendInc * (8 + Math.random()*10));
      camp.conversions += Math.round(spendInc * (1 + Math.random()*2));
      Store.replaceArray("campaigns", list);
      toast("Simulated spend + metrics");
      renderAds(root);
    });
  });
}

function card(c) {
  const ctr = c.impressions ? (c.clicks / c.impressions *100).toFixed(2):"0.00";
  const cvr = c.clicks ? (c.conversions / c.clicks *100).toFixed(2):"0.00";
  const roi = c.spent ? ((c.conversions*25 - c.spent)/c.spent *100).toFixed(2):"0.00";
  return `
    <div class="card">
      <div class="flex between small">
        <strong>${c.name}</strong>
        <span class="badge">${c.platform}</span>
      </div>
      <div class="dim" style="font-size:.55rem;">Budget: $${c.budget.toFixed(2)} · Spent: $${c.spent.toFixed(2)}</div>
      <div style="font-size:.65rem; margin-top:.4rem;">
        Impr: ${c.impressions.toLocaleString()}<br/>
        Clicks: ${c.clicks.toLocaleString()} (CTR ${ctr}%)<br/>
        Conv: ${c.conversions} (CVR ${cvr}%)<br/>
        ROI: ${roi}% (simulated)
      </div>
      <button class="btn outline small" data-action="simulate" data-id="${c.id}" style="margin-top:.6rem;">Simulate +</button>
    </div>
  `;
}