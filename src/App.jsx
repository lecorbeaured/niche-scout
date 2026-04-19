import { useState, useRef, useEffect } from "react";

// ── Config ────────────────────────────────────────────────────────────────────
const TELEGRAM_CHAT_ID = "7477833460";
const TELEGRAM_BOT_TOKEN = ""; // paste your bot token here

const AFFILIATE_MAP = {
  "credit repair": { name: "IdentityIQ", url: "https://www.identityiq.com/sc-securemax.aspx?offercode=431297RY", channel: "finance", amazon: false },
  "credit score": { name: "Kikoff", url: "https://kikoff.pxf.io/c/7007975/2344833/14994", channel: "finance", amazon: false },
  "debt": { name: "IdentityIQ", url: "https://www.identityiq.com/sc-securemax.aspx?offercode=431297RY", channel: "finance", amazon: false },
  "collections": { name: "IdentityIQ", url: "https://www.identityiq.com/sc-securemax.aspx?offercode=431297RY", channel: "finance", amazon: false },
  "finance": { name: "Kikoff", url: "https://kikoff.pxf.io/c/7007975/2344833/14994", channel: "finance", amazon: false },
  "money": { name: "Kikoff", url: "https://kikoff.pxf.io/c/7007975/2344833/14994", channel: "finance", amazon: false },
  "budget": { name: "Kikoff", url: "https://kikoff.pxf.io/c/7007975/2344833/14994", channel: "finance", amazon: false },
  "numerology": { name: "ORACELIS", url: "https://oracelis.com", channel: "spirituality", amazon: true },
  "moon": { name: "ORACELIS", url: "https://oracelis.com", channel: "spirituality", amazon: true },
  "saturn": { name: "ORACELIS", url: "https://oracelis.com", channel: "spirituality", amazon: true },
  "spiritual": { name: "ORACELIS", url: "https://oracelis.com", channel: "spirituality", amazon: true },
  "manifestation": { name: "ORACELIS", url: "https://oracelis.com", channel: "spirituality", amazon: true },
  "astrology": { name: "ORACELIS", url: "https://oracelis.com", channel: "spirituality", amazon: true },
  "planner": { name: "Amazon Associates", url: null, channel: "finance", amazon: true },
  "journal": { name: "Amazon Associates", url: null, channel: "finance", amazon: true },
  "book": { name: "Amazon Associates", url: null, channel: "finance", amazon: true },
  "trading": { name: "Amazon Associates", url: null, channel: "finance", amazon: true },
  "solana": { name: "Amazon Associates", url: null, channel: "finance", amazon: true },
  "investing": { name: "Amazon Associates", url: null, channel: "finance", amazon: true },
  "productivity": { name: "Amazon Associates", url: null, channel: "finance", amazon: true },
  "self help": { name: "Amazon Associates", url: null, channel: "spirituality", amazon: true },
  "tarot": { name: "Amazon Associates", url: null, channel: "spirituality", amazon: true },
  "crystal": { name: "Amazon Associates", url: null, channel: "spirituality", amazon: true },
  "meditation": { name: "Amazon Associates", url: null, channel: "spirituality", amazon: true },
};

// Niches where Amazon physical/digital products are likely worth adding as a secondary link
const AMAZON_SIGNAL_KEYWORDS = [
  "book", "journal", "planner", "workbook", "guide", "course", "kit", "deck", "card",
  "crystal", "candle", "tool", "software", "tracker", "template", "printable", "calendar",
  "tarot", "oracle", "meditation", "trading", "investing", "productivity", "self help",
  "numerology", "astrology", "spiritual", "manifestation", "moon", "saturn",
];

const AMAZON_TAG = "ericcoste-20";

function getAmazonSearchUrl(query) {
  return `https://www.amazon.com/s?k=${encodeURIComponent(query)}&tag=${AMAZON_TAG}`;
}

const PLATFORMS = [
  { id: "google", label: "Google", icon: "🔍" },
  { id: "etsy", label: "Etsy", icon: "🛍️" },
  { id: "reddit", label: "Reddit", icon: "💬" },
  { id: "youtube", label: "YouTube", icon: "▶️" },
  { id: "amazon", label: "Amazon", icon: "📦" },
  { id: "pinterest", label: "Pinterest", icon: "📌" },
  { id: "twitter", label: "X/Twitter", icon: "✖" },
  { id: "facebook", label: "Facebook", icon: "📘" },
  { id: "all", label: "All Platforms", icon: "🌐" },
];

const MODES = [
  { id: "buyer", label: "Buyer Intent", desc: "Purchase-ready searches" },
  { id: "trending", label: "Trending Now", desc: "What's hot right now" },
  { id: "gaps", label: "Content Gaps", desc: "Underserved demand" },
  { id: "pdf", label: "PDF Products", desc: "Digital product ideas" },
  { id: "spy", label: "Competitor Intel", desc: "Reverse-engineer rivals" },
];

const CHANNELS = {
  finance: { label: "💰 Credit & Finance", color: "#00d4aa", accent: "#00ff99" },
  spirituality: { label: "🔮 Spirituality & Numerology", color: "#a78bfa", accent: "#c4b5fd" },
};

const WORKFLOW_STEPS = {
  finance: [
    { id: 1, title: "Topic Lock", icon: "🎯", duration: "5 min", cta: "Topic confirmed — start scripting",
      instructions: "Your topic has been pre-loaded from Niche Scout. Confirm it fits this week's content plan, check it against your last 3 uploads to avoid repetition, then lock it in." },
    { id: 2, title: "Script Writing", icon: "✍️", duration: "20 min", cta: "Script is written and reviewed",
      instructions: "Write your 45–60 second script. Hook (first 3 sec): state the shocking fact or question. Body: 3 rapid-fire tips or steps. CTA: 'Save this, follow for more credit secrets.' Use your seeded hook below as the opening line." },
    { id: 3, title: "Voiceover", icon: "🎙️", duration: "10 min", cta: "Voiceover recorded and exported",
      instructions: "Record in ElevenLabs or record yourself. Speak at 1.1x natural pace. Export as MP3. File name: [topic-slug]-vo.mp3. Keep under 60 seconds." },
    { id: 4, title: "Video Assembly", icon: "🎬", duration: "20 min", cta: "Video assembled and exported",
      instructions: "Open InVideo AI or CapCut. Import voiceover. Select finance/money B-roll pack. Add captions (auto-generate, then verify). Add your logo bug bottom-right. Export 1080x1920 MP4." },
    { id: 5, title: "Thumbnail", icon: "🖼️", duration: "10 min", cta: "Thumbnail created and saved",
      instructions: "Open Canva. Use bold text overlay on dark background. Include: primary keyword, a number if possible ('3 Ways to...'), high contrast. Save as thumbnail-[topic-slug].png." },
    { id: 6, title: "Upload & SEO", icon: "📤", duration: "15 min", cta: "Video uploaded with full SEO",
      instructions: "Upload to YouTube Shorts. Title: include primary keyword in first 60 chars. Description: 150 words, keyword-rich, include affiliate link naturally. Tags: 10–15 from your keyword research. Set end screen to your Payhip link." },
    { id: 7, title: "Cross-Post", icon: "🔁", duration: "15 min", cta: "Cross-posted to all platforms",
      instructions: "Download the exported Short. Upload natively to: TikTok (no watermark), Instagram Reels, Facebook Reels. For Pinterest: create an Idea Pin using the thumbnail + a 2-sentence text overlay with your primary keyword — credit/finance content performs strongly on Pinterest search. For X/Twitter: post the video directly (native uploads get more reach than links) with 2–3 hashtags and your affiliate link. For Facebook: post to your page AND drop it in 2–3 relevant Facebook Groups (credit repair, personal finance). Pin the best comment with your affiliate link everywhere." },
  ],
  spirituality: [
    { id: 1, title: "Topic Lock", icon: "🔮", duration: "5 min", cta: "Topic confirmed — start scripting",
      instructions: "Your topic has been pre-loaded from Niche Scout. Align it with the current moon phase or numerological cycle if possible — this increases relevance and shareability in the spiritual community." },
    { id: 2, title: "Script Writing", icon: "✍️", duration: "20 min", cta: "Script is written and reviewed",
      instructions: "Write your 45–60 second script. Hook: mystical open question or bold claim ('Most people don't know what their life path number reveals...'). Body: 3 insights or revelations. CTA: 'Follow for your daily numerology insight.' Use seeded hook below." },
    { id: 3, title: "Voiceover", icon: "🎙️", duration: "10 min", cta: "Voiceover recorded and exported",
      instructions: "Use a calm, measured tone — slightly slower than finance content. ElevenLabs 'Aria' or 'Daniel' voice works well for this niche. Add subtle ambient background music (royalty-free). Export as MP3." },
    { id: 4, title: "Video Assembly", icon: "🎬", duration: "20 min", cta: "Video assembled and exported",
      instructions: "Use cosmic/celestial B-roll: starfields, moon phases, sacred geometry animations. Add animated text overlays with glow effects. Soft color grade (purple/indigo tones). Export 1080x1920 MP4." },
    { id: 5, title: "Thumbnail", icon: "🖼️", duration: "10 min", cta: "Thumbnail created and saved",
      instructions: "Dark cosmic background with gold or purple text. Include a number, symbol, or moon emoji. Mystical but legible. Test at small size — it must read clearly in feed." },
    { id: 6, title: "Upload & SEO", icon: "📤", duration: "15 min", cta: "Video uploaded with full SEO",
      instructions: "Upload to YouTube Shorts. Title: lead with the number or mystical hook. Description: link to ORACELIS Saturn Hour or Moon Phase Calculator as your primary CTA. Tags: numerology, life path, moon phase, astrology, manifestation." },
    { id: 7, title: "Cross-Post", icon: "🔁", duration: "15 min", cta: "Cross-posted to all platforms",
      instructions: "The spiritual niche is one of Pinterest's strongest verticals — prioritize it. Create a Pinterest Idea Pin: use your thumbnail, add a 3-line text overlay with the keyword and a mystical hook, link to your ORACELIS tool. Upload natively to TikTok, Instagram Reels, and Facebook Reels. For X/Twitter: post natively with mystical hashtags (#numerology #moonphase #astrology) — the spirituality community is very active on X. For Facebook: post to your page and drop into spirituality/numerology Facebook Groups for organic reach. Pin top comment with ORACELIS link on all platforms." },
  ],
};

// ── Prompt builders ───────────────────────────────────────────────────────────
function buildResearchPrompt(niche, platform, mode) {
  const pLabel = platform === "all" ? "Google, YouTube, Reddit, Etsy, Amazon, Pinterest, X/Twitter, and Facebook" : PLATFORMS.find(p => p.id === platform)?.label;
  const modeMap = {
    buyer: `Find the TOP 10 HIGH BUYER INTENT keywords in "${niche}" on ${pLabel}. For each: keyword | what they want to buy | urgency signal. Then list IMMEDIATE OPPORTUNITIES I can target today.`,
    trending: `What is TRENDING RIGHT NOW in "${niche}" on ${pLabel}? List top 8 trends with demand level. Include seasonal signals and the fastest opportunity to act on.`,
    gaps: `Find 8 UNDERSERVED CONTENT GAPS in "${niche}" on ${pLabel}. Topic | why underserved | difficulty. Focus on what people search but get poor results for.`,
    pdf: `Research PDF digital products selling in "${niche}" on Etsy, Gumroad, Amazon KDP, and Pinterest. List 8 product ideas with title, buyer, price ($8/$17/$26/$35/$44). Include bestseller patterns, Pinterest pin strategies for each product, and affiliate angles.`,
    spy: `Who dominates "${niche}" on ${pLabel}? List top 3 competitors with URLs, their best keywords, content strategy, Pinterest board strategies if relevant, and where they're weak so I can outcompete.`,
  };
  return `You are NICHE SCOUT — an elite market research AI. Search the web for REAL, CURRENT data.

NICHE: "${niche}" | PLATFORM: ${pLabel}

${modeMap[mode]}

## SHORTS HOOKS
List 5 punchy YouTube Shorts opening lines (under 12 words each) based on what you find. These should stop the scroll.

## PRIORITY ACTION
One sentence — the single most valuable move to make first.

Use ## headers, — for bullets. Be specific with real keywords.`;
}

function buildHookPrompt(niche, researchSnippet, channel) {
  const style = channel === "finance"
    ? "bold, urgent, numbers-driven, slightly alarming"
    : "mystical, curiosity-driven, personal, slightly esoteric";
  return `Based on this research about "${niche}":
${researchSnippet.slice(0, 800)}

Generate 3 YouTube Shorts opening hooks. Style: ${style}. Each hook must be under 12 words and make someone stop scrolling instantly. Number them 1, 2, 3. No preamble.`;
}

// ── Score helpers ─────────────────────────────────────────────────────────────
function calcScore(niche, result) {
  let s = 5;
  const t = (niche + result).toLowerCase();
  ["buy","purchase","best","template","kit","guide","fix","repair","remove","how to"].forEach(w => { if (t.includes(w)) s += 0.5; });
  ["credit","debt","finance","spiritual","numerology","astrology","manifestation"].forEach(w => { if (t.includes(w)) s += 0.7; });
  ["free","what is","definition"].forEach(w => { if (t.includes(w)) s -= 0.4; });
  return Math.min(10, Math.max(1, Math.round(s)));
}

function detectChannel(niche, result) {
  const t = (niche + result).toLowerCase();
  const spiritual = ["numerology","moon","saturn","spiritual","manifestation","astrology","oracle","esoteric","chakra","tarot"];
  if (spiritual.some(w => t.includes(w))) return "spirituality";
  return "finance";
}

function findAffiliate(niche) {
  const n = niche.toLowerCase();
  for (const [k, v] of Object.entries(AFFILIATE_MAP)) {
    if (n.includes(k)) return v;
  }
  return null;
}

// Returns suggested Amazon search terms if the niche likely has
// physical or digital products worth linking on Amazon
function detectAmazonOpportunity(niche, result) {
  const t = (niche + " " + result).toLowerCase();
  const hits = AMAZON_SIGNAL_KEYWORDS.filter(k => t.includes(k));
  if (hits.length === 0) return null;
  // Build a clean search query from the niche + top signal word
  const topSignal = hits[0];
  const searchQuery = `${niche} ${topSignal}`.trim();
  return {
    query: searchQuery,
    searchUrl: getAmazonSearchUrl(searchQuery),
    signals: hits.slice(0, 3),
  };
}

function scoreColor(s) {
  if (s >= 9) return "#c8f545";
  if (s >= 7) return "#f59e42";
  if (s >= 5) return "#60a5fa";
  return "#6b6b7a";
}

// ── Styles ────────────────────────────────────────────────────────────────────
const S = `
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=Fira+Mono:wght@400;500&display=swap');
*{box-sizing:border-box;margin:0;padding:0;}
html, body{background:#08080e;color:#e8e4dc;font-family:'Syne',sans-serif;min-height:100vh;width:100%;}
#root{background:#08080e;min-height:100vh;}
:root{
  --acid:#c8f545;--acid-d:rgba(200,245,69,.12);--acid-b:rgba(200,245,69,.28);
  --sur:#0f0f16;--sur2:#15151e;--bdr:rgba(255,255,255,.06);--mut:#5a5a6a;
  --mono:'Fira Mono',monospace;--fin:#00d4aa;--spi:#a78bfa;
  --ora:#f59e42;--ora-d:rgba(245,158,66,.12);--ora-b:rgba(245,158,66,.28);
  --blu:#60a5fa;--blu-d:rgba(96,165,250,.1);--blu-b:rgba(96,165,250,.28);
  --pnk:#f472b6;--pnk-d:rgba(244,114,182,.1);
}
.wrap{max-width:1100px;margin:0 auto;padding:0 20px 80px;}

/* layout */
.two-col{display:grid;grid-template-columns:1fr 1fr;gap:20px;align-items:start;}
@media(max-width:760px){.two-col{grid-template-columns:1fr;}}

/* header */
.hdr{padding:36px 0 24px;border-bottom:1px solid var(--bdr);margin-bottom:28px;}
.hdr-tag{font-family:var(--mono);font-size:9px;letter-spacing:.22em;color:var(--acid);text-transform:uppercase;margin-bottom:8px;}
.hdr h1{font-size:clamp(24px,4.5vw,40px);font-weight:800;letter-spacing:-.02em;color:#fff;line-height:1.05;}
.hdr h1 em{color:var(--acid);font-style:normal;}
.hdr h1 span{color:var(--spi);}
.hdr-sub{margin-top:8px;color:var(--mut);font-size:12px;}
.arrow-badge{display:inline-flex;align-items:center;gap:6px;font-family:var(--mono);font-size:9px;padding:3px 10px;border-radius:4px;background:var(--acid-d);border:1px solid var(--acid-b);color:var(--acid);margin-top:10px;}

/* panels */
.panel{background:var(--sur);border:1px solid var(--bdr);border-radius:12px;overflow:hidden;}
.panel-hdr{padding:14px 18px;border-bottom:1px solid var(--bdr);background:var(--sur2);display:flex;align-items:center;gap:10px;}
.panel-dot{width:6px;height:6px;border-radius:50%;}
.panel-title{font-family:var(--mono);font-size:10px;letter-spacing:.1em;text-transform:uppercase;}
.panel-body{padding:20px;}

/* form elements */
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

/* score */
.score-wrap{display:flex;align-items:center;gap:12px;padding:14px 16px;background:var(--sur2);border:1px solid var(--bdr);border-radius:8px;margin-bottom:14px;}
.score-bar-area{flex:1;}
.score-sub{font-family:var(--mono);font-size:9px;color:var(--mut);letter-spacing:.14em;text-transform:uppercase;margin-bottom:5px;}
.score-track{height:5px;background:rgba(255,255,255,.05);border-radius:100px;overflow:hidden;}
.score-fill{height:100%;border-radius:100px;transition:width .9s cubic-bezier(.16,1,.3,1);}
.score-num{font-family:var(--mono);font-size:20px;min-width:32px;text-align:right;}
.aff-chip{display:flex;align-items:center;gap:8px;padding:9px 13px;background:var(--ora-d);border:1px solid var(--ora-b);border-radius:7px;font-family:var(--mono);font-size:11px;color:var(--ora);margin-bottom:14px;flex-wrap:wrap;}
.aff-chip a{color:var(--ora);text-decoration:underline;}

/* result body */
.res-body{padding:18px;font-family:var(--mono);font-size:12px;line-height:1.85;color:#bbb;white-space:pre-wrap;max-height:420px;overflow-y:auto;}
.res-body::-webkit-scrollbar{width:4px;}
.res-body::-webkit-scrollbar-thumb{background:var(--bdr);border-radius:2px;}
.loading{color:var(--mut);animation:blink 1.2s infinite;}
@keyframes blink{0%,100%{opacity:1;}50%{opacity:.2;}}
.err{color:#ff6b6b;}

/* keyword pills */
.kw-list{display:flex;flex-direction:column;gap:6px;margin-top:10px;}
.kw-row{display:flex;align-items:center;gap:8px;padding:9px 12px;background:var(--sur2);border:1px solid var(--bdr);border-radius:6px;cursor:pointer;transition:all .13s;}
.kw-row:hover{border-color:var(--acid-b);}
.kw-text{flex:1;font-size:12px;color:#ccc;}
.kw-send{font-family:var(--mono);font-size:10px;padding:3px 9px;border-radius:4px;background:var(--acid-d);border:1px solid var(--acid-b);color:var(--acid);white-space:nowrap;}

/* action bar */
.act-bar{display:flex;gap:7px;flex-wrap:wrap;padding:12px 18px;border-top:1px solid var(--bdr);background:var(--sur2);}
.act-btn{font-family:var(--mono);font-size:10px;padding:5px 11px;border-radius:4px;border:1px solid var(--bdr);background:transparent;color:var(--mut);cursor:pointer;transition:all .12s;}
.act-btn:hover:not(:disabled){color:#fff;border-color:rgba(255,255,255,.2);}
.act-btn.tg{border-color:var(--blu-b);color:var(--blu);}
.act-btn.tg:hover{background:var(--blu-d);}
.act-btn:disabled{opacity:.35;cursor:not-allowed;}

/* channel selector */
.ch-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:18px;}
.ch-btn{padding:14px;border-radius:8px;border:1px solid var(--bdr);background:var(--sur2);color:#fff;font-family:'Syne',sans-serif;font-size:13px;font-weight:700;cursor:pointer;text-align:left;transition:all .15s;}
.ch-btn .ch-sub{font-size:11px;font-weight:400;color:var(--mut);margin-top:3px;}
.ch-btn.fin.on{background:rgba(0,212,170,.1);border-color:#00d4aa;}
.ch-btn.spi.on{background:rgba(167,139,250,.1);border-color:#a78bfa;}

/* workflow */
.wf-progress{display:flex;gap:0;margin-bottom:20px;border-radius:8px;overflow:hidden;border:1px solid var(--bdr);}
.wf-step-dot{flex:1;padding:10px 4px;font-family:var(--mono);font-size:9px;text-align:center;color:var(--mut);background:var(--sur2);cursor:pointer;transition:all .13s;border-right:1px solid var(--bdr);}
.wf-step-dot:last-child{border-right:none;}
.wf-step-dot.done{background:rgba(200,245,69,.08);color:var(--acid);}
.wf-step-dot.active{background:rgba(200,245,69,.15);color:var(--acid);font-weight:600;}
.wf-step-dot .dot-num{font-size:13px;display:block;margin-bottom:2px;}

.step-card{padding:20px;}
.step-icon{font-size:28px;margin-bottom:10px;}
.step-meta{display:flex;align-items:center;gap:10px;margin-bottom:14px;}
.step-num{font-family:var(--mono);font-size:9px;color:var(--mut);}
.step-dur{font-family:var(--mono);font-size:9px;padding:2px 8px;border-radius:4px;background:var(--acid-d);color:var(--acid);}
.step-title{font-size:17px;font-weight:800;color:#fff;margin-bottom:10px;}
.step-instr{font-size:13px;color:#aaa;line-height:1.75;margin-bottom:16px;}
.step-seed{background:var(--sur2);border:1px solid var(--acid-b);border-radius:7px;padding:14px;margin-bottom:18px;}
.step-seed-lbl{font-family:var(--mono);font-size:9px;color:var(--acid);letter-spacing:.14em;text-transform:uppercase;margin-bottom:8px;}
.step-seed-text{font-size:12px;color:#ccc;line-height:1.7;font-family:var(--mono);}
.complete-btn{width:100%;padding:13px;border:none;border-radius:8px;font-family:'Syne',sans-serif;font-size:13px;font-weight:800;cursor:pointer;letter-spacing:.03em;transition:all .15s;}
.complete-btn:hover{transform:translateY(-1px);}
.done-state{display:flex;align-items:center;gap:8px;padding:12px;border-radius:7px;font-size:12px;font-family:var(--mono);}
.final-done{text-align:center;padding:28px 20px;}
.final-done .big{font-size:40px;margin-bottom:10px;}
.final-done h3{font-size:18px;font-weight:800;color:#fff;margin-bottom:6px;}
.final-done p{font-size:12px;color:var(--mut);}
.reset-btn{margin-top:16px;padding:10px 22px;background:var(--acid-d);border:1px solid var(--acid-b);border-radius:6px;color:var(--acid);font-family:var(--mono);font-size:11px;cursor:pointer;}

/* modal */
.modal-bg{position:fixed;inset:0;background:rgba(0,0,0,.7);display:flex;align-items:center;justify-content:center;z-index:99;padding:20px;}
.modal{background:var(--sur);border:1px solid var(--bdr);border-radius:14px;padding:28px;max-width:380px;width:100%;text-align:center;}
.modal h3{font-size:16px;font-weight:800;color:#fff;margin:12px 0 8px;}
.modal p{font-size:12px;color:var(--mut);line-height:1.7;margin-bottom:20px;}
.modal-btns{display:flex;gap:10px;}
.modal-btns button{flex:1;padding:11px;border-radius:7px;font-family:'Syne',sans-serif;font-size:12px;font-weight:700;cursor:pointer;}
.modal-cancel{background:transparent;border:1px solid var(--bdr);color:var(--mut);}
.modal-ok{border:none;color:#000;font-weight:800;}

/* toast */
.toast{position:fixed;bottom:24px;right:24px;padding:11px 18px;border-radius:7px;font-family:var(--mono);font-size:11px;z-index:199;animation:sup .3s ease;}
.toast.ok{background:var(--acid-d);border:1px solid var(--acid-b);color:var(--acid);}
.toast.err{background:rgba(255,107,107,.12);border:1px solid rgba(255,107,107,.3);color:#ff6b6b;}
@keyframes sup{from{opacity:0;transform:translateY(10px);}to{opacity:1;transform:translateY(0);}}

.divider{height:1px;background:var(--bdr);margin:24px 0;}
`;

// ── Component ─────────────────────────────────────────────────────────────────
export default function App() {
  // Scout state
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

  // Shorts state
  const [channel, setChannel] = useState("finance");
  const [topic, setTopic] = useState("");
  const [seedHooks, setSeedHooks] = useState("");
  const [currentStep, setCurrentStep] = useState(1);
  const [completed, setCompleted] = useState([]);
  const [confirm, setConfirm] = useState(false);
  const [hookLoading, setHookLoading] = useState(false);

  // Shared
  const [toast, setToast] = useState(null);
  const shortsRef = useRef(null);

  function showToast(msg, type = "ok") {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3200);
  }

  async function callClaude(userMsg, useSearch = false) {
    const body = {
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      messages: [{ role: "user", content: userMsg }],
    };
    if (useSearch) body.tools = [{ type: "web_search_20250305", name: "web_search" }];
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error?.message || "API error");
    return data.content.filter(b => b.type === "text").map(b => b.text).join("\n");
  }

  // Extract keywords from result text
  function extractKeywords(text) {
    const lines = text.split("\n").filter(l => l.trim().startsWith("—") || l.trim().match(/^\d+\./));
    return lines.slice(0, 8).map(l => l.replace(/^[—\d\.]+\s*/, "").split("|")[0].trim()).filter(Boolean);
  }

  async function runResearch() {
    if (!niche.trim()) return;
    setLoading(true); setResult(""); setError(""); setScore(null); setAffiliate(null); setExtractedKws([]); setAmazonOpp(null);
    const n = niche.trim();
    try {
      const text = await callClaude(buildResearchPrompt(n, platform, mode), true);
      setResult(text);
      setScore(calcScore(n, text));
      setAffiliate(findAffiliate(n));
      setAmazonOpp(detectAmazonOpportunity(n, text));
      setExtractedKws(extractKeywords(text));
      if (!history.includes(n)) setHistory(prev => [n, ...prev].slice(0, 6));
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  }

  // Push keyword → Shorts workflow
  async function sendToShorts(kw) {
    const detectedCh = detectChannel(kw + niche, result);
    setChannel(detectedCh);
    setTopic(kw);
    setCurrentStep(1);
    setCompleted([]);
    setSeedHooks("");
    setHookLoading(true);

    // Scroll to workflow
    setTimeout(() => shortsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 100);

    try {
      const hooks = await callClaude(buildHookPrompt(kw, result, detectedCh), false);
      setSeedHooks(hooks);
    } catch (_) { setSeedHooks(""); }
    finally { setHookLoading(false); }

    showToast(`"${kw}" sent to Shorts workflow ↓`);
  }

  async function sendTelegram() {
    if (!result) return;
    if (!TELEGRAM_BOT_TOKEN) { showToast("Add bot token to TELEGRAM_BOT_TOKEN", "err"); return; }
    setTgLoading(true);
    const msg = `🔍 *NICHE SCOUT*\n*Niche:* ${niche}\n*Score:* ${score}/10\n\n${result.slice(0, 3200)}`;
    try {
      const r = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: TELEGRAM_CHAT_ID, text: msg, parse_mode: "Markdown" }),
      });
      const d = await r.json();
      d.ok ? showToast("✓ Sent to Telegram") : showToast(d.description, "err");
    } catch (e) { showToast(e.message, "err"); }
    finally { setTgLoading(false); }
  }

  // Workflow logic
  const steps = WORKFLOW_STEPS[channel];
  const step = steps[currentStep - 1];
  const ch = CHANNELS[channel];
  const isLastStep = currentStep === steps.length;
  const allDone = completed.length === steps.length;

  function handleComplete() { setConfirm(true); }
  function confirmComplete() {
    const next = [...completed, currentStep];
    setCompleted(next);
    setConfirm(false);
    if (!isLastStep) setCurrentStep(currentStep + 1);
  }

  function resetWorkflow() {
    setCurrentStep(1); setCompleted([]); setTopic(""); setSeedHooks("");
  }

  function formatResult(t) {
    return t
      .replace(/##\s(.+)/g, '<h4 style="color:#fff;font-family:Syne,sans-serif;font-size:13px;font-weight:700;margin:16px 0 6px;border-left:2px solid #c8f545;padding-left:9px">$1</h4>')
      .replace(/\*\*(.+?)\*\*/g, '<strong style="color:#c8f545">$1</strong>');
  }

  const sc = score ? scoreColor(score) : "#5a5a6a";

  return (
    <>
      <style>{S}</style>
      <div className="wrap">

        {/* Header */}
        <header className="hdr">
          <div className="hdr-tag">// Integrated Research + Production System</div>
          <h1>NICHE <em>SCOUT</em> <span>× SHORTS</span></h1>
          <div className="hdr-sub">Research a keyword → one click → pre-loaded Shorts production workflow</div>
          <div className="arrow-badge">Scout → Send to Shorts → Film → Upload</div>
        </header>

        <div className="two-col">

          {/* ── LEFT: NICHE SCOUT ── */}
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
                <input className="inp" placeholder="credit repair, numerology, printable planner..."
                  value={niche} onChange={e => setNiche(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && !loading && runResearch()} />

                {history.length > 0 && (
                  <div className="chip-row" style={{ marginBottom: 14 }}>
                    {history.map(h => <button key={h} className="chip" style={{ fontSize: 11 }} onClick={() => setNiche(h)}>{h}</button>)}
                  </div>
                )}

                <button className="run-btn" onClick={runResearch} disabled={loading || !niche.trim()}>
                  {loading ? "SCANNING WEB..." : "SCOUT →"}
                </button>
              </div>

              {/* Score + affiliate */}
              {score !== null && (
                <div className="panel-body" style={{ paddingTop: 0 }}>
                  <div className="score-wrap">
                    <div className="score-bar-area">
                      <div className="score-sub">💰 Money Score</div>
                      <div className="score-track">
                        <div className="score-fill" style={{ width: `${score * 10}%`, background: sc }} />
                      </div>
                    </div>
                    <div className="score-num" style={{ color: sc }}>{score}</div>
                  </div>
                  {affiliate && (
                    <div className="aff-chip">
                      <span>🔗 {affiliate.name}</span>
                      {affiliate.url
                        ? <a href={affiliate.url} target="_blank" rel="noreferrer">use link ↗</a>
                        : <span style={{color:"var(--mut)"}}>— grab your specific product link below</span>}
                    </div>
                  )}
                  {amazonOpp && (
                    <div className="aff-chip" style={{ background: "rgba(255,153,0,0.08)", borderColor: "rgba(255,153,0,0.3)", color: "#ff9900", marginTop: 8 }}>
                      <span>📦 Amazon opportunity detected</span>
                      <span style={{ color: "var(--mut)" }}>({amazonOpp.signals.join(", ")})</span>
                      <a href={amazonOpp.searchUrl} target="_blank" rel="noreferrer"
                        style={{ color: "#ff9900" }}>
                        search "{amazonOpp.query}" ↗
                      </a>
                      <span style={{ color: "var(--mut)", fontSize: 10 }}>— find the product, grab your affiliate link, embed it</span>
                    </div>
                  )}
                </div>
              )}

              {/* Results */}
              {(loading || result || error) && (
                <>
                  <div className="panel-hdr" style={{ borderTop: "1px solid var(--bdr)" }}>
                    <div className="panel-dot" style={{ background: "#c8f545", animation: loading ? "blink 1s infinite" : "none" }} />
                    <div className="panel-title" style={{ color: "#c8f545" }}>
                      {loading ? "SCANNING..." : `RESULTS — ${niche.toUpperCase()}`}
                    </div>
                  </div>
                  <div className="res-body">
                    {loading && <div className="loading">⟳ Fetching live web data...</div>}
                    {error && <div className="err">⚠ {error}</div>}
                    {result && <div dangerouslySetInnerHTML={{ __html: formatResult(result) }} />}
                  </div>

                  {/* Extracted keywords → Send to Shorts */}
                  {extractedKws.length > 0 && (
                    <div className="panel-body" style={{ paddingTop: 0 }}>
                      <span className="lbl">Click a keyword to send to Shorts ↓</span>
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
                      <button className="act-btn tg" onClick={sendTelegram} disabled={tgLoading}>
                        {tgLoading ? "⟳" : "✈"} Telegram
                      </button>
                      <button className="act-btn" onClick={() => { navigator.clipboard.writeText(result); showToast("Copied"); }}>
                        Copy
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* ── RIGHT: SHORTS WORKFLOW ── */}
          <div ref={shortsRef}>
            <div className="panel">
              <div className="panel-hdr">
                <div className="panel-dot" style={{ background: topic ? ch.color : "#5a5a6a" }} />
                <div className="panel-title" style={{ color: topic ? ch.color : "#5a5a6a" }}>
                  02 — Shorts Workflow {topic ? `— ${channel === "finance" ? "💰" : "🔮"}` : ""}
                </div>
              </div>
              <div className="panel-body">

                {!topic ? (
                  <div style={{ textAlign: "center", padding: "32px 10px", color: "var(--mut)", fontFamily: "var(--mono)", fontSize: 12, lineHeight: 1.8 }}>
                    <div style={{ fontSize: 32, marginBottom: 12 }}>←</div>
                    Run a Niche Scout search, then click<br />any keyword to load it here
                  </div>
                ) : allDone ? (
                  <div className="final-done">
                    <div className="big">🎉</div>
                    <h3>Short Complete!</h3>
                    <p style={{ color: "var(--mut)", fontSize: 12, marginTop: 6 }}>"{topic}" is live across all platforms.</p>
                    <button className="reset-btn" onClick={resetWorkflow}>Start New Short →</button>
                  </div>
                ) : (
                  <>
                    {/* Channel selector */}
                    <span className="lbl">Channel</span>
                    <div className="ch-grid" style={{ marginBottom: 16 }}>
                      {Object.entries(CHANNELS).map(([id, c]) => (
                        <button key={id} className={`ch-btn ${id} ${channel === id ? "on" : ""}`} onClick={() => setChannel(id)}>
                          {c.label}
                          <div className="ch-sub">{id === "finance" ? "Credit · Debt · Money" : "Numerology · Moon · Tarot"}</div>
                        </button>
                      ))}
                    </div>

                    {/* Topic badge */}
                    <div style={{ padding: "9px 13px", background: "var(--sur2)", border: "1px solid var(--bdr)", borderRadius: 7, marginBottom: 16, fontFamily: "var(--mono)", fontSize: 11 }}>
                      <span style={{ color: "var(--mut)" }}>TOPIC: </span>
                      <span style={{ color: "#fff" }}>{topic}</span>
                      {hookLoading && <span style={{ color: "var(--acid)", marginLeft: 10 }}>⟳ generating hooks...</span>}
                    </div>

                    {/* Progress bar */}
                    <div className="wf-progress">
                      {steps.map(s => (
                        <div key={s.id}
                          className={`wf-step-dot ${completed.includes(s.id) ? "done" : ""} ${currentStep === s.id ? "active" : ""}`}
                          onClick={() => completed.includes(s.id) || s.id === currentStep ? setCurrentStep(s.id) : null}>
                          <span className="dot-num">{completed.includes(s.id) ? "✓" : s.id}</span>
                          {s.icon}
                        </div>
                      ))}
                    </div>

                    {/* Step card */}
                    <div className="step-card">
                      <div className="step-icon">{step.icon}</div>
                      <div className="step-meta">
                        <span className="step-num">STEP {step.id} OF {steps.length}</span>
                        <span className="step-dur">⏱ {step.duration}</span>
                      </div>
                      <div className="step-title">{step.title}</div>
                      <div className="step-instr">{step.instructions}</div>

                      {/* Seeded content for script step */}
                      {step.id === 2 && seedHooks && (
                        <div className="step-seed">
                          <div className="step-seed-lbl">🎯 AI-Generated Hooks (from your research)</div>
                          <div className="step-seed-text">{seedHooks}</div>
                        </div>
                      )}

                      {/* Affiliate seed for upload step */}
                      {step.id === 6 && affiliate && (
                        <div className="step-seed">
                          <div className="step-seed-lbl">🔗 Primary Affiliate — {affiliate.name}</div>
                          <div className="step-seed-text">{affiliate.url || "Grab the specific product link from Amazon and paste here"}</div>
                        </div>
                      )}
                      {step.id === 6 && amazonOpp && (
                        <div className="step-seed" style={{ borderColor: "rgba(255,153,0,0.3)", marginTop: 10 }}>
                          <div className="step-seed-lbl" style={{ color: "#ff9900" }}>📦 Amazon Associates — grab & embed</div>
                          <div className="step-seed-text">
                            Search: <a href={amazonOpp.searchUrl} target="_blank" rel="noreferrer" style={{ color: "#ff9900" }}>"{amazonOpp.query}" on Amazon ↗</a>
                            {"\n"}Find the best-rated product → copy your affiliate link (tag: ericcoste-20) → paste into description
                          </div>
                        </div>
                      )}

                      <div style={{ height: 16 }} />

                      {completed.includes(currentStep) ? (
                        <div className="done-state" style={{ background: "var(--acid-d)", border: "1px solid var(--acid-b)", color: "var(--acid)" }}>
                          <span>✓</span> <span>Complete — select next step above</span>
                        </div>
                      ) : (
                        <button className="complete-btn"
                          style={{ background: `linear-gradient(135deg, ${ch.color}, ${ch.accent})`, color: "#000" }}
                          onClick={handleComplete}>
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

        {/* Confirm modal */}
        {confirm && (
          <div className="modal-bg" onClick={() => setConfirm(false)}>
            <div className="modal" onClick={e => e.stopPropagation()}>
              <div style={{ fontSize: 32 }}>{step.icon}</div>
              <h3>Mark "{step.title}" complete?</h3>
              <p>Confirm you've finished this step before moving on.{!isLastStep && <><br />Next: <strong style={{ color: ch.color }}>{steps[currentStep]?.title}</strong></>}</p>
              <div className="modal-btns">
                <button className="modal-cancel" onClick={() => setConfirm(false)}>Not yet</button>
                <button className="modal-ok" style={{ background: `linear-gradient(135deg,${ch.color},${ch.accent})` }} onClick={confirmComplete}>
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
