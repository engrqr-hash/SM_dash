import { Store } from "../core/store.js";
import { formatTimeRelative } from "../utils/format.js";
import { toast } from "../ui/toast.js";

export function renderInbox(root) {
  const inbox = Store.get("inbox").slice().sort((a,b)=>b.time-a.time);

  root.innerHTML = `
    <section class="fade-in">
      <h1>Unified Inbox</h1>
      <p class="dim small">Moderate & reply with AI assistance.</p>
      <div class="flex gap-sm" style="margin:.6rem 0;">
        <button class="btn outline small" id="bulkHideBtn">Hide Spam</button>
        <button class="btn outline small" id="bulkPositiveBtn">Mark Positive</button>
      </div>
      <div class="split">
        <div class="card" style="grid-column:1 / span 2;">
          <div class="card-header"><div class="card-title">Recent Activity</div></div>
          <div class="flex col gap-sm" id="inboxList">
            ${inbox.map(item => inboxRow(item)).join("")}
          </div>
        </div>
        <div class="card">
          <div class="card-header"><div class="card-title">AI Reply Draft</div><button class="btn secondary small" id="regenDraft" disabled>Regenerate</button></div>
          <div id="aiDraft" class="empty-state small"><h3>Select an item</h3><p>AI will generate suggestions.</p></div>
        </div>
      </div>
    </section>
  `;

  let current = null;

  root.querySelectorAll("[data-id]").forEach(row => {
    row.addEventListener("click", () => {
      const id = row.dataset.id;
      current = inbox.find(i=>i.id===id);
      generateAIDraft(current, root.querySelector("#aiDraft"));
    });
  });

  document.getElementById("regenDraft").addEventListener("click", () => {
    if (!current) return;
    generateAIDraft(current, root.querySelector("#aiDraft"), true);
  });

  document.getElementById("bulkHideBtn").addEventListener("click", () => {
    toast("Spam hidden (simulation)");
  });
  document.getElementById("bulkPositiveBtn").addEventListener("click", () => {
    toast("Marked positive (simulation)");
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

function generateAIDraft(item, container, regen=false) {
  container.innerHTML = `<div class="small dim">Analyzing context${regen?" (regen)":""}...</div>`;
  document.getElementById("regenDraft").disabled = true;
  setTimeout(()=>{
    container.classList.remove("empty-state");
    container.innerHTML = `
      <div style="font-size:.7rem; line-height:1.4;">
        <div class="dim" style="font-size:.6rem; letter-spacing:.6px; text-transform:uppercase; margin-bottom:.35rem;">Original</div>
        <blockquote style="margin:0 0 .7rem; border-left:2px solid var(--border); padding-left:.5rem; font-style:italic; color:var(--txt-dim);">${item.text}</blockquote>
        <div class="dim" style="font-size:.6rem; letter-spacing:.6px; text-transform:uppercase; margin-bottom:.35rem;">Suggested Reply</div>
        <p>"Appreciate the input! We’re compiling more insights—anything specific you’d like us to break down next?"</p>
        <div class="flex gap-sm">
          <button class="btn small">Use</button>
          <button class="btn outline small" id="draftRegenerateBtn">Regenerate</button>
        </div>
      </div>
    `;
    document.getElementById("regenDraft").disabled = false;
    container.querySelector("#draftRegenerateBtn").addEventListener("click", () => generateAIDraft(item, container, true));
  }, 650);
}