import { Store } from "../core/store.js";
import { nanoid } from "../utils/id.js";
import { toast } from "../ui/toast.js";

export function renderInfluencers(root) {
  const infl = Store.get("influencers").slice();
  root.innerHTML = `
    <section class="fade-in">
      <h1>Influencer Collaboration</h1>
      <p class="dim small">Track prospects, outreach, negotiation, active collabs.</p>
      <div class="inline-form" style="margin:.8rem 0;">
        <input id="infHandle" placeholder="@handle" />
        <select id="infPlatform">
          <option value="instagram">Instagram</option>
          <option value="tiktok">TikTok</option>
          <option value="youtube">YouTube</option>
        </select>
        <input id="infReach" type="number" placeholder="Reach" />
        <button class="btn small" id="addInfBtn">Add</button>
      </div>
      <div class="kanban">
        ${col("Prospect", "prospect", infl.filter(i=>i.status==="prospect"))}
        ${col("Outreach Sent", "outreach-sent", infl.filter(i=>i.status==="outreach-sent"))}
        ${col("Negotiating", "negotiating", infl.filter(i=>i.status==="negotiating"))}
        ${col("Active", "active", infl.filter(i=>i.status==="active"))}
      </div>
    </section>
  `;

  document.getElementById("addInfBtn").addEventListener("click", () => {
    const handle = document.getElementById("infHandle").value.trim();
    if (!handle) return;
    Store.push("influencers", {
      id:"inf_"+nanoid(),
      handle,
      platform: document.getElementById("infPlatform").value,
      reach: +document.getElementById("infReach").value || 0,
      status:"prospect",
      notes:""
    });
    toast("Influencer added");
    renderInfluencers(root);
  });

  root.querySelectorAll("[data-action='advance']").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.id;
      const items = Store.get("influencers").slice();
      const item = items.find(i=>i.id===id);
      if (!item) return;
      item.status = next(item.status);
      Store.replaceArray("influencers", items);
      toast("Moved to "+item.status);
      renderInfluencers(root);
    });
  });
}

function col(title, key, list) {
  return `
    <div class="kanban-col">
      <h3>${title} (${list.length})</h3>
      <div class="flex col gap-sm">
        ${list.map(i => `
          <div class="card" style="padding:.55rem .6rem;">
            <div style="font-size:.7rem; font-weight:600;">${i.handle}</div>
            <div class="dim" style="font-size:.55rem;">${i.platform} · Reach ${i.reach.toLocaleString()}</div>
            <div style="margin-top:.35rem;">
              ${i.status!=="active"? `<button data-id="${i.id}" data-action="advance" class="btn outline small">Advance →</button>`:``}
            </div>
          </div>
        `).join("") || `<div class="dim small">None</div>`}
      </div>
    </div>
  `;
}

function next(s) {
  return ({
    "prospect":"outreach-sent",
    "outreach-sent":"negotiating",
    "negotiating":"active",
    "active":"active"
  })[s] || "prospect";
}