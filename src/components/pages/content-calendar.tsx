"use client";
// @ts-nocheck
import { useState, useRef, useEffect } from "react";

/* ─── Platform definitions ─── */
const PLATFORMS = [
  { id: "instagram", label: "Instagram", color: "#c27afa", bg: "rgba(194,122,250,0.12)", icon: "◎" },
  { id: "youtube", label: "YouTube", color: "#f45b5b", bg: "rgba(244,91,91,0.12)", icon: "▶" },
  { id: "tiktok", label: "TikTok", color: "#2ee8c8", bg: "rgba(46,232,200,0.10)", icon: "♫" },
  { id: "linkedin", label: "LinkedIn", color: "#5b9bf4", bg: "rgba(91,155,244,0.12)", icon: "■" },
  { id: "facebook", label: "Facebook", color: "#4e8cf7", bg: "rgba(78,140,247,0.12)", icon: "●" },
  { id: "twitter", label: "X / Twitter", color: "#a0aec0", bg: "rgba(160,174,192,0.10)", icon: "✕" },
];

const CONTENT_TYPES = ["Photo", "Vidéo", "Carrousel", "Reel", "Story", "Short", "Article", "Live"];

const STATUSES = [
  { id: "scheduled", label: "Programmé", color: "#a78bfa", dot: "◉" },
  { id: "published", label: "Publié", color: "#34d399", dot: "●" },
  { id: "draft", label: "Brouillon", color: "#fbbf24", dot: "◐" },
];

/* ─── Sample data ─── */
function buildSampleData() {
  return [
    { id: 1, title: "Lancement collection printemps", platform: "instagram", type: "Carrousel", status: "scheduled", date: "2026-03-28", time: "10:00" },
    { id: 2, title: "Tuto maquillage naturel", platform: "youtube", type: "Vidéo", status: "scheduled", date: "2026-03-29", time: "14:00" },
    { id: 3, title: "Behind the scenes shooting", platform: "tiktok", type: "Reel", status: "scheduled", date: "2026-03-28", time: "18:00" },
    { id: 4, title: "Article tendances mode 2026", platform: "linkedin", type: "Article", status: "scheduled", date: "2026-03-30", time: "09:00" },
    { id: 5, title: "Retour pop-up store", platform: "instagram", type: "Photo", status: "published", date: "2026-03-20", time: "11:00" },
    { id: 6, title: "Unboxing packaging éco", platform: "youtube", type: "Short", status: "published", date: "2026-03-18", time: "16:00" },
    { id: 7, title: "Sondage communauté", platform: "instagram", type: "Story", status: "published", date: "2026-03-22", time: "12:00" },
    { id: 8, title: "Annonce partenariat exclusif", platform: "facebook", type: "Photo", status: "scheduled", date: "2026-04-01", time: "10:00" },
    { id: 9, title: "Live Q&A équipe créative", platform: "instagram", type: "Live", status: "scheduled", date: "2026-04-03", time: "19:00" },
    { id: 10, title: "Astuce photo smartphone", platform: "tiktok", type: "Reel", status: "published", date: "2026-03-15", time: "08:30" },
    { id: 11, title: "Résultats campagne Q1", platform: "linkedin", type: "Article", status: "published", date: "2026-03-12", time: "10:00" },
    { id: 12, title: "Teaser nouvelle collab", platform: "instagram", type: "Reel", status: "draft", date: "2026-03-31", time: "17:00" },
    { id: 13, title: "Review produit bestseller", platform: "youtube", type: "Vidéo", status: "draft", date: "2026-04-02", time: "15:00" },
    { id: 14, title: "Challenge viral danse", platform: "tiktok", type: "Reel", status: "scheduled", date: "2026-04-05", time: "20:00" },
    { id: 15, title: "Newsletter recap mensuel", platform: "facebook", type: "Article", status: "scheduled", date: "2026-03-26", time: "09:00" },
    { id: 16, title: "Carousel tips branding", platform: "instagram", type: "Carrousel", status: "published", date: "2026-03-10", time: "11:30" },
    { id: 17, title: "Thread stratégie contenu", platform: "twitter", type: "Article", status: "published", date: "2026-03-14", time: "13:00" },
    { id: 18, title: "Story poll préférences", platform: "instagram", type: "Story", status: "published", date: "2026-03-08", time: "18:00" },
    { id: 19, title: "Vlog journée type fondateur", platform: "youtube", type: "Vidéo", status: "scheduled", date: "2026-04-06", time: "12:00" },
    { id: 20, title: "Avant/Après retouche", platform: "tiktok", type: "Short", status: "draft", date: "2026-04-04", time: "16:30" },
    { id: 21, title: "Post motivation lundi", platform: "linkedin", type: "Photo", status: "scheduled", date: "2026-03-30", time: "07:30" },
    { id: 22, title: "Collab marque partenaire", platform: "instagram", type: "Photo", status: "scheduled", date: "2026-04-07", time: "10:00" },
    { id: 23, title: "Recap semaine en stories", platform: "instagram", type: "Story", status: "published", date: "2026-03-22", time: "20:00" },
    { id: 24, title: "Shorts comparatif produits", platform: "youtube", type: "Short", status: "published", date: "2026-03-20", time: "09:00" },
    { id: 25, title: "Annonce soldes flash", platform: "facebook", type: "Photo", status: "scheduled", date: "2026-03-28", time: "08:00" },
  ];
}

/* ─── Calendar helpers ─── */
const DAYS_FR = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];
const MONTHS_FR = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];

function getCalendarDays(year, month) {
  const first = new Date(year, month, 1);
  const last = new Date(year, month + 1, 0);
  let startDay = first.getDay() - 1;
  if (startDay < 0) startDay = 6;
  const days = [];
  for (let i = startDay - 1; i >= 0; i--) days.push({ date: new Date(year, month, -i), inMonth: false });
  for (let i = 1; i <= last.getDate(); i++) days.push({ date: new Date(year, month, i), inMonth: true });
  while (days.length < 42) {
    const d = new Date(year, month + 1, days.length - (startDay + last.getDate()) + 1);
    days.push({ date: d, inMonth: false });
  }
  return days;
}

function fmtKey(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
function isToday(d) {
  const t = new Date();
  return d.getFullYear() === t.getFullYear() && d.getMonth() === t.getMonth() && d.getDate() === t.getDate();
}

/* ─── Tokens ─── */
const T = {
  bg: "#08080b", bg1: "#0d0d12", bg2: "#131318", bg3: "#19191f",
  border: "#1e1e2a", borderH: "#2e2e3e",
  fg: "#ededf2", fg2: "#9494a6", fg3: "#56566a",
  accent: "#a78bfa", accentDim: "rgba(167,139,250,0.10)",
};

/* ─── Hook ─── */
function useClickOutside(ref, fn) {
  useEffect(() => {
    const h = e => { if (ref.current && !ref.current.contains(e.target)) fn(); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, [ref, fn]);
}

/* ─── Modal ─── */
function Modal({ open, onClose, children }) {
  if (!open) return null;
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", animation: "cFade .15s both" }} onClick={onClose}>
      <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(6px)" }} />
      <div style={{ position: "relative", width: "100%", maxWidth: 500, background: T.bg2, border: `1px solid ${T.border}`, borderRadius: 16, boxShadow: "0 32px 80px rgba(0,0,0,0.5)", animation: "cUp .25s cubic-bezier(.4,0,.2,1) both", maxHeight: "92vh", overflowY: "auto" }} onClick={e => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
}

/* ─── Event form ─── */
function EventForm({ item, onSave, onDelete, onClose, initDate }) {
  const [f, setF] = useState({ title: item?.title || "", platform: item?.platform || "instagram", type: item?.type || "Photo", status: item?.status || "scheduled", date: item?.date || initDate || "", time: item?.time || "10:00" });
  const u = (k, v) => setF(p => ({ ...p, [k]: v }));

  const inp = { width: "100%", padding: "10px 14px", fontSize: 13, fontFamily: "'Sora',sans-serif", background: T.bg1, border: `1px solid ${T.border}`, borderRadius: 9, color: T.fg, outline: "none", transition: "border-color .15s" };
  const lbl = { display: "block", fontSize: 10, fontWeight: 600, color: T.fg3, marginBottom: 5, letterSpacing: .8, textTransform: "uppercase" };

  return (
    <>
      <div style={{ padding: "22px 26px 16px", borderBottom: `1px solid ${T.border}` }}>
        <h2 style={{ fontSize: 16, fontWeight: 700, margin: 0 }}>{item?.id ? "Modifier" : "Nouveau contenu"}</h2>
        <p style={{ fontSize: 11, color: T.fg3, margin: "3px 0 0" }}>{item?.id ? "Mettez à jour cette publication" : "Planifiez un nouveau contenu"}</p>
      </div>
      <div style={{ padding: "18px 26px", display: "flex", flexDirection: "column", gap: 16 }}>
        <div>
          <label style={lbl}>Titre</label>
          <input value={f.title} onChange={e => u("title", e.target.value)} placeholder="Décrivez le contenu..." style={inp}
            onFocus={e => e.target.style.borderColor = T.accent} onBlur={e => e.target.style.borderColor = T.border} />
        </div>
        <div>
          <label style={lbl}>Plateforme</label>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
            {PLATFORMS.map(p => (
              <button key={p.id} onClick={() => u("platform", p.id)} style={{
                padding: "7px 12px", borderRadius: 7, fontSize: 11, fontWeight: 600, fontFamily: "inherit",
                border: f.platform === p.id ? `1.5px solid ${p.color}` : `1px solid ${T.border}`,
                background: f.platform === p.id ? p.bg : T.bg1, color: f.platform === p.id ? p.color : T.fg3,
                cursor: "pointer", transition: "all .15s", display: "flex", alignItems: "center", gap: 4,
              }}>
                <span style={{ fontSize: 8 }}>{p.icon}</span>{p.label}
              </button>
            ))}
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <div>
            <label style={lbl}>Type</label>
            <select value={f.type} onChange={e => u("type", e.target.value)} style={{ ...inp, appearance: "none", cursor: "pointer" }}>
              {CONTENT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label style={lbl}>Statut</label>
            <div style={{ display: "flex", gap: 5 }}>
              {STATUSES.map(s => (
                <button key={s.id} onClick={() => u("status", s.id)} style={{
                  flex: 1, padding: "8px 4px", borderRadius: 7, fontSize: 10, fontWeight: 600, fontFamily: "inherit",
                  border: f.status === s.id ? `1.5px solid ${s.color}` : `1px solid ${T.border}`,
                  background: f.status === s.id ? s.color + "14" : T.bg1, color: f.status === s.id ? s.color : T.fg3,
                  cursor: "pointer", transition: "all .15s",
                }}>{s.label}</button>
              ))}
            </div>
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <div>
            <label style={lbl}>Date</label>
            <input type="date" value={f.date} onChange={e => u("date", e.target.value)} style={{ ...inp, colorScheme: "dark" }}
              onFocus={e => e.target.style.borderColor = T.accent} onBlur={e => e.target.style.borderColor = T.border} />
          </div>
          <div>
            <label style={lbl}>Heure</label>
            <input type="time" value={f.time} onChange={e => u("time", e.target.value)} style={{ ...inp, colorScheme: "dark" }}
              onFocus={e => e.target.style.borderColor = T.accent} onBlur={e => e.target.style.borderColor = T.border} />
          </div>
        </div>
      </div>
      <div style={{ padding: "0 26px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: `1px solid ${T.border}`, paddingTop: 16 }}>
        <div>
          {item?.id && (
            <button onClick={() => onDelete(item.id)} style={{ fontSize: 11, color: "#f87171", background: "none", border: "none", cursor: "pointer", fontFamily: "inherit", fontWeight: 500, padding: "4px 8px", borderRadius: 6, transition: "background .15s" }}
              onMouseEnter={e => e.currentTarget.style.background = "rgba(248,113,113,0.08)"} onMouseLeave={e => e.currentTarget.style.background = "none"}>
              Supprimer
            </button>
          )}
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={onClose} style={{ padding: "9px 18px", borderRadius: 9, fontSize: 13, fontWeight: 500, fontFamily: "inherit", background: "none", border: `1px solid ${T.border}`, color: T.fg2, cursor: "pointer", transition: "all .15s" }}
            onMouseEnter={e => e.currentTarget.style.borderColor = T.borderH} onMouseLeave={e => e.currentTarget.style.borderColor = T.border}>Annuler</button>
          <button onClick={() => { if (f.title.trim() && f.date) onSave(f); }} style={{
            padding: "9px 22px", borderRadius: 9, fontSize: 13, fontWeight: 600, fontFamily: "inherit",
            background: T.accent, border: "none", color: "#fff", cursor: "pointer", transition: "all .15s",
            opacity: f.title.trim() && f.date ? 1 : 0.35,
          }} onMouseEnter={e => { if (f.title.trim()) e.currentTarget.style.background = "#9678f0"; }}
             onMouseLeave={e => e.currentTarget.style.background = T.accent}>
            {item?.id ? "Enregistrer" : "Ajouter"}
          </button>
        </div>
      </div>
    </>
  );
}

/* ─── Day Sidebar ─── */
function DaySidebar({ dateKey, items, onClose, onEdit, onAdd }) {
  const ref = useRef(null);
  useClickOutside(ref, onClose);
  if (!dateKey) return null;
  const lbl = new Date(dateKey + "T00:00:00").toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" });
  const sorted = [...items].sort((a, b) => (a.time || "").localeCompare(b.time || ""));

  return (
    <div ref={ref} style={{
      position: "fixed", right: 0, top: 0, bottom: 0, width: 370, zIndex: 150,
      background: T.bg2, borderLeft: `1px solid ${T.border}`, boxShadow: "-16px 0 50px rgba(0,0,0,0.4)",
      display: "flex", flexDirection: "column", animation: "cLeft .22s cubic-bezier(.4,0,.2,1) both",
    }}>
      <div style={{ padding: "20px 22px 14px", borderBottom: `1px solid ${T.border}`, display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <p style={{ fontSize: 10, fontWeight: 600, color: T.fg3, textTransform: "uppercase", letterSpacing: 1, margin: 0 }}>Détail du jour</p>
          <h3 style={{ fontSize: 15, fontWeight: 700, margin: "5px 0 0", textTransform: "capitalize" }}>{lbl}</h3>
          <p style={{ fontSize: 11, color: T.fg3, margin: "3px 0 0" }}>{sorted.length} publication{sorted.length !== 1 ? "s" : ""}</p>
        </div>
        <button onClick={onClose} style={{ background: "none", border: "none", color: T.fg3, cursor: "pointer", fontSize: 20, lineHeight: 1, padding: "2px 6px", borderRadius: 6 }}
          onMouseEnter={e => e.currentTarget.style.color = T.fg} onMouseLeave={e => e.currentTarget.style.color = T.fg3}>×</button>
      </div>
      <div style={{ flex: 1, padding: "14px 18px", overflowY: "auto" }}>
        {sorted.length === 0 && (
          <div style={{ textAlign: "center", padding: "48px 0", color: T.fg3 }}>
            <p style={{ fontSize: 32, margin: "0 0 8px", opacity: .25 }}>○</p>
            <p style={{ fontSize: 12 }}>Aucun contenu ce jour</p>
          </div>
        )}
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {sorted.map((it, i) => {
            const pl = PLATFORMS.find(p => p.id === it.platform);
            const st = STATUSES.find(s => s.id === it.status);
            return (
              <div key={it.id} onClick={() => onEdit(it)} style={{
                background: T.bg3, border: `1px solid ${T.border}`, borderRadius: 10, padding: "14px 16px",
                cursor: "pointer", transition: "all .15s", borderLeft: `3px solid ${pl?.color || T.fg3}`,
                animation: `cFade .3s ${i * 50}ms both`,
              }} onMouseEnter={e => { e.currentTarget.style.borderColor = T.borderH; e.currentTarget.style.transform = "translateX(-2px)"; }}
                 onMouseLeave={e => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.transform = "none"; }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 7 }}>
                  <span style={{ fontSize: 10, fontWeight: 600, color: pl?.color, background: pl?.bg, padding: "2px 8px", borderRadius: 5, display: "inline-flex", alignItems: "center", gap: 4 }}>
                    <span style={{ fontSize: 7 }}>{pl?.icon}</span>{pl?.label}
                  </span>
                  <span style={{ fontSize: 10, color: st?.color, fontWeight: 600 }}>{st?.dot} {st?.label}</span>
                </div>
                <p style={{ fontSize: 13, fontWeight: 500, color: T.fg, margin: "0 0 6px", lineHeight: 1.45 }}>{it.title}</p>
                <div style={{ display: "flex", gap: 14, fontSize: 10, color: T.fg3 }}>
                  <span>{it.time}</span>
                  <span>{it.type}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div style={{ padding: "14px 18px", borderTop: `1px solid ${T.border}` }}>
        <button onClick={onAdd} style={{
          width: "100%", padding: "10px", borderRadius: 9, fontSize: 13, fontWeight: 600, fontFamily: "'Sora',sans-serif",
          background: T.accentDim, border: `1px dashed ${T.accent}44`, color: T.accent,
          cursor: "pointer", transition: "all .15s", display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
        }} onMouseEnter={e => e.currentTarget.style.background = T.accent + "22"} onMouseLeave={e => e.currentTarget.style.background = T.accentDim}>
          + Ajouter du contenu
        </button>
      </div>
    </div>
  );
}

/* ─── Main Component ─── */
export default function ContentCalendar() {
  const [year, setYear] = useState(2026);
  const [month, setMonth] = useState(2);
  const [items, setItems] = useState(buildSampleData);
  const [activePlat, setActivePlat] = useState(new Set(PLATFORMS.map(p => p.id)));
  const [activeStat, setActiveStat] = useState(new Set(STATUSES.map(s => s.id)));
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [selDay, setSelDay] = useState(null);
  const [initDate, setInitDate] = useState("");

  const calDays = getCalendarDays(year, month);
  const toggle = (set, setter, id) => setter(prev => { const n = new Set(prev); if (n.has(id)) { if (n.size > 1) n.delete(id); } else n.add(id); return n; });

  const filtered = items.filter(it => activePlat.has(it.platform) && activeStat.has(it.status));
  const byDate = {};
  filtered.forEach(it => { if (!byDate[it.date]) byDate[it.date] = []; byDate[it.date].push(it); });

  const prev = () => { if (month === 0) { setMonth(11); setYear(y => y - 1); } else setMonth(m => m - 1); };
  const next = () => { if (month === 11) { setMonth(0); setYear(y => y + 1); } else setMonth(m => m + 1); };
  const today = () => { const t = new Date(); setYear(t.getFullYear()); setMonth(t.getMonth()); };

  const openNew = (d) => { setEditItem(null); setInitDate(d || ""); setModalOpen(true); };
  const openEdit = (it) => { setEditItem(it); setModalOpen(true); };
  const closeModal = () => { setModalOpen(false); setEditItem(null); };

  const save = (data) => {
    if (editItem?.id) setItems(p => p.map(i => i.id === editItem.id ? { ...i, ...data } : i));
    else setItems(p => [...p, { ...data, id: Date.now() }]);
    closeModal();
  };
  const del = (id) => { setItems(p => p.filter(i => i.id !== id)); closeModal(); };

  const mKey = `${year}-${String(month + 1).padStart(2, "0")}`;
  const mItems = items.filter(i => i.date?.startsWith(mKey));
  const stats = { total: mItems.length, sched: mItems.filter(i => i.status === "scheduled").length, pub: mItems.filter(i => i.status === "published").length, draft: mItems.filter(i => i.status === "draft").length };

  return (
    <div style={{  fontFamily: "inherit", color: T.fg }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&display=swap');
        @keyframes cFade { from{opacity:0} to{opacity:1} }
        @keyframes cUp { from{opacity:0;transform:translateY(14px) scale(.98)} to{opacity:1;transform:translateY(0) scale(1)} }
        @keyframes cLeft { from{opacity:0;transform:translateX(28px)} to{opacity:1;transform:translateX(0)} }
        @keyframes cCell { from{opacity:0;transform:scale(.97)} to{opacity:1;transform:scale(1)} }
        ::-webkit-scrollbar{width:5px;height:5px} ::-webkit-scrollbar-track{background:transparent} ::-webkit-scrollbar-thumb{background:${T.border};border-radius:3px}
        input[type="date"]::-webkit-calendar-picker-indicator, input[type="time"]::-webkit-calendar-picker-indicator{filter:invert(.5);cursor:pointer}
      `}</style>

      {/* Header */}
      <div style={{ padding: "22px 32px 18px", borderBottom: `1px solid ${T.border}`, background: `linear-gradient(180deg,${T.bg1},${T.bg})`, animation: "cFade .4s both" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 14 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 42, height: 42, borderRadius: 12, background: `linear-gradient(135deg,${T.accent},#c084fc)`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 0 24px ${T.accent}33` }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            </div>
            <div>
              <h1 style={{ fontSize: 21, fontWeight: 800, margin: 0, letterSpacing: -.5 }}>Calendrier de contenu</h1>
              <p style={{ fontSize: 12, color: T.fg3, margin: 0 }}>Planifiez et suivez vos publications multi-plateforme</p>
            </div>
          </div>
          <button onClick={() => openNew("")} style={{ display: "flex", alignItems: "center", gap: 7, padding: "9px 20px", borderRadius: 9, fontSize: 13, fontWeight: 600, fontFamily: "inherit", background: T.accent, border: "none", color: "#fff", cursor: "pointer", transition: "all .2s", boxShadow: `0 0 20px ${T.accent}22` }}
            onMouseEnter={e => { e.currentTarget.style.background = "#9678f0"; e.currentTarget.style.boxShadow = `0 0 30px ${T.accent}44`; }}
            onMouseLeave={e => { e.currentTarget.style.background = T.accent; e.currentTarget.style.boxShadow = `0 0 20px ${T.accent}22`; }}>
            + Nouveau contenu
          </button>
        </div>

        {/* Nav + Stats + Filters */}
        <div style={{ marginTop: 18, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <button onClick={prev} style={{ width: 30, height: 30, borderRadius: 7, background: T.bg2, border: `1px solid ${T.border}`, color: T.fg2, cursor: "pointer", fontSize: 15, display: "flex", alignItems: "center", justifyContent: "center", transition: "all .15s" }}
              onMouseEnter={e => e.currentTarget.style.borderColor = T.borderH} onMouseLeave={e => e.currentTarget.style.borderColor = T.border}>‹</button>
            <h2 style={{ fontSize: 16, fontWeight: 700, margin: 0, minWidth: 170, textAlign: "center" }}>{MONTHS_FR[month]} {year}</h2>
            <button onClick={next} style={{ width: 30, height: 30, borderRadius: 7, background: T.bg2, border: `1px solid ${T.border}`, color: T.fg2, cursor: "pointer", fontSize: 15, display: "flex", alignItems: "center", justifyContent: "center", transition: "all .15s" }}
              onMouseEnter={e => e.currentTarget.style.borderColor = T.borderH} onMouseLeave={e => e.currentTarget.style.borderColor = T.border}>›</button>
            <button onClick={today} style={{ padding: "4px 12px", borderRadius: 6, fontSize: 10, fontWeight: 600, fontFamily: "inherit", background: T.bg2, border: `1px solid ${T.border}`, color: T.fg2, cursor: "pointer", marginLeft: 2, transition: "all .15s" }}
              onMouseEnter={e => e.currentTarget.style.borderColor = T.borderH} onMouseLeave={e => e.currentTarget.style.borderColor = T.border}>Aujourd'hui</button>

            <div style={{ width: 1, height: 22, background: T.border, margin: "0 8px" }} />
            {[{ l: "Total", v: stats.total, c: T.fg }, { l: "Prog.", v: stats.sched, c: "#a78bfa" }, { l: "Pub.", v: stats.pub, c: "#34d399" }, { l: "Brouillons", v: stats.draft, c: "#fbbf24" }].map(s => (
              <div key={s.l} style={{ display: "flex", alignItems: "center", gap: 4, marginRight: 8 }}>
                <span style={{ fontSize: 16, fontWeight: 700, color: s.c, fontVariantNumeric: "tabular-nums" }}>{s.v}</span>
                <span style={{ fontSize: 10, color: T.fg3 }}>{s.l}</span>
              </div>
            ))}
          </div>

          <div style={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
            {PLATFORMS.map(p => {
              const on = activePlat.has(p.id);
              return (
                <button key={p.id} onClick={() => toggle(activePlat, setActivePlat, p.id)} style={{
                  padding: "4px 10px", borderRadius: 6, fontSize: 10, fontWeight: 600, fontFamily: "inherit",
                  border: on ? `1px solid ${p.color}55` : `1px solid ${T.border}`,
                  background: on ? p.bg : "transparent", color: on ? p.color : T.fg3,
                  cursor: "pointer", transition: "all .15s", opacity: on ? 1 : .45,
                }}>{p.label}</button>
              );
            })}
            <div style={{ width: 1, background: T.border, margin: "0 3px" }} />
            {STATUSES.map(s => {
              const on = activeStat.has(s.id);
              return (
                <button key={s.id} onClick={() => toggle(activeStat, setActiveStat, s.id)} style={{
                  padding: "4px 9px", borderRadius: 6, fontSize: 10, fontWeight: 600, fontFamily: "inherit",
                  border: on ? `1px solid ${s.color}55` : `1px solid ${T.border}`,
                  background: on ? s.color + "12" : "transparent", color: on ? s.color : T.fg3,
                  cursor: "pointer", transition: "all .15s", opacity: on ? 1 : .45,
                }}>{s.dot} {s.label}</button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Grid */}
      <div style={{ padding: "18px 32px 36px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 0, marginBottom: 1 }}>
          {DAYS_FR.map((d, i) => (
            <div key={d} style={{ padding: "8px 10px", fontSize: 10, fontWeight: 600, color: i >= 5 ? T.fg3 : T.fg2, textTransform: "uppercase", letterSpacing: 1.2, textAlign: "center" }}>{d}</div>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 1, background: T.border, borderRadius: 14, overflow: "hidden", border: `1px solid ${T.border}` }}>
          {calDays.map((day, idx) => {
            const key = fmtKey(day.date);
            const dItems = byDate[key] || [];
            const td = isToday(day.date);
            const max = 3;
            const extra = dItems.length - max;

            return (
              <div key={idx} onClick={() => setSelDay(key)} style={{
                background: td ? "rgba(167,139,250,0.035)" : T.bg1,
                minHeight: 108, padding: "5px 6px", cursor: "pointer", transition: "background .15s",
                opacity: day.inMonth ? 1 : .28, position: "relative",
                animation: `cCell .3s ${(Math.floor(idx / 7)) * 35 + (idx % 7) * 12}ms both`,
              }}
              onMouseEnter={e => { if (day.inMonth) e.currentTarget.style.background = T.bg2; }}
              onMouseLeave={e => { e.currentTarget.style.background = td ? "rgba(167,139,250,0.035)" : T.bg1; }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 3 }}>
                  <span style={{
                    fontSize: 11, fontWeight: td ? 700 : 500, color: td ? "#fff" : day.inMonth ? T.fg2 : T.fg3,
                    ...(td ? { background: T.accent, width: 22, height: 22, borderRadius: "50%", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 10 } : {}),
                  }}>{day.date.getDate()}</span>
                  {day.inMonth && dItems.length > 0 && (
                    <span style={{ fontSize: 9, color: T.fg3, fontWeight: 600, opacity: .6 }}>{dItems.length}</span>
                  )}
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  {dItems.slice(0, max).map(it => {
                    const pl = PLATFORMS.find(p => p.id === it.platform);
                    const st = STATUSES.find(s => s.id === it.status);
                    return (
                      <div key={it.id} onClick={e => { e.stopPropagation(); openEdit(it); }} style={{
                        padding: "3px 6px", borderRadius: 4, fontSize: 10, fontWeight: 500,
                        background: pl?.bg || T.bg3, color: pl?.color || T.fg2,
                        borderLeft: `2.5px solid ${pl?.color || T.fg3}`,
                        whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                        transition: "all .12s", cursor: "pointer", lineHeight: 1.4,
                        display: "flex", alignItems: "center", gap: 3,
                      }}
                      onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.03)"; e.currentTarget.style.boxShadow = `0 2px 8px ${pl?.color || T.fg3}22`; }}
                      onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; }}>
                        <span style={{ fontSize: 5, color: st?.color, flexShrink: 0 }}>{st?.dot}</span>
                        {it.title}
                      </div>
                    );
                  })}
                  {extra > 0 && (
                    <span style={{ fontSize: 9, color: T.fg3, fontWeight: 600, padding: "1px 6px" }}>+{extra} de plus</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div style={{ display: "flex", gap: 18, marginTop: 14, justifyContent: "center", flexWrap: "wrap" }}>
          {PLATFORMS.map(p => (
            <div key={p.id} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 10, color: T.fg3 }}>
              <div style={{ width: 10, height: 10, borderRadius: 3, background: p.bg, borderLeft: `2.5px solid ${p.color}` }} />
              {p.label}
            </div>
          ))}
          <div style={{ width: 1, background: T.border }} />
          {STATUSES.map(s => (
            <div key={s.id} style={{ display: "flex", alignItems: "center", gap: 3, fontSize: 10, color: T.fg3 }}>
              <span style={{ color: s.color, fontSize: 7 }}>{s.dot}</span>{s.label}
            </div>
          ))}
        </div>
      </div>

      {/* Sidebar */}
      {selDay && (
        <DaySidebar
          dateKey={selDay}
          items={filtered.filter(i => i.date === selDay)}
          onClose={() => setSelDay(null)}
          onEdit={it => { setSelDay(null); openEdit(it); }}
          onAdd={() => { const d = selDay; setSelDay(null); openNew(d); }}
        />
      )}

      {/* Modal */}
      <Modal open={modalOpen} onClose={closeModal}>
        <EventForm item={editItem} initDate={initDate} onSave={save} onDelete={del} onClose={closeModal} />
      </Modal>
    </div>
  );
}
