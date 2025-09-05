import { Store } from "../core/store.js";
import { toast } from "../ui/toast.js";

export function renderBilling(root) {
  root.innerHTML = `
    <section class="fade-in">
      <h1>Billing & Plan</h1>
      <p class="dim small">Manage subscription tiers, AI credit packs, invoices.</p>
      <div class="split" style="margin-top:.9rem;">
        <div class="card">
          <div class="card-header"><div class="card-title">Current Plan</div></div>
          <div style="font-size:.85rem;">You are on <strong>${Store.state.plan}</strong> plan.</div>
          <div class="dim small" style="margin-top:.4rem;">AI Credits Remaining: <strong>${Store.state.aiCredits}</strong></div>
          <button class="btn small" style="margin-top:.7rem;" id="upgradeBtn">Upgrade</button>
        </div>
        <div class="card">
          <div class="card-header"><div class="card-title">Add-ons</div></div>
          <div class="flex col gap-sm small">
            <label><input type="checkbox" /> Advanced Competitor Benchmarking</label>
            <label><input type="checkbox" /> White-Label Reports</label>
            <label><input type="checkbox" /> Extra Team Seats (5)</label>
          </div>
          <button class="btn outline small" style="margin-top:.6rem;">Purchase</button>
        </div>
        <div class="card">
          <div class="card-header"><div class="card-title">Invoices</div></div>
          <div class="empty-state small"><h3>No invoices yet</h3><p>Billing will appear after first charge.</p></div>
        </div>
      </div>
    </section>
  `;

  root.querySelector("#upgradeBtn").addEventListener("click", () => {
    toast("Upgrade flow placeholder");
  });
}