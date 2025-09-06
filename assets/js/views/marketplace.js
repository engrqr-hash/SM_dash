import { Store } from "../core/store.js";
import { toast } from "../ui/toast.js";

const items = [
  { id:"white-label", name:"White-Label Reporting", desc:"Remove our branding from exports.", price:29 },
  { id:"advanced-benchmark", name:"Advanced Benchmark Pack", desc:"Deeper competitor metrics & historical graphs.", price:39 },
  { id:"template-pack", name:"Template Pack Vol.1", desc:"15 premium post & story templates.", price:19 },
  { id:"forecast-pro", name:"Forecast Pro", desc:"Improved predictive accuracy for engagement.", price:49 }
];

export function renderMarketplace(root) {
  const owned = Store.state.marketplace.purchased;
  root.innerHTML = `
    <section class="fade-in">
      <h1>Marketplace</h1>
      <p class="dim small">Extend platform capabilities with add-ons.</p>
      <div class="market-grid" style="margin-top:1rem;">
        ${items.map(i => `
          <div class="card">
            <div class="flex between small">
              <strong>${i.name}</strong>
              ${owned.includes(i.id) ? `<span class="badge success">Owned</span>`:`<span class="badge">$${i.price}</span>`}
            </div>
            <p style="font-size:.65rem; margin:.4rem 0 .6rem;">${i.desc}</p>
            ${owned.includes(i.id) ? `` : `<button class="btn small" data-id="${i.id}" data-action="buy">Buy</button>`}
          </div>
        `).join("")}
      </div>
    </section>
  `;

  root.querySelectorAll("[data-action='buy']").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.id;
      if (!Store.state.marketplace.purchased.includes(id)) {
        Store.state.marketplace.purchased.push(id);
        Store.persist();
        toast("Purchased "+id);
        renderMarketplace(root);
      }
    });
  });
}