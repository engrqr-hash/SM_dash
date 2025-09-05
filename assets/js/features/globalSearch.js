import { Store } from "../core/store.js";
import { formatTimeRelative } from "../utils/format.js";

export function initGlobalSearch() {
  const input = document.getElementById("globalSearch");
  const results = document.getElementById("searchResults");
  if (!input) return;
  let current = [];
  let idx = -1;

  input.addEventListener("input", () => {
    const q = input.value.trim().toLowerCase();
    if (!q) {
      results.setAttribute("hidden","");
      return;
    }
    current = searchAll(q).slice(0,15);
    results.innerHTML = current.map((r,i)=>`
      <div class="search-item" data-index="${i}" style="padding:.45rem .55rem; border-radius:6px; cursor:pointer; font-size:.7rem;">
        <div style="font-weight:600;">${highlight(r.label,q)}</div>
        <div class="dim" style="font-size:.55rem;">${r.meta}</div>
      </div>
    `).join("") || `<div class="dim small" style="padding:.6rem;">No matches</div>`;
    results.removeAttribute("hidden");
    idx = -1;
  });

  input.addEventListener("keydown", e => {
    if (results.hasAttribute("hidden")) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      move(1);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      move(-1);
    } else if (e.key === "Enter") {
      if (idx >=0 && current[idx]) {
        go(current[idx]);
      }
    } else if (e.key === "Escape") {
      results.setAttribute("hidden","");
    }
  });

  results.addEventListener("click", e => {
    const item = e.target.closest(".search-item");
    if (!item) return;
    const i = +item.dataset.index;
    go(current[i]);
  });

  function move(delta) {
    idx = (idx + delta + current.length) % current.length;
    results.querySelectorAll(".search-item").forEach(el => el.style.background="transparent");
    const active = results.querySelector(`.search-item[data-index='${idx}']`);
    if (active) active.style.background="var(--bg-soft)";
  }

  function go(res) {
    results.setAttribute("hidden","");
    input.value = "";
    location.hash = "#" + res.route;
  }
}

function searchAll(q) {
  const posts = Store.get("scheduled").filter(p => p.content.toLowerCase().includes(q)).map(p => ({
    type:"post",
    label: p.content.slice(0,50),
    meta: p.platform + " · " + formatTimeRelative(p.time),
    route: "compose"
  }));
  const media = Store.get("media").filter(m => m.name.toLowerCase().includes(q)).map(m => ({
    type:"media",
    label: m.name,
    meta: m.type + " asset",
    route: "media"
  }));
  const inbox = Store.get("inbox").filter(i => i.text.toLowerCase().includes(q)).map(i => ({
    type:"inbox",
    label: i.text.slice(0,60),
    meta: i.platform + " comment",
    route: "inbox"
  }));
  return [...posts, ...media, ...inbox];
}

function highlight(label, q) {
  return label.replace(new RegExp(q,"gi"), m => `<mark style="background:rgba(var(--accent-rgb)/.4); color:var(--txt); border-radius:2px; padding:0 2px;">${m}</mark>`);
}