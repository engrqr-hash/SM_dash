import { Store } from "../core/store.js";
import { formatFileSize, formatTimeRelative } from "../utils/format.js";

export function renderMedia(root) {
  const media = Store.get("media").slice().sort((a,b)=>b.added-a.added);

  root.innerHTML = `
    <section class="fade-in">
      <h1>Media Library</h1>
      <p class="dim small">Organize assets, AI tagging, stock & cloud sync (future integrations).</p>
      <div class="inline-form" style="margin:.8rem 0;">
        <input type="search" placeholder="Search by keyword..." id="mediaSearch" />
        <select id="mediaType">
          <option value="">All types</option>
          <option value="image">Images</option>
          <option value="video">Videos</option>
          <option value="source">Source Files</option>
        </select>
        <button class="btn outline small" id="uploadBtn" type="button">Upload</button>
      </div>
      <div id="mediaGrid" class="grid cols-flex">
        ${media.map(fileCard).join("")}
      </div>
    </section>
  `;

  const search = root.querySelector("#mediaSearch");
  const typeFilter = root.querySelector("#mediaType");
  const grid = root.querySelector("#mediaGrid");

  function applyFilter() {
    let list = media;
    const q = search.value.trim().toLowerCase();
    const t = typeFilter.value;
    if (q) list = list.filter(m => m.name.toLowerCase().includes(q) || m.tags.some(tag=>tag.includes(q)));
    if (t) list = list.filter(m => m.type === t);
    grid.innerHTML = list.map(fileCard).join("") || `<div class="empty-state small" style="grid-column:1/-1;"><h3>No matches</h3><p>Try different keywords.</p></div>`;
  }

  search.addEventListener("input", applyFilter);
  typeFilter.addEventListener("change", applyFilter);

  root.querySelector("#uploadBtn").addEventListener("click", () => {
    alert("Implement upload modal with preview / AI tags.");
  });
}

function fileCard(file) {
  return `
    <div class="card" style="min-height:140px;">
      <div class="flex between small">
        <strong style="font-size:.75rem;">${file.name}</strong>
        <span class="badge">${file.type}</span>
      </div>
      <div class="dim" style="font-size:.55rem;">${formatFileSize(file.size)} · ${formatTimeRelative(file.added)}</div>
      <div style="display:flex; flex-wrap:wrap; gap:.3rem; margin-top:.4rem;">
        ${file.tags.slice(0,4).map(t=>`<span class="tag">${t}</span>`).join("")}
      </div>
      <div style="margin-top:auto;">
        <button class="btn outline small" style="margin-top:.6rem;">Preview</button>
      </div>
    </div>
  `;
}