import { Store } from "../core/store.js";
import { toast } from "../ui/toast.js";
import { nanoid } from "../utils/id.js";
import { aiGenerateCaption, aiSuggestHashtags } from "../features/aiEngine.js";
import { openModal } from "../ui/modal.js";

export function renderCompose(root) {
  const platforms = Store.get("platforms").filter(p=>p.connected);
  root.innerHTML = `
    <section class="fade-in">
      <h1>Create & Schedule</h1>
      <p class="dim small">AI captions, tone selection, hashtag suggestions, first-comment scheduling, evergreen recycling.</p>

      <form id="composeForm" class="inline-form" style="margin-top:.8rem;">
        <select name="platform" required>
          <option value="">Select platform</option>
          ${platforms.map(p=>`<option value="${p.type}">${p.name} (${p.type})</option>`).join("")}
        </select>
        <textarea name="content" placeholder="Write your post..." rows="5" required></textarea>
        <div style="display:flex; gap:.5rem; flex-wrap:wrap;">
          <select name="tone">
            <option value="">Tone (AI)</option>
            <option value="casual">Casual</option>
            <option value="professional">Professional</option>
            <option value="funny">Funny</option>
            <option value="inspiring">Inspiring</option>
            <option value="edgy">Edgy</option>
          </select>
          <input name="datetime" type="datetime-local" required />
          <input name="tags" placeholder="#hashtags..." />
          <input name="firstComment" placeholder="First comment (optional)" />
          <input name="recycleHours" type="number" min="0" placeholder="Recycle hrs (0=off)" />
        </div>
        <div style="flex:1 1 100%; display:flex; gap:.5rem; flex-wrap:wrap;">
          <button class="btn" type="submit">Schedule Post</button>
          <button class="btn secondary" type="button" data-action="generate-caption">AI Caption</button>
          <button class="btn outline" type="button" data-action="suggest-hashtags">AI Hashtags</button>
          <button class="btn outline" type="button" data-action="draft">Save Draft</button>
          <button class="btn outline" type="button" data-action="open-first-comment">First Comment Modal</button>
        </div>
      </form>

      <div class="ai-warning" style="margin-top:1rem;">
        AI Credits: <strong>${Store.state.aiCredits}</strong>. Low? Upgrade in Billing.
      </div>

      <div id="recentScheduled" style="margin-top:1.4rem;">
        <h2 style="font-size:.85rem; text-transform:uppercase; letter-spacing:.7px; color:var(--txt-dim);">Recently Scheduled</h2>
        <div id="scheduledList" class="flex col gap-sm" style="margin-top:.6rem;"></div>
      </div>
    </section>
  `;

  renderScheduledList(root.querySelector("#scheduledList"));

  const form = root.querySelector("#composeForm");
  form.addEventListener("submit", e => {
    e.preventDefault();
    const fd = new FormData(form);
    const platform = fd.get("platform");
    const content = fd.get("content").trim();
    const datetime = fd.get("datetime");
    if (!platform || !content || !datetime) {
      toast("Missing required fields", {type:"warn"});
      return;
    }
    const post = {
      id: nanoid(),
      platform,
      content,
      time: new Date(datetime).getTime(),
      status:"scheduled",
      tags: parseTags(fd.get("tags")),
      firstComment: fd.get("firstComment") || null,
      evergreen: !!(+fd.get("recycleHours")>0),
      recycleEveryHours: (+fd.get("recycleHours")>0 ? +fd.get("recycleHours") : null)
    };
    Store.push("scheduled", post);
    toast("Scheduled for "+ new Date(post.time).toLocaleString());
    form.reset();
    renderScheduledList(root.querySelector("#scheduledList"));
  });

  form.querySelector("[data-action='draft']").addEventListener("click", () => {
    const fd = new FormData(form);
    const draft = {
      id:nanoid(),
      platform: fd.get("platform") || "unspecified",
      content: fd.get("content").trim(),
      created: Date.now(),
      tags: parseTags(fd.get("tags"))
    };
    Store.push("drafts", draft);
    toast("Draft saved");
  });

  form.querySelector("[data-action='generate-caption']").addEventListener("click", async () => {
    const tone = form.querySelector("[name='tone']").value || "casual";
    toast("Generating caption...");
    const caption = await aiGenerateCaption({ tone, context:"brand update" });
    form.querySelector("textarea[name='content']").value = caption + "\n\nWhat do you think?";
    toast("Caption ready ✅");
  });

  form.querySelector("[data-action='suggest-hashtags']").addEventListener("click", async () => {
    toast("AI hashtag suggestions...");
    const text = form.querySelector("textarea[name='content']").value;
    const tags = await aiSuggestHashtags({ platform: form.platform?.value, seed: text });
    const current = form.querySelector("[name='tags']").value;
    form.querySelector("[name='tags']").value = (current + " " + tags.join(" ")).trim();
    toast("Hashtags added");
  });

  form.querySelector("[data-action='open-first-comment']").addEventListener("click", () => {
    openModal({
      title:"First Comment",
      content: `<textarea id="fcInput" style="width:100%; min-height:130px; background:var(--bg-soft); border:1px solid var(--border); border-radius:var(--radius-sm); color:var(--txt); padding:.6rem;font-size:.75rem;">${form.firstComment?.value||""}</textarea>`,
      actions: [
        { label:"Save", primary:true, onClick(){
          form.firstComment.value = document.getElementById("fcInput").value;
        }},
        { label:"Cancel" }
      ]
    });
  });
}

function parseTags(str) {
  return (str||"").split(/[\s,]+/).filter(v=>v.startsWith("#"));
}

function renderScheduledList(el) {
  const items = Store.get("scheduled").slice().sort((a,b)=>b.time-a.time).slice(0,8);
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
        ${p.evergreen ? `<span class="badge">Recycles</span>`:""}
      </div>
    </div>
  `).join("");
}