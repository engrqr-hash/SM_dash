export function openModal({ title, content, actions=[] }) {
  const overlay = document.createElement("div");
  overlay.className = "modal-overlay";
  overlay.innerHTML = `
    <div class="modal" role="dialog" aria-modal="true">
      <div class="modal-header">
        <h2 style="font-size:1rem; margin:0;">${title}</h2>
        <button class="modal-close" aria-label="Close">&times;</button>
      </div>
      <div class="modal-body">${content}</div>
      <div class="modal-actions" style="display:flex; gap:.5rem; flex-wrap:wrap;">
        ${actions.map((a,i)=>`
          <button class="btn ${a.primary ? "" : "outline"} small" data-index="${i}">${a.label}</button>
        `).join("")}
      </div>
    </div>
  `;
  document.body.appendChild(overlay);

  const close = () => {
    overlay.classList.add("fade-out");
    setTimeout(()=>overlay.remove(),150);
  };

  overlay.addEventListener("click", e => {
    if (e.target === overlay || e.target.classList.contains("modal-close")) close();
  });

  overlay.querySelectorAll(".modal-actions button").forEach(btn => {
    btn.addEventListener("click", () => {
      const action = actions[+btn.dataset.index];
      if (action?.onClick) action.onClick();
      close();
    });
  });
}