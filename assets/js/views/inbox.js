import { Store } from "../core/store.js";
import { formatTimeRelative } from "../utils/format.js";
import { toast } from "../ui/toast.js";

export function renderInbox(root) {
  const inbox = Store.get("inbox").slice().sort((a,b)=>b.time-a.time);

  root.innerHTML = `
    <section class="fade-in">
      <h1>Unified Inbox</h1>
      <p class="dim small">Comments, mentions, messages; AI reply suggestions & sentiment.</p>
      <div class="split">
        <div class="card" style="grid-column:1 / span 2;">
          <div class="card-header"><div class="card-title">Recent Activity</div><button class="btn small outline" data-action="moderate">Auto-Moderate</button></div>
          <div class="flex col gap-sm" id="inboxList">
            ${inbox.map(item => inboxRow(item)).join("")}
          </div>
        </div>
        <div class="card">
          <div class="card-header"><div class="card-title">AI Reply Draft</div></div>
          <div id="aiDraft" class="empty-state small"><h3>Select an item</h3><p>AI will generate tone-adjusted suggestions.</p></div>
        </div>
      </div>
    </section>
  `;

  root.querySelectorAll("[data-id]").forEach(row => {
    row.addEventListener("click", () => {
      const id = row.dataset.id;
      const item = inbox.find(i=>i.id===id);
      generateAIDraft(item, root.querySelector("#aiDraft"));
    });
  });

  root.querySelector("[data-action='moderate']").addEventListener("click", () => {
    toast("Auto-moderation simulated (spam hidden).");
  });
}

function inboxRow(item) {
  return `
    <div class="card" data-id="${item.id}" style="padding:.6rem .7rem; cursor:pointer;">
      <div class="flex between small">
        <div class="flex col" style="gap:.3rem;">
          <div><strong>${item.author}</strong> · <span class="dim">${item.platform}</span></div>
          <div style="font-size:.7rem; line-height:1.3;">${item.text}</div>
          <div class="dim" style="font-size:.55rem;">${formatTimeRelative(item.time)} · Sentiment: ${sentimentBadge(item.sentiment)}</div>
        </div>
      </div>
    </div>
  `;
}

function sentimentBadge(sentiment) {
  const color = sentiment === "positive" ? "var(--success)" : sentiment === "negative" ? "var(--danger)" : "var(--txt-dim)";
  return `<span style="color:${color}; font-weight:600;">${sentiment}</span>`;
}

function generateAIDraft(item, container) {
  container.innerHTML = `<div class="small dim">Analyzing context...</div>`;
  setTimeout(()=>{
    container.classList.remove("empty-state");
    container.innerHTML = `
      <div style="font-size:.7rem; line-height:1.4;">
        <div class="dim" style="font-size:.6rem; letter-spacing:.6px; text-transform:uppercase; margin-bottom:.35rem;">Original</div>
        <blockquote style="margin:0 0 .7rem; border-left:2px solid var(--border); padding-left:.5rem; font-style:italic; color:var(--txt-dim);">${item.text}</blockquote>
        <div class="dim" style="font-size:.6rem; letter-spacing:.6px; text-transform:uppercase; margin-bottom:.35rem;">Suggested Reply</div>
        <p>"Appreciate you sharing that! Let us pull a bit more data and we’ll follow up—curious what you’d like to see next?"</p>
        <div class="flex gap-sm">
          <button class="btn small">Use</button>
          <button class="btn outline small">Regenerate</button>
        </div>
      </div>
    `;
  }, 650);
}