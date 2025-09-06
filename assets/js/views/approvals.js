import { Store } from "../core/store.js";
import { nanoid } from "../utils/id.js";
import { toast } from "../ui/toast.js";

export function renderApprovals(root) {
  const approvals = Store.get("approvals").slice();
  root.innerHTML = `
    <section class="fade-in">
      <h1>Approvals Workflow</h1>
      <p class="dim small">Draft review & client approval pipeline.</p>
      <div class="kanban">
        ${column("Draft", "draft", approvals.filter(a=>a.status==="draft"))}
        ${column("Needs Review", "needs-review", approvals.filter(a=>a.status==="needs-review"))}
        ${column("Client Review", "client-review", approvals.filter(a=>a.status==="client-review"))}
        ${column("Approved", "approved", approvals.filter(a=>a.status==="approved"))}
        ${column("Scheduled", "scheduled", approvals.filter(a=>a.status==="scheduled"))}
      </div>
      <div style="margin-top:1rem;">
        <button class="btn small" id="addApprovalBtn">+ Add Content For Review</button>
      </div>
    </section>
  `;

  document.getElementById("addApprovalBtn").addEventListener("click", () => {
    const content = prompt("Enter short content snippet:");
    if (!content) return;
    Store.push("approvals", {
      id:"ap_"+nanoid(),
      platform:"instagram",
      content,
      status:"draft",
      created: Date.now(),
      notes:[]
    });
    toast("Draft added");
    renderApprovals(root);
  });

  root.querySelectorAll("[data-action='advance']").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.id;
      const items = Store.get("approvals").slice();
      const item = items.find(i=>i.id===id);
      if (!item) return;
      item.status = nextStatus(item.status);
      if (item.status === "scheduled") {
        // push to scheduled posts
        Store.push("scheduled", {
          id:"post_"+nanoid(),
            platform:item.platform,
          content:item.content,
          time: Date.now()+3600_000,
          status:"scheduled",
          tags:[]
        });
      }
      Store.replaceArray("approvals", items);
      toast("Moved to "+item.status);
      renderApprovals(root);
    });
  });
}

function column(title, key, list) {
  return `
    <div class="kanban-col">
      <h3>${title} (${list.length})</h3>
      <div class="flex col gap-sm">
        ${list.map(item => `
          <div class="card draggable" style="padding:.6rem .7rem;">
            <div style="font-size:.65rem; font-weight:600;">${item.platform}</div>
            <div style="font-size:.7rem;">${item.content}</div>
            <div class="flex gap-sm" style="margin-top:.4rem;">
              ${item.status!=="scheduled" ? `<button class="btn outline small" data-action="advance" data-id="${item.id}">Advance →</button>`:""}
            </div>
          </div>
        `).join("") || `<div class="dim small">Empty</div>`}
      </div>
    </div>
  `;
}

function nextStatus(s) {
  return ({
    "draft":"needs-review",
    "needs-review":"client-review",
    "client-review":"approved",
    "approved":"scheduled",
    "scheduled":"scheduled"
  })[s] || "draft";
}