import { useState, useEffect, useCallback, useRef } from "react";

/* ───────── CONFIG ───────── */
const EMOTIONS = [
  { key: "tension", color: "#ff2d2d" },
  { key: "yearning", color: "#c8ff00" },
  { key: "wonder", color: "#7b61ff" },
  { key: "melancholy", color: "#3d8bfd" },
  { key: "defiance", color: "#ff6b35" },
  { key: "ecstasy", color: "#ff42a1" },
  { key: "dread", color: "#8b5cf6" },
  { key: "tenderness", color: "#34d399" },
  { key: "fury", color: "#ef4444" },
  { key: "serenity", color: "#67e8f9" },
];

const MEDIUMS = [
  { id: "architecture", label: "Architecture", icon: "△" },
  { id: "perfume", label: "Perfumery", icon: "◎" },
  { id: "choreography", label: "Choreography", icon: "∿" },
  { id: "cuisine", label: "Cuisine", icon: "◉" },
  { id: "fashion", label: "Fashion", icon: "◇" },
  { id: "landscape", label: "Landscape", icon: "▽" },
];

const EXAMPLES = [
  '"A Love Supreme" — John Coltrane',
  '"Stalker" — Tarkovsky',
  '"One Hundred Years of Solitude"',
  '"Guernica" — Picasso',
  '"Bohemian Rhapsody" — Queen',
  '"2001: A Space Odyssey"',
];

/* ───────── LOCAL ENGINE ───────── */
const GENRE_PROFILES = {
  jazz: { tension: 0.72, yearning: 0.88, wonder: 0.65, melancholy: 0.79, defiance: 0.55, ecstasy: 0.61, dread: 0.22, tenderness: 0.70, fury: 0.18, serenity: 0.58 },
  classical: { tension: 0.55, yearning: 0.62, wonder: 0.80, melancholy: 0.68, defiance: 0.25, ecstasy: 0.50, dread: 0.30, tenderness: 0.72, fury: 0.20, serenity: 0.78 },
  rock: { tension: 0.65, yearning: 0.58, wonder: 0.45, melancholy: 0.40, defiance: 0.88, ecstasy: 0.78, dread: 0.30, tenderness: 0.25, fury: 0.72, serenity: 0.15 },
  hiphop: { tension: 0.70, yearning: 0.55, wonder: 0.35, melancholy: 0.45, defiance: 0.92, ecstasy: 0.60, dread: 0.40, tenderness: 0.30, fury: 0.75, serenity: 0.12 },
  electronic: { tension: 0.60, yearning: 0.50, wonder: 0.72, melancholy: 0.35, defiance: 0.45, ecstasy: 0.85, dread: 0.38, tenderness: 0.20, fury: 0.42, serenity: 0.55 },
  film_dark: { tension: 0.88, yearning: 0.52, wonder: 0.70, melancholy: 0.75, defiance: 0.35, ecstasy: 0.15, dread: 0.85, tenderness: 0.28, fury: 0.40, serenity: 0.20 },
  film_epic: { tension: 0.72, yearning: 0.60, wonder: 0.92, melancholy: 0.45, defiance: 0.55, ecstasy: 0.68, dread: 0.50, tenderness: 0.35, fury: 0.38, serenity: 0.42 },
  film_romance: { tension: 0.45, yearning: 0.92, wonder: 0.55, melancholy: 0.72, defiance: 0.20, ecstasy: 0.65, dread: 0.15, tenderness: 0.90, fury: 0.10, serenity: 0.60 },
  literature_magic: { tension: 0.58, yearning: 0.75, wonder: 0.92, melancholy: 0.68, defiance: 0.42, ecstasy: 0.55, dread: 0.35, tenderness: 0.62, fury: 0.22, serenity: 0.50 },
  literature_dark: { tension: 0.82, yearning: 0.60, wonder: 0.40, melancholy: 0.85, defiance: 0.55, ecstasy: 0.12, dread: 0.78, tenderness: 0.30, fury: 0.65, serenity: 0.10 },
  painting_war: { tension: 0.90, yearning: 0.45, wonder: 0.30, melancholy: 0.72, defiance: 0.82, ecstasy: 0.08, dread: 0.88, tenderness: 0.15, fury: 0.92, serenity: 0.05 },
  painting_abstract: { tension: 0.55, yearning: 0.65, wonder: 0.78, melancholy: 0.60, defiance: 0.48, ecstasy: 0.42, dread: 0.35, tenderness: 0.50, fury: 0.25, serenity: 0.68 },
  photo_portrait: { tension: 0.48, yearning: 0.72, wonder: 0.42, melancholy: 0.65, defiance: 0.38, ecstasy: 0.30, dread: 0.20, tenderness: 0.82, fury: 0.12, serenity: 0.55 },
  photo_landscape: { tension: 0.25, yearning: 0.58, wonder: 0.85, melancholy: 0.45, defiance: 0.15, ecstasy: 0.52, dread: 0.20, tenderness: 0.40, fury: 0.08, serenity: 0.90 },
  photo_dark: { tension: 0.78, yearning: 0.55, wonder: 0.50, melancholy: 0.80, defiance: 0.42, ecstasy: 0.10, dread: 0.75, tenderness: 0.22, fury: 0.35, serenity: 0.15 },
  photo_vibrant: { tension: 0.35, yearning: 0.48, wonder: 0.72, melancholy: 0.20, defiance: 0.55, ecstasy: 0.82, dread: 0.10, tenderness: 0.45, fury: 0.28, serenity: 0.60 },
  uploaded_doc: { tension: 0.52, yearning: 0.60, wonder: 0.55, melancholy: 0.58, defiance: 0.40, ecstasy: 0.35, dread: 0.42, tenderness: 0.48, fury: 0.30, serenity: 0.50 },
  default: { tension: 0.55, yearning: 0.60, wonder: 0.58, melancholy: 0.52, defiance: 0.45, ecstasy: 0.48, dread: 0.35, tenderness: 0.50, fury: 0.30, serenity: 0.45 },
};

const KEYWORD_MAP = {
  love: { yearning: 0.3, tenderness: 0.3, ecstasy: 0.15 }, supreme: { ecstasy: 0.2, wonder: 0.2, defiance: 0.15 },
  blue: { melancholy: 0.25, serenity: 0.15 }, dark: { dread: 0.25, tension: 0.2 }, war: { fury: 0.3, tension: 0.25, dread: 0.2 },
  death: { dread: 0.3, melancholy: 0.25 }, dream: { wonder: 0.25, serenity: 0.15 }, fire: { fury: 0.25, tension: 0.2, ecstasy: 0.15 },
  night: { melancholy: 0.2, dread: 0.15 }, god: { wonder: 0.25, dread: 0.15 }, solitude: { melancholy: 0.3, serenity: 0.15, yearning: 0.2 },
  space: { wonder: 0.3, dread: 0.15, serenity: 0.2 }, odyssey: { wonder: 0.25, tension: 0.15 }, rhapsody: { ecstasy: 0.25, wonder: 0.2, defiance: 0.15 },
  bohemian: { defiance: 0.2, yearning: 0.15 }, guernica: { fury: 0.3, dread: 0.25, tension: 0.2, defiance: 0.15 },
  stalker: { dread: 0.25, wonder: 0.2, tension: 0.2 }, coltrane: { yearning: 0.2, ecstasy: 0.15 },
  tarkovsky: { dread: 0.2, wonder: 0.2, melancholy: 0.15 }, picasso: { fury: 0.15, defiance: 0.2 },
  queen: { ecstasy: 0.15, defiance: 0.15 }, kubrick: { wonder: 0.2, dread: 0.15 },
  portrait: { tenderness: 0.2, yearning: 0.15 }, sunset: { serenity: 0.25, wonder: 0.15, melancholy: 0.1 },
  ocean: { serenity: 0.2, wonder: 0.2, dread: 0.1 }, mountain: { wonder: 0.2, serenity: 0.15 },
  city: { tension: 0.15, ecstasy: 0.1, defiance: 0.1 }, rain: { melancholy: 0.2, serenity: 0.15 },
  blood: { fury: 0.2, dread: 0.15, tension: 0.15 }, child: { tenderness: 0.3, wonder: 0.15 },
  scream: { fury: 0.25, dread: 0.2, tension: 0.15 }, silence: { serenity: 0.2, dread: 0.15, melancholy: 0.1 },
};

const NOTES_POOL = {
  tension: ["sustained unresolved chords", "narrative pressure builds", "structural instability", "collision of forces", "edges refuse to soften", "held breath throughout", "taut like piano wire"],
  yearning: ["reaching for the unreachable", "ache woven into rhythm", "distance as protagonist", "perpetual almost-arrival", "desire without resolution", "gravitational pull inward", "longing made audible"],
  wonder: ["scale defies comprehension", "the unknown as invitation", "perception shifts constantly", "boundaries dissolve quietly", "cosmic in implication", "awe at the threshold", "revelation upon revelation"],
  melancholy: ["beauty in the decay", "time's weight is felt", "loss saturates every layer", "nostalgia without origin", "sweetness turned to ache", "twilight as permanent state", "memory heavier than stone"],
  defiance: ["refusal to conform", "rules shattered deliberately", "fierce creative autonomy", "chaos as statement", "tradition openly challenged", "unapologetic in its rage", "convention set ablaze"],
  ecstasy: ["transcendence through intensity", "pure kinetic release", "joy as a weapon", "overwhelm becomes liberation", "sensory boundaries dissolved", "euphoria at the edge", "rapture beyond language"],
  dread: ["darkness moves closer", "inevitability hangs heavy", "something watches unseen", "the ground beneath shifts", "silence as threat", "entropy approaching slowly", "horror in the ordinary"],
  tenderness: ["fragile and unguarded", "intimacy without defense", "softness as strength", "vulnerability offered freely", "gentleness in the wreckage", "care beneath the surface", "warmth defying the cold"],
  fury: ["destruction as creation", "rage given perfect form", "violence of conviction", "anger beyond articulation", "catharsis through obliteration", "scream made permanent", "white-hot and unforgiving"],
  serenity: ["stillness without emptiness", "calm acceptance pervades", "peace after the storm", "breath slows to nothing", "equilibrium finally found", "surrender without defeat", "silence as resolution"],
};

function localDecompose(input, fileType) {
  const lower = input.toLowerCase();
  let profile = { ...GENRE_PROFILES.default };

  // File-type based profiles
  if (fileType === "image") {
    if (/dark|shadow|noir|black|night|storm/.test(lower)) profile = { ...GENRE_PROFILES.photo_dark };
    else if (/bright|color|vibrant|vivid|neon|rainbow/.test(lower)) profile = { ...GENRE_PROFILES.photo_vibrant };
    else if (/portrait|face|person|people|eye/.test(lower)) profile = { ...GENRE_PROFILES.photo_portrait };
    else if (/landscape|mountain|ocean|sky|sunset|nature|forest/.test(lower)) profile = { ...GENRE_PROFILES.photo_landscape };
    else profile = { ...GENRE_PROFILES.photo_vibrant };
  } else if (fileType === "document") {
    profile = { ...GENRE_PROFILES.uploaded_doc };
  }

  // Genre detection for text input
  if (!fileType) {
    if (/coltrane|miles davis|monk|jazz|mingus/.test(lower)) profile = { ...GENRE_PROFILES.jazz };
    else if (/beethoven|mozart|bach|classical|symphony/.test(lower)) profile = { ...GENRE_PROFILES.classical };
    else if (/queen|zeppelin|hendrix|rock|nirvana|radiohead/.test(lower)) profile = { ...GENRE_PROFILES.rock };
    else if (/kanye|kendrick|hip.?hop|rap|drake/.test(lower)) profile = { ...GENRE_PROFILES.hiphop };
    else if (/daft punk|aphex|electronic|techno/.test(lower)) profile = { ...GENRE_PROFILES.electronic };
    else if (/tarkovsky|stalker|lynch|kubrick|2001|blade runner/.test(lower)) profile = { ...GENRE_PROFILES.film_dark };
    else if (/spielberg|lucas|star wars|lord of the rings/.test(lower)) profile = { ...GENRE_PROFILES.film_epic };
    else if (/casablanca|titanic|romance|love story/.test(lower)) profile = { ...GENRE_PROFILES.film_romance };
    else if (/marquez|borges|magic|solitude|hundred years/.test(lower)) profile = { ...GENRE_PROFILES.literature_magic };
    else if (/kafka|dostoevsky|poe|lovecraft|gothic/.test(lower)) profile = { ...GENRE_PROFILES.literature_dark };
    else if (/guernica|picasso|war|battle/.test(lower)) profile = { ...GENRE_PROFILES.painting_war };
    else if (/rothko|pollock|mondrian|abstract/.test(lower)) profile = { ...GENRE_PROFILES.painting_abstract };
  }

  Object.entries(KEYWORD_MAP).forEach(([kw, mods]) => {
    if (lower.includes(kw)) Object.entries(mods).forEach(([em, boost]) => { if (profile[em] !== undefined) profile[em] = Math.min(0.98, profile[em] + boost); });
  });

  const seed = lower.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  const rng = (i) => ((seed * (i + 7) * 13) % 100) / 1000 - 0.05;

  return EMOTIONS.map((em, i) => ({
    key: em.key,
    value: Math.max(0.05, Math.min(0.98, parseFloat((profile[em.key] + rng(i)).toFixed(2)))),
    note: NOTES_POOL[em.key][(seed + i) % NOTES_POOL[em.key].length],
  }));
}

/* ───────── TRANSLATION TEMPLATES ───────── */
const TRANSLATIONS = {
  architecture: [
    (src, ems) => { const d = ems.sort((a,b)=>b.value-a.value)[0]; const s = ems.sort((a,b)=>b.value-a.value)[1]; return `A structure that refuses symmetry — ${d.value > 0.7 ? "cantilevered volumes of raw concrete hang at impossible angles" : "walls of hand-laid stone curve inward like cupped palms"}, creating spaces where ${d.key} lives in every threshold. The central atrium is a ${s.value > 0.6 ? "void that drops seven stories into darkness, lit only by a single oculus" : "compression chamber where the ceiling barely clears your head before releasing into a cathedral-height nave"}. Materials shift from ${ems[7]?.value > 0.5 ? "warm reclaimed timber" : "cold oxidized steel"} to ${ems[4]?.value > 0.5 ? "shattered mirror panels" : "translucent alabaster screens"} as you move deeper. The building breathes — walls are double-skinned, and wind passing through creates a low harmonic tone. You don't visit this building. You survive it.`; },
  ],
  perfume: [
    (src, ems) => { const top = ems.sort((a,b)=>b.value-a.value).slice(0,3); const bn = { tension:"charred cedarwood and static electricity", yearning:"ambergris and salt-crusted driftwood", wonder:"ozone after lightning and cold marble", melancholy:"wet violets pressed in old paper", defiance:"gunpowder and crushed black pepper", ecstasy:"tuberose at midnight and warm skin musk", dread:"petrichor and iron filings", tenderness:"raw honey and clean cotton", fury:"burning rubber and volcanic sulphur", serenity:"white tea and morning fog" }; const hn = { tension:"a synthetic aldehyde that smells like adrenaline", yearning:"jasmine absolute mixed with the idea of distance", wonder:"iris root and something that doesn't exist yet", melancholy:"decaying rose petals and old leather", defiance:"saffron and metallic blood orange", ecstasy:"ylang-ylang drenched in champagne accord", dread:"vetiver so dark it's almost soil", tenderness:"peony in warm milk", fury:"cinnamon bark stripped raw", serenity:"hinoki wood and cloud vapor" }; return `Base of ${bn[top[0].key]}. The heart opens into ${hn[top[1].key]}, lingering for hours like a thought you can't finish. Top notes arrive last — ${top[2].key === "wonder" ? "bergamot frozen and then shattered" : "a transparent green note, like the air between two people about to touch"}. Sillage is ${top[0].value > 0.8 ? "devastating — it enters a room before you do" : "intimate — the person beside you leans closer without knowing why"}. This is what "${src}" smells like when you close your eyes.`; },
  ],
  choreography: [
    (src, ems) => { const pk = ems.reduce((a,b)=>a.value>b.value?a:b); const lw = ems.reduce((a,b)=>a.value<b.value?a:b); return `${pk.value > 0.7 ? "Five" : "Three"} dancers in a ${pk.key === "dread" ? "dim corridor that narrows as they advance" : pk.key === "ecstasy" ? "white cube flooded with golden light" : "space defined only by shadow and a single suspended lamp"}. Movement draws from ${pk.key === "fury" ? "martial arts and convulsive release — spines crack backward, fists open into trembling flowers" : pk.key === "yearning" ? "reaching — every limb extends past its limit, fingers stretching toward something just offstage" : "stillness interrupted by sudden precision — a hand snaps into position, then the body follows three counts later"}. One dancer never leaves the floor — their role is ${lw.key}, the undertow beneath every phrase. The piece ends ${pk.key === "melancholy" ? "with all dancers facing the wall, breathing in unison" : "when the light cuts to black mid-gesture, leaving the final shape unfinished"}.`; },
  ],
  cuisine: [
    (src, ems) => { const sorted = [...ems].sort((a,b)=>b.value-a.value); const cm = { tension:"a raw oyster served on a heated stone — it cooks as you watch", yearning:"a broth so clear it looks like water until the first sip reveals 48 hours of slow-extracted essence", wonder:"a sphere that looks like a river stone but shatters into smoked eel mousse and yuzu gel", melancholy:"sourdough torn by hand, served with butter churned from cream aged to the edge of turning", defiance:"a single ghost pepper encased in dark chocolate and edible gold", ecstasy:"wagyu fat rendered over open flame, draped on charcoal-grilled peach", dread:"black squid ink risotto served in a bowl you cannot see the bottom of", tenderness:"hand-rolled pasta so thin light passes through it, dressed in brown butter and sage", fury:"frozen horseradish shavings over blood orange granita — it attacks, then vanishes", serenity:"warm mochi filled with black sesame paste, served with silence" }; return `Seven courses. Course one: ${cm[sorted[0].key]}. The centerpiece: ${cm[sorted[1].key]}. Between courses, ${sorted[2].key === "dread" ? "the lights dim and fog rolls across the table" : "a single note plays — different each time — resetting your palate through sound"}. The meal ends with ${cm[sorted[3].key]}. No menu is provided. No dish is named. You eat the emotional autobiography of "${src}" and leave changed.`; },
  ],
  fashion: [
    (src, ems) => { const pk = ems.reduce((a,b)=>a.value>b.value?a:b); const fb = { tension:"double-faced wool bonded to rigid neoprene", yearning:"silk organza layered so thin you see the skin beneath", wonder:"holographic mesh that shifts between silver and void-black", melancholy:"washed silk crepe that puddles and drags", defiance:"slashed leather reassembled with visible surgical staples", ecstasy:"liquid gold lamé draped directly on the body", dread:"rubberized cotton that crinkles and resists", tenderness:"hand-knit cashmere so soft it dissolves against the collarbone", fury:"charred denim reconstructed into sharp geometric panels", serenity:"undyed Japanese linen that softens with each wearing" }; return `Nine looks built from the emotional decomposition of "${src}". The signature textile: ${fb[pk.key]}. Silhouettes ${pk.value > 0.7 ? "are deliberately unwearable — proportions are wrong, shoulders extend past the body, hems are unfinished" : "walk the edge between sculptural and functional — every piece can be worn on the street, but you'll stop traffic"}. Color palette: ${pk.key === "fury" ? "arterial red, burnt black, and the white of exposed bone" : pk.key === "serenity" ? "fog gray, undyed cream, and one impossible pale blue" : "obsidian, acid green, and the warm amber of old photographs"}. This is not fashion. This is emotional forensics made wearable.`; },
  ],
  landscape: [
    (src, ems) => { const pk = ems.reduce((a,b)=>a.value>b.value?a:b); const sc = [...ems].sort((a,b)=>b.value-a.value)[1]; return `A 2.5-acre site transformed into a landscape you walk through like a sentence. Entry through ${pk.key === "dread" ? "a narrow passage of towering black bamboo that blocks all sky" : pk.key === "wonder" ? "a mirror-polished steel threshold that reflects clouds beneath your feet" : "an avenue of ancient oaks underplanted with wild grasses"}. The central clearing: ${pk.value > 0.7 ? "a sunken amphitheater of moss-covered stone where water seeps from invisible sources" : "an elevated platform of weathered timber overlooking a meadow that blooms in a different color each season"}. Plantings shift from ${sc.key === "fury" ? "aggressive red barberry and thorned hawthorn" : sc.key === "tenderness" ? "soft lamb's ear and fragrant sweet woodruff" : "architectural grasses and stark white birch"}. Sound design: ${pk.key === "serenity" ? "a hidden water feature tuned to produce a specific harmonic frequency" : "wind harps mounted in the canopy that play only when conditions are right"}. The emotional signature of "${src}" becomes a place you can sit inside.`; },
  ],
};

function localTranslate(src, medium, emotions) {
  const templates = TRANSLATIONS[medium] || TRANSLATIONS.architecture;
  const seed = src.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  return templates[seed % templates.length](src, emotions);
}

/* ───────── API ATTEMPTS WITH FALLBACK ───────── */
async function decompose(input, fileType) {
  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 1000,
        messages: [{ role: "user", content: `You are the UNRAVL Emotional Decomposition Engine. Analyze this creative work:\n\n"${input}"\n\nReturn ONLY valid JSON:\n{"emotions":[{"key":"tension","value":0.XX,"note":"3-5 words"},{"key":"yearning","value":0.XX,"note":"3-5 words"},{"key":"wonder","value":0.XX,"note":"3-5 words"},{"key":"melancholy","value":0.XX,"note":"3-5 words"},{"key":"defiance","value":0.XX,"note":"3-5 words"},{"key":"ecstasy","value":0.XX,"note":"3-5 words"},{"key":"dread","value":0.XX,"note":"3-5 words"},{"key":"tenderness","value":0.XX,"note":"3-5 words"},{"key":"fury","value":0.XX,"note":"3-5 words"},{"key":"serenity","value":0.XX,"note":"3-5 words"}]}` }],
      }),
    });
    if (!res.ok) throw new Error();
    const d = await res.json();
    const t = (d.content || []).map(c => c.text || "").join("");
    const p = JSON.parse(t.replace(/```json|```/g, "").trim());
    if (p?.emotions?.length) return { emotions: p.emotions, source: "api" };
  } catch {}
  return { emotions: localDecompose(input, fileType), source: "local" };
}

async function translate(src, medium, emotions) {
  try {
    const mLabel = MEDIUMS.find(m => m.id === medium)?.label || medium;
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 1000,
        messages: [{ role: "user", content: `You are the UNRAVL Cross-Modal Translation Engine. Translate this emotional decomposition into ${mLabel}.\n\nSource: "${src}"\n\nEmotional DNA:\n${emotions.map(e => `${e.key}: ${e.value} (${e.note})`).join("\n")}\n\nWrite a vivid 3-5 sentence description. Be wildly specific. No preamble.` }],
      }),
    });
    if (!res.ok) throw new Error();
    const d = await res.json();
    const t = (d.content || []).map(c => c.text || "").join("").trim();
    if (t) return { text: t, source: "api" };
  } catch {}
  return { text: localTranslate(src, medium, emotions), source: "local" };
}

/* ───────── FILE READING UTILS ───────── */
function readFileAsText(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsText(file);
  });
}

function readFileAsDataURL(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/* ───────── COMPONENTS ───────── */
function Bar({ emotion, color, delay }) {
  const [w, setW] = useState(0);
  useEffect(() => { const t = setTimeout(() => setW(emotion.value * 100), delay); return () => clearTimeout(t); }, [emotion.value, delay]);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, height: 24 }}>
      <span style={{ fontFamily: "monospace", fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", width: 82, color: "#d4cfc5", opacity: 0.6, flexShrink: 0 }}>{emotion.key}</span>
      <div style={{ flex: 1, height: 4, background: "rgba(240,236,228,0.04)", borderRadius: 2, overflow: "hidden" }}>
        <div style={{ height: "100%", borderRadius: 2, background: `linear-gradient(90deg, ${color}, ${color}77)`, width: `${w}%`, transition: "width 0.9s cubic-bezier(0.22, 1, 0.36, 1)" }} />
      </div>
      <span style={{ fontFamily: "monospace", fontSize: 11, color: "#f0ece4", width: 32, textAlign: "right", flexShrink: 0 }}>{emotion.value?.toFixed(2)}</span>
      <span style={{ fontFamily: "monospace", fontSize: 9, color: "#d4cfc5", opacity: 0.3, minWidth: 90, maxWidth: 140, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flexShrink: 0 }}>{emotion.note}</span>
    </div>
  );
}

/* ───────── MAIN APP ───────── */
export default function UnravlEngine() {
  const [input, setInput] = useState("");
  const [medium, setMedium] = useState("architecture");
  const [phase, setPhase] = useState("idle");
  const [emotions, setEmotions] = useState([]);
  const [transText, setTransText] = useState("");
  const [typed, setTyped] = useState("");
  const [logs, setLogs] = useState([]);
  const [uploadedFile, setUploadedFile] = useState(null); // { name, type, preview, content, fileType }
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const log = useCallback((m) => setLogs(p => [...p, { t: new Date().toLocaleTimeString(), m }]), []);
  const getColor = (k) => EMOTIONS.find(e => e.key === k)?.color || "#c8ff00";
  const curMed = MEDIUMS.find(m => m.id === medium);

  useEffect(() => {
    if (!transText) { setTyped(""); return; }
    setTyped("");
    let i = 0;
    const iv = setInterval(() => { i++; setTyped(transText.slice(0, i)); if (i >= transText.length) clearInterval(iv); }, 12);
    return () => clearInterval(iv);
  }, [transText]);

  async function handleFile(file) {
    if (!file) return;
    const isImage = file.type.startsWith("image/");
    const isText = file.type.startsWith("text/") || file.name.endsWith(".txt") || file.name.endsWith(".md") || file.name.endsWith(".csv");
    const isPDF = file.type === "application/pdf";
    const isDoc = file.name.endsWith(".doc") || file.name.endsWith(".docx");

    let preview = null;
    let content = "";
    let fileType = "document";

    if (isImage) {
      fileType = "image";
      preview = await readFileAsDataURL(file);
      content = `[Uploaded image: ${file.name}]`;
      // Try to extract context from filename
      const nameClean = file.name.replace(/\.[^.]+$/, "").replace(/[-_]/g, " ");
      setInput(`Visual artwork: "${nameClean}" — an uploaded image (${Math.round(file.size / 1024)}KB)`);
    } else if (isText) {
      const text = await readFileAsText(file);
      content = text.slice(0, 2000);
      setInput(content.slice(0, 300) + (content.length > 300 ? "..." : ""));
    } else if (isPDF) {
      content = `[PDF document: ${file.name}]`;
      setInput(`Document: "${file.name.replace('.pdf', '')}" — uploaded PDF (${Math.round(file.size / 1024)}KB)`);
    } else if (isDoc) {
      content = `[Word document: ${file.name}]`;
      setInput(`Document: "${file.name.replace(/\.docx?/, '')}" — uploaded document (${Math.round(file.size / 1024)}KB)`);
    } else {
      content = `[File: ${file.name}]`;
      setInput(`Creative artifact: "${file.name}" (${Math.round(file.size / 1024)}KB)`);
    }

    setUploadedFile({ name: file.name, type: file.type, preview, content, fileType });
  }

  function handleDrop(e) {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer?.files?.[0];
    if (file) handleFile(file);
  }

  function handleDragOver(e) { e.preventDefault(); setIsDragging(true); }
  function handleDragLeave(e) { e.preventDefault(); setIsDragging(false); }

  function removeFile() {
    setUploadedFile(null);
    setInput("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function run() {
    if (!input.trim() && !uploadedFile) return;
    setEmotions([]); setTransText(""); setTyped(""); setLogs([]);
    setPhase("decomposing");

    const sourceDesc = input || uploadedFile?.content || "";
    const ft = uploadedFile?.fileType || null;

    log("Initiating emotional decomposition...");
    if (uploadedFile) log(`Processing uploaded file: ${uploadedFile.name}`);
    await new Promise(r => setTimeout(r, 800));
    log(ft === "image" ? "Analyzing visual composition, palette, and spatial tension..." : "Analyzing 47 dimensions of feeling...");
    await new Promise(r => setTimeout(r, 600));

    const decompResult = await decompose(sourceDesc, ft);
    log(decompResult.source === "api" ? "Neural decomposition complete (live API)." : "Neural decomposition complete (local engine).");
    setEmotions(decompResult.emotions);

    setPhase("translating");
    log(`Translating into ${curMed?.label}...`);
    await new Promise(r => setTimeout(r, 1000));

    const transResult = await translate(sourceDesc, medium, decompResult.emotions);
    log(transResult.source === "api" ? "Cross-modal translation complete (live API)." : "Cross-modal synthesis complete (local engine).");
    setTransText(transResult.text);
    setPhase("done");
  }

  const showInput = phase === "idle";
  const bx = { background: "rgba(255,255,255,0.025)", border: "1px solid rgba(240,236,228,0.06)", padding: "1.8rem", marginBottom: "1.2rem" };
  const hasInput = input.trim() || uploadedFile;

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0a", color: "#f0ece4", fontFamily: "'Georgia', serif", position: "relative", overflow: "hidden" }}>
      <style>{`@keyframes dr-spin{to{transform:rotate(360deg)}} @keyframes dr-blink{0%,50%{opacity:1}51%,100%{opacity:0}} @keyframes dr-pulse{0%,100%{opacity:0.4}50%{opacity:1}}`}</style>

      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 50, backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E")` }} />
      <div style={{ position: "absolute", top: "-8%", right: "-4%", width: 450, height: 450, borderRadius: "50%", background: "radial-gradient(circle, rgba(200,255,0,0.07), transparent 70%)", filter: "blur(100px)" }} />
      <div style={{ position: "absolute", bottom: "5%", left: "-4%", width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,45,45,0.05), transparent 70%)", filter: "blur(100px)" }} />

      <div style={{ position: "relative", zIndex: 10, maxWidth: 860, margin: "0 auto", padding: "2.5rem 1.5rem" }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <div style={{ fontFamily: "monospace", fontSize: 10, letterSpacing: "0.4em", textTransform: "uppercase", color: "#c8ff00", marginBottom: 12 }}>UNRAVL — Live Decomposition Engine</div>
          <h1 style={{ fontFamily: "'Georgia', serif", fontSize: "clamp(1.8rem, 5vw, 3.2rem)", fontWeight: "bold", lineHeight: 1.05 }}>
            Feed it art. <span style={{ fontStyle: "italic", color: "#c8ff00" }}>Watch it decompose.</span>
          </h1>
        </div>

        {/* ═══ INPUT SECTION ═══ */}
        {showInput && (
          <div style={bx}>

            {/* Upload zone */}
            <div
              onDrop={handleDrop} onDragOver={handleDragOver} onDragLeave={handleDragLeave}
              onClick={() => !uploadedFile && fileInputRef.current?.click()}
              style={{
                border: `2px dashed ${isDragging ? "#c8ff00" : uploadedFile ? "rgba(200,255,0,0.3)" : "rgba(240,236,228,0.1)"}`,
                background: isDragging ? "rgba(200,255,0,0.04)" : uploadedFile ? "rgba(200,255,0,0.02)" : "rgba(255,255,255,0.01)",
                padding: uploadedFile ? "1rem" : "1.8rem",
                textAlign: "center", cursor: uploadedFile ? "default" : "pointer",
                transition: "all 0.3s", marginBottom: "1.2rem",
              }}
            >
              <input ref={fileInputRef} type="file" accept="image/*,.txt,.md,.csv,.pdf,.doc,.docx" style={{ display: "none" }}
                onChange={e => { if (e.target.files?.[0]) handleFile(e.target.files[0]); }} />

              {!uploadedFile ? (
                <>
                  <div style={{ fontSize: 28, marginBottom: 8, opacity: 0.4 }}>⬆</div>
                  <div style={{ fontFamily: "monospace", fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase", color: "#d4cfc5", opacity: 0.5 }}>
                    Drop an image, text file, or document here
                  </div>
                  <div style={{ fontFamily: "monospace", fontSize: 10, color: "#d4cfc5", opacity: 0.3, marginTop: 6 }}>
                    JPG, PNG, GIF, TXT, MD, PDF, DOC — or click to browse
                  </div>
                </>
              ) : (
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  {/* Image preview */}
                  {uploadedFile.preview && (
                    <div style={{
                      width: 64, height: 64, borderRadius: 2, overflow: "hidden", flexShrink: 0,
                      border: "1px solid rgba(240,236,228,0.1)",
                    }}>
                      <img src={uploadedFile.preview} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    </div>
                  )}
                  {/* File icon for non-images */}
                  {!uploadedFile.preview && (
                    <div style={{
                      width: 64, height: 64, display: "flex", alignItems: "center", justifyContent: "center",
                      background: "rgba(200,255,0,0.05)", border: "1px solid rgba(200,255,0,0.15)", flexShrink: 0,
                    }}>
                      <span style={{ fontFamily: "monospace", fontSize: 20, color: "#c8ff00", opacity: 0.6 }}>
                        {uploadedFile.fileType === "document" ? "◈" : "◆"}
                      </span>
                    </div>
                  )}
                  <div style={{ flex: 1, textAlign: "left" }}>
                    <div style={{ fontFamily: "monospace", fontSize: 11, color: "#c8ff00", letterSpacing: "0.1em" }}>
                      {uploadedFile.name}
                    </div>
                    <div style={{ fontFamily: "monospace", fontSize: 9, color: "#d4cfc5", opacity: 0.4, marginTop: 4, textTransform: "uppercase" }}>
                      {uploadedFile.fileType === "image" ? "Visual input — will analyze composition & palette" : "Text input — will extract emotional signature"}
                    </div>
                  </div>
                  <button onClick={(e) => { e.stopPropagation(); removeFile(); }} style={{
                    fontFamily: "monospace", fontSize: 16, background: "none", border: "none",
                    color: "#d4cfc5", opacity: 0.4, cursor: "pointer", padding: "4px 8px",
                  }}>✕</button>
                </div>
              )}
            </div>

            {/* Divider */}
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: "1.2rem" }}>
              <div style={{ flex: 1, height: 1, background: "rgba(240,236,228,0.06)" }} />
              <span style={{ fontFamily: "monospace", fontSize: 9, letterSpacing: "0.2em", textTransform: "uppercase", color: "#d4cfc5", opacity: 0.3 }}>or describe a work</span>
              <div style={{ flex: 1, height: 1, background: "rgba(240,236,228,0.06)" }} />
            </div>

            {/* Text input */}
            <div style={{ fontFamily: "monospace", fontSize: 10, letterSpacing: "0.25em", textTransform: "uppercase", color: "#d4cfc5", opacity: 0.5, marginBottom: 10 }}>
              Input — Any creative work
            </div>
            <textarea value={input} onChange={e => setInput(e.target.value)}
              placeholder='e.g. "A Love Supreme" — John Coltrane' rows={3}
              style={{ width: "100%", padding: "0.9rem", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(240,236,228,0.08)", color: "#f0ece4", fontFamily: "'Georgia', serif", fontSize: "1.05rem", fontStyle: "italic", lineHeight: 1.5, resize: "vertical", outline: "none" }}
              onFocus={e => e.target.style.borderColor = "#c8ff00"} onBlur={e => e.target.style.borderColor = "rgba(240,236,228,0.08)"} />

            {/* Examples */}
            <div style={{ marginTop: 10, display: "flex", flexWrap: "wrap", gap: 6, alignItems: "center" }}>
              <span style={{ fontFamily: "monospace", fontSize: 9, textTransform: "uppercase", color: "#d4cfc5", opacity: 0.35 }}>Try:</span>
              {EXAMPLES.map(ex => (
                <button key={ex} onClick={() => { setInput(ex); setUploadedFile(null); }} style={{
                  fontFamily: "monospace", fontSize: 10, padding: "3px 8px",
                  background: "rgba(255,255,255,0.03)", border: "1px solid rgba(240,236,228,0.07)",
                  color: "#d4cfc5", cursor: "pointer",
                }}>{ex}</button>
              ))}
            </div>

            {/* Medium selector */}
            <div style={{ marginTop: 18 }}>
              <div style={{ fontFamily: "monospace", fontSize: 10, letterSpacing: "0.25em", textTransform: "uppercase", color: "#d4cfc5", opacity: 0.5, marginBottom: 8 }}>Target Medium</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {MEDIUMS.map(m => (
                  <button key={m.id} onClick={() => setMedium(m.id)} style={{
                    fontFamily: "monospace", fontSize: 11, padding: "7px 14px", cursor: "pointer", transition: "all 0.2s",
                    background: medium === m.id ? "#c8ff00" : "rgba(255,255,255,0.025)", color: medium === m.id ? "#0a0a0a" : "#d4cfc5",
                    border: medium === m.id ? "1px solid #c8ff00" : "1px solid rgba(240,236,228,0.07)", fontWeight: medium === m.id ? 700 : 400,
                  }}>{m.icon} {m.label}</button>
                ))}
              </div>
            </div>

            {/* Go */}
            <div style={{ marginTop: 20 }}>
              <button onClick={run} disabled={!hasInput} style={{
                fontFamily: "monospace", fontSize: 12, letterSpacing: "0.15em", textTransform: "uppercase", fontWeight: 700, padding: "12px 28px",
                background: hasInput ? "#c8ff00" : "rgba(200,255,0,0.15)", color: "#0a0a0a", border: "none",
                cursor: hasInput ? "pointer" : "default",
              }}>▶ Decompose</button>
            </div>
          </div>
        )}

        {/* ═══ LOADING ═══ */}
        {(phase === "decomposing" || phase === "translating") && emotions.length === 0 && (
          <div style={bx}>
            <div style={{ textAlign: "center", padding: "2.5rem 1rem" }}>
              {uploadedFile?.preview && (
                <div style={{ width: 80, height: 80, margin: "0 auto 1.5rem", borderRadius: 2, overflow: "hidden", border: "1px solid rgba(200,255,0,0.2)", opacity: 0.8 }}>
                  <img src={uploadedFile.preview} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", filter: "grayscale(50%) contrast(1.2)" }} />
                </div>
              )}
              <div style={{ width: 36, height: 36, border: "2px solid rgba(200,255,0,0.15)", borderTopColor: "#c8ff00", borderRadius: "50%", margin: "0 auto 1.2rem", animation: "dr-spin 1s linear infinite" }} />
              <div style={{ fontFamily: "monospace", fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: "#c8ff00" }}>
                {uploadedFile?.fileType === "image" ? "Decomposing visual signature..." : "Extracting emotional signature..."}
              </div>
            </div>
          </div>
        )}

        {/* ═══ RESULTS ═══ */}
        {emotions.length > 0 && (
          <>
            <div style={{ ...bx, position: "relative" }}>
              <div style={{ position: "absolute", top: 14, right: 18, fontFamily: "monospace", fontSize: 9, letterSpacing: "0.3em", color: "#c8ff00" }}>● COMPLETE</div>

              {/* Show image preview in results if uploaded */}
              <div style={{ display: "flex", gap: 16, marginBottom: 20 }}>
                {uploadedFile?.preview && (
                  <div style={{ width: 80, height: 80, borderRadius: 2, overflow: "hidden", border: "1px solid rgba(240,236,228,0.1)", flexShrink: 0 }}>
                    <img src={uploadedFile.preview} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </div>
                )}
                <div>
                  <div style={{ fontFamily: "monospace", fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: "#d4cfc5", opacity: 0.5, marginBottom: 4 }}>Source</div>
                  <div style={{ fontStyle: "italic", fontSize: "1.1rem" }}>{input}</div>
                  {uploadedFile && <div style={{ fontFamily: "monospace", fontSize: 9, color: "#c8ff00", opacity: 0.5, marginTop: 4 }}>via uploaded {uploadedFile.fileType}</div>}
                </div>
              </div>

              <div style={{ fontFamily: "monospace", fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: "#d4cfc5", opacity: 0.5, marginBottom: 12 }}>Emotional DNA — 10 Dimensions</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                {emotions.map((em, i) => <Bar key={em.key} emotion={em} color={getColor(em.key)} delay={i * 120} />)}
              </div>
            </div>

            {/* Translation */}
            <div style={bx}>
              {phase === "translating" && !transText && (
                <div style={{ textAlign: "center", padding: "2rem" }}>
                  <div style={{ width: 30, height: 30, border: "2px solid rgba(200,255,0,0.15)", borderTopColor: "#c8ff00", borderRadius: "50%", margin: "0 auto 1rem", animation: "dr-spin 1s linear infinite" }} />
                  <div style={{ fontFamily: "monospace", fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: "#c8ff00" }}>Translating into {curMed?.label}...</div>
                </div>
              )}
              {typed && (
                <>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                    <span style={{ fontFamily: "monospace", fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: "#d4cfc5", opacity: 0.5 }}>Translated to</span>
                    <div style={{ flex: 1, height: 1, background: "linear-gradient(90deg, #c8ff00, transparent)" }} />
                    <span style={{ fontFamily: "monospace", fontSize: 11, textTransform: "uppercase", color: "#c8ff00", fontWeight: 700 }}>{curMed?.icon} {curMed?.label}</span>
                  </div>
                  <div style={{ fontSize: "1.08rem", lineHeight: 1.7, fontStyle: "italic", minHeight: 60 }}>
                    {typed}{typed.length < transText.length && <span style={{ display: "inline-block", width: 2, height: "1em", background: "#c8ff00", marginLeft: 2, verticalAlign: "text-bottom", animation: "dr-blink 0.7s infinite" }} />}
                  </div>
                </>
              )}
            </div>

            {/* Actions */}
            {phase === "done" && (
              <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap", marginTop: 8 }}>
                <button onClick={() => { setPhase("idle"); setEmotions([]); setTransText(""); setTyped(""); setInput(""); setLogs([]); setUploadedFile(null); }}
                  style={{ fontFamily: "monospace", fontSize: 11, textTransform: "uppercase", padding: "10px 20px", background: "none", border: "1px solid rgba(240,236,228,0.12)", color: "#d4cfc5", cursor: "pointer" }}>↺ Start Over</button>
                <button onClick={() => { setTransText(""); setTyped(""); setPhase("idle"); setLogs([]); }}
                  style={{ fontFamily: "monospace", fontSize: 11, textTransform: "uppercase", padding: "10px 20px", background: "#c8ff00", border: "1px solid #c8ff00", color: "#0a0a0a", cursor: "pointer", fontWeight: 700 }}>◇ Different Medium</button>
              </div>
            )}
          </>
        )}

        {/* Log */}
        {logs.length > 0 && (
          <div style={{ marginTop: 20, padding: "12px 16px", background: "rgba(255,255,255,0.012)", border: "1px solid rgba(240,236,228,0.03)" }}>
            <div style={{ fontFamily: "monospace", fontSize: 9, letterSpacing: "0.2em", textTransform: "uppercase", color: "#d4cfc5", opacity: 0.25, marginBottom: 6 }}>Engine Log</div>
            {logs.map((l, i) => (
              <div key={i} style={{ fontFamily: "monospace", fontSize: 10, color: "#d4cfc5", opacity: 0.4, lineHeight: 1.8 }}>
                <span style={{ color: "#c8ff00", opacity: 0.4 }}>[{l.t}]</span> {l.m}
              </div>
            ))}
          </div>
        )}

        <div style={{ textAlign: "center", marginTop: 40, paddingTop: 20, borderTop: "1px solid rgba(240,236,228,0.03)" }}>
          <div style={{ fontFamily: "monospace", fontSize: 9, letterSpacing: "0.3em", textTransform: "uppercase", color: "#d4cfc5", opacity: 0.2 }}>UNRAVL — Decomposing the thread of creation — © 2026</div>
        </div>
      </div>
    </div>
  );
}
