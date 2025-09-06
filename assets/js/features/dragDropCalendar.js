import { Store } from "../core/store.js";
import { toast } from "../ui/toast.js";

export function initDragDropCalendar() {
  document.addEventListener("pointerdown", e => {
    const slot = e.target.closest(".calendar-day .slot");
    if (!slot) return;
    const id = slot.dataset.id;
    slot.setPointerCapture(e.pointerId);
    slot.classList.add("dragging");
    let overDay = null;

    function move(ev) {
      const el = document.elementFromPoint(ev.clientX, ev.clientY);
      const day = el?.closest(".calendar-day");
      if (overDay && overDay !== day) overDay.classList.remove("drop-target");
      if (day && day !== overDay) {
        day.classList.add("drop-target");
        overDay = day;
      }
    }
    function up(ev) {
      slot.releasePointerCapture(e.pointerId);
      slot.classList.remove("dragging");
      if (overDay) {
        overDay.classList.remove("drop-target");
        const date = overDay.querySelector(".date").textContent.trim();
        // naive: shift day of month only; real impl would map to actual date
        const posts = Store.get("scheduled").slice();
        const post = posts.find(p=>p.id===id);
        if (post) {
          const newDate = new Date();
          newDate.setDate(+date);
          post.time = newDate.getTime() + 3600_000; // default +1h
          Store.replaceArray("scheduled", posts);
          toast("Post moved to day " + date);
          if (location.hash === "#calendar") {
            // force re-render
            import("../views/calendar.js").then(m=>m.renderCalendar(document.getElementById("viewContainer")));
          }
        }
      }
      cleanup();
    }
    function cleanup() {
      document.removeEventListener("pointermove", move);
      document.removeEventListener("pointerup", up);
    }
    document.addEventListener("pointermove", move);
    document.addEventListener("pointerup", up, { once:true });
  });
}