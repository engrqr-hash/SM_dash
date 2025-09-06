import { clusterHashtags } from "../features/hashtagEngine.js";
import { toast } from "../ui/toast.js";

export function renderStrategy(root) {
  root.innerHTML = `
    <section class="fade-in">
      <h1>Strategy & Planning</h1>
      <p class="dim small">Audience insights, hashtag clustering, best time suggestions.</p>
      <div class="tabs" id="strategyTabs">
        <button data-tab="hashtags" class="active">Hashtags</button>
        <button data-tab="audience">Audience</button>
        <button data-tab="timing">Best Time</button>
      </div>
      <div id="strategyContent"></div>
    </section>
  `;
  const content = root.querySelector("#strategyContent");

  function show(tab) {
    if (tab==="hashtags") renderHashtags(content);
    else if (tab==="audience") renderAudience(content);
    else renderTiming(content);
    root.querySelectorAll(".tabs button").forEach(b=>b.classList.toggle("active", b.dataset.tab===tab));
  }
  show("hashtags");

  root.querySelectorAll(".tabs button").forEach(btn => {
    btn.addEventListener("click", ()=>show(btn.dataset.tab));
  });
}

function renderHashtags(container) {
  container.innerHTML = `
    <div class="card">
      <div class="card-header"><div class="card-title">Hashtag Strategy</div></div>
      <div class="inline-form">
        <input id="seedTerms" placeholder="Seed terms (space separated)" />
        <button class="btn small" id="genClustersBtn">Generate Clusters</button>
      </div>
      <div id="clusters" style="margin-top:.8rem;"></div>
    </div>
  `;
  document.getElementById("genClustersBtn").addEventListener("click", () => {
    const terms = document.getElementById("seedTerms").value.trim().split(/\s+/).filter(Boolean);
    const clusters = clusterHashtags(terms);
    const el = document.getElementById("clusters");
    el.innerHTML = clusters.map(c => `
      <div class="card" style="padding:.6rem .7rem;">
        <strong style="font-size:.75rem;">${c.theme}</strong>
        <div style="margin-top:.4rem; display:flex; flex-wrap:wrap; gap:.35rem;">
          ${c.tags.map(t=>`<span class="tag">${t}</span>`).join("")}
        </div>
      </div>
    `).join("");
  });
}

function renderAudience(container) {
  container.innerHTML = `
    <div class="card">
      <div class="card-header"><div class="card-title">Audience Insights (AI)</div><button class="btn outline small" id="refreshAudience">Refresh</button></div>
      <ul style="font-size:.7rem; line-height:1.4; padding-left:1rem;">
        <li>Audience shifting interest towards short-form educational clips.</li>
        <li>Peak engagement age bracket: 25–34 (simulation)</li>
        <li>Followers with "strategy" interest increased 8% last 30 days.</li>
      </ul>
    </div>
  `;
  document.getElementById("refreshAudience").addEventListener("click", () => {
    toast("AI refreshing audience segmentation...");
    setTimeout(()=>toast("Audience insights updated"), 800);
  });
}

function renderTiming(container) {
  container.innerHTML = `
    <div class="card">
      <div class="card-header"><div class="card-title">Best Posting Time (AI)</div><button class="btn outline small" id="recalcTime">Recalculate</button></div>
      <p class="small dim">AI suggests optimal windows based on historical engagement.</p>
      <div class="grid cols-4 tight" id="timeSlots"></div>
    </div>
  `;
  const slots = [
    "Mon 09:00", "Tue 10:30", "Wed 11:00",
    "Thu 10:15", "Fri 09:45", "Sat 12:30", "Sun 14:00"
  ];
  const cont = document.getElementById("timeSlots");
  cont.innerHTML = slots.map(s=>`
    <div class="card" style="padding:.5rem .6rem;">
      <div style="font-size:.7rem; font-weight:600;">${s}</div>
      <div class="dim" style="font-size:.6rem;">Predicted ↑ +6.2% ER</div>
    </div>
  `).join("");

  document.getElementById("recalcTime").addEventListener("click", () => {
    toast("AI recalculating...");
    setTimeout(()=>toast("Updated time windows"), 900);
  });
}