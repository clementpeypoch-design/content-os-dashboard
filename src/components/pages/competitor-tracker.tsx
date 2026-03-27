"use client";
// @ts-nocheck
import { useState, useRef, useEffect, useMemo } from "react";

const PL = {
  instagram: { label: "Instagram", color: "#c27afa", bg: "rgba(194,122,250,0.10)", short: "IG" },
  youtube: { label: "YouTube", color: "#f45b5b", bg: "rgba(244,91,91,0.10)", short: "YT" },
  tiktok: { label: "TikTok", color: "#2ee8c8", bg: "rgba(46,232,200,0.08)", short: "TT" },
  linkedin: { label: "LinkedIn", color: "#5b9bf4", bg: "rgba(91,155,244,0.10)", short: "LI" },
  twitter: { label: "X", color: "#a0aec0", bg: "rgba(160,174,192,0.08)", short: "X" },
  facebook: { label: "Facebook", color: "#4e8cf7", bg: "rgba(78,140,247,0.10)", short: "FB" },
};

const K = {
  bg: "#07070a", bg1: "#0c0c10", bg2: "#111116", bg3: "#17171d",
  border: "#1c1c28", borderH: "#2a2a3a",
  fg: "#eaeaf0", fg2: "#8e8ea2", fg3: "#52526a",
  accent: "#a78bfa", green: "#34d399", red: "#f87171", amber: "#fbbf24",
};

function mkRng(s) {
  return function () {
    s = Math.sin(s) * 10000;
    return s - Math.floor(s);
  };
}

function sparkData(seed, len, base, growth) {
  len = len || 12;
  base = base || 100;
  growth = growth || 0.04;
  var r = mkRng(seed);
  var d = [base];
  for (var i = 1; i < len; i++) {
    d.push(Math.round(d[i - 1] * (1 + growth * (0.3 + r() * 1.4)) + (r() - 0.4) * base * 0.02));
  }
  return d;
}

function fmt(n) {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + "M";
  if (n >= 1000) return (n / 1000).toFixed(1) + "K";
  return String(n);
}

function fmtDate(d) {
  return new Date(d + "T00:00:00").toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
}

var INIT = [
  {
    id: 1, name: "Acme Studio", avatar: "AC", avatarColor: "#8b5cf6",
    accounts: [
      { platform: "instagram", handle: "@acmestudio", followers: 142300, engagement: 4.2, postsPerWeek: 5.1, growthPct: 3.8 },
      { platform: "youtube", handle: "AcmeStudioTV", followers: 89400, engagement: 6.1, postsPerWeek: 2.0, growthPct: 5.2 },
      { platform: "tiktok", handle: "@acme.studio", followers: 234500, engagement: 8.7, postsPerWeek: 7.3, growthPct: 12.4 },
    ],
    recentPosts: [
      { platform: "instagram", text: "New spring collection drop", likes: 4230, comments: 187, date: "2026-03-24" },
      { platform: "tiktok", text: "Behind the scenes warehouse tour", likes: 18700, comments: 342, date: "2026-03-25" },
      { platform: "youtube", text: "How we design our packaging", likes: 2100, comments: 89, date: "2026-03-22" },
    ],
  },
  {
    id: 2, name: "Nova Creative", avatar: "NC", avatarColor: "#06b6d4",
    accounts: [
      { platform: "instagram", handle: "@novacreative", followers: 98200, engagement: 5.6, postsPerWeek: 4.2, growthPct: 2.1 },
      { platform: "linkedin", handle: "Nova Creative Agency", followers: 34100, engagement: 3.2, postsPerWeek: 3.0, growthPct: 1.8 },
      { platform: "twitter", handle: "@nova_creative", followers: 28700, engagement: 2.4, postsPerWeek: 8.5, growthPct: 0.9 },
    ],
    recentPosts: [
      { platform: "instagram", text: "Client spotlight: Rebrand for @luxmarket", likes: 3410, comments: 95, date: "2026-03-25" },
      { platform: "linkedin", text: "Why we ditched the traditional pitch deck", likes: 890, comments: 67, date: "2026-03-23" },
    ],
  },
  {
    id: 3, name: "Pixel Co", avatar: "PX", avatarColor: "#f59e0b",
    accounts: [
      { platform: "instagram", handle: "@pixelco", followers: 67800, engagement: 3.1, postsPerWeek: 3.5, growthPct: -0.4 },
      { platform: "youtube", handle: "PixelCo", followers: 45200, engagement: 4.8, postsPerWeek: 1.5, growthPct: 1.2 },
      { platform: "facebook", handle: "Pixel Co Official", followers: 52300, engagement: 1.9, postsPerWeek: 4.0, growthPct: -1.1 },
    ],
    recentPosts: [
      { platform: "youtube", text: "5 design mistakes every startup makes", likes: 1870, comments: 134, date: "2026-03-24" },
      { platform: "instagram", text: "Minimalism is evolving fast", likes: 2240, comments: 78, date: "2026-03-23" },
    ],
  },
  {
    id: 4, name: "Bright Agency", avatar: "BA", avatarColor: "#10b981",
    accounts: [
      { platform: "instagram", handle: "@brightagency", followers: 53400, engagement: 4.8, postsPerWeek: 6.0, growthPct: 4.5 },
      { platform: "tiktok", handle: "@bright.agency", followers: 178900, engagement: 9.2, postsPerWeek: 9.0, growthPct: 18.7 },
      { platform: "youtube", handle: "BrightAgencyHQ", followers: 31200, engagement: 5.5, postsPerWeek: 1.0, growthPct: 2.8 },
      { platform: "linkedin", handle: "Bright Agency", followers: 19800, engagement: 2.9, postsPerWeek: 2.5, growthPct: 3.1 },
    ],
    recentPosts: [
      { platform: "tiktok", text: "POV: landing a Fortune 500 client", likes: 42100, comments: 890, date: "2026-03-26" },
      { platform: "instagram", text: "Team offsite recap", likes: 3890, comments: 156, date: "2026-03-25" },
      { platform: "linkedin", text: "Hiring: Senior Creative Director", likes: 560, comments: 43, date: "2026-03-24" },
    ],
  },
  {
    id: 5, name: "Zenith Media", avatar: "ZM", avatarColor: "#ec4899",
    accounts: [
      { platform: "instagram", handle: "@zenith.media", followers: 210400, engagement: 3.6, postsPerWeek: 4.8, growthPct: 1.9 },
      { platform: "youtube", handle: "ZenithMediaOfficial", followers: 156700, engagement: 7.3, postsPerWeek: 3.0, growthPct: 4.1 },
      { platform: "twitter", handle: "@zenithmedia", followers: 87300, engagement: 1.8, postsPerWeek: 12.0, growthPct: 0.5 },
      { platform: "facebook", handle: "Zenith Media Group", followers: 134200, engagement: 2.1, postsPerWeek: 5.5, growthPct: -0.3 },
    ],
    recentPosts: [
      { platform: "youtube", text: "State of social media marketing 2026", likes: 8900, comments: 412, date: "2026-03-26" },
      { platform: "instagram", text: "Production studio major upgrade", likes: 7200, comments: 234, date: "2026-03-25" },
    ],
  },
];

function Sparkline({ data, color, width, height }) {
  width = width || 100;
  height = height || 28;
  if (!data || data.length < 2) return null;
  var min = Math.min.apply(null, data);
  var max = Math.max.apply(null, data);
  var range = max - min || 1;
  var pts = data.map(function (v, i) {
    var x = (i / (data.length - 1)) * width;
    var y = height - 2 - ((v - min) / range) * (height - 4);
    return x + "," + y;
  });
  var up = data[data.length - 1] >= data[0];
  var c = color || (up ? K.green : K.red);
  var uid = "sp" + Math.abs(data[0]) + "" + data.length;

  return (
    <svg width={width} height={height} viewBox={"0 0 " + width + " " + height} style={{ display: "block" }}>
      <defs>
        <linearGradient id={uid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={c} stopOpacity="0.18" />
          <stop offset="100%" stopColor={c} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={"0," + height + " " + pts.join(" ") + " " + width + "," + height} fill={"url(#" + uid + ")"} />
      <polyline points={pts.join(" ")} fill="none" stroke={c} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Modal({ open, onClose, children }) {
  if (!open) return null;
  return (
    <div
      style={{ position: "fixed", inset: 0, zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center" }}
      onClick={onClose}
    >
      <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(6px)" }} />
      <div
        style={{
          position: "relative", width: "100%", maxWidth: 560, background: K.bg2,
          border: "1px solid " + K.border, borderRadius: 16,
          boxShadow: "0 32px 80px rgba(0,0,0,0.6)", maxHeight: "92vh", overflowY: "auto",
        }}
        onClick={function (e) { e.stopPropagation(); }}
      >
        {children}
      </div>
    </div>
  );
}

function AddForm({ onSave, onClose }) {
  var [name, setName] = useState("");
  var [accs, setAccs] = useState([{ platform: "instagram", handle: "" }]);

  function addRow() {
    if (accs.length < 6) setAccs(function (p) { return p.concat([{ platform: "instagram", handle: "" }]); });
  }
  function rmRow(i) {
    setAccs(function (p) { return p.filter(function (_, j) { return j !== i; }); });
  }
  function updRow(i, key, val) {
    setAccs(function (p) { return p.map(function (a, j) { return j === i ? Object.assign({}, a, { [key]: val }) : a; }); });
  }

  var inp = {
    width: "100%", padding: "10px 14px", fontSize: 13, fontFamily: "'Manrope',sans-serif",
    background: K.bg1, border: "1px solid " + K.border, borderRadius: 9, color: K.fg, outline: "none",
  };
  var lbl = { display: "block", fontSize: 10, fontWeight: 700, color: K.fg3, marginBottom: 5, letterSpacing: 0.8, textTransform: "uppercase" };

  var ok = name.trim() && accs.some(function (a) { return a.handle.trim(); });

  function submit() {
    if (!ok) return;
    var rng = mkRng(Date.now());
    var na = accs.filter(function (a) { return a.handle.trim(); }).map(function (a) {
      return {
        platform: a.platform, handle: a.handle.trim(),
        followers: Math.round(5000 + rng() * 95000),
        engagement: +(1 + rng() * 8).toFixed(1),
        postsPerWeek: +(1 + rng() * 10).toFixed(1),
        growthPct: +(-2 + rng() * 15).toFixed(1),
      };
    });
    var cols = ["#8b5cf6", "#06b6d4", "#f59e0b", "#10b981", "#ec4899", "#f97316"];
    onSave({
      id: Date.now(), name: name.trim(),
      avatar: name.trim().split(" ").map(function (w) { return w[0]; }).join("").toUpperCase().slice(0, 2),
      avatarColor: cols[Math.floor(rng() * cols.length)],
      accounts: na, recentPosts: [],
    });
  }

  return (
    <div>
      <div style={{ padding: "22px 26px 16px", borderBottom: "1px solid " + K.border }}>
        <h2 style={{ fontSize: 16, fontWeight: 700, margin: 0 }}>Ajouter un concurrent</h2>
        <p style={{ fontSize: 11, color: K.fg3, margin: "3px 0 0" }}>Entrez le nom et les comptes sociaux</p>
      </div>
      <div style={{ padding: "18px 26px", display: "flex", flexDirection: "column", gap: 16 }}>
        <div>
          <label style={lbl}>Nom</label>
          <input value={name} onChange={function (e) { setName(e.target.value); }} placeholder="Ex: Acme Studio" style={inp} />
        </div>
        <div>
          <label style={lbl}>Comptes</label>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {accs.map(function (a, i) {
              return (
                <div key={i} style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <select value={a.platform} onChange={function (e) { updRow(i, "platform", e.target.value); }}
                    style={Object.assign({}, inp, { width: 140, cursor: "pointer" })}>
                    {Object.entries(PL).map(function (entry) {
                      return <option key={entry[0]} value={entry[0]}>{entry[1].label}</option>;
                    })}
                  </select>
                  <input value={a.handle} onChange={function (e) { updRow(i, "handle", e.target.value); }}
                    placeholder="@handle" style={Object.assign({}, inp, { flex: 1 })} />
                  {accs.length > 1 && (
                    <button onClick={function () { rmRow(i); }}
                      style={{ background: "none", border: "none", color: K.fg3, cursor: "pointer", fontSize: 18, padding: "0 4px" }}>
                      x
                    </button>
                  )}
                </div>
              );
            })}
          </div>
          {accs.length < 6 && (
            <button onClick={addRow} style={{ marginTop: 8, fontSize: 12, color: K.accent, background: "none", border: "none", cursor: "pointer", fontFamily: "inherit", fontWeight: 600 }}>
              + Ajouter un compte
            </button>
          )}
        </div>
      </div>
      <div style={{ padding: "0 26px 22px", display: "flex", justifyContent: "flex-end", gap: 10, borderTop: "1px solid " + K.border, paddingTop: 16 }}>
        <button onClick={onClose} style={{ padding: "9px 18px", borderRadius: 9, fontSize: 13, fontWeight: 500, fontFamily: "inherit", background: "none", border: "1px solid " + K.border, color: K.fg2, cursor: "pointer" }}>
          Annuler
        </button>
        <button onClick={submit} style={{ padding: "9px 24px", borderRadius: 9, fontSize: 13, fontWeight: 600, fontFamily: "inherit", background: "#f97316", border: "none", color: "#fff", cursor: "pointer", opacity: ok ? 1 : 0.35 }}>
          Ajouter
        </button>
      </div>
    </div>
  );
}

function DetailPanel({ competitor, onClose }) {
  var ref = useRef(null);
  useEffect(function () {
    function h(e) { if (ref.current && !ref.current.contains(e.target)) onClose(); }
    document.addEventListener("mousedown", h);
    return function () { document.removeEventListener("mousedown", h); };
  }, [onClose]);

  if (!competitor) return null;
  var c = competitor;
  var tot = c.accounts.reduce(function (s, a) { return s + a.followers; }, 0);
  var avgE = +(c.accounts.reduce(function (s, a) { return s + a.engagement; }, 0) / c.accounts.length).toFixed(1);
  var totP = +c.accounts.reduce(function (s, a) { return s + a.postsPerWeek; }, 0).toFixed(1);

  return (
    <div ref={ref} style={{
      position: "fixed", right: 0, top: 0, bottom: 0, width: 420, zIndex: 150,
      background: K.bg2, borderLeft: "1px solid " + K.border,
      boxShadow: "-16px 0 50px rgba(0,0,0,0.5)",
      display: "flex", flexDirection: "column", overflowY: "auto",
    }}>
      <div style={{ padding: "22px 24px 18px", borderBottom: "1px solid " + K.border }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{
              width: 44, height: 44, borderRadius: 12, background: c.avatarColor + "22",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 15, fontWeight: 700, color: c.avatarColor,
            }}>
              {c.avatar}
            </div>
            <div>
              <h3 style={{ fontSize: 17, fontWeight: 700, margin: 0 }}>{c.name}</h3>
              <p style={{ fontSize: 11, color: K.fg3, margin: "2px 0 0" }}>{c.accounts.length} plateformes</p>
            </div>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", color: K.fg3, cursor: "pointer", fontSize: 20 }}>
            x
          </button>
        </div>
        <div style={{ display: "flex", gap: 12, marginTop: 16 }}>
          {[
            { l: "Abonnes", v: fmt(tot), co: K.fg },
            { l: "Engagement", v: avgE + "%", co: K.green },
            { l: "Posts/sem", v: String(totP), co: K.accent },
          ].map(function (s) {
            return (
              <div key={s.l} style={{ background: K.bg3, borderRadius: 10, padding: "12px 14px", flex: 1 }}>
                <p style={{ fontSize: 10, fontWeight: 600, color: K.fg3, margin: 0, textTransform: "uppercase", letterSpacing: 0.6 }}>{s.l}</p>
                <p style={{ fontSize: 18, fontWeight: 700, color: s.co, margin: "4px 0 0" }}>{s.v}</p>
              </div>
            );
          })}
        </div>
      </div>

      <div style={{ padding: "18px 24px", borderBottom: "1px solid " + K.border }}>
        <h4 style={{ fontSize: 11, fontWeight: 700, color: K.fg3, textTransform: "uppercase", letterSpacing: 0.8, margin: "0 0 12px" }}>Par plateforme</h4>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {c.accounts.map(function (a, i) {
            var pl = PL[a.platform];
            return (
              <div key={i} style={{ background: K.bg3, borderRadius: 10, padding: "12px 16px", borderLeft: "3px solid " + (pl ? pl.color : K.fg3) }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 10, fontWeight: 700, color: pl ? pl.color : K.fg3, background: pl ? pl.bg : "transparent", padding: "2px 8px", borderRadius: 5 }}>
                      {pl ? pl.label : "?"}
                    </span>
                    <span style={{ fontSize: 12, color: K.fg2 }}>{a.handle}</span>
                  </div>
                  <span style={{ fontSize: 10, fontWeight: 600, color: a.growthPct >= 0 ? K.green : K.red }}>
                    {a.growthPct >= 0 ? "+" : ""}{a.growthPct}%
                  </span>
                </div>
                <div style={{ display: "flex", gap: 20, fontSize: 11 }}>
                  <span style={{ color: K.fg2 }}><strong style={{ color: K.fg }}>{fmt(a.followers)}</strong> abonnes</span>
                  <span style={{ color: K.fg2 }}><strong style={{ color: K.fg }}>{a.engagement}%</strong> eng.</span>
                  <span style={{ color: K.fg2 }}><strong style={{ color: K.fg }}>{a.postsPerWeek}</strong>/sem</span>
                </div>
                <div style={{ marginTop: 8 }}>
                  <Sparkline data={sparkData(a.followers + i * 7, 12, a.followers * 0.9, undefined)} color={pl ? pl.color : undefined} width={320} height={32} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div style={{ padding: "18px 24px" }}>
        <h4 style={{ fontSize: 11, fontWeight: 700, color: K.fg3, textTransform: "uppercase", letterSpacing: 0.8, margin: "0 0 12px" }}>Publications recentes</h4>
        {c.recentPosts.length === 0 && <p style={{ fontSize: 12, color: K.fg3, textAlign: "center", padding: "24px 0" }}>Aucune publication</p>}
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {c.recentPosts.map(function (p, i) {
            var pl = PL[p.platform];
            return (
              <div key={i} style={{ background: K.bg3, borderRadius: 10, padding: "12px 14px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <span style={{ fontSize: 10, fontWeight: 600, color: pl ? pl.color : K.fg3, background: pl ? pl.bg : "transparent", padding: "2px 7px", borderRadius: 4 }}>
                    {pl ? pl.label : "?"}
                  </span>
                  <span style={{ fontSize: 10, color: K.fg3 }}>{fmtDate(p.date)}</span>
                </div>
                <p style={{ fontSize: 12, color: K.fg, margin: "0 0 8px", lineHeight: 1.5 }}>{p.text}</p>
                <div style={{ display: "flex", gap: 14, fontSize: 10, color: K.fg3 }}>
                  <span>{fmt(p.likes)} likes</span>
                  <span>{fmt(p.comments)} com.</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function SortIcon({ active, dir }) {
  if (!active) return <span style={{ opacity: 0.25, fontSize: 10, marginLeft: 3 }}>{"↕"}</span>;
  return <span style={{ color: K.accent, fontSize: 10, marginLeft: 3 }}>{dir === "desc" ? "↓" : "↑"}</span>;
}

export default function CompetitorTracker() {
  var [comps, setComps] = useState(INIT);
  var [sortKey, setSortKey] = useState("followers");
  var [sortDir, setSortDir] = useState("desc");
  var [platF, setPlatF] = useState("all");
  var [search, setSearch] = useState("");
  var [addOpen, setAddOpen] = useState(false);
  var [detail, setDetail] = useState(null);

  function toggleSort(key) {
    if (sortKey === key) {
      setSortDir(function (d) { return d === "desc" ? "asc" : "desc"; });
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  }

  var data = useMemo(function () {
    var kmap = { name: "name", followers: "tf", engagement: "ae", posts: "tp", growth: "ag" };

    return comps.map(function (c) {
      var accs = platF === "all" ? c.accounts : c.accounts.filter(function (a) { return a.platform === platF; });
      var tf = accs.reduce(function (s, a) { return s + a.followers; }, 0);
      var ae = accs.length ? +(accs.reduce(function (s, a) { return s + a.engagement; }, 0) / accs.length).toFixed(1) : 0;
      var tp = +accs.reduce(function (s, a) { return s + a.postsPerWeek; }, 0).toFixed(1);
      var ag = accs.length ? +(accs.reduce(function (s, a) { return s + a.growthPct; }, 0) / accs.length).toFixed(1) : 0;
      return Object.assign({}, c, { fa: accs, tf: tf, ae: ae, tp: tp, ag: ag });
    }).filter(function (c) {
      if (platF !== "all" && c.fa.length === 0) return false;
      if (search && c.name.toLowerCase().indexOf(search.toLowerCase()) === -1) return false;
      return true;
    }).sort(function (a, b) {
      var m = sortDir === "desc" ? -1 : 1;
      var prop = kmap[sortKey] || "tf";
      var va = a[prop];
      var vb = b[prop];
      if (typeof va === "string") return va.localeCompare(vb) * -m;
      return (va - vb) * m;
    });
  }, [comps, sortKey, sortDir, platF, search]);

  function addC(d) { setComps(function (p) { return p.concat([d]); }); setAddOpen(false); }
  function rmC(id) {
    setComps(function (p) { return p.filter(function (c) { return c.id !== id; }); });
    if (detail && detail.id === id) setDetail(null);
  }

  var thBase = {
    padding: "12px 14px", textAlign: "left", fontSize: 10, fontWeight: 700, color: K.fg3,
    textTransform: "uppercase", letterSpacing: 0.8, cursor: "pointer", userSelect: "none",
    whiteSpace: "nowrap", borderBottom: "1px solid " + K.border,
  };

  var allPosts = [];
  comps.forEach(function (c) {
    c.recentPosts.forEach(function (p) {
      allPosts.push(Object.assign({}, p, { comp: c.name, ac: c.avatarColor, av: c.avatar }));
    });
  });
  allPosts.sort(function (a, b) { return b.date.localeCompare(a.date); });
  allPosts = allPosts.slice(0, 8);

  return (
    <div style={{ minHeight: "100vh", background: K.bg, fontFamily: "'Manrope',sans-serif", color: K.fg }}>
      <style>{
        "@import url('https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700;800&display=swap');" +
        "::-webkit-scrollbar{width:5px;height:5px}::-webkit-scrollbar-track{background:transparent}::-webkit-scrollbar-thumb{background:" + K.border + ";border-radius:3px}"
      }</style>

      {/* Header */}
      <div style={{ padding: "22px 32px 18px", borderBottom: "1px solid " + K.border, background: K.bg1 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 14 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{
              width: 42, height: 42, borderRadius: 12,
              background: "linear-gradient(135deg, #f97316, #f59e0b)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round">
                <circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" />
              </svg>
            </div>
            <div>
              <h1 style={{ fontSize: 21, fontWeight: 800, margin: 0, letterSpacing: -0.5 }}>Suivi des concurrents</h1>
              <p style={{ fontSize: 12, color: K.fg3, margin: 0 }}>Analysez les performances sur tous les reseaux</p>
            </div>
          </div>
          <button onClick={function () { setAddOpen(true); }} style={{
            display: "flex", alignItems: "center", gap: 7, padding: "9px 20px", borderRadius: 9,
            fontSize: 13, fontWeight: 600, fontFamily: "inherit", background: "#f97316",
            border: "none", color: "#fff", cursor: "pointer",
          }}>
            + Ajouter un concurrent
          </button>
        </div>

        {/* Filters row */}
        <div style={{ marginTop: 18, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
          <div style={{ display: "flex", gap: 14, alignItems: "center", fontSize: 12, color: K.fg3 }}>
            <span><strong style={{ color: K.fg, fontWeight: 700, fontSize: 18 }}>{comps.length}</strong> concurrents</span>
            <span><strong style={{ color: K.fg, fontWeight: 700, fontSize: 18 }}>{comps.reduce(function (s, c) { return s + c.accounts.length; }, 0)}</strong> comptes</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ position: "relative" }}>
              <input type="text" placeholder="Rechercher..." value={search}
                onChange={function (e) { setSearch(e.target.value); }}
                style={{
                  padding: "7px 14px", fontSize: 12, fontFamily: "inherit", background: K.bg2,
                  border: "1px solid " + K.border, borderRadius: 8, color: K.fg, outline: "none", width: 170,
                }}
              />
            </div>
            <div style={{ display: "flex", gap: 3, background: K.bg2, border: "1px solid " + K.border, borderRadius: 8, padding: 3 }}>
              <button onClick={function () { setPlatF("all"); }} style={{
                padding: "5px 11px", borderRadius: 6, fontSize: 11, fontWeight: 600, fontFamily: "inherit",
                background: platF === "all" ? K.bg3 : "transparent", border: "none",
                color: platF === "all" ? K.fg : K.fg3, cursor: "pointer",
              }}>Tous</button>
              {Object.entries(PL).map(function (entry) {
                var k = entry[0];
                var v = entry[1];
                return (
                  <button key={k} onClick={function () { setPlatF(k); }} style={{
                    padding: "5px 9px", borderRadius: 6, fontSize: 11, fontWeight: 600, fontFamily: "inherit",
                    background: platF === k ? v.bg : "transparent", border: "none",
                    color: platF === k ? v.color : K.fg3, cursor: "pointer",
                  }}>{v.short}</button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div style={{ padding: "20px 32px 40px" }}>
        <div style={{ background: K.bg2, border: "1px solid " + K.border, borderRadius: 14, overflow: "hidden" }}>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13, minWidth: 880 }}>
              <thead>
                <tr style={{ background: K.bg3 }}>
                  <th style={Object.assign({}, thBase, { width: 240 })} onClick={function () { toggleSort("name"); }}>
                    Concurrent <SortIcon active={sortKey === "name"} dir={sortDir} />
                  </th>
                  <th style={thBase}>Plateformes</th>
                  <th style={Object.assign({}, thBase, { textAlign: "right" })} onClick={function () { toggleSort("followers"); }}>
                    Abonnes <SortIcon active={sortKey === "followers"} dir={sortDir} />
                  </th>
                  <th style={Object.assign({}, thBase, { textAlign: "right" })} onClick={function () { toggleSort("engagement"); }}>
                    Engagement <SortIcon active={sortKey === "engagement"} dir={sortDir} />
                  </th>
                  <th style={Object.assign({}, thBase, { textAlign: "right" })} onClick={function () { toggleSort("posts"); }}>
                    Posts/sem <SortIcon active={sortKey === "posts"} dir={sortDir} />
                  </th>
                  <th style={Object.assign({}, thBase, { textAlign: "right" })} onClick={function () { toggleSort("growth"); }}>
                    Croissance <SortIcon active={sortKey === "growth"} dir={sortDir} />
                  </th>
                  <th style={Object.assign({}, thBase, { textAlign: "center", width: 120 })}>Tendance</th>
                  <th style={Object.assign({}, thBase, { width: 44 })}></th>
                </tr>
              </thead>
              <tbody>
                {data.map(function (c, i) {
                  return (
                    <tr key={c.id}
                      style={{ borderBottom: "1px solid " + K.border, cursor: "pointer", transition: "background .15s" }}
                      onMouseEnter={function (e) { e.currentTarget.style.background = K.bg3 + "88"; }}
                      onMouseLeave={function (e) { e.currentTarget.style.background = "transparent"; }}
                      onClick={function () { setDetail(c); }}
                    >
                      <td style={{ padding: "14px 14px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                          <div style={{
                            width: 38, height: 38, borderRadius: 10,
                            background: c.avatarColor + "1a",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            fontSize: 13, fontWeight: 700, color: c.avatarColor, flexShrink: 0,
                          }}>{c.avatar}</div>
                          <div>
                            <p style={{ margin: 0, fontWeight: 600, fontSize: 13, color: K.fg }}>{c.name}</p>
                            <p style={{ margin: "2px 0 0", fontSize: 11, color: K.fg3 }}>{c.recentPosts.length} posts recents</p>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: "14px 14px" }}>
                        <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                          {c.fa.map(function (a, j) {
                            var pl = PL[a.platform];
                            return <span key={j} style={{ fontSize: 9, fontWeight: 700, color: pl ? pl.color : K.fg3, background: pl ? pl.bg : "transparent", padding: "3px 7px", borderRadius: 4 }}>{pl ? pl.short : "?"}</span>;
                          })}
                        </div>
                      </td>
                      <td style={{ padding: "14px 14px", textAlign: "right", fontWeight: 700, fontSize: 14, color: K.fg }}>
                        {fmt(c.tf)}
                      </td>
                      <td style={{ padding: "14px 14px", textAlign: "right" }}>
                        <span style={{ fontWeight: 700, fontSize: 14, color: c.ae >= 5 ? K.green : c.ae >= 3 ? K.amber : K.fg }}>
                          {c.ae}%
                        </span>
                      </td>
                      <td style={{ padding: "14px 14px", textAlign: "right", fontWeight: 600, color: K.fg2 }}>
                        {c.tp}
                      </td>
                      <td style={{ padding: "14px 14px", textAlign: "right" }}>
                        <span style={{
                          fontSize: 12, fontWeight: 700,
                          color: c.ag >= 0 ? K.green : K.red,
                          background: c.ag >= 0 ? "rgba(52,211,153,0.1)" : "rgba(248,113,113,0.1)",
                          padding: "3px 9px", borderRadius: 6,
                        }}>
                          {c.ag >= 0 ? "+" : ""}{c.ag}%
                        </span>
                      </td>
                      <td style={{ padding: "14px 10px", textAlign: "center" }}>
                        <Sparkline
                          data={sparkData(c.id * 17, 12, c.tf * 0.88, c.ag > 0 ? 0.03 : -0.01)}
                          color={c.ag >= 0 ? K.green : K.red}
                          width={100} height={28}
                        />
                      </td>
                      <td style={{ padding: "14px 10px", textAlign: "center" }}>
                        <button
                          onClick={function (e) { e.stopPropagation(); rmC(c.id); }}
                          style={{ background: "none", border: "none", color: K.fg3, cursor: "pointer", fontSize: 14, padding: "4px 6px", borderRadius: 6, lineHeight: 1 }}
                          title="Supprimer"
                        >x</button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {data.length === 0 && (
            <div style={{ padding: "60px 20px", textAlign: "center" }}>
              <p style={{ fontSize: 13, color: K.fg3 }}>Aucun concurrent trouve</p>
              <button onClick={function () { setAddOpen(true); }}
                style={{ marginTop: 12, fontSize: 12, color: "#f97316", background: "none", border: "1px solid rgba(249,115,22,0.3)", borderRadius: 8, padding: "8px 18px", cursor: "pointer", fontFamily: "inherit", fontWeight: 600 }}>
                + Ajouter
              </button>
            </div>
          )}
        </div>

        {/* Recent activity */}
        <div style={{ marginTop: 20 }}>
          <h3 style={{ fontSize: 13, fontWeight: 700, color: K.fg2, margin: "0 0 12px" }}>Activite recente</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 10 }}>
            {allPosts.map(function (p, i) {
              var pl = PL[p.platform];
              return (
                <div key={i} style={{
                  background: K.bg2, border: "1px solid " + K.border, borderRadius: 12, padding: "14px 16px",
                  transition: "border-color .15s",
                }}
                  onMouseEnter={function (e) { e.currentTarget.style.borderColor = K.borderH; }}
                  onMouseLeave={function (e) { e.currentTarget.style.borderColor = K.border; }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{
                        width: 24, height: 24, borderRadius: 6, background: p.ac + "1a",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 9, fontWeight: 700, color: p.ac,
                      }}>{p.av}</div>
                      <span style={{ fontSize: 12, fontWeight: 600, color: K.fg }}>{p.comp}</span>
                      <span style={{ fontSize: 9, fontWeight: 700, color: pl ? pl.color : K.fg3, background: pl ? pl.bg : "transparent", padding: "2px 6px", borderRadius: 4 }}>
                        {pl ? pl.label : "?"}
                      </span>
                    </div>
                    <span style={{ fontSize: 10, color: K.fg3 }}>{fmtDate(p.date)}</span>
                  </div>
                  <p style={{ fontSize: 12, color: K.fg2, margin: "0 0 8px", lineHeight: 1.5 }}>{p.text}</p>
                  <div style={{ display: "flex", gap: 14, fontSize: 10, color: K.fg3 }}>
                    <span>{fmt(p.likes)} likes</span>
                    <span>{fmt(p.comments)} com.</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {detail && <DetailPanel competitor={detail} onClose={function () { setDetail(null); }} />}
      <Modal open={addOpen} onClose={function () { setAddOpen(false); }}>
        <AddForm onSave={addC} onClose={function () { setAddOpen(false); }} />
      </Modal>
    </div>
  );
}
