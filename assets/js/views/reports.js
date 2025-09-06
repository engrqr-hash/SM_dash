import { Store } from "../core/store.js";
import { toast } from "../ui/toast.js";
import { nanoid } from "../utils/id.js";

export function renderReports(root) {
  const reports = Store.get("reports").slice().sort((a,b)=>b.created-a.created);
  root.innerHTML = `
    <section class="fade-in">
      <h1>Reporting & Exports</h1>
      <p class="dim small">White-label PDFs, CSV/Excel exports (simulation).</p>
      <div class="inline-form" style="margin:.7rem 0;">
        <input id="reportName" placeholder="Report name" />
        <select id="reportFormat">
          <option value="pdf">PDF</option>
          <option value="csv">CSV</option>
          <option value="xlsx">Excel</option>
        </select>
        <button class="btn small" id="genReportBtn">Generate</button>
      </div>
      <div class="flex col gap-sm">
        ${reports.map(r=>`
          <div class="card" style="padding:.6rem .7rem;">
            <div class="flex between small">
              <strong>${r.name}</strong>
              <span class="badge">${r.format}</span>
            </div>
            <div class="dim" style="font-size:.55rem;">${new Date(r.created).toLocaleString()} · ${r.whiteLabel ? "White-Label" : "Standard"}</div>
            <button class="btn outline small" data-id="${r.id}" data-action="download" style="margin-top:.4rem;">Download</button>
          </div>
        `).join("") || `<div class="empty-state"><h3>No reports</h3><p>Create one above.</p></div>`}
      </div>
    </section>
  `;

  document.getElementById("genReportBtn").addEventListener("click", () => {
    const name = document.getElementById("reportName").value || "Monthly Report";
    const format = document.getElementById("reportFormat").value;
    Store.push("reports", {
      id:"r_"+nanoid(),
      name,
      format,
      created: Date.now(),
      whiteLabel: Store.state.marketplace.purchased.includes("white-label"),
      size: Math.round(Math.random()*500)+200
    });
    toast("Report generated");
    renderReports(root);
  });

  root.querySelectorAll("[data-action='download']").forEach(btn => {
    btn.addEventListener("click", () => {
      toast("Download started (simulated)");
    });
  });
}