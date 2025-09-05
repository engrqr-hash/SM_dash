/**
 * Simple state store (in-memory + localStorage sync) to extend later
 */
export const Store = {
  state: {
    user: null,
    platforms: [],
    scheduled: [],
    media: [],
    inbox: [],
    analytics: {},
    aiCredits: 120,
    plan: "Pro",
    brandKit: {
      colors: ["#295dff", "#ff4d61", "#38c976"],
      fonts: { heading: "Inter", body: "Inter" },
      logo: null
    }
  },
  listeners: new Set(),

  init() {
    const persisted = localStorage.getItem("uc_state");
    if (persisted) {
      try {
        const parsed = JSON.parse(persisted);
        Object.assign(this.state, parsed);
      } catch (e) {
        console.warn("Bad persisted state", e);
      }
    } else {
      this.seed();
    }
    this.persist();
  },

  seed() {
    this.state.user = {
      id: "u_001",
      name: "Avery Quinn",
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      avatar: "assets/img/user-placeholder.png",
      roles: ["admin"],
      email: "avery@example.com"
    };
    this.state.platforms = [
      { id:"fb_main", type:"facebook", name:"Brand FB Page", connected:true },
      { id:"ig_main", type:"instagram", name:"Brand IG", connected:true },
      { id:"tw_main", type:"twitter", name:"Brand X", connected:true },
      { id:"li_main", type:"linkedin", name:"Corporate LinkedIn", connected:false },
      { id:"tt_main", type:"tiktok", name:"TikTok Channel", connected:true },
      { id:"yt_main", type:"youtube", name:"YouTube Shorts", connected:true }
    ];
    const now = Date.now();
    this.state.scheduled = [
      {
        id:"post_001",
        platform:"instagram",
        time: now + 1000 * 60 * 60 * 5,
        status:"scheduled",
        content:"Behind the scenes reel dropping later 🚀",
        tags:["bts","reel"],
        evergreen:false
      },
      {
        id:"post_002",
        platform:"twitter",
        time: now + 1000 * 60 * 60 * 2,
        status:"scheduled",
        content:"Hot take: consistency > virality. Thoughts?",
        tags:["strategy"],
        evergreen:true
      }
    ];
    this.state.media = [
      { id:"m1", name:"reel_01.mp4", type:"video", tags:["reel","bts"], size: 9_000_000, added: now - 86400000 },
      { id:"m2", name:"launch_banner.png", type:"image", tags:["launch","ad"], size: 1_500_000, added: now - 3600000 },
      { id:"m3", name:"story_template.psd", type:"source", tags:["template","story"], size: 12_000_000, added: now - 18000000 }
    ];
    this.state.inbox = [
      { id:"c1", platform:"instagram", type:"comment", author:"@visual_vibes", text:"Love this! 🔥", sentiment:"positive", time: now - 600000 },
      { id:"c2", platform:"twitter", type:"mention", author:"@growth_geek", text:"Interesting perspective—do you have data?", sentiment:"neutral", time: now - 1200000 },
      { id:"c3", platform:"facebook", type:"message", author:"Lisa M", text:"Can we reschedule our collab?", sentiment:"neutral", time: now - 2400000 }
    ];
    this.state.analytics = {
      summary: {
        followers: 48231,
        engagementRate: 4.7,
        avgReach7d: 192000,
        growth7d: 2.4
      },
      platforms: {
        instagram:{ followers:18200, engagement:5.9 },
        twitter:{ followers:9200, engagement:3.1 },
        linkedin:{ followers: 5400, engagement:4.8 },
        tiktok:{ followers:9800, engagement:7.4 },
        youtube:{ followers:4400, engagement:3.9 }
      }
    };
  },

  get(key) {
    return this.state[key];
  },

  set(key, value) {
    this.state[key] = value;
    this.persist();
    this.emit();
  },

  update(key, partial) {
    Object.assign(this.state[key], partial);
    this.persist();
    this.emit();
  },

  push(key, item) {
    this.state[key].push(item);
    this.persist();
    this.emit();
  },

  persist() {
    localStorage.setItem("uc_state", JSON.stringify(this.state));
  },

  subscribe(fn) {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  },

  emit() {
    this.listeners.forEach(fn => fn(this.state));
  }
};