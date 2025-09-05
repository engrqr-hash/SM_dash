/**
 * Mock realtime updates simulation (for engagement / inbox)
 */
import { Store } from "../core/store.js";
import { toast } from "../ui/toast.js";

export function initMockRealtime() {
  setInterval(() => {
    if (Math.random() < .25) {
      const newComment = {
        id:"c_live_"+crypto.randomUUID().slice(0,6),
        platform:"instagram",
        type:"comment",
        author:"@auto_stream",
        text:"Love this drop! 🔄",
        sentiment:"positive",
        time:Date.now()
      };
      Store.push("inbox", newComment);
      if (location.hash === "#inbox") {
        toast("New comment received");
      }
    }
  }, 6000);
}