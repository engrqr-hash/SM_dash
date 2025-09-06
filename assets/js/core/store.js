import { migrateState } from "./storeMigrations.js";

export const Store = {
  version: 2,
  state: {
    _version: 2,
    user: null,
    roles: [],          // role list for current user
    platforms: [],
    scheduled: [],
    drafts: [],
    approvals: [],
    media: [],
    inbox: [],
    analytics: {},
    competitors: [],
    influencers: [],
    campaigns: [],
    reports: [],
    marketplace: { purchased: [] },
    aiCredits: 120,
    plan: "Pro",
    brandKit: {
      colors: ["#295dff", "#ff4d61", "#38c976"],
      fonts: { heading: "Inter", body: "Inter" },
      logo: null
    },
    settings: {
      notifications: {
        email: true,
        slack: false,
        whatsapp: false
      }
    },
    forecastCache: null
  },
  listeners: new Set(),

  init() {
    const persisted = localStorage.getItem("uc_state");
    if (persisted) {
      try {
        const parsed = JSON.parse(persisted);
        this.state = migrateState(parsed, this.version);
      } catch (e) {
        console.warn("Failed to parse persisted state", e);
        this.seed();
      }
    } else {
      this.seed();
    }
    this.persist();
  },

  seed() {
    const now = Date.now();
    this.state.user = {
      id: "u_001",
      name: "Avery Quinn",
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      avatar: "assets/img/user-placeholder.png",
      email: "avery@example.com"
    };
    this.state.roles = ["admin"]; // could push viewer/editor etc.
    this.state.platforms = [
      { id:"fb_main", type:"facebook", name:"Brand FB Page", connected:true },
      { id:"ig_main", type:"instagram", name:"Brand IG", connected:true },
      { id:"tw_main", type:"twitter", name:"Brand X", connected:true },
      { id:"li_main", type:"linkedin", name:"Corporate LinkedIn", connected:false },
      { id:"tt_main", type:"tiktok", name:"TikTok Channel", connected:true },
      { id:"yt_main", type:"youtube", name:"YouTube Shorts", connected:true }
    ];
    this.state.scheduled = [
      { id:"post_001", platform:"instagram", time: now + 3600_000*5, status:"scheduled", content:"Behind the scenes reel dropping later 🚀", tags:["bts","reel"], evergreen:false },
      { id:"post_002", platform:"twitter", time: now + 3600_000*2, status:"scheduled", content:"Consistency > virality. Thoughts?", tags:["strategy"], evergreen:true, recycleEveryHours: 72 }
    ];
    this.state.drafts = [
      { id:"d_001", platform:"instagram", content:"Draft: Launch teaser image #launch", tags:["launch"], created: now-3600000 }
    ];
    this.state.approvals = [
      { id:"ap_001", platform:"linkedin", content:"We hit 50K milestone! 🎉", status:"needs-review", created: now-7200000, notes:[] }
    ];
    this.state.media = [
      { id:"m1", name:"reel_01.mp4", type:"video", tags:["reel","bts"], size: 9_000_000, added: now - 86400000 },
      { id:"m2", name:"launch_banner.png", type:"image", tags:["launch","ad"], size: 1_500_000, added: now - 3600000 },
      { id:"m3", name:"story_template.psd", type:"source", tags:["template","story"], size: 12_000_000, added: now - 18000000 }
    ];
    this.state.inbox = [
      { id:"c1", platform:"instagram", type:"comment", author:"@visual_vibes", text:"Love this! 🔥", sentiment:"positive", time: now - 600000 },
      { id:"c2", platform:"twitter", type:"mention", author:"@growth_geek", text:"Do you have supporting data?", sentiment:"neutral", time: now - 1200000 },
      { id:"c3", platform:"facebook", type:"message", author:"Lisa M", text:"Can we reschedule our collab?", sentiment:"neutral", time: now - 2400000 }
    ];
    this.state.analytics = {
      summary: {
        followers: 48231,
        engagementRate: 4.7,
        avgReach7d: 192000,
        growth7d: 2.4,
        clicks7d: 5400
      },
      platforms: {
        instagram:{ followers:18200, engagement:5.9, reach7d:72000 },
        twitter:{ followers:9200, engagement:3.1, reach7d:21000 },
        linkedin:{ followers: 5400, engagement:4.8, reach7d:11500 },
        tiktok:{ followers:9800, engagement:7.4, reach7d:39000 },
        youtube:{ followers:4400, engagement:3.9, reach7d:17300 }
      }
    };
    this.state.competitors = [
      { id:"comp_001", name:"Rival Social", instagram:21000, tiktok:12000, twitter:7000, lastScan: now-3600_000 },
      { id:"comp_002", name:"GrowthLabs", instagram:34000, tiktok:8000, twitter:15000, lastScan: now-7200_000 }
    ];
    this.state.influencers = [
      { id:"inf_001", handle:"@marketing_maven", platform:"instagram", reach:95000, status:"prospect", notes:"High engagement reels" },
      { id:"inf_002", handle:"@tiktok_trends", platform:"tiktok", reach:140000, status:"outreach-sent", notes:"Focus on Gen Z" }
    ];
    this.state.campaigns = [
      { id:"camp_001", name:"Spring Awareness", platform:"facebook", budget:500, spent:120, impressions:35000, clicks:1200, conversions:45, status:"active" }
    ];
    this.state.reports = [];
  },

  get(key) { return this.state[key]; },

  set(key, value) { this.state[key] = value; this.persist(); this.emit(); },

  update(key, value) {
    if (typeof value === "function") {
      this.state[key] = value(this.state[key]);
    } else if (typeof this.state[key] === "object" && !Array.isArray(this.state[key])) {
      Object.assign(this.state[key], value);
    } else {
      this.state[key] = value;
    }
    this.persist();
    this.emit();
  },

  push(key, item) {
    this.state[key].push(item);
    this.persist();
    this.emit();
  },

  replaceArray(key, array) {
    this.state[key] = array;
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