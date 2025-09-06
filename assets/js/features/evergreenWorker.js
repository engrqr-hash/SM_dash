import { Store } from "../core/store.js";
import { nanoid } from "../utils/id.js";
import { toast } from "../ui/toast.js";

export function initEvergreenWorker() {
  setInterval(() => {
    const now = Date.now();
    const posts = Store.get("scheduled");
    const recycleCandidates = posts.filter(p => p.evergreen && p.recycleEveryHours && now > p.time && !p._requeued);
    recycleCandidates.forEach(p => {
      const nextTime = now + p.recycleEveryHours * 3600_000;
      const clone = { ...p, id: nanoid(), time: nextTime, _requeued:false };
      p._requeued = true;
      Store.push("scheduled", clone);
      toast("Evergreen recycled: " + p.content.slice(0,30));
    });
  }, 15_000); // check every 15s (demo)
}