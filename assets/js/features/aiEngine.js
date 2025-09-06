import { EventBus } from "../core/events.js";

export async function aiGenerateCaption({ tone, context }) {
  EventBus.emit("ai:consume", 1);
  await delay(500);
  const toneMap = {
    casual: "Just keeping it real",
    professional: "Strategic insight",
    funny: "Couldn’t resist this one",
    inspiring: "Chasing the vision",
    edgy: "Hot take incoming"
  };
  return `${toneMap[tone] || "Fresh perspective"}: ${context || "Your brand story"} 🚀`;
}

export async function aiSuggestHashtags({ platform, seed }) {
  EventBus.emit("ai:consume", 1);
  await delay(400);
  const base = seed?.split(/\s+/).filter(Boolean).slice(0,2) || ["growth","brand"];
  return Array.from(new Set([
    ...base.map(b=>"#"+clean(b)),
    "#contentstrategy","#marketing","#socialmedia","#trending","#engagement"
  ])).slice(0,8);
}

export async function aiForecastPerformance() {
  EventBus.emit("ai:consume", 2);
  await delay(700);
  // Return mock time series
  const now = Date.now();
  return Array.from({length:12}).map((_,i)=>({
    t: now + i*86400000,
    engagement: +(Math.random()*5 + 3).toFixed(2),
    reach: Math.round(15000 + Math.random()*8000)
  }));
}

function clean(s) { return s.replace(/[^a-z0-9]/gi,"").toLowerCase(); }
function delay(ms) { return new Promise(r=>setTimeout(r,ms)); }