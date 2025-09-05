/**
 * Placeholder component registration pattern
 * Could be expanded into a full custom element registry later
 */
import { toast } from "../ui/toast.js";

export function registerGlobalComponents() {
  // Example: command palette (lazy)
  document.addEventListener("keydown", e => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
      e.preventDefault();
      toast("Command palette not yet implemented (Ctrl/Cmd+K) 🧪");
    }
  });
}