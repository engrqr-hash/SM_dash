import { Store } from "../core/store.js";
import { formatDateShort } from "../utils/format.js";
import { toast } from "../ui/toast.js";

export function renderCalendar(root) {
  const now = new Date();
  const start = firstVisibleDay(now);
  const posts = Store.get("scheduled");
  const days = [];
  for (let i=0;i<35;i++) {
    const d = new Date(start.getTime() + i*86400000);
    days.push(d);
  }

  root.innerHTML = `
    <section class="fade-in">
      <h1>Editorial Calendar</h1>
      <p class="dim small">Drag & drop (coming soon), multi-platform scheduling, AI time suggestions.</p>
      <div class="calendar-grid" aria-label="Calendar month view">
        ${days.map(d => dayCell(d, posts)).join("")}
      </div>
    </section>
  `;

  root.querySelectorAll(".calendar-day .slot").forEach(slot => {
    slot.addEventListener("click", () => {
      toast("Open post editor for " + slot.dataset.id);
    });
  });
}

function firstVisibleDay(date) {
  const first = new Date(date.getFullYear(), date.getMonth(), 1);
  const day = first.getDay(); // 0 Sun
  const diff = day; // start from Sunday
  return new Date(first.getTime() - diff*86400000);
}

function dayCell(date, posts) {
  const isoDay = date.toISOString().slice(0,10);
  const dayPosts = posts.filter(p => new Date(p.time).toISOString().slice(0,10) === isoDay);
  return `
    <div class="calendar-day" aria-label="${date.toDateString()}">
      <div class="date">${formatDateShort(date)}</div>
      ${dayPosts.map(p => `
        <div class="slot platform-${p.platform}" data-id="${p.id}" title="${p.content}">
          ${p.platform.slice(0,2).toUpperCase()}: ${p.content.slice(0,22)}
        </div>
      `).join("")}
    </div>
  `;
}