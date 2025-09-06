import { Store } from "../core/store.js";
import { formatDateShort } from "../utils/format.js";
import { toast } from "../ui/toast.js";
import { aiGenerateCaption } from "../features/aiEngine.js";

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
      <div class="flex between" style="align-items:flex-end;">
        <div>
          <h1>Editorial Calendar</h1>
          <p class="dim small">Drag & drop to adjust date. AI can suggest optimal time slots.</p>
        </div>
        <div class="flex gap-sm">
          <button class="btn small outline" id="suggestTimeBtn">AI Suggest Time</button>
        </div>
      </div>
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

  document.getElementById("suggestTimeBtn").addEventListener("click", async () => {
    toast("AI analyzing best slot...");
    await aiGenerateCaption({ tone:"professional", context:"Time slot analysis" }); // consume credits
    toast("Best time: Tue 10:30 AM local (simulation)");
  });
}

function firstVisibleDay(date) {
  const first = new Date(date.getFullYear(), date.getMonth(), 1);
  const day = first.getDay();
  return new Date(first.getTime() - day*86400000);
}

function dayCell(date, posts) {
  const isoDay = date.toISOString().slice(0,10);
  const dayPosts = posts.filter(p => new Date(p.time).toISOString().slice(0,10) === isoDay);
  return `
    <div class="calendar-day" aria-label="${date.toDateString()}">
      <div class="date">${formatDateShort(date)}</div>
      ${dayPosts.map(p => `
        <div class="slot platform-${p.platform}" draggable="true" data-id="${p.id}" title="${p.content}">
          ${p.platform.slice(0,2).toUpperCase()}: ${p.content.slice(0,22)}
        </div>
      `).join("")}
    </div>
  `;
}