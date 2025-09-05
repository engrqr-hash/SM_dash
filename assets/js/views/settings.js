import { Store } from "../core/store.js";
import { toast } from "../ui/toast.js";

export function renderSettings(root) {
  const user = Store.get("user");
  root.innerHTML = `
    <section class="fade-in">
      <h1>Settings & Brand Kit</h1>
      <p class="dim small">Profile configuration, timezones, notifications, brand assets.</p>
      <div class="split" style="margin-top:.9rem;">
        <div class="card">
          <div class="card-header"><div class="card-title">Profile</div></div>
          <form id="profileForm" class="inline-form">
            <input name="name" value="${user.name}" required />
            <input name="email" value="${user.email}" type="email" required />
            <input name="timezone" value="${user.timezone}" />
            <button class="btn small">Save</button>
          </form>
        </div>
        <div class="card">
          <div class="card-header"><div class="card-title">Brand Colors</div></div>
          <div class="flex gap-sm" id="colorList">
            ${Store.state.brandKit.colors.map(c=>colorSwatch(c)).join("")}
          </div>
          <button class="btn outline small" id="addColorBtn" style="margin-top:.6rem;">Add Color</button>
        </div>
        <div class="card">
          <div class="card-header"><div class="card-title">Notifications</div></div>
          <div class="flex col gap-sm small">
            ${["Email Alerts","Slack Integration","WhatsApp Alerts (coming)"].map(n=>`
              <label style="display:flex; align-items:center; gap:.5rem;">
                <input type="checkbox" ${n.includes("coming")?"disabled":""} />
                <span>${n}</span>
              </label>
            `).join("")}
          </div>
        </div>
      </div>
    </section>
  `;

  root.querySelector("#profileForm").addEventListener("submit", e => {
    e.preventDefault();
    const fd = new FormData(e.target);
    Store.update("user", {
      name: fd.get("name"),
      email: fd.get("email"),
      timezone: fd.get("timezone")
    });
    toast("Profile updated");
  });

  root.querySelector("#addColorBtn").addEventListener("click", () => {
    const newColor = prompt("Enter hex color (#rrggbb):", "#");
    if (!newColor) return;
    if (!/^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(newColor)) {
      toast("Invalid hex color", { type:"warn" });
      return;
    }
    Store.state.brandKit.colors.push(newColor);
    Store.persist();
    renderSettings(root);
  });
}

function colorSwatch(c) {
  return `
    <div style="width:46px; height:46px; border-radius:var(--radius-sm); background:${c}; border:1px solid var(--border); position:relative;">
      <span style="position:absolute; bottom:2px; left:2px; font-size:.5rem; background:rgba(0,0,0,.4); padding:.1rem .2rem; border-radius:2px; color:#fff;">${c}</span>
    </div>
  `;
}