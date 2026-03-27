"use client";
// @ts-nocheck
import { useState, useEffect, useRef } from "react";

const COLUMNS = [
  { id: "backlog", label: "Backlog", color: "#6b7280", icon: "○" },
  { id: "draft", label: "Brouillons", color: "#f59e0b", icon: "◐" },
  { id: "scheduled", label: "Programmés", color: "#8b5cf6", icon: "◉" },
  { id: "published", label: "Publiés", color: "#10b981", icon: "●" },
];

const POST_TYPES = [
  { id: "photo", label: "Photo", emoji: "◻", color: "#60a5fa" },
  { id: "carousel", label: "Carrousel", emoji: "▣", color: "#c084fc" },
  { id: "reel", label: "Reel", emoji: "▶", color: "#f472b6" },
  { id: "story", label: "Story", emoji: "◯", color: "#34d399" },
];

const INITIAL_POSTS = [
  { id: 1, caption: "Lancement nouvelle collection printemps — shooting en studio avec la palette pastel et textures naturelles", type: "carousel", status: "scheduled", date: "2026-03-28", tags: ["collection", "printemps"] },
  { id: 2, caption: "Behind the scenes — préparation du shooting photo pour la campagne été 2026", type: "reel", status: "scheduled", date: "2026-03-30", tags: ["bts", "coulisses"] },
  { id: 3, caption: "Astuce du jour : comment créer une grille Instagram harmonieuse en 5 étapes simples", type: "carousel", status: "draft", date: "", tags: ["tips", "design"] },
  { id: 4, caption: "Collaboration avec @studio_créatif — teaser de la prochaine série limitée", type: "reel", status: "draft", date: "", tags: ["collab", "teaser"] },
  { id: 5, caption: "Retour sur notre événement pop-up du weekend — merci à tous les visiteurs !", type: "photo", status: "published", date: "2026-03-20", tags: ["event", "popup"] },
  { id: 6, caption: "Unboxing du nouveau packaging éco-responsable — vos retours nous importent", type: "reel", status: "published", date: "2026-03-18", tags: ["packaging", "eco"] },
  { id: 7, caption: "Idée : série de posts éducatifs sur les tendances mode durables en 2026", type: "photo", status: "backlog", tags: ["idée", "durable"] },
  { id: 8, caption: "Concept : mini-documentaire sur le processus de fabrication artisanale", type: "reel", status: "backlog", tags: ["concept", "artisanal"] },
  { id: 9, caption: "Partenariat avec un influenceur food — cross-promotion lifestyle", type: "story", status: "backlog", tags: ["partenariat", "food"] },
  { id: 10, caption: "Résultats du sondage communauté — ce que vous voulez voir en avril", type: "story", status: "published", date: "2026-03-22", tags: ["communauté", "sondage"] },
  { id: 11, caption: "Sneak peek collection capsule — 3 pièces exclusives révélées demain", type: "story", status: "scheduled", date: "2026-04-01", tags: ["capsule", "exclu"] },
  { id: 12, caption: "Rétrospective Q1 — nos meilleurs moments et les leçons apprises", type: "carousel", status: "draft", date: "", tags: ["rétro", "Q1"] },
];

function formatDate(d) {
  if (!d) return "";
  const date = new Date(d + "T00:00:00");
  return date.toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
}

function daysUntil(d) {
  if (!d) return null;
  const now = new Date(); now.setHours(0,0,0,0);
  const target = new Date(d + "T00:00:00");
  return Math.ceil((target - now) / 86400000);
}

function PostCard({ post, onEdit, onMove, onDelete, index }) {
  const typeInfo = POST_TYPES.find(t => t.id === post.type) || POST_TYPES[0];
  const days = daysUntil(post.date);
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    if (!showMenu) return;
    const handler = (e) => { if (menuRef.current && !menuRef.current.contains(e.target)) setShowMenu(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [showMenu]);

  return (
    <div style={{
      background: "#16161a",
      border: "1px solid #232329",
      borderRadius: 10,
      padding: "14px 16px",
      cursor: "pointer",
      transition: "all 0.2s cubic-bezier(.4,0,.2,1)",
      position: "relative",
      animation: `cardIn 0.35s ${index * 0.04}s both`,
    }}
    onMouseEnter={e => { e.currentTarget.style.borderColor = "#3a3a44"; e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 6px 24px rgba(0,0,0,0.35)"; }}
    onMouseLeave={e => { e.currentTarget.style.borderColor = "#232329"; e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
    onClick={() => onEdit(post)}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
        <span style={{
          display: "inline-flex", alignItems: "center", gap: 5,
          fontSize: 11, fontWeight: 600, letterSpacing: 0.3,
          color: typeInfo.color, background: typeInfo.color + "15",
          padding: "3px 9px", borderRadius: 6,
        }}>
          <span style={{ fontSize: 9 }}>{typeInfo.emoji}</span>
          {typeInfo.label}
        </span>

        <div ref={menuRef} style={{ position: "relative" }}>
          <button onClick={e => { e.stopPropagation(); setShowMenu(!showMenu); }}
            style={{ background: "none", border: "none", color: "#555", cursor: "pointer", padding: "2px 4px", fontSize: 16, lineHeight: 1, borderRadius: 4 }}
            onMouseEnter={e => e.currentTarget.style.color = "#999"}
            onMouseLeave={e => e.currentTarget.style.color = "#555"}
          >⋮</button>
          {showMenu && (
            <div style={{
              position: "absolute", right: 0, top: "100%", marginTop: 4,
              background: "#1e1e24", border: "1px solid #2e2e36", borderRadius: 8,
              padding: 4, minWidth: 160, zIndex: 50,
              boxShadow: "0 12px 40px rgba(0,0,0,0.5)",
            }}>
              {COLUMNS.filter(c => c.id !== post.status).map(c => (
                <button key={c.id}
                  onClick={e => { e.stopPropagation(); onMove(post.id, c.id); setShowMenu(false); }}
                  style={{
                    display: "flex", alignItems: "center", gap: 8, width: "100%",
                    padding: "8px 12px", background: "none", border: "none",
                    color: "#b0b0ba", fontSize: 12, cursor: "pointer", borderRadius: 6, textAlign: "left",
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = "#27272f"; e.currentTarget.style.color = "#eee"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "none"; e.currentTarget.style.color = "#b0b0ba"; }}
                >
                  <span style={{ color: c.color, fontSize: 10 }}>{c.icon}</span>
                  Vers {c.label}
                </button>
              ))}
              <div style={{ height: 1, background: "#2e2e36", margin: "4px 0" }} />
              <button
                onClick={e => { e.stopPropagation(); onDelete(post.id); setShowMenu(false); }}
                style={{
                  display: "flex", alignItems: "center", gap: 8, width: "100%",
                  padding: "8px 12px", background: "none", border: "none",
                  color: "#ef4444", fontSize: 12, cursor: "pointer", borderRadius: 6, textAlign: "left",
                }}
                onMouseEnter={e => e.currentTarget.style.background = "#2a1515"}
                onMouseLeave={e => e.currentTarget.style.background = "none"}
              >
                Supprimer
              </button>
            </div>
          )}
        </div>
      </div>

      <p style={{ fontSize: 13, lineHeight: 1.55, color: "#d4d4dc", margin: 0, marginBottom: 10, display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
        {post.caption}
      </p>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: post.date ? 10 : 0 }}>
        {(post.tags || []).map(tag => (
          <span key={tag} style={{ fontSize: 10, color: "#72727e", background: "#1e1e24", padding: "2px 7px", borderRadius: 4 }}>#{tag}</span>
        ))}
      </div>

      {post.date && (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontSize: 11, color: "#72727e" }}>{formatDate(post.date)}</span>
          {days !== null && post.status === "scheduled" && (
            <span style={{
              fontSize: 10, fontWeight: 600, padding: "2px 7px", borderRadius: 4,
              color: days <= 1 ? "#fbbf24" : days <= 3 ? "#8b5cf6" : "#72727e",
              background: days <= 1 ? "#fbbf2412" : days <= 3 ? "#8b5cf612" : "transparent",
            }}>
              {days === 0 ? "Aujourd'hui" : days === 1 ? "Demain" : days < 0 ? "Passé" : `J-${days}`}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

function Modal({ isOpen, onClose, children }) {
  if (!isOpen) return null;
  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 100,
      display: "flex", alignItems: "center", justifyContent: "center",
      animation: "fadeIn 0.2s both",
    }} onClick={onClose}>
      <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.65)", backdropFilter: "blur(4px)" }} />
      <div style={{
        position: "relative", width: "100%", maxWidth: 520,
        background: "#16161a", border: "1px solid #2a2a32",
        borderRadius: 14, padding: 0,
        boxShadow: "0 24px 80px rgba(0,0,0,0.6)",
        animation: "slideUp 0.3s cubic-bezier(.4,0,.2,1) both",
        maxHeight: "90vh", overflowY: "auto",
      }} onClick={e => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
}

function PostForm({ post, onSave, onClose }) {
  const [form, setForm] = useState({
    caption: post?.caption || "",
    type: post?.type || "photo",
    status: post?.status || "backlog",
    date: post?.date || "",
    tags: (post?.tags || []).join(", "),
  });

  const update = (key, val) => setForm(prev => ({ ...prev, [key]: val }));

  const handleSubmit = () => {
    if (!form.caption.trim()) return;
    onSave({
      ...post,
      caption: form.caption.trim(),
      type: form.type,
      status: form.status,
      date: form.date,
      tags: form.tags.split(",").map(t => t.trim()).filter(Boolean),
    });
  };

  const inputStyle = {
    width: "100%", padding: "10px 14px", fontSize: 13,
    background: "#111114", border: "1px solid #2a2a32", borderRadius: 8,
    color: "#e4e4ec", outline: "none", transition: "border-color 0.15s",
    fontFamily: "inherit",
  };

  const labelStyle = { display: "block", fontSize: 11, fontWeight: 600, color: "#8b8b9a", marginBottom: 6, letterSpacing: 0.4, textTransform: "uppercase" };

  return (
    <>
      <div style={{ padding: "22px 28px 0", borderBottom: "1px solid #232329", paddingBottom: 18 }}>
        <h2 style={{ fontSize: 17, fontWeight: 700, color: "#f0f0f0", margin: 0, letterSpacing: -0.3 }}>
          {post?.id ? "Modifier la publication" : "Nouvelle idée de post"}
        </h2>
        <p style={{ fontSize: 12, color: "#62626e", margin: "4px 0 0" }}>
          {post?.id ? "Mettez à jour les détails de cette publication." : "Ajoutez une nouvelle idée à votre pipeline de contenu."}
        </p>
      </div>

      <div style={{ padding: "20px 28px", display: "flex", flexDirection: "column", gap: 18 }}>
        <div>
          <label style={labelStyle}>Légende</label>
          <textarea
            value={form.caption}
            onChange={e => update("caption", e.target.value)}
            placeholder="Décrivez votre idée de post..."
            rows={3}
            style={{ ...inputStyle, resize: "vertical", lineHeight: 1.55 }}
            onFocus={e => e.target.style.borderColor = "#8b5cf6"}
            onBlur={e => e.target.style.borderColor = "#2a2a32"}
          />
          <div style={{ textAlign: "right", fontSize: 10, color: form.caption.length > 2200 ? "#ef4444" : "#555", marginTop: 4 }}>
            {form.caption.length} / 2 200
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <div>
            <label style={labelStyle}>Type de publication</label>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
              {POST_TYPES.map(t => (
                <button key={t.id}
                  onClick={() => update("type", t.id)}
                  style={{
                    padding: "8px 10px", borderRadius: 8, fontSize: 12, fontWeight: 500,
                    border: form.type === t.id ? `1.5px solid ${t.color}` : "1px solid #2a2a32",
                    background: form.type === t.id ? t.color + "12" : "#111114",
                    color: form.type === t.id ? t.color : "#8b8b9a",
                    cursor: "pointer", transition: "all 0.15s", display: "flex", alignItems: "center", gap: 5,
                    fontFamily: "inherit",
                  }}
                >
                  <span style={{ fontSize: 9 }}>{t.emoji}</span>{t.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label style={labelStyle}>Statut</label>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
              {COLUMNS.map(c => (
                <button key={c.id}
                  onClick={() => update("status", c.id)}
                  style={{
                    padding: "8px 10px", borderRadius: 8, fontSize: 12, fontWeight: 500,
                    border: form.status === c.id ? `1.5px solid ${c.color}` : "1px solid #2a2a32",
                    background: form.status === c.id ? c.color + "12" : "#111114",
                    color: form.status === c.id ? c.color : "#8b8b9a",
                    cursor: "pointer", transition: "all 0.15s", display: "flex", alignItems: "center", gap: 5,
                    fontFamily: "inherit",
                  }}
                >
                  <span style={{ fontSize: 9 }}>{c.icon}</span>{c.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <div>
            <label style={labelStyle}>Date programmée</label>
            <input
              type="date"
              value={form.date}
              onChange={e => update("date", e.target.value)}
              style={{ ...inputStyle, colorScheme: "dark" }}
              onFocus={e => e.target.style.borderColor = "#8b5cf6"}
              onBlur={e => e.target.style.borderColor = "#2a2a32"}
            />
          </div>
          <div>
            <label style={labelStyle}>Tags (séparés par des virgules)</label>
            <input
              type="text"
              value={form.tags}
              onChange={e => update("tags", e.target.value)}
              placeholder="mode, lifestyle, promo"
              style={inputStyle}
              onFocus={e => e.target.style.borderColor = "#8b5cf6"}
              onBlur={e => e.target.style.borderColor = "#2a2a32"}
            />
          </div>
        </div>
      </div>

      <div style={{ padding: "0 28px 22px", display: "flex", justifyContent: "flex-end", gap: 10, borderTop: "1px solid #232329", paddingTop: 18 }}>
        <button onClick={onClose}
          style={{
            padding: "9px 20px", borderRadius: 8, fontSize: 13, fontWeight: 500,
            background: "none", border: "1px solid #2a2a32", color: "#8b8b9a",
            cursor: "pointer", fontFamily: "inherit", transition: "all 0.15s",
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = "#444"; e.currentTarget.style.color = "#ccc"; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = "#2a2a32"; e.currentTarget.style.color = "#8b8b9a"; }}
        >Annuler</button>
        <button onClick={handleSubmit}
          style={{
            padding: "9px 24px", borderRadius: 8, fontSize: 13, fontWeight: 600,
            background: "#8b5cf6", border: "none", color: "#fff",
            cursor: "pointer", fontFamily: "inherit", transition: "all 0.15s",
            opacity: form.caption.trim() ? 1 : 0.4,
          }}
          onMouseEnter={e => { if (form.caption.trim()) e.currentTarget.style.background = "#7c3aed"; }}
          onMouseLeave={e => e.currentTarget.style.background = "#8b5cf6"}
          disabled={!form.caption.trim()}
        >
          {post?.id ? "Enregistrer" : "Ajouter"}
        </button>
      </div>
    </>
  );
}

export default function InstagramBoard() {
  const [posts, setPosts] = useState(INITIAL_POSTS);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const openNew = () => { setEditingPost(null); setModalOpen(true); };
  const openEdit = (post) => { setEditingPost(post); setModalOpen(true); };
  const closeModal = () => { setModalOpen(false); setEditingPost(null); };

  const handleSave = (data) => {
    if (data.id) {
      setPosts(prev => prev.map(p => p.id === data.id ? data : p));
    } else {
      setPosts(prev => [...prev, { ...data, id: Date.now() }]);
    }
    closeModal();
  };

  const handleMove = (id, newStatus) => {
    setPosts(prev => prev.map(p => p.id === id ? { ...p, status: newStatus } : p));
  };

  const handleDelete = (id) => {
    setPosts(prev => prev.filter(p => p.id !== id));
  };

  const filtered = posts.filter(p => {
    if (filter !== "all" && p.type !== filter) return false;
    if (searchQuery && !p.caption.toLowerCase().includes(searchQuery.toLowerCase()) && !(p.tags || []).some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))) return false;
    return true;
  });

  const totalByStatus = {};
  COLUMNS.forEach(c => { totalByStatus[c.id] = filtered.filter(p => p.status === c.id).length; });

  return (
    <div style={{
      
      fontFamily: "inherit", color: "#e4e4ec",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap');
        @keyframes fadeIn { from { opacity:0 } to { opacity:1 } }
        @keyframes slideUp { from { opacity:0; transform:translateY(16px) scale(0.98) } to { opacity:1; transform:translateY(0) scale(1) } }
        @keyframes cardIn { from { opacity:0; transform:translateY(8px) } to { opacity:1; transform:translateY(0) } }
        @keyframes headerIn { from { opacity:0; transform:translateY(-8px) } to { opacity:1; transform:translateY(0) } }
        ::-webkit-scrollbar { width:5px }
        ::-webkit-scrollbar-track { background:transparent }
        ::-webkit-scrollbar-thumb { background:#2a2a32; border-radius:3px }
        ::-webkit-scrollbar-thumb:hover { background:#3a3a44 }
      `}</style>

      {/* Header */}
      <div style={{
        padding: "24px 32px 20px", borderBottom: "1px solid #1a1a20",
        background: "linear-gradient(180deg, #111116 0%, #0c0c0f 100%)",
        animation: "headerIn 0.4s both",
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{
              width: 42, height: 42, borderRadius: 12,
              background: "linear-gradient(135deg, #8b5cf6 0%, #c084fc 100%)",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 0 24px rgba(139,92,246,0.2)",
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5"/>
                <circle cx="12" cy="12" r="5"/>
                <circle cx="17.5" cy="6.5" r="1.5" fill="white" stroke="none"/>
              </svg>
            </div>
            <div>
              <h1 style={{ fontSize: 21, fontWeight: 700, margin: 0, letterSpacing: -0.5 }}>Instagram Board</h1>
              <p style={{ fontSize: 12, color: "#62626e", margin: 0 }}>Gérez votre pipeline de contenu Instagram</p>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {/* Search */}
            <div style={{ position: "relative" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="2.2" style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }}>
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              <input
                type="text" placeholder="Rechercher..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                style={{
                  padding: "8px 14px 8px 34px", fontSize: 12,
                  background: "#16161a", border: "1px solid #232329", borderRadius: 8,
                  color: "#e4e4ec", outline: "none", width: 180, fontFamily: "inherit",
                  transition: "border-color 0.15s",
                }}
                onFocus={e => e.target.style.borderColor = "#8b5cf6"}
                onBlur={e => e.target.style.borderColor = "#232329"}
              />
            </div>

            {/* Type filter pills */}
            <div style={{ display: "flex", gap: 4, background: "#16161a", border: "1px solid #232329", borderRadius: 8, padding: 3 }}>
              <button onClick={() => setFilter("all")}
                style={{
                  padding: "5px 12px", borderRadius: 6, fontSize: 11, fontWeight: 500,
                  background: filter === "all" ? "#27272f" : "transparent",
                  border: "none", color: filter === "all" ? "#e4e4ec" : "#62626e",
                  cursor: "pointer", fontFamily: "inherit", transition: "all 0.15s",
                }}>Tous</button>
              {POST_TYPES.map(t => (
                <button key={t.id} onClick={() => setFilter(t.id)}
                  style={{
                    padding: "5px 10px", borderRadius: 6, fontSize: 11, fontWeight: 500,
                    background: filter === t.id ? t.color + "18" : "transparent",
                    border: "none", color: filter === t.id ? t.color : "#62626e",
                    cursor: "pointer", fontFamily: "inherit", transition: "all 0.15s",
                  }}>{t.label}</button>
              ))}
            </div>

            {/* Add button */}
            <button onClick={openNew}
              style={{
                display: "flex", alignItems: "center", gap: 7,
                padding: "8px 18px", borderRadius: 8, fontSize: 13, fontWeight: 600,
                background: "#8b5cf6", border: "none", color: "#fff",
                cursor: "pointer", fontFamily: "inherit",
                transition: "all 0.2s",
                boxShadow: "0 0 20px rgba(139,92,246,0.15)",
              }}
              onMouseEnter={e => { e.currentTarget.style.background = "#7c3aed"; e.currentTarget.style.boxShadow = "0 0 28px rgba(139,92,246,0.3)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "#8b5cf6"; e.currentTarget.style.boxShadow = "0 0 20px rgba(139,92,246,0.15)"; }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              Nouveau post
            </button>
          </div>
        </div>

        {/* Summary stats */}
        <div style={{ display: "flex", gap: 20, marginTop: 18 }}>
          {COLUMNS.map(c => (
            <div key={c.id} style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 10, color: c.color }}>{c.icon}</span>
              <span style={{ fontSize: 20, fontWeight: 700, color: "#f0f0f0", letterSpacing: -0.5 }}>{totalByStatus[c.id]}</span>
              <span style={{ fontSize: 11, color: "#62626e", fontWeight: 500 }}>{c.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Board columns */}
      <div style={{
        display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 0,
        minHeight: "calc(100vh - 160px)",
      }}>
        {COLUMNS.map((col, colIdx) => {
          const colPosts = filtered
            .filter(p => p.status === col.id)
            .sort((a, b) => {
              if (a.date && b.date) return new Date(a.date) - new Date(b.date);
              if (a.date) return -1;
              if (b.date) return 1;
              return 0;
            });

          return (
            <div key={col.id} style={{
              borderRight: colIdx < 3 ? "1px solid #1a1a20" : "none",
              display: "flex", flexDirection: "column",
            }}>
              {/* Column header */}
              <div style={{
                padding: "16px 18px 12px",
                display: "flex", alignItems: "center", justifyContent: "space-between",
                borderBottom: "1px solid #1a1a20",
                position: "sticky", top: 0, zIndex: 10,
                background: "#0c0c0f",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: col.color, boxShadow: `0 0 8px ${col.color}44` }} />
                  <span style={{ fontSize: 13, fontWeight: 600, color: "#d4d4dc" }}>{col.label}</span>
                  <span style={{
                    fontSize: 10, fontWeight: 600, color: "#62626e",
                    background: "#1a1a20", padding: "2px 7px", borderRadius: 10, minWidth: 18, textAlign: "center",
                  }}>{colPosts.length}</span>
                </div>
                <button onClick={openNew}
                  style={{
                    background: "none", border: "none", color: "#444",
                    cursor: "pointer", padding: "2px 4px", fontSize: 18, lineHeight: 1,
                    borderRadius: 4, transition: "color 0.15s",
                  }}
                  onMouseEnter={e => e.currentTarget.style.color = "#999"}
                  onMouseLeave={e => e.currentTarget.style.color = "#444"}
                >+</button>
              </div>

              {/* Cards */}
              <div style={{
                padding: "12px 12px", flex: 1,
                display: "flex", flexDirection: "column", gap: 8,
                overflowY: "auto",
              }}>
                {colPosts.map((post, i) => (
                  <PostCard
                    key={post.id}
                    post={post}
                    index={i}
                    onEdit={openEdit}
                    onMove={handleMove}
                    onDelete={handleDelete}
                  />
                ))}
                {colPosts.length === 0 && (
                  <div style={{
                    flex: 1, display: "flex", flexDirection: "column",
                    alignItems: "center", justifyContent: "center",
                    padding: "40px 20px", textAlign: "center",
                    opacity: 0.4,
                  }}>
                    <div style={{ fontSize: 28, marginBottom: 8 }}>{col.icon}</div>
                    <p style={{ fontSize: 12, color: "#62626e" }}>Aucun post ici</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal */}
      <Modal isOpen={modalOpen} onClose={closeModal}>
        <PostForm post={editingPost} onSave={handleSave} onClose={closeModal} />
      </Modal>
    </div>
  );
}
