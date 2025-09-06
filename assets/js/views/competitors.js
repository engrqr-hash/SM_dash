import { Store } from "../core/store.js";
import { toast } from "../ui/toast.js";
import { nanoid } from "../utils/id.js";

export function renderCompetitors(root) {
  const comps = Store.get("competitors").slice();
  root.innerHTML = `
    <section class="fade-in">
      <h1>Competitor Analysis</h1>
      <p class="dim small">Track rival follower counts & engagement deltas.</p>
      <div class="inline-form" style="margin:.6rem 0;">
        <input id="compName" placeholder="Competitor name" />
        <input id="compIG" type="number" placeholder="IG followers" />
        <input id="compTT" type="number" placeholder="TikTok followers" />
        <input id="compTW" type="number" placeholder="Twitter followers" />
        <button class="btn small" id="addCompBtn">Add</button>
      </div>
      <div class="card">
        <div class="card-header"><div class="card-title">Benchmark Table</div><button class="btn outline small" id="scanBtn">Scan Updates</button></div>
        <div class="scroll-x">
          <table class="table">
            <thead>
              <tr><th>Name</th><th>IG</th><th>TikTok</th><th>X</th><th>Last Scan</th></tr>
            </thead>
            <tbody>
              ${comps.map(c => `
                <tr>
                  <td>${c.name}</td>
                  <td>${c.instagram?.toLocaleString()}</td>
                  <td>${c.tiktok?.toLocaleString()}</td>
                  <td>${c.twitter?.toLocaleString()}</td>
                  <td>${timeSince(c.lastScan)}</td>
                </tr>
              `).join("")}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  `;

  document.getElementById("addCompBtn").addEventListener("click", () => {
    const name = document.getElementById("compName").value.trim();
    if (!name) return;
    const ig = +document.getElementById("compIG").value || 0;
    const tt = +document.getElementById("compTT").value || 0;
    const tw = +document.getElementById("compTW").value || 0;
    Store.push("competitors", {
      id:"comp_"+nanoid(),
      name,
      instagram: ig, tiktok: tt, twitter: tw,
      lastScan: Date.now()
    });
    toast("Competitor added");
    renderCompetitors(root);
  });

  document.getElementById("scanBtn").addEventListener("click", () => {
    toast("Scanning competitors...");
    const updated = Store.get("competitors").map(c => ({
      ...c,
      instagram: Math.round(c.instagram * (1 + (Math.random()*.02))),
      tiktok: Math.round(c.tiktok * (1 + (Math.random()*.025))),
      twitter: Math.round(c.twitter * (1 + (Math.random()*.018))),
      lastScan: Date.now()
    }));
    Store.replaceArray("competitors", updated);
    setTimeout(()=>{
      toast("Scan complete");
      renderCompetitors(root);
    }, 700);
  });
}

function timeSince(ts) {
  const diff = Date.now() - ts;
  const m = Math.round(diff/60000);
  if (m < 60) return m+"m ago";
  const h = Math.round(m/60);
  return h+"h ago";
}