import { useState, useRef } from "react";

// ── Config ────────────────────────────────────────────────────────────────────
const TELEGRAM_CHAT_ID = "7477833460";
const TELEGRAM_BOT_TOKEN = ""; // paste your bot token here
const AMAZON_TAG = "ericcoste-20";

const AFFILIATE_MAP = {
  "credit repair": { name: "IdentityIQ", url: "https://www.identityiq.com/sc-securemax.aspx?offercode=431297RY" },
  "credit score": { name: "Kikoff", url: "https://kikoff.pxf.io/c/7007975/2344833/14994" },
  "debt": { name: "IdentityIQ", url: "https://www.identityiq.com/sc-securemax.aspx?offercode=431297RY" },
  "collections": { name: "IdentityIQ", url: "https://www.identityiq.com/sc-securemax.aspx?offercode=431297RY" },
  "finance": { name: "Kikoff", url: "https://kikoff.pxf.io/c/7007975/2344833/14994" },
  "money": { name: "Kikoff", url: "https://kikoff.pxf.io/c/7007975/2344833/14994" },
  "budget": { name: "Kikoff", url: "https://kikoff.pxf.io/c/7007975/2344833/14994" },
  "numerology": { name: "ORACELIS", url: "https://oracelis.com" },
  "moon": { name: "ORACELIS", url: "https://oracelis.com" },
  "saturn": { name: "ORACELIS", url: "https://oracelis.com" },
  "spiritual": { name: "ORACELIS", url: "https://oracelis.com" },
  "manifestation": { name: "ORACELIS", url: "https://oracelis.com" },
  "astrology": { name: "ORACELIS", url: "https://oracelis.com" },
};

const AMAZON_SIGNALS = [
  "book","journal","planner","workbook","guide","kit","deck","card","crystal",
  "candle","tracker","template","printable","calendar","tarot","oracle",
  "meditation","trading","investing","productivity","self help","numerology",
  "astrology","spiritual","manifestation","moon","saturn","travel","gear",
  "course","tool","software","plugin","dog","pet","fitness","yoga","recipe",
];

// ── Channel definitions ───────────────────────────────────────────────────────
const CHANNELS = {
  finance: {
    label: "💰 Credit & Finance", color: "#00d4aa", accent: "#00ff99",
    keywords: ["credit","debt","loan","budget","money","finance","collections","kikoff","score","repair","bankruptcy","fico"],
    hookStyle: "bold, urgent, numbers-driven, slightly alarming — make them feel they are losing money right now",
  },
  spirituality: {
    label: "🔮 Spirituality", color: "#a78bfa", accent: "#c4b5fd",
    keywords: ["numerology","moon","saturn","spiritual","manifestation","astrology","oracle","chakra","tarot","crystal","meditation","esoteric","mystic","ritual","angel"],
    hookStyle: "mystical, curiosity-driven, personal, slightly esoteric — reveal hidden knowledge",
  },
  travel: {
    label: "🏖️ Travel & Lifestyle", color: "#f59e42", accent: "#fbbf24",
    keywords: ["travel","las vegas","vegas","hotel","resort","trip","vacation","flight","airbnb","casino","nightlife","fremont","strip","attraction","destination","tour"],
    hookStyle: "exciting, FOMO-inducing, visual — make them feel they are missing out on an incredible experience",
  },
  digital: {
    label: "📦 Digital Products", color: "#f472b6", accent: "#fb7185",
    keywords: ["printable","template","planner","etsy","gumroad","payhip","pdf","digital download","canva","worksheet","workbook","ebook","notion","bundle","kdp"],
    hookStyle: "practical, value-focused, income-oriented — show how easy it is to make money selling digital products",
  },
  tech: {
    label: "💻 Tech & Tools", color: "#60a5fa", accent: "#93c5fd",
    keywords: ["solana","crypto","trading","bot","saas","code","software","ai","gpt","api","developer","blockchain","nft","defi","web3","python","javascript","app","tool","automation"],
    hookStyle: "smart, insider-knowledge tone — position as someone with technical edge others do not have",
  },
  selfhelp: {
    label: "🧠 Self Help", color: "#fb923c", accent: "#fdba74",
    keywords: ["productivity","mindset","habit","routine","journal","self help","motivation","discipline","focus","anxiety","confidence","morning","goal","success","mindfulness","stoic"],
    hookStyle: "relatable, honest, slightly vulnerable — speak directly to their pain point before offering the insight",
  },
};

// ── Workflow steps per channel ────────────────────────────────────────────────
const WORKFLOW_STEPS = {
  finance: [
    { id:1, title:"Topic Lock", icon:"🎯", duration:"5 min", cta:"Topic confirmed — start scripting",
      instructions:"Confirm the topic fits this week's plan. Check your last 3 uploads to avoid repetition. Verify the keyword has buyer intent — it should make someone feel urgency about their credit or debt situation." },
    { id:2, title:"Script Writing", icon:"✍️", duration:"20 min", cta:"Script written and reviewed",
      instructions:"45–60 sec script. Hook (3 sec): shocking stat or alarming question about credit/debt. Body: 3 rapid-fire actionable tips. CTA: 'Save this — your credit score depends on it.' Use the AI hooks below as your opening line." },
    { id:3, title:"Voiceover", icon:"🎙️", duration:"10 min", cta:"Voiceover recorded and exported",
      instructions:"Speak at 1.15x natural pace — finance content needs energy. ElevenLabs 'Adam' or 'Josh'. No music — silence builds authority in finance. Export MP3, name: [topic-slug]-vo.mp3." },
    { id:4, title:"Video Assembly", icon:"🎬", duration:"20 min", cta:"Video assembled and exported",
      instructions:"InVideo AI or CapCut. B-roll: credit cards, cash, banks, calculator. Bold white captions on dark background. Logo bug bottom-right. Export 1080x1920 MP4." },
    { id:5, title:"Thumbnail", icon:"🖼️", duration:"10 min", cta:"Thumbnail created and saved",
      instructions:"Dark background, bold red or green text. Include a number ('3 Ways to...', '$500 in 30 Days'). High contrast — must read clearly at 150px. Save as thumbnail-[topic-slug].png." },
    { id:6, title:"Upload & SEO", icon:"📤", duration:"15 min", cta:"Video uploaded with full SEO",
      instructions:"YouTube Shorts: keyword in first 60 chars of title. Description: affiliate link in first 2 lines, Payhip at end, 150 words keyword-rich. 15 tags from research. Pin affiliate link as top comment." },
    { id:7, title:"Cross-Post", icon:"🔁", duration:"15 min", cta:"Cross-posted to all platforms",
      instructions:"TikTok (no watermark) · Instagram Reels · Facebook Reels + 2 finance Facebook Groups · Pinterest Idea Pin (thumbnail + keyword overlay) · X/Twitter native video with #creditrepair #debtfree. Affiliate link in every caption." },
  ],
  spirituality: [
    { id:1, title:"Topic Lock", icon:"🔮", duration:"5 min", cta:"Topic confirmed — start scripting",
      instructions:"Align the topic with the current moon phase or numerological cycle if possible. Check your ORACELIS Saturn Hour Calculator for timing alignment — this boosts shareability." },
    { id:2, title:"Script Writing", icon:"✍️", duration:"20 min", cta:"Script written and reviewed",
      instructions:"45–60 sec. Hook: mystical open question ('Most people do not know what their life path number reveals about their money...'). Body: 3 insights. CTA: 'Follow — your daily cosmic insight awaits.' Use AI hooks below." },
    { id:3, title:"Voiceover", icon:"🎙️", duration:"10 min", cta:"Voiceover recorded and exported",
      instructions:"Calm, measured pace — slower than finance. ElevenLabs 'Aria' or 'Daniel'. Add subtle ambient drone music underneath (royalty-free, Pixabay). Export MP3." },
    { id:4, title:"Video Assembly", icon:"🎬", duration:"20 min", cta:"Video assembled and exported",
      instructions:"B-roll: starfields, moon phases, sacred geometry, candlelight. Animated text with soft glow. Purple/indigo color grade. Slow fade transitions. Export 1080x1920 MP4." },
    { id:5, title:"Thumbnail", icon:"🖼️", duration:"10 min", cta:"Thumbnail created and saved",
      instructions:"Dark cosmic background, gold or purple text. Include a number, moon emoji, or mystical symbol. Soft glow on text. Must read at small size." },
    { id:6, title:"Upload & SEO", icon:"📤", duration:"15 min", cta:"Video uploaded with full SEO",
      instructions:"Title: lead with the mystical hook or number. Description: link ORACELIS Saturn Hour or Moon Phase Calculator as primary CTA. Tags: numerology, life path, moon phase, astrology, manifestation, angel numbers." },
    { id:7, title:"Cross-Post", icon:"🔁", duration:"15 min", cta:"Cross-posted to all platforms",
      instructions:"Pinterest FIRST — spiritual content is top-performing there. Idea Pin with 3-line mystical text overlay → ORACELIS link. Then TikTok · Instagram Reels · Facebook spirituality groups · X/Twitter with #numerology #moonphase #astrology." },
  ],
  travel: [
    { id:1, title:"Topic Lock", icon:"🗺️", duration:"5 min", cta:"Topic confirmed — start scripting",
      instructions:"Confirm the destination or experience. For Las Vegas content, check getraveready.live and vegasstripguide.site for affiliate angles. Tie to a seasonal event or upcoming holiday if possible." },
    { id:2, title:"Script Writing", icon:"✍️", duration:"20 min", cta:"Script written and reviewed",
      instructions:"45–60 sec. Hook: jaw-dropping fact or hidden gem ('Most tourists in Vegas never find this...'). Body: 3 specific tips or spots. CTA: 'Save this for your trip — follow for more Vegas secrets.' Use AI hooks below." },
    { id:3, title:"Voiceover", icon:"🎙️", duration:"10 min", cta:"Voiceover recorded and exported",
      instructions:"Upbeat, excited tone — insider friend giving tips. ElevenLabs 'Ryan' or 'Charlotte'. Subtle upbeat background music. Export MP3." },
    { id:4, title:"Video Assembly", icon:"🎬", duration:"20 min", cta:"Video assembled and exported",
      instructions:"B-roll: city skylines, hotel pools, casino floors, food, nightlife. Bright warm color grade. Fast cuts every 2–3 sec. On-screen text callouts for each tip. Export 1080x1920 MP4." },
    { id:5, title:"Thumbnail", icon:"🖼️", duration:"10 min", cta:"Thumbnail created and saved",
      instructions:"Bright vivid background. Bold white or yellow text. Include destination name. Show something visually impressive — skyline, pool, food. Warm tones outperform cool in travel." },
    { id:6, title:"Upload & SEO", icon:"📤", duration:"15 min", cta:"Video uploaded with full SEO",
      instructions:"Title: city + experience ('Best Hidden Spots in Las Vegas 2026'). Description: link getraveready.live or vegasstripguide.site + Stay22 widget page. Tags: las vegas, vegas tips, vegas travel, nevada, what to do in vegas." },
    { id:7, title:"Cross-Post", icon:"🔁", duration:"15 min", cta:"Cross-posted to all platforms",
      instructions:"Pinterest is huge for travel — Idea Pin with destination photo + tip overlay. TikTok · Instagram Reels (tag location) · Facebook travel groups · X/Twitter with city hashtags. Viator affiliate link in every caption." },
  ],
  digital: [
    { id:1, title:"Topic Lock", icon:"📦", duration:"5 min", cta:"Topic confirmed — start scripting",
      instructions:"Confirm the digital product angle — showing how to make money selling it, or promoting a specific product? Link to payhip.com/ericcoste if you have a matching existing product." },
    { id:2, title:"Script Writing", icon:"✍️", duration:"20 min", cta:"Script written and reviewed",
      instructions:"45–60 sec. Hook: income proof ('I made $X selling this simple PDF...'). Body: show the product, who buys it, the process. CTA: 'Link in bio — template is ready to download.' Use AI hooks below." },
    { id:3, title:"Voiceover", icon:"🎙️", duration:"10 min", cta:"Voiceover recorded and exported",
      instructions:"Casual, relatable tone — friend showing a side hustle. ElevenLabs 'Sarah' or 'Bella'. Light background music. Export MP3." },
    { id:4, title:"Video Assembly", icon:"🎬", duration:"20 min", cta:"Video assembled and exported",
      instructions:"Screen recordings of Etsy/Payhip dashboard, Canva design process, product mockups. Bright clean aesthetic. Show income numbers if available. Export 1080x1920 MP4." },
    { id:5, title:"Thumbnail", icon:"🖼️", duration:"10 min", cta:"Thumbnail created and saved",
      instructions:"Clean bright background. Show the product mockup prominently. Include an income number if possible. Canva digital product mockup frames work well." },
    { id:6, title:"Upload & SEO", icon:"📤", duration:"15 min", cta:"Video uploaded with full SEO",
      instructions:"Title: income angle or product name. Description: direct Payhip or Etsy link in first line. Tags: digital products, passive income, etsy seller, printables, make money online, side hustle." },
    { id:7, title:"Cross-Post", icon:"🔁", duration:"15 min", cta:"Cross-posted to all platforms",
      instructions:"Pinterest is #1 for digital product discovery — Idea Pin showing product + price. TikTok with #passiveincome #digitalproducts · Instagram Reels · Facebook side hustle groups · X/Twitter. Payhip link everywhere." },
  ],
  tech: [
    { id:1, title:"Topic Lock", icon:"⚡", duration:"5 min", cta:"Topic confirmed — start scripting",
      instructions:"Confirm the technical angle — tutorial, tool review, income from code, or market insight? For Solana/trading, tie to a current market event for higher relevance and search volume." },
    { id:2, title:"Script Writing", icon:"✍️", duration:"20 min", cta:"Script written and reviewed",
      instructions:"45–60 sec. Hook: surprising technical fact ('This Solana bot made $X while I slept...'). Body: 3 specific technical insights or steps. CTA: 'Follow for more alpha — comment if you want the code.' Use AI hooks below." },
    { id:3, title:"Voiceover", icon:"🎙️", duration:"10 min", cta:"Voiceover recorded and exported",
      instructions:"Confident, knowledgeable tone — you know things others do not. ElevenLabs 'Marcus' or 'Liam'. Minimal background music. Export MP3." },
    { id:4, title:"Video Assembly", icon:"🎬", duration:"20 min", cta:"Video assembled and exported",
      instructions:"Screen recordings of terminals, dashboards, trading charts, code editors. Dark theme looks authoritative. Highlight key numbers with callouts. Export 1080x1920 MP4." },
    { id:5, title:"Thumbnail", icon:"🖼️", duration:"10 min", cta:"Thumbnail created and saved",
      instructions:"Dark background with green or blue accent — tech/terminal aesthetic. Include a number (profit, speed, percentage). Bold readable text. Matrix-style overlay adds credibility." },
    { id:6, title:"Upload & SEO", icon:"📤", duration:"15 min", cta:"Video uploaded with full SEO",
      instructions:"Title: specific and technical ('Solana MEV Bot That Prints Fees'). Description: GitHub link if applicable, Amazon book recs with your tag. Tags: solana, crypto trading, trading bot, defi, web3, passive income crypto." },
    { id:7, title:"Cross-Post", icon:"🔁", duration:"15 min", cta:"Cross-posted to all platforms",
      instructions:"Reddit FIRST — r/solana, r/algotrading, r/CryptoTechnology (add value, follow rules). X/Twitter is massive for crypto — tweet thread with chart screenshot. TikTok · YouTube Shorts · Discord communities." },
  ],
  selfhelp: [
    { id:1, title:"Topic Lock", icon:"🧠", duration:"5 min", cta:"Topic confirmed — start scripting",
      instructions:"Confirm the self-help angle — habit, mindset shift, productivity system, or overcoming a struggle? The more specific the pain point the better. Avoid generic 'be more productive' angles." },
    { id:2, title:"Script Writing", icon:"✍️", duration:"20 min", cta:"Script written and reviewed",
      instructions:"45–60 sec. Hook: relatable confession or counterintuitive truth ('I used to waste 4 hours a day until I learned this...'). Body: 1 specific insight with 3 implementation steps. CTA: 'Save this — you will need it tomorrow morning.' Use AI hooks below." },
    { id:3, title:"Voiceover", icon:"🎙️", duration:"10 min", cta:"Voiceover recorded and exported",
      instructions:"Warm, honest, slightly vulnerable — friend who figured something out. ElevenLabs 'Alice' or 'Chris'. Soft motivational background music at low volume. Export MP3." },
    { id:4, title:"Video Assembly", icon:"🎬", duration:"20 min", cta:"Video assembled and exported",
      instructions:"B-roll: journaling, morning routines, clean desks, nature. Warm golden color grade. On-screen text for each step. Calm slow transitions. Export 1080x1920 MP4." },
    { id:5, title:"Thumbnail", icon:"🖼️", duration:"10 min", cta:"Thumbnail created and saved",
      instructions:"Clean minimal warm tones. One bold statement or question. Avoid clutter. A single powerful line on a clean background outperforms busy designs in this niche." },
    { id:6, title:"Upload & SEO", icon:"📤", duration:"15 min", cta:"Video uploaded with full SEO",
      instructions:"Title: specific transformation ('The 5-Minute Morning Habit That Eliminated My Anxiety'). Description: Amazon book recs with your tag, Payhip journal link if relevant. Tags: productivity, self improvement, habits, morning routine, mindset." },
    { id:7, title:"Cross-Post", icon:"🔁", duration:"15 min", cta:"Cross-posted to all platforms",
      instructions:"Pinterest performs well for self-help — Idea Pin with core tip as text overlay. TikTok · Instagram Reels · Facebook self-improvement groups · X/Twitter quote-tweet format · Reddit r/productivity r/selfimprovement. Amazon affiliate link in all captions." },
  ],
};

// ── Helpers ───────────────────────────────────────────────────────────────────
function detectChannel(text) {
  const t = text.toLowerCase();
  let best = "finance"; let bestScore = 0;
  for (const [id, ch] of Object.entries(CHANNELS)) {
    const score = ch.keywords.filter(k => t.includes(k)).length;
    if (score > bestScore) { bestScore = score; best = id; }
  }
  return best;
}

function findAffiliate(niche) {
  const n = niche.toLowerCase();
  for (const [k, v] of Object.entries(AFFILIATE_MAP)) {
    if (n.includes(k)) return v;
  }
  return null;
}

function detectAmazon(niche, result) {
  const t = (niche + " " + result).toLowerCase();
  const hits = AMAZON_SIGNALS.filter(k => t.includes(k));
  if (!hits.length) return null;
  const q = `${niche} ${hits[0]}`.trim();
  return { query: q, url: `https://www.amazon.com/s?k=${encodeURIComponent(q)}&tag=${AMAZON_TAG}`, signals: hits.slice(0,3) };
}

function calcScore(niche, result) {
  let s = 5;
  const t = (niche + result).toLowerCase();
  ["buy","purchase","best","template","kit","guide","fix","repair","remove","how to","download"].forEach(w => { if (t.includes(w)) s += 0.5; });
  ["credit","debt","finance","spiritual","numerology","astrology","manifestation","travel","vegas","digital","solana","trading","productivity"].forEach(w => { if (t.includes(w)) s += 0.6; });
  ["free","what is","definition","wikipedia"].forEach(w => { if (t.includes(w)) s -= 0.4; });
  return Math.min(10, Math.max(1, Math.round(s)));
}

function scoreColor(s) {
  if (s >= 9) return "#c8f545";
  if (s >= 7) return "#f59e42";
  if (s >= 5) return "#60a5fa";
  return "#6b6b7a";
}

const PLATFORMS = [
  { id:"google", label:"Google", icon:"🔍" },
  { id:"etsy", label:"Etsy", icon:"🛍️" },
  { id:"reddit", label:"Reddit", icon:"💬" },
  { id:"youtube", label:"YouTube", icon:"▶️" },
  { id:"amazon", label:"Amazon", icon:"📦" },
  { id:"pinterest", label:"Pinterest", icon:"📌" },
  { id:"twitter", label:"X/Twitter", icon:"✖" },
  { id:"facebook", label:"Facebook", icon:"📘" },
  { id:"all", label:"All Platforms", icon:"🌐" },
];

const MODES = [
  { id:"buyer", label:"Buyer Intent", desc:"Purchase-ready searches" },
  { id:"trending", label:"Trending Now", desc:"What's hot right now" },
  { id:"gaps", label:"Content Gaps", desc:"Underserved demand" },
  { id:"pdf", label:"PDF Products", desc:"Digital product ideas" },
  { id:"spy", label:"Competitor Intel", desc:"Reverse-engineer rivals" },
];

function buildResearchPrompt(niche, platform, mode) {
  const pLabel = platform === "all"
    ? "Google, YouTube, Reddit, Etsy, Amazon, Pinterest, X/Twitter, and Facebook"
    : PLATFORMS.find(p => p.id === platform)?.label;
  const modeMap = {
    buyer: `Find TOP 10 HIGH BUYER INTENT keywords in "${niche}" on ${pLabel}. Each: keyword | what they want | urgency signal. Then IMMEDIATE OPPORTUNITIES to target today.`,
    trending: `What is TRENDING RIGHT NOW in "${niche}" on ${pLabel}? Top 8 trends with demand level. Seasonal signals. Fastest opportunity.`,
    gaps: `Find 8 UNDERSERVED CONTENT GAPS in "${niche}" on ${pLabel}. Topic | why underserved | difficulty (Easy/Med/Hard).`,
    pdf: `Research PDF/digital products in "${niche}" on Etsy, Gumroad, Amazon KDP, Pinterest. 8 product ideas: title | buyer | price ($8/$17/$26/$35/$44). Bestseller patterns + affiliate angles.`,
    spy: `Who dominates "${niche}" on ${pLabel}? Top 3 competitors: URL | best keywords | content strategy | weakness I can exploit.`,
  };
  return `You are NICHE SCOUT — elite market research AI. Search the web for REAL current data first.

NICHE: "${niche}" | PLATFORM: ${pLabel}

${modeMap[mode]}

## SHORTS HOOKS
5 punchy YouTube Shorts opening lines under 12 words each that stop the scroll.

## PRIORITY ACTION
One sentence — the single most valuable move to make first.

Use ## headers and — for bullets. Be specific with real keywords.`;
}

function buildHookPrompt(niche, snippet, channelId) {
  const ch = CHANNELS[channelId];
  return `Based on this research about "${niche}":
${snippet.slice(0, 800)}

Generate 3 YouTube Shorts opening hooks. Style: ${ch.hookStyle}
Each must be under 12 words and make someone stop scrolling instantly.
Number them 1, 2, 3. No preamble.`;
}

// ── Styles ────────────────────────────────────────────────────────────────────
const S = `
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=Fira+Mono:wght@400;500&display=swap');
*{box-sizing:border-box;margin:0;padding:0;}
html,body{background:#08080e;color:#e8e4dc;font-family:'Syne',sans-serif;min-height:100vh;width:100%;}
#root{background:#08080e;min-height:100vh;}
:root{
  --acid:#c8f545;--acid-d:rgba(200,245,69,.12);--acid-b:rgba(200,245,69,.28);
  --sur:#0f0f16;--sur2:#15151e;--bdr:rgba(255,255,255,.06);--mut:#5a5a6a;
  --mono:'Fira Mono',monospace;
  --ora:#f59e42;--ora-d:rgba(245,158,66,.12);--ora-b:rgba(245,158,66,.28);
  --blu:#60a5fa;--blu-d:rgba(96,165,250,.1);--blu-b:rgba(96,165,250,.28);
}
.wrap{max-width:1100px;margin:0 auto;padding:0 20px 80px;}
.two-col{display:grid;grid-template-columns:1fr 1fr;gap:20px;align-items:start;}
@media(max-width:760px){.two-col{grid-template-columns:1fr;}}
.hdr{padding:36px 0 24px;border-bottom:1px solid var(--bdr);margin-bottom:28px;}
.hdr-tag{font-family:var(--mono);font-size:9px;letter-spacing:.22em;color:var(--acid);text-transform:uppercase;margin-bottom:8px;}
.hdr h1{font-size:clamp(24px,4.5vw,40px);font-weight:800;letter-spacing:-.02em;color:#fff;line-height:1.05;}
.hdr h1 em{color:var(--acid);font-style:normal;}
.hdr h1 span{color:#a78bfa;}
.hdr-sub{margin-top:8px;color:var(--mut);font-size:12px;}
.arrow-badge{display:inline-flex;align-items:center;gap:6px;font-family:var(--mono);font-size:9px;padding:3px 10px;border-radius:4px;background:var(--acid-d);border:1px solid var(--acid-b);color:var(--acid);margin-top:10px;}
.panel{background:var(--sur);border:1px solid var(--bdr);border-radius:12px;overflow:hidden;}
.panel-hdr{padding:14px 18px;border-bottom:1px solid var(--bdr);background:var(--sur2);display:flex;align-items:center;gap:10px;}
.panel-dot{width:6px;height:6px;border-radius:50%;}
.panel-title{font-family:var(--mono);font-size:10px;letter-spacing:.1em;text-transform:uppercase;}
.panel-body{padding:20px;}
.lbl{font-family:var(--mono);font-size:9px;letter-spacing:.16em;text-transform:uppercase;color:var(--mut);margin-bottom:9px;display:block;}
.chip-row{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:18px;}
.chip{display:flex;align-items:center;gap:4px;padding:5px 10px;border-radius:5px;border:1px solid var(--bdr);background:var(--sur2);color:var(--mut);font-family:'Syne',sans-serif;font-size:11px;font-weight:600;cursor:pointer;transition:all .13s;white-space:nowrap;}
.chip:hover{border-color:var(--acid-b);color:#fff;}
.chip.on{background:var(--acid-d);border-color:var(--acid);color:var(--acid);}
.inp{width:100%;background:var(--sur2);border:1px solid var(--bdr);border-radius:7px;padding:12px 15px;font-family:'Syne',sans-serif;font-size:14px;color:#fff;outline:none;transition:border-color .13s;margin-bottom:14px;}
.inp::placeholder{color:var(--mut);}
.inp:focus{border-color:var(--acid-b);}
.run-btn{width:100%;padding:13px;background:var(--acid);border:none;border-radius:7px;font-family:'Syne',sans-serif;font-size:13px;font-weight:800;color:#08080e;cursor:pointer;transition:all .15s;letter-spacing:.03em;}
.run-btn:hover:not(:disabled){transform:translateY(-1px);box-shadow:0 5px 20px rgba(200,245,69,.22);}
.run-btn:disabled{opacity:.4;cursor:not-allowed;}
.score-wrap{display:flex;align-items:center;gap:12px;padding:14px 16px;background:var(--sur2);border:1px solid var(--bdr);border-radius:8px;margin-bottom:10px;}
.score-bar-area{flex:1;}
.score-sub{font-family:var(--mono);font-size:9px;color:var(--mut);letter-spacing:.14em;text-transform:uppercase;margin-bottom:5px;}
.score-track{height:5px;background:rgba(255,255,255,.05);border-radius:100px;overflow:hidden;}
.score-fill{height:100%;border-radius:100px;transition:width .9s cubic-bezier(.16,1,.3,1);}
.score-num{font-family:var(--mono);font-size:20px;min-width:32px;text-align:right;}
.aff-chip{display:flex;align-items:center;gap:8px;padding:8px 12px;background:var(--ora-d);border:1px solid var(--ora-b);border-radius:7px;font-family:var(--mono);font-size:11px;color:var(--ora);margin-bottom:8px;flex-wrap:wrap;}
.aff-chip a{color:var(--ora);text-decoration:underline;}
.amz-chip{display:flex;align-items:center;gap:8px;padding:8px 12px;background:rgba(255,153,0,.08);border:1px solid rgba(255,153,0,.3);border-radius:7px;font-family:var(--mono);font-size:11px;color:#ff9900;margin-bottom:8px;flex-wrap:wrap;}
.amz-chip a{color:#ff9900;text-decoration:underline;}
.res-body{padding:18px;font-family:var(--mono);font-size:12px;line-height:1.85;color:#bbb;white-space:pre-wrap;max-height:400px;overflow-y:auto;}
.res-body::-webkit-scrollbar{width:4px;}
.res-body::-webkit-scrollbar-thumb{background:var(--bdr);border-radius:2px;}
.loading{color:var(--mut);animation:blink 1.2s infinite;}
@keyframes blink{0%,100%{opacity:1;}50%{opacity:.2;}}
.err{color:#ff6b6b;}
.kw-list{display:flex;flex-direction:column;gap:6px;margin-top:10px;}
.kw-row{display:flex;align-items:center;gap:8px;padding:9px 12px;background:var(--sur2);border:1px solid var(--bdr);border-radius:6px;cursor:pointer;transition:all .13s;}
.kw-row:hover{border-color:var(--acid-b);}
.kw-text{flex:1;font-size:12px;color:#ccc;}
.kw-send{font-family:var(--mono);font-size:10px;padding:3px 9px;border-radius:4px;background:var(--acid-d);border:1px solid var(--acid-b);color:var(--acid);white-space:nowrap;}
.act-bar{display:flex;gap:7px;flex-wrap:wrap;padding:12px 18px;border-top:1px solid var(--bdr);background:var(--sur2);}
.act-btn{font-family:var(--mono);font-size:10px;padding:5px 11px;border-radius:4px;border:1px solid var(--bdr);background:transparent;color:var(--mut);cursor:pointer;transition:all .12s;}
.act-btn:hover:not(:disabled){color:#fff;border-color:rgba(255,255,255,.2);}
.act-btn.tg{border-color:var(--blu-b);color:var(--blu);}
.act-btn.tg:hover{background:var(--blu-d);}
.act-btn:disabled{opacity:.35;cursor:not-allowed;}
.ch-grid{display:grid;grid-template-columns:1fr 1fr 1fr;gap:7px;margin-bottom:16px;}
@media(max-width:500px){.ch-grid{grid-template-columns:1fr 1fr;}}
.ch-btn{padding:9px 11px;border-radius:7px;border:1px solid var(--bdr);background:var(--sur2);color:#ccc;font-family:'Syne',sans-serif;font-size:11px;font-weight:700;cursor:pointer;text-align:left;transition:all .15s;line-height:1.3;}
.ch-btn.on{font-weight:800;}
.wf-progress{display:flex;margin-bottom:20px;border-radius:8px;overflow:hidden;border:1px solid var(--bdr);}
.wf-dot{flex:1;padding:9px 3px;font-family:var(--mono);font-size:9px;text-align:center;color:var(--mut);background:var(--sur2);cursor:pointer;transition:all .13s;border-right:1px solid var(--bdr);}
.wf-dot:last-child{border-right:none;}
.wf-dot.done{background:rgba(200,245,69,.08);color:var(--acid);}
.wf-dot.active{background:rgba(200,245,69,.15);color:var(--acid);font-weight:600;}
.wf-dot .dn{font-size:12px;display:block;margin-bottom:2px;}
.step-card{padding:20px;}
.step-icon{font-size:26px;margin-bottom:10px;}
.step-meta{display:flex;align-items:center;gap:10px;margin-bottom:12px;}
.step-num{font-family:var(--mono);font-size:9px;color:var(--mut);}
.step-dur{font-family:var(--mono);font-size:9px;padding:2px 8px;border-radius:4px;background:var(--acid-d);color:var(--acid);}
.step-title{font-size:16px;font-weight:800;color:#fff;margin-bottom:8px;}
.step-instr{font-size:12px;color:#aaa;line-height:1.8;margin-bottom:14px;}
.step-seed{background:var(--sur2);border-radius:7px;padding:13px;margin-bottom:12px;border-left:2px solid var(--acid-b);}
.seed-lbl{font-family:var(--mono);font-size:9px;letter-spacing:.14em;text-transform:uppercase;margin-bottom:7px;color:var(--acid);}
.seed-text{font-size:11px;color:#ccc;line-height:1.75;font-family:var(--mono);white-space:pre-wrap;}
.seed-text a{color:#ff9900;text-decoration:underline;}
.complete-btn{width:100%;padding:13px;border:none;border-radius:8px;font-family:'Syne',sans-serif;font-size:13px;font-weight:800;cursor:pointer;letter-spacing:.03em;transition:all .15s;}
.complete-btn:hover{transform:translateY(-1px);}
.done-state{display:flex;align-items:center;gap:8px;padding:12px;border-radius:7px;font-size:12px;font-family:var(--mono);background:var(--acid-d);border:1px solid var(--acid-b);color:var(--acid);}
.final-done{text-align:center;padding:28px 20px;}
.final-done .big{font-size:40px;margin-bottom:10px;}
.final-done h3{font-size:18px;font-weight:800;color:#fff;margin-bottom:6px;}
.reset-btn{margin-top:16px;padding:10px 22px;background:var(--acid-d);border:1px solid var(--acid-b);border-radius:6px;color:var(--acid);font-family:var(--mono);font-size:11px;cursor:pointer;}
.empty-wf{text-align:center;padding:40px 16px;color:var(--mut);font-family:var(--mono);font-size:12px;line-height:1.9;}
.modal-bg{position:fixed;inset:0;background:rgba(0,0,0,.75);display:flex;align-items:center;justify-content:center;z-index:99;padding:20px;}
.modal{background:var(--sur);border:1px solid var(--bdr);border-radius:14px;padding:28px;max-width:360px;width:100%;text-align:center;}
.modal h3{font-size:16px;font-weight:800;color:#fff;margin:12px 0 8px;}
.modal p{font-size:12px;color:var(--mut);line-height:1.7;margin-bottom:20px;}
.modal-btns{display:flex;gap:10px;}
.modal-btns button{flex:1;padding:11px;border-radius:7px;font-family:'Syne',sans-serif;font-size:12px;font-weight:700;cursor:pointer;}
.modal-cancel{background:transparent;border:1px solid var(--bdr);color:var(--mut);}
.modal-ok{border:none;color:#000;font-weight:800;}
.toast{position:fixed;bottom:24px;right:24px;padding:11px 18px;border-radius:7px;font-family:var(--mono);font-size:11px;z-index:199;animation:sup .3s ease;}
.toast.ok{background:var(--acid-d);border:1px solid var(--acid-b);color:var(--acid);}
.toast.err{background:rgba(255,107,107,.12);border:1px solid rgba(255,107,107,.3);color:#ff6b6b;}
@keyframes sup{from{opacity:0;transform:translateY(10px);}to{opacity:1;transform:translateY(0);}}
@keyframes pulse{0%,100%{opacity:1;}50%{opacity:.3;}}
`;

// ── Component ─────────────────────────────────────────────────────────────────
export default function App() {
  const [niche, setNiche] = useState("");
  const [platform, setPlatform] = useState("all");
  const [mode, setMode] = useState("buyer");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const [error, setError] = useState("");
  const [score, setScore] = useState(null);
  const [affiliate, setAffiliate] = useState(null);
  const [amazonOpp, setAmazonOpp] = useState(null);
  const [history, setHistory] = useState([]);
  const [extractedKws, setExtractedKws] = useState([]);
  const [tgLoading, setTgLoading] = useState(false);
  const [activeNiche, setActiveNiche] = useState("");
  const [channelId, setChannelId] = useState("finance");
  const [topic, setTopic] = useState("");
  const [seedHooks, setSeedHooks] = useState("");
  const [currentStep, setCurrentStep] = useState(1);
  const [completed, setCompleted] = useState([]);
  const [confirm, setConfirm] = useState(false);
  const [hookLoading, setHookLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const shortsRef = useRef(null);

  function showToast(msg, type = "ok") {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3200);
  }

  async function callClaude(userMsg, useSearch = false) {
    const body = { model: "claude-sonnet-4-20250514", max_tokens: 1000, messages: [{ role: "user", content: userMsg }] };
    if (useSearch) body.tools = [{ type: "web_search_20250305", name: "web_search" }];
    const res = await fetch("https://scout-api-production-081b.up.railway.app/api/research", {
      method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error?.message || "API error");
    return data.content.filter(b => b.type === "text").map(b => b.text).join("\n");
  }

  function extractKeywords(text) {
    const lines = text.split("\n").filter(l => l.trim().startsWith("—") || l.trim().match(/^\d+\./));
    return lines.slice(0, 8).map(l => l.replace(/^[—\d.]+\s*/, "").split("|")[0].trim()).filter(Boolean);
  }

  async function runResearch() {
    if (!niche.trim()) return;
    setLoading(true); setResult(""); setError(""); setScore(null); setAffiliate(null); setAmazonOpp(null); setExtractedKws([]);
    const n = niche.trim();
    try {
      const text = await callClaude(buildResearchPrompt(n, platform, mode), true);
      setResult(text); setActiveNiche(n);
      setScore(calcScore(n, text));
      setAffiliate(findAffiliate(n));
      setAmazonOpp(detectAmazon(n, text));
      setExtractedKws(extractKeywords(text));
      if (!history.includes(n)) setHistory(prev => [n, ...prev].slice(0, 6));
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  }

  async function sendToShorts(kw) {
    const detected = detectChannel(kw + " " + niche + " " + result);
    setChannelId(detected); setTopic(kw); setCurrentStep(1); setCompleted([]); setSeedHooks(""); setHookLoading(true);
    setTimeout(() => shortsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
    try {
      const hooks = await callClaude(buildHookPrompt(kw, result, detected), false);
      setSeedHooks(hooks);
    } catch (_) { setSeedHooks(""); }
    finally { setHookLoading(false); }
    showToast(`"${kw}" → ${CHANNELS[detected].label}`);
  }

  async function sendTelegram() {
    if (!result || !TELEGRAM_BOT_TOKEN) { showToast("Add bot token to TELEGRAM_BOT_TOKEN", "err"); return; }
    setTgLoading(true);
    try {
      const r = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: TELEGRAM_CHAT_ID, text: `🔍 *NICHE SCOUT*\n*Niche:* ${activeNiche}\n*Score:* ${score}/10\n*Channel:* ${CHANNELS[channelId].label}\n\n${result.slice(0,3000)}`, parse_mode: "Markdown" }),
      });
      const d = await r.json();
      d.ok ? showToast("✓ Sent to Telegram") : showToast(d.description, "err");
    } catch (e) { showToast(e.message, "err"); }
    finally { setTgLoading(false); }
  }

  const ch = CHANNELS[channelId];
  const steps = WORKFLOW_STEPS[channelId];
  const step = steps[currentStep - 1];
  const isLastStep = currentStep === steps.length;
  const allDone = completed.length === steps.length;
  const sc = score ? scoreColor(score) : "#5a5a6a";

  function formatResult(t) {
    return t
      .replace(/##\s(.+)/g, '<h4 style="color:#fff;font-family:Syne,sans-serif;font-size:13px;font-weight:700;margin:16px 0 6px;border-left:2px solid #c8f545;padding-left:9px">$1</h4>')
      .replace(/\*\*(.+?)\*\*/g, '<strong style="color:#c8f545">$1</strong>');
  }

  return (
    <>
      <style>{S}</style>
      <div className="wrap">
        <header className="hdr">
          <div className="hdr-tag">// Integrated Research + Production System</div>
          <h1>NICHE <em>SCOUT</em> <span>× SHORTS</span></h1>
          <div className="hdr-sub">Research any niche → one click → channel-matched Shorts workflow</div>
          <div className="arrow-badge">Scout → Auto-Detect Channel → Generate Hooks → Film → Upload</div>
        </header>

        <div className="two-col">
          {/* SCOUT */}
          <div>
            <div className="panel">
              <div className="panel-hdr">
                <div className="panel-dot" style={{ background: "#c8f545" }} />
                <div className="panel-title" style={{ color: "#c8f545" }}>01 — Niche Scout</div>
              </div>
              <div className="panel-body">
                <span className="lbl">Platform</span>
                <div className="chip-row">
                  {PLATFORMS.map(p => (
                    <button key={p.id} className={`chip ${platform === p.id ? "on" : ""}`} onClick={() => setPlatform(p.id)}>
                      {p.icon} {p.label}
                    </button>
                  ))}
                </div>
                <span className="lbl">Research Mode</span>
                <div className="chip-row" style={{ marginBottom: 16 }}>
                  {MODES.map(m => (
                    <button key={m.id} className={`chip ${mode === m.id ? "on" : ""}`} onClick={() => setMode(m.id)} title={m.desc}>
                      {m.label}
                    </button>
                  ))}
                </div>
                <span className="lbl">Niche / Keyword</span>
                <input className="inp" placeholder="credit repair, vegas hotels, solana, dog training, printables..."
                  value={niche} onChange={e => setNiche(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && !loading && runResearch()} />
                {history.length > 0 && (
                  <div className="chip-row" style={{ marginBottom: 14 }}>
                    {history.map(h => <button key={h} className="chip" onClick={() => setNiche(h)}>{h}</button>)}
                  </div>
                )}
                <button className="run-btn" onClick={runResearch} disabled={loading || !niche.trim()}>
                  {loading ? "SCANNING WEB..." : "SCOUT →"}
                </button>
              </div>

              {score !== null && (
                <div className="panel-body" style={{ paddingTop: 0 }}>
                  <div className="score-wrap">
                    <div className="score-bar-area">
                      <div className="score-sub">💰 Money Score</div>
                      <div className="score-track"><div className="score-fill" style={{ width: `${score * 10}%`, background: sc }} /></div>
                    </div>
                    <div className="score-num" style={{ color: sc }}>{score}</div>
                  </div>
                  {affiliate && (
                    <div className="aff-chip">
                      <span>🔗 {affiliate.name}</span>
                      {affiliate.url ? <a href={affiliate.url} target="_blank" rel="noreferrer">use link ↗</a> : <span style={{ color: "var(--mut)" }}>— grab specific product link</span>}
                    </div>
                  )}
                  {amazonOpp && (
                    <div className="amz-chip">
                      <span>📦 Amazon opp ({amazonOpp.signals.join(", ")})</span>
                      <a href={amazonOpp.url} target="_blank" rel="noreferrer">search "{amazonOpp.query}" ↗</a>
                    </div>
                  )}
                </div>
              )}

              {(loading || result || error) && (
                <>
                  <div className="panel-hdr" style={{ borderTop: "1px solid var(--bdr)" }}>
                    <div className="panel-dot" style={{ background: "#c8f545", animation: loading ? "pulse 1s infinite" : "none" }} />
                    <div className="panel-title" style={{ color: "#c8f545" }}>{loading ? "SCANNING..." : `RESULTS — ${activeNiche.toUpperCase()}`}</div>
                  </div>
                  <div className="res-body">
                    {loading && <div className="loading">⟳ Fetching live web data...</div>}
                    {error && <div className="err">⚠ {error}</div>}
                    {result && <div dangerouslySetInnerHTML={{ __html: formatResult(result) }} />}
                  </div>
                  {extractedKws.length > 0 && (
                    <div className="panel-body" style={{ paddingTop: 0 }}>
                      <span className="lbl">Click keyword → auto-loads matched Shorts workflow ↓</span>
                      <div className="kw-list">
                        {extractedKws.map((kw, i) => (
                          <div key={i} className="kw-row" onClick={() => sendToShorts(kw)}>
                            <div className="kw-text">{kw}</div>
                            <div className="kw-send">→ Shorts</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {result && (
                    <div className="act-bar">
                      <button className="act-btn tg" onClick={sendTelegram} disabled={tgLoading}>{tgLoading ? "⟳" : "✈"} Telegram</button>
                      <button className="act-btn" onClick={() => { navigator.clipboard.writeText(result); showToast("Copied"); }}>Copy</button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* WORKFLOW */}
          <div ref={shortsRef}>
            <div className="panel">
              <div className="panel-hdr">
                <div className="panel-dot" style={{ background: topic ? ch.color : "#5a5a6a" }} />
                <div className="panel-title" style={{ color: topic ? ch.color : "#5a5a6a" }}>
                  02 — Shorts Workflow {topic ? `— ${ch.label}` : ""}
                </div>
              </div>
              <div className="panel-body">
                {!topic ? (
                  <div className="empty-wf">
                    <div style={{ fontSize: 28, marginBottom: 12 }}>←</div>
                    Scout any niche, click a keyword to load<br />the right workflow automatically.<br /><br />
                    <span style={{ color: "#2a2a3a", fontSize: 11 }}>
                      💰 Finance · 🔮 Spirituality · 🏖️ Travel<br />
                      📦 Digital Products · 💻 Tech · 🧠 Self Help
                    </span>
                  </div>
                ) : allDone ? (
                  <div className="final-done">
                    <div className="big">🎉</div>
                    <h3>Short Complete!</h3>
                    <p style={{ color: "var(--mut)", fontSize: 12, marginTop: 6 }}>"{topic}" is live across all platforms.</p>
                    <button className="reset-btn" onClick={() => { setCurrentStep(1); setCompleted([]); setTopic(""); setSeedHooks(""); }}>Start New Short →</button>
                  </div>
                ) : (
                  <>
                    <span className="lbl">Channel — auto-detected, override if needed</span>
                    <div className="ch-grid">
                      {Object.entries(CHANNELS).map(([id, c]) => (
                        <button key={id} className={`ch-btn ${channelId === id ? "on" : ""}`}
                          style={channelId === id ? { background: `${c.color}18`, borderColor: c.color, color: c.color } : {}}
                          onClick={() => setChannelId(id)}>
                          {c.label}
                        </button>
                      ))}
                    </div>

                    <div style={{ padding: "9px 13px", background: "var(--sur2)", border: "1px solid var(--bdr)", borderRadius: 7, marginBottom: 16, fontFamily: "var(--mono)", fontSize: 11 }}>
                      <span style={{ color: "var(--mut)" }}>TOPIC: </span>
                      <span style={{ color: "#fff" }}>{topic}</span>
                      {hookLoading && <span style={{ color: "var(--acid)", marginLeft: 10 }}>⟳ generating hooks...</span>}
                    </div>

                    <div className="wf-progress">
                      {steps.map(s => (
                        <div key={s.id} className={`wf-dot ${completed.includes(s.id) ? "done" : ""} ${currentStep === s.id ? "active" : ""}`}
                          onClick={() => (completed.includes(s.id) || s.id === currentStep) && setCurrentStep(s.id)}>
                          <span className="dn">{completed.includes(s.id) ? "✓" : s.id}</span>
                          {s.icon}
                        </div>
                      ))}
                    </div>

                    <div className="step-card">
                      <div className="step-icon">{step.icon}</div>
                      <div className="step-meta">
                        <span className="step-num">STEP {step.id} OF {steps.length}</span>
                        <span className="step-dur">⏱ {step.duration}</span>
                      </div>
                      <div className="step-title">{step.title}</div>
                      <div className="step-instr">{step.instructions}</div>

                      {step.id === 2 && seedHooks && (
                        <div className="step-seed" style={{ borderLeftColor: ch.color }}>
                          <div className="seed-lbl" style={{ color: ch.color }}>🎯 AI Hooks — tuned for {ch.label}</div>
                          <div className="seed-text">{seedHooks}</div>
                        </div>
                      )}
                      {step.id === 6 && affiliate && (
                        <div className="step-seed" style={{ borderLeftColor: "var(--ora)" }}>
                          <div className="seed-lbl" style={{ color: "var(--ora)" }}>🔗 Primary Affiliate — {affiliate.name}</div>
                          <div className="seed-text">{affiliate.url || "Grab the specific Amazon product link and paste here"}</div>
                        </div>
                      )}
                      {step.id === 6 && amazonOpp && (
                        <div className="step-seed" style={{ borderLeftColor: "#ff9900", marginTop: 10 }}>
                          <div className="seed-lbl" style={{ color: "#ff9900" }}>📦 Amazon Associates (tag: ericcoste-20)</div>
                          <div className="seed-text">
                            <a href={amazonOpp.url} target="_blank" rel="noreferrer">Search "{amazonOpp.query}" on Amazon ↗</a>
                            {"\n"}Find best-rated product → copy affiliate link → paste in description
                          </div>
                        </div>
                      )}

                      <div style={{ height: 16 }} />
                      {completed.includes(currentStep) ? (
                        <div className="done-state"><span>✓</span><span>Complete — select next step above</span></div>
                      ) : (
                        <button className="complete-btn"
                          style={{ background: `linear-gradient(135deg,${ch.color},${ch.accent})`, color: "#000" }}
                          onClick={() => setConfirm(true)}>
                          ✓ &nbsp;{step.cta}
                        </button>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {confirm && (
          <div className="modal-bg" onClick={() => setConfirm(false)}>
            <div className="modal" onClick={e => e.stopPropagation()}>
              <div style={{ fontSize: 30 }}>{step.icon}</div>
              <h3>Mark "{step.title}" complete?</h3>
              <p>Confirm you finished this step before moving on.{!isLastStep && <><br />Next: <strong style={{ color: ch.color }}>{steps[currentStep]?.title}</strong></>}</p>
              <div className="modal-btns">
                <button className="modal-cancel" onClick={() => setConfirm(false)}>Not yet</button>
                <button className="modal-ok" style={{ background: `linear-gradient(135deg,${ch.color},${ch.accent})` }}
                  onClick={() => { setCompleted(p => [...p, currentStep]); setConfirm(false); if (!isLastStep) setCurrentStep(currentStep + 1); }}>
                  Yes, done ✓
                </button>
              </div>
            </div>
          </div>
        )}

        {toast && <div className={`toast ${toast.type}`}>{toast.msg}</div>}
      </div>
    </>
  );
}
