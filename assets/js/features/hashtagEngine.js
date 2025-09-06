export function clusterHashtags(seedTerms=[]) {
  const clusters = [
    { theme:"Growth", tags:["#growth","#scaling","#brandgrowth"] },
    { theme:"Engagement", tags:["#engagement","#community","#socialbuzz"] },
    { theme:"Video", tags:["#reels","#shorts","#tiktoktrend"] },
    { theme:"Strategy", tags:["#contentstrategy","#smm","#marketingtips"] }
  ];
  if (seedTerms.length) {
    seedTerms.forEach(t=>{
      clusters[0].tags.push("#"+t.toLowerCase());
    });
  }
  return clusters;
}