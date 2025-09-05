import { Store } from "../core/store.js";
import { toast } from "../ui/toast.js";
import { nanoid } from "../utils/id.js";

export function renderCompose(root) {
  const platforms = Store.get("platforms").filter(p=>p.connected);
  root.innerHTML = `
    <section class="fade-in">
      <h1>Create & Schedule</h1>
      <p class="dim small">AI captions, first-comment scheduling, evergreen recycling.</p>

      <form id="composeForm" class="inline-form" style="margin-top:.8rem;">
        <select name="platform" required>
          <option value="">Select platform</option>
          ${platforms.map(p=>`<option value="${p.type}">${p.name} (${p.type})</option>`).join("")}
        </select>
        <textarea name="content" placeholder="Write your post..." rows="4" required></textarea>
        <input type="datetime-local" name="datetime" required />
        <input name="tags" placeholder="#hashtags (space or comma separated)" />
        <div style="flex:1 1 100%; display:flex; gap:.5rem; flex-wrap:wrap;">
          <button class="btn" type="submit">Schedule Post</button>
          <button class="btn secondary" type="button" data-action="generate-caption">AI Caption</button>
          <button class="btn outline" type="button" data-action="first-comment">Add First Comment</button>
          <button class="btn outline" type="button" data-action="evergreen">Mark Evergreen</button>
        </div>
      </form>

      <div id="recentDrafts" style="margin-top:1.4rem;">
        <h2 style="font-size:.85rem; text-transform:uppercase; letter-spacing:.7px; color:var(--txt-dim);">Recently Scheduled</h2>
        <div id="scheduledList" class="flex col gap-sm" style="margin-top:.6rem;"></div>
      </div>
    </section>
  `;

  renderScheduledList(root.querySelector("#scheduledList"));

  const form = root.querySelector("#composeForm");
  let evergreenNext = false;
  let firstComment = null;

  form.addEventListener("submit", e => {
    e.preventDefault();
    const fd = new FormData(form);
    const platform = fd.get("platform");
    const content = fd.get("content").trim();
    const datetime = fd.get("datetime");
    if (!platform || !content || !datetime) {
      toast("Fill all required fields", { type:"warn" });
      return;
    }
    const time = new Date(datetime).getTime();
    const tags = (fd.get("tags")||"").split(/[\s,]+/).filter(Boolean);
    const post = {
      id: nanoid(),
      platform,
      time,
      status:"scheduled",
      content,
      tags,
      evergreen: evergreenNext,
      firstComment
    };
    Store.push("scheduled", post);
    toast("Post scheduled for " + new Date(time).toLocaleString());
    evergreenNext = false;
    firstComment = null;
    form.reset();
    renderScheduledList(root.querySelector("#scheduledList"));
  });

  form.querySelector("[data-action='generate-caption']").addEventListener("click", () => {
    toast("Generating AI caption...");
    setTimeout(()=>{
      form.querySelector("textarea[name='content']").value =
        "Capturing the journey, not just the destination. 🚀\n\nWhat milestone are you proud of this week?";
      toast("AI caption applied!");
    }, 800);
  });

  form.querySelector("[data-action='first-comment']").addEventListener("click", () => {
    firstComment = "🔥 Join the conversation & share your thoughts below!";
    toast("First comment set (editable in advanced modal later).");
  });

  form.querySelector("[data-action='evergreen']").addEventListener("click", e => {
    evergreenNext = !evergreenNext;
    e.target.classList.toggle("outline", !evergreenNext);
    e.target.classList.toggle("secondary", evergreenNext);
    toast("Evergreen flag: " + evergreenNext);
  });
}

function renderScheduledList(el) {
  const items = Store.get("scheduled").slice().sort((a,b)=>b.time-a.time).slice(0,6);
  if (!items.length) {
    el.innerHTML = `<div class="empty-state small"><h3>No posts yet</h3><p>Create something compelling!</p></div>`;
    return;
  }
  el.innerHTML = items.map(p => `
    <div class="card" style="padding:.6rem .75rem;">
      <div class="flex between small" style="align-items:flex-start;">
        <div style="flex:1; min-width:0;">
          <strong style="text-transform:capitalize;">${p.platform}</strong> · ${new Date(p.time).toLocaleString()}
          <div style="font-size:.65rem; margin-top:.2rem; color:var(--txt-dim); white-space:nowrap; text-overflow:ellipsis; overflow:hidden;">${p.content}</div>
        </div>
        ${p.evergreen ? `<span class="badge">Evergreen</span>`:""}
      </div>
    </div>
  `).join("");
}