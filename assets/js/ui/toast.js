let queue = [];
let root;

export function toast(message, opts = {}) {
  if (!root) root = document.getElementById("toastRoot");
  const id = crypto.randomUUID();
  const el = document.createElement("div");
  el.className = "toast";
  if (opts.type === "warn") el.style.borderColor = "var(--warn)";
  if (opts.type === "error") el.style.borderColor = "var(--danger)";
  el.innerHTML = `<div style="display:flex; gap:.5rem; align-items:center;">
    <span style="font-size:.8rem;">${message}</span>
    <button data-close style="background:none; border:0; color:var(--txt-dim); cursor:pointer; font-size:.8rem; margin-left:.4rem;">×</button>
  </div>`;
  el.querySelector("[data-close]").addEventListener("click", () => remove(id, el));
  root.appendChild(el);
  queue.push({ id, el });
  setTimeout(()=> remove(id, el), opts.duration || 3800);
}

function remove(id, el) {
  if (!el.isConnected) return;
  el.style.transition = ".25s ease";
  el.style.opacity = "0";
  el.style.transform = "translateY(6px)";
  setTimeout(()=>el.remove(), 250);
  queue = queue.filter(t=>t.id!==id);
}