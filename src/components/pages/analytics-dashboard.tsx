"use client";
// @ts-nocheck
import { useState, useEffect, useRef, useCallback } from "react";
import { Chart, CategoryScale, LinearScale, BarElement, BarController, LineController, LineElement, PointElement, Filler, Tooltip, Legend } from "chart.js";

Chart.register(CategoryScale, LinearScale, BarElement, BarController, LineController, LineElement, PointElement, Filler, Tooltip, Legend);

const C = {
  bg: "#0b0b0e", bg2: "#111116", card: "#15151b", border: "#1e1e26",
  fg: "#eaeaf0", fg2: "#8a8a9a", fg3: "#55555f",
  violet: "#8b5cf6", cyan: "#22d3ee", emerald: "#34d399",
  amber: "#fbbf24", rose: "#fb7185", blue: "#60a5fa",
};

const RANGES = [
  { id: "7d", label: "7 jours" },
  { id: "14d", label: "14 jours" },
  { id: "30d", label: "30 jours" },
  { id: "90d", label: "90 jours" },
];

function getDays(id) { return parseInt(id); }

function genLabels(n) {
  const out = [];
  const now = new Date();
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(now); d.setDate(d.getDate() - i);
    out.push(d.toLocaleDateString("fr-FR", { day: "numeric", month: "short" }));
  }
  return out;
}

function rng(seed) { let s = seed; return () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; }; }

function gen(n, base, v, seed = 42, t = 0.5) {
  const r = rng(seed); const d = []; let c = base;
  for (let i = 0; i < n; i++) { c += (r() - 0.45) * v + t; d.push(Math.max(0, Math.round(c))); }
  return d;
}

function genEng(n, seed = 77) { const r = rng(seed); return Array.from({ length: n }, (_, i) => +(3.2 + r() * 3.5 + i * 0.02).toFixed(2)); }

function makeData(rangeId) {
  const n = getDays(rangeId);
  const labels = genLabels(n);
  const impressions = gen(n, 8000, 3000, 42, 80);
  const reach = gen(n, 5500, 2000, 99, 55);
  const engagement = genEng(n, 77);
  const followers = gen(n, 50, 30, 123, 2);
  const unfollows = gen(n, 8, 10, 201, 0.1);
  const likes = gen(n, 400, 200, 55, 8);
  const comments = gen(n, 40, 30, 66, 1.5);
  const saves = gen(n, 80, 50, 88, 3);
  const shares = gen(n, 30, 25, 111, 1);
  const sum = a => a.reduce((x, y) => x + y, 0);
  return {
    labels, impressions, reach, engagement, followers, unfollows,
    likes, comments, saves, shares,
    kpis: {
      impressions: sum(impressions),
      engagement: (sum(engagement) / n).toFixed(2),
      followerGrowth: sum(followers) - sum(unfollows),
      interactions: sum(likes) + sum(comments) + sum(saves),
    },
  };
}

const TOP_POSTS = [
  { id: 1, type: "Carrousel", caption: "Lancement collection printemps \u2014 shooting studio palette pastel", impr: 48200, eng: "7.2%", likes: 2841, saves: 423, date: "22 mar" },
  { id: 2, type: "Reel", caption: "Behind the scenes \u2014 pr\u00e9paration shooting campagne \u00e9t\u00e9 2026", impr: 41800, eng: "6.8%", likes: 3102, saves: 512, date: "18 mar" },
  { id: 3, type: "Photo", caption: "Retour sur notre \u00e9v\u00e9nement pop-up du weekend dernier", impr: 32100, eng: "5.4%", likes: 1923, saves: 287, date: "20 mar" },
  { id: 4, type: "Reel", caption: "Unboxing du nouveau packaging \u00e9co-responsable", impr: 29400, eng: "5.1%", likes: 2456, saves: 367, date: "15 mar" },
  { id: 5, type: "Story", caption: "Sondage communaut\u00e9 \u2014 ce que vous voulez voir en avril", impr: 24600, eng: "4.9%", likes: 1247, saves: 156, date: "12 mar" },
];

const PLATFORMS = [
  { name: "Instagram", value: 62, color: C.violet },
  { name: "TikTok", value: 21, color: C.cyan },
  { name: "Facebook", value: 11, color: C.blue },
  { name: "X / Twitter", value: 6, color: C.fg3 },
];

function numFmt(n) {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + "M";
  if (n >= 1000) return (n / 1000).toFixed(1) + "K";
  return n.toLocaleString("fr-FR");
}

function ChartCanvas({ config, height = 260 }) {
  const ref = useRef(null);
  const chart = useRef(null);
  useEffect(() => {
    if (chart.current) chart.current.destroy();
    chart.current = new Chart(ref.current.getContext("2d"), config);
    return () => { if (chart.current) chart.current.destroy(); };
  }, [config]);
  return <canvas ref={ref} style={{ width: "100%", height }} />;
}

function StatCard({ label, value, change, trend, color, icon, delay }) {
  return (
    <div style={{
      background: C.card, border: `1px solid ${C.border}`, borderRadius: 14,
      padding: "20px 22px", position: "relative", overflow: "hidden",
      animation: `su 0.45s ${delay}ms both`,
    }}>
      <div style={{
        position: "absolute", top: -24, right: -24, width: 88, height: 88,
        borderRadius: "50%", background: color + "08",
      }} />
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
        <div style={{
          width: 32, height: 32, borderRadius: 9,
          background: color + "15", display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 14, color,
        }}>{icon}</div>
        <span style={{ fontSize: 10, fontWeight: 600, color: C.fg2, textTransform: "uppercase", letterSpacing: 0.6 }}>{label}</span>
      </div>
      <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
        <span style={{ fontSize: 26, fontWeight: 800, color: C.fg, letterSpacing: -1 }}>{value}</span>
        {change && (
          <span style={{
            fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 6,
            color: trend === "up" ? C.emerald : C.rose,
            background: (trend === "up" ? C.emerald : C.rose) + "15",
          }}>{change}</span>
        )}
      </div>
    </div>
  );
}

function CCard({ title, sub, children, delay, right }) {
  return (
    <div style={{
      background: C.card, border: `1px solid ${C.border}`, borderRadius: 14,
      padding: "22px 24px", animation: `su 0.45s ${delay}ms both`,
    }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 18 }}>
        <div>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: C.fg, margin: 0, letterSpacing: -0.2 }}>{title}</h3>
          {sub && <p style={{ fontSize: 11, color: C.fg3, margin: "3px 0 0" }}>{sub}</p>}
        </div>
        {right}
      </div>
      {children}
    </div>
  );
}

const bo = {
  responsive: true, maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: "#1e1e28", titleColor: "#eaeaf0", bodyColor: "#8a8a9a",
      borderColor: "#2a2a34", borderWidth: 1, cornerRadius: 8, padding: 12,
      titleFont: { family: "'Outfit',sans-serif", size: 12, weight: 600 },
      bodyFont: { family: "'Outfit',sans-serif", size: 11 },
      displayColors: true, boxWidth: 8, boxHeight: 8, boxPadding: 4,
    },
  },
  scales: {
    x: { grid: { color: "rgba(255,255,255,0.04)", drawBorder: false }, ticks: { color: C.fg3, font: { family: "'Outfit',sans-serif", size: 10 }, maxTicksLimit: 10 }, border: { display: false } },
    y: { grid: { color: "rgba(255,255,255,0.04)", drawBorder: false }, ticks: { color: C.fg3, font: { family: "'Outfit',sans-serif", size: 10 }, maxTicksLimit: 6 }, border: { display: false } },
  },
};

const withLegend = {
  display: true, position: "top", align: "end",
  labels: {
    color: C.fg2, font: { family: "'Outfit',sans-serif", size: 11 },
    boxWidth: 8, boxHeight: 8, padding: 16,
    usePointStyle: true, pointStyle: "rectRounded",
  },
};

export default function AnalyticsDashboard() {
  const [range, setRange] = useState("30d");
  const [data, setData] = useState(() => makeData("30d"));
  const [customFrom, setCustomFrom] = useState("");
  const [customTo, setCustomTo] = useState("");
  const [showCustom, setShowCustom] = useState(false);
  const popRef = useRef(null);

  useEffect(() => { setData(makeData(range)); }, [range]);

  useEffect(() => {
    if (!showCustom) return;
    const h = e => { if (popRef.current && !popRef.current.contains(e.target)) setShowCustom(false); };
    document.addEventListener("mousedown", h); return () => document.removeEventListener("mousedown", h);
  }, [showCustom]);

  const impCfg = useCallback(() => ({
    type: "bar",
    data: {
      labels: data.labels,
      datasets: [
        { label: "Impressions", data: data.impressions, backgroundColor: C.violet + "55", hoverBackgroundColor: C.violet + "aa", borderRadius: 4, borderSkipped: false, barPercentage: 0.65 },
        { label: "Port\u00e9e", data: data.reach, backgroundColor: C.cyan + "44", hoverBackgroundColor: C.cyan + "88", borderRadius: 4, borderSkipped: false, barPercentage: 0.65 },
      ],
    },
    options: { ...bo, plugins: { ...bo.plugins, legend: withLegend }, scales: { ...bo.scales, y: { ...bo.scales.y, ticks: { ...bo.scales.y.ticks, callback: v => numFmt(v) } } } },
  }), [data]);

  const engCfg = useCallback(() => ({
    type: "line",
    data: {
      labels: data.labels,
      datasets: [{
        label: "Taux d'engagement (%)", data: data.engagement,
        borderColor: C.emerald, backgroundColor: C.emerald + "12",
        pointBackgroundColor: C.emerald, pointBorderColor: C.card, pointBorderWidth: 2,
        pointRadius: 0, pointHoverRadius: 5, borderWidth: 2.5, tension: 0.4, fill: true,
      }],
    },
    options: { ...bo, scales: { ...bo.scales, y: { ...bo.scales.y, ticks: { ...bo.scales.y.ticks, callback: v => v + "%" } } } },
  }), [data]);

  const folCfg = useCallback(() => ({
    type: "bar",
    data: {
      labels: data.labels,
      datasets: [
        { label: "Nouveaux abonn\u00e9s", data: data.followers, backgroundColor: C.amber + "55", hoverBackgroundColor: C.amber + "aa", borderRadius: 3, borderSkipped: false, barPercentage: 0.5, stack: "s" },
        { label: "D\u00e9sabonnements", data: data.unfollows.map(v => -v), backgroundColor: C.rose + "44", hoverBackgroundColor: C.rose + "88", borderRadius: 3, borderSkipped: false, barPercentage: 0.5, stack: "s" },
      ],
    },
    options: { ...bo, plugins: { ...bo.plugins, legend: withLegend }, scales: { x: { ...bo.scales.x, stacked: true }, y: { ...bo.scales.y, stacked: true } } },
  }), [data]);

  const intCfg = useCallback(() => ({
    type: "line",
    data: {
      labels: data.labels,
      datasets: [
        { label: "Likes", data: data.likes, borderColor: C.rose, backgroundColor: "transparent", pointRadius: 0, pointHoverRadius: 4, borderWidth: 2, tension: 0.4 },
        { label: "Commentaires", data: data.comments, borderColor: C.blue, backgroundColor: "transparent", pointRadius: 0, pointHoverRadius: 4, borderWidth: 2, tension: 0.4 },
        { label: "Sauvegardes", data: data.saves, borderColor: C.amber, backgroundColor: "transparent", pointRadius: 0, pointHoverRadius: 4, borderWidth: 2, tension: 0.4 },
        { label: "Partages", data: data.shares, borderColor: C.emerald, backgroundColor: "transparent", pointRadius: 0, pointHoverRadius: 4, borderWidth: 2, tension: 0.4, borderDash: [4, 4] },
      ],
    },
    options: {
      ...bo, plugins: {
        ...bo.plugins,
        legend: { display: true, position: "top", align: "end", labels: { color: C.fg2, font: { family: "'Outfit',sans-serif", size: 11 }, boxWidth: 12, boxHeight: 2, padding: 16, usePointStyle: false } },
      },
    },
  }), [data]);

  const typeCol = { "Carrousel": C.violet, "Reel": C.rose, "Photo": C.blue, "Story": C.emerald };

  const inputS = { padding: "7px 10px", fontSize: 12, background: C.bg, border: `1px solid ${C.border}`, borderRadius: 7, color: C.fg, fontFamily: "inherit", colorScheme: "dark", outline: "none" };

  return (
    <div style={{  color: C.fg, fontFamily: "'Outfit',system-ui,sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap');
        @keyframes su{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
        @keyframes fi{from{opacity:0}to{opacity:1}}
        ::-webkit-scrollbar{width:5px}::-webkit-scrollbar-track{background:transparent}
        ::-webkit-scrollbar-thumb{background:#2a2a32;border-radius:3px}
        input[type="date"]::-webkit-calendar-picker-indicator{filter:invert(0.5)}
      `}</style>

      {/* HEADER */}
      <div style={{ padding: "24px 36px 20px", borderBottom: `1px solid ${C.border}`, background: `linear-gradient(180deg,${C.bg2},${C.bg})`, animation: "fi 0.4s both" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 44, height: 44, borderRadius: 13, background: `linear-gradient(135deg,${C.cyan}22,${C.violet}22)`, border: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={C.cyan} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
            </div>
            <div>
              <h1 style={{ fontSize: 22, fontWeight: 800, margin: 0, letterSpacing: -0.6 }}>Analytics</h1>
              <p style={{ fontSize: 12, color: C.fg3, margin: 0 }}>Performance multi-plateformes en temps r\u00e9el</p>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ display: "flex", gap: 3, background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: 3 }}>
              {RANGES.map(r => (
                <button key={r.id} onClick={() => { setRange(r.id); setShowCustom(false); }}
                  style={{
                    padding: "7px 14px", borderRadius: 7, fontSize: 12, fontWeight: 600,
                    background: range === r.id && !showCustom ? C.violet + "20" : "transparent",
                    border: "none", color: range === r.id && !showCustom ? C.violet : C.fg3,
                    cursor: "pointer", fontFamily: "inherit", transition: "all 0.15s",
                  }}>{r.label}</button>
              ))}
            </div>
            <div style={{ position: "relative" }} ref={popRef}>
              <button onClick={() => setShowCustom(!showCustom)}
                style={{
                  padding: "7px 14px", borderRadius: 10, fontSize: 12, fontWeight: 600,
                  background: showCustom ? C.card : "transparent",
                  border: `1px solid ${showCustom ? C.violet + "44" : C.border}`,
                  color: showCustom ? C.violet : C.fg3,
                  cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", gap: 6,
                }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                Personnalis\u00e9
              </button>
              {showCustom && (
                <div style={{
                  position: "absolute", right: 0, top: "calc(100% + 6px)", zIndex: 50,
                  background: C.card, border: `1px solid ${C.border}`, borderRadius: 12,
                  padding: 16, display: "flex", gap: 10, alignItems: "flex-end",
                  boxShadow: "0 12px 40px rgba(0,0,0,0.5)", animation: "su 0.2s both",
                }}>
                  <div>
                    <label style={{ fontSize: 10, fontWeight: 600, color: C.fg3, display: "block", marginBottom: 4, textTransform: "uppercase", letterSpacing: 0.5 }}>Du</label>
                    <input type="date" value={customFrom} onChange={e => setCustomFrom(e.target.value)} style={inputS} />
                  </div>
                  <div>
                    <label style={{ fontSize: 10, fontWeight: 600, color: C.fg3, display: "block", marginBottom: 4, textTransform: "uppercase", letterSpacing: 0.5 }}>Au</label>
                    <input type="date" value={customTo} onChange={e => setCustomTo(e.target.value)} style={inputS} />
                  </div>
                  <button onClick={() => setShowCustom(false)} style={{ padding: "7px 14px", borderRadius: 7, fontSize: 12, fontWeight: 600, background: C.violet, border: "none", color: "#fff", cursor: "pointer", fontFamily: "inherit" }}>OK</button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 16 }}>
          <span style={{ fontSize: 10, color: C.fg3, fontWeight: 500 }}>Sources :</span>
          {["Instagram", "TikTok", "Facebook", "X"].map(s => (
            <span key={s} style={{ fontSize: 10, fontWeight: 600, color: C.fg2, background: C.bg, padding: "3px 10px", borderRadius: 6, border: `1px solid ${C.border}` }}>{s}</span>
          ))}
          <span style={{ fontSize: 10, color: C.cyan, background: C.cyan + "15", padding: "3px 10px", borderRadius: 6, fontWeight: 600, marginLeft: 4 }}>via Supermetrics</span>
        </div>
      </div>

      <div style={{ padding: "24px 36px 48px", maxWidth: 1400, margin: "0 auto" }}>
        {/* KPI */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, marginBottom: 24 }}>
          <StatCard label="Impressions" value={numFmt(data.kpis.impressions)} change="+18.4%" trend="up" color={C.violet} icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/></svg>} delay={80} />
          <StatCard label="Taux d'engagement" value={data.kpis.engagement + "%"} change="+0.8%" trend="up" color={C.emerald} icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>} delay={140} />
          <StatCard label="Croissance abonn\u00e9s" value={"+" + numFmt(data.kpis.followerGrowth)} change="+12.3%" trend="up" color={C.amber} icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/></svg>} delay={200} />
          <StatCard label="Interactions" value={numFmt(data.kpis.interactions)} change="-2.1%" trend="down" color={C.rose} icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>} delay={260} />
        </div>

        {/* CHARTS ROW 1 */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
          <CCard title="Impressions et port\u00e9e" sub="Volume quotidien" delay={320}>
            <div style={{ height: 260 }}><ChartCanvas config={impCfg()} height={260} /></div>
          </CCard>
          <CCard title="Taux d'engagement" sub="Pourcentage moyen quotidien" delay={380}>
            <div style={{ height: 260 }}><ChartCanvas config={engCfg()} height={260} /></div>
          </CCard>
        </div>

        {/* CHARTS ROW 2 */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
          <CCard title="Croissance des abonn\u00e9s" sub="Nouveaux vs. d\u00e9sabonnements" delay={440}>
            <div style={{ height: 260 }}><ChartCanvas config={folCfg()} height={260} /></div>
          </CCard>
          <CCard title="Interactions d\u00e9taill\u00e9es" sub="Likes, commentaires, sauvegardes, partages" delay={500}>
            <div style={{ height: 260 }}><ChartCanvas config={intCfg()} height={260} /></div>
          </CCard>
        </div>

        {/* BOTTOM: TOP POSTS + PLATFORMS */}
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 14 }}>
          <CCard title="Publications les plus performantes" sub="Class\u00e9es par impressions sur la p\u00e9riode" delay={560}>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: "0 4px", fontSize: 12 }}>
                <thead>
                  <tr>
                    {["Publication", "Type", "Impressions", "Engage.", "Likes", "Sauveg.", "Date"].map(h => (
                      <th key={h} style={{ textAlign: "left", padding: "6px 10px", fontSize: 10, fontWeight: 600, color: C.fg3, textTransform: "uppercase", letterSpacing: 0.5, borderBottom: `1px solid ${C.border}` }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {TOP_POSTS.map((p, i) => (
                    <tr key={p.id} style={{ animation: `su 0.35s ${620 + i * 40}ms both`, cursor: "pointer" }}
                      onMouseEnter={e => e.currentTarget.style.background = C.bg2}
                      onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                      <td style={{ padding: "10px 10px", color: C.fg, fontWeight: 500, maxWidth: 240, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", borderRadius: "8px 0 0 8px" }}>
                        <span style={{ color: C.fg3, marginRight: 8, fontWeight: 700, fontSize: 11 }}>#{i + 1}</span>{p.caption}
                      </td>
                      <td style={{ padding: "10px 10px" }}>
                        <span style={{ fontSize: 10, fontWeight: 600, padding: "3px 8px", borderRadius: 5, color: typeCol[p.type] || C.fg2, background: (typeCol[p.type] || C.fg2) + "15" }}>{p.type}</span>
                      </td>
                      <td style={{ padding: "10px 10px", fontWeight: 700, color: C.fg }}>{numFmt(p.impr)}</td>
                      <td style={{ padding: "10px 10px", color: C.emerald, fontWeight: 600 }}>{p.eng}</td>
                      <td style={{ padding: "10px 10px", color: C.fg2 }}>{numFmt(p.likes)}</td>
                      <td style={{ padding: "10px 10px", color: C.fg2 }}>{numFmt(p.saves)}</td>
                      <td style={{ padding: "10px 10px", color: C.fg3, borderRadius: "0 8px 8px 0" }}>{p.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CCard>

          <CCard title="R\u00e9partition par plateforme" sub="Part des impressions totales" delay={600}>
            <div style={{ display: "flex", flexDirection: "column", gap: 14, paddingTop: 4 }}>
              {PLATFORMS.map((p, i) => (
                <div key={p.name} style={{ animation: `su 0.3s ${660 + i * 50}ms both` }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: C.fg }}>{p.name}</span>
                    <span style={{ fontSize: 13, fontWeight: 700, color: p.color }}>{p.value}%</span>
                  </div>
                  <div style={{ height: 7, borderRadius: 4, background: C.bg, overflow: "hidden" }}>
                    <div style={{ height: "100%", borderRadius: 4, background: `linear-gradient(90deg,${p.color}88,${p.color})`, width: `${p.value}%`, transition: "width 0.8s cubic-bezier(.4,0,.2,1)" }} />
                  </div>
                </div>
              ))}

              <div style={{ marginTop: 8, padding: "14px 16px", background: C.bg, borderRadius: 10, border: `1px solid ${C.border}` }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                  <span style={{ fontSize: 10, fontWeight: 600, color: C.fg3, textTransform: "uppercase", letterSpacing: 0.5 }}>Total impressions</span>
                  <span style={{ fontSize: 16, fontWeight: 800, color: C.fg, letterSpacing: -0.5 }}>{numFmt(data.kpis.impressions)}</span>
                </div>
                <div style={{ display: "flex", gap: 12 }}>
                  {PLATFORMS.map(p => (
                    <div key={p.name} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                      <div style={{ width: 6, height: 6, borderRadius: "50%", background: p.color }} />
                      <span style={{ fontSize: 10, color: C.fg3 }}>{numFmt(Math.round(data.kpis.impressions * p.value / 100))}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CCard>
        </div>
      </div>
    </div>
  );
}
