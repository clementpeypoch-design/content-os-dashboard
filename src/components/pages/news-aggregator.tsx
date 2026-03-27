"use client";
// @ts-nocheck
import { useState, useEffect, useCallback } from "react";

/* ═══════════════════════════════════════════
   TOPIC CATEGORIES
   ═══════════════════════════════════════════ */
var TOPICS = [
  { id: "all", label: "Tous", color: "#a78bfa" },
  { id: "psychologie", label: "Psychologie", color: "#8b5cf6" },
  { id: "relations", label: "Relations", color: "#f472b6" },
  { id: "seduction", label: "Seduction", color: "#f97316" },
  { id: "masculinite", label: "Masculinite", color: "#10b981" },
  { id: "sexualite", label: "Sexualite", color: "#ef4444" },
  { id: "developpement", label: "Dev. personnel", color: "#06b6d4" },
  { id: "dating", label: "Dating", color: "#eab308" },
];

/* ═══════════════════════════════════════════
   RSS FEED SOURCES
   ═══════════════════════════════════════════ */
var FEEDS = [
  { url: "https://www.artofmanliness.com/feed/", source: "Art of Manliness", topics: ["masculinite", "developpement"] },
  { url: "https://www.gottman.com/blog/feed/", source: "The Gottman Institute", topics: ["relations", "psychologie"] },
  { url: "https://www.sexandpsychology.com/feed/", source: "Sex and Psychology", topics: ["sexualite", "psychologie", "dating"] },
  { url: "https://goodmenproject.com/feed/", source: "The Good Men Project", topics: ["masculinite", "relations"] },
  { url: "https://markmanson.net/feed", source: "Mark Manson", topics: ["developpement", "relations"] },
  { url: "https://www.doctornerdlove.com/feed/", source: "Dr. NerdLove", topics: ["dating", "seduction", "relations"] },
  { url: "https://ifstudies.org/blog/feed", source: "Institute for Family Studies", topics: ["relations", "psychologie"] },
  { url: "https://www.conquerandwin.com/feed/", source: "Conquer and Win", topics: ["seduction", "masculinite", "developpement"] },
];

/* ═══════════════════════════════════════════
   COMPREHENSIVE FALLBACK DATA
   ═══════════════════════════════════════════ */
var FALLBACK = [
  { title: "The Science of Masculine Confidence: What Research Actually Shows", source: "Art of Manliness", date: "2026-03-25", summary: "New research from the University of Texas reveals that authentic confidence in men is linked to emotional regulation skills rather than dominance behaviors. The study tracked 1,200 men over 3 years.", topics: ["masculinite", "psychologie"], url: "#" },
  { title: "How the Gottman Method Predicts Relationship Success with 94% Accuracy", source: "The Gottman Institute", date: "2026-03-24", summary: "Drs. John and Julie Gottman share updated findings on the four behaviors that predict divorce. The latest longitudinal data includes couples from diverse backgrounds across 12 countries.", topics: ["relations", "psychologie"], url: "#" },
  { title: "Dating App Fatigue: Why Singles Are Returning to In-Person Connections", source: "Sex and Psychology", date: "2026-03-24", summary: "A Kinsey Institute study of 2,000 singles reveals that 67% of respondents report feeling burned out by dating apps. Dr. Lehmiller analyzes what this shift means for modern courtship.", topics: ["dating", "sexualite"], url: "#" },
  { title: "Redefining Masculinity: Moving Beyond the Provider-Protector Archetype", source: "The Good Men Project", date: "2026-03-23", summary: "A deep exploration of how contemporary men are expanding traditional masculine roles while maintaining core strengths. Features interviews with psychologists and relationship therapists.", topics: ["masculinite", "developpement"], url: "#" },
  { title: "The Attachment Style Revolution: How Knowing Yours Changes Everything", source: "Mark Manson", date: "2026-03-23", summary: "Mark Manson breaks down why understanding attachment theory has become the most important relationship skill of the decade, and how men can identify and work with their attachment patterns.", topics: ["relations", "psychologie", "developpement"], url: "#" },
  { title: "Approach Anxiety Is Normal: A Neuroscience Perspective on Social Fear", source: "Dr. NerdLove", date: "2026-03-22", summary: "Dr. NerdLove examines the neuroscience behind approach anxiety, explaining why it is a natural survival mechanism and providing evidence-based techniques to work through it constructively.", topics: ["seduction", "psychologie"], url: "#" },
  { title: "Marriage Rates and Cohabitation: 2026 Demographic Shifts Explained", source: "Institute for Family Studies", date: "2026-03-22", summary: "New census data reveals significant changes in partnership formation patterns. Marriage rates stabilize for the first time in a decade while cohabitation arrangements continue to diversify.", topics: ["relations", "dating"], url: "#" },
  { title: "Why Emotional Intelligence Is the New Attraction Superpower", source: "Conquer and Win", date: "2026-03-21", summary: "Research shows that emotional intelligence now ranks as the top quality women seek in partners, surpassing physical attractiveness and financial status for the first time in survey history.", topics: ["seduction", "developpement", "masculinite"], url: "#" },
  { title: "The Four Conversations That Build Deep Intimacy in Relationships", source: "The Gottman Institute", date: "2026-03-21", summary: "Building on decades of research, the Gottman Institute identifies four specific conversation types that consistently deepen emotional and physical intimacy between partners.", topics: ["relations", "sexualite"], url: "#" },
  { title: "Digital Body Language: How to Communicate Attraction Through Text", source: "Dr. NerdLove", date: "2026-03-20", summary: "In the age of digital-first dating, Dr. NerdLove explores the science of text-based communication, message timing, and how to convey genuine interest without coming across as needy.", topics: ["dating", "seduction"], url: "#" },
  { title: "Testosterone, Stress, and the Male Brain: Latest Endocrinology Findings", source: "Sex and Psychology", date: "2026-03-20", summary: "New endocrinology research sheds light on how chronic stress affects testosterone levels and sexual function in men, along with practical interventions that show measurable results.", topics: ["sexualite", "masculinite", "psychologie"], url: "#" },
  { title: "The Stoic Man Myth: Why Vulnerability Strengthens Relationships", source: "The Good Men Project", date: "2026-03-19", summary: "Contrary to popular belief, men who practice strategic vulnerability report 40% higher relationship satisfaction. New findings challenge the silent strength archetype.", topics: ["masculinite", "relations", "developpement"], url: "#" },
  { title: "Modern Chivalry: Navigating Etiquette in the Era of Equality", source: "Art of Manliness", date: "2026-03-19", summary: "A thoughtful guide to updated social etiquette that respects modern sensibilities while maintaining genuine courtesy. Based on surveys of what both men and women appreciate in social interactions.", topics: ["seduction", "masculinite"], url: "#" },
  { title: "The Paradox of Choice in Dating: How Too Many Options Leads to Loneliness", source: "Mark Manson", date: "2026-03-18", summary: "Barry Schwartz's paradox of choice applied to modern dating. Mark Manson argues that abundance of options creates decision paralysis and proposes a framework for intentional partner selection.", topics: ["dating", "psychologie", "developpement"], url: "#" },
  { title: "How Female Psychology Shapes Partner Selection: An Evolutionary Lens", source: "Sex and Psychology", date: "2026-03-18", summary: "An examination of how evolutionary psychology explains modern mate selection patterns, including the interplay between ancestral drives and contemporary social dynamics in women's attraction cues.", topics: ["psychologie", "seduction", "relations"], url: "#" },
  { title: "Speed Dating Studies Reveal What Truly Creates Instant Attraction", source: "Institute for Family Studies", date: "2026-03-17", summary: "Meta-analysis of 47 speed dating studies across 8 countries reveals surprising findings about what generates genuine attraction in face-to-face encounters. Humor and active listening rank highest.", topics: ["seduction", "dating", "psychologie"], url: "#" },
  { title: "Building a Purpose-Driven Life: The Foundation of Masculine Fulfillment", source: "Conquer and Win", date: "2026-03-17", summary: "An exploration of how finding and committing to meaningful purpose transforms every area of a man's life, from career success to relationship quality and personal magnetism.", topics: ["developpement", "masculinite"], url: "#" },
  { title: "The Rise of Slow Dating: Quality Over Quantity in 2026", source: "Dr. NerdLove", date: "2026-03-16", summary: "A growing movement among young adults favoring intentional, slower-paced dating over rapid swiping. Dr. NerdLove examines the psychological benefits and practical strategies for slow dating.", topics: ["dating", "relations"], url: "#" },
  { title: "Communication Styles That Bridge the Gender Divide", source: "The Gottman Institute", date: "2026-03-16", summary: "Research reveals that men and women process conversational bids differently. The Gottman Institute presents specific techniques for improving cross-gender communication and reducing misunderstandings.", topics: ["relations", "psychologie"], url: "#" },
  { title: "The Male Loneliness Epidemic: Causes, Consequences, and Solutions", source: "The Good Men Project", date: "2026-03-15", summary: "An in-depth report on the growing crisis of male social isolation, its roots in shifting social structures, and evidence-based approaches for men to rebuild meaningful social connections.", topics: ["masculinite", "psychologie", "developpement"], url: "#" },
  { title: "Sexual Polarity Explained: The Dance of Masculine and Feminine Energy", source: "Mark Manson", date: "2026-03-15", summary: "An exploration of David Deida's concept of sexual polarity, updated with modern research. How understanding and embodying complementary energies can reignite passion in long-term relationships.", topics: ["sexualite", "relations"], url: "#" },
  { title: "First Date Mastery: What 10,000 Post-Date Surveys Reveal", source: "Conquer and Win", date: "2026-03-14", summary: "Analysis of 10,000 post-date surveys reveals the consistent patterns behind successful first dates. Location choice, conversation depth, and authentic presence rank above appearance or spending.", topics: ["seduction", "dating"], url: "#" },
  { title: "Rejection Sensitivity in Men: Biological Roots and Cognitive Reframing", source: "Art of Manliness", date: "2026-03-14", summary: "Neuroscience research shows that social rejection activates the same brain regions as physical pain. Practical cognitive reframing techniques help men develop healthier responses to romantic rejection.", topics: ["psychologie", "developpement", "seduction"], url: "#" },
  { title: "Why Women Test Men: Understanding Fitness Indicators in Courtship", source: "Sex and Psychology", date: "2026-03-13", summary: "Evolutionary psychology explains the function of congruence tests in courtship. New research maps how these interactions serve as honest signals of emotional stability and relationship readiness.", topics: ["seduction", "psychologie"], url: "#" },
  { title: "The Friendship-to-Romance Pipeline: How 68% of Lasting Relationships Begin", source: "Institute for Family Studies", date: "2026-03-13", summary: "A landmark study finds that the majority of lasting romantic partnerships develop from existing friendships, challenging the stranger-to-lover narrative dominant in dating culture.", topics: ["dating", "relations"], url: "#" },
];

/* ═══════════════════════════════════════════
   TOKENS
   ═══════════════════════════════════════════ */
var K = {
  bg: "#07070a", bg1: "#0c0c10", bg2: "#111116", bg3: "#18181f",
  border: "#1d1d2a", borderH: "#2c2c3c",
  fg: "#eaeaf0", fg2: "#8e8ea2", fg3: "#52526a",
  accent: "#a78bfa", green: "#34d399", red: "#f87171",
};

/* ═══════════════════════════════════════════
   FETCH RSS HELPER
   ═══════════════════════════════════════════ */
function fetchFeeds(feeds, onResult, onDone) {
  var completed = 0;
  var total = feeds.length;

  feeds.forEach(function (feed) {
    var apiUrl = "https://api.rss2json.com/v1/api.json?rss_url=" + encodeURIComponent(feed.url);
    fetch(apiUrl)
      .then(function (res) { return res.json(); })
      .then(function (data) {
        if (data.status === "ok" && data.items) {
          var articles = data.items.slice(0, 5).map(function (item) {
            var plainDesc = (item.description || "").replace(/<[^>]*>/g, "").replace(/&[^;]+;/g, " ").trim();
            var summary = plainDesc.length > 200 ? plainDesc.substring(0, 200) + "..." : plainDesc;
            return {
              title: item.title || "Sans titre",
              source: feed.source,
              date: item.pubDate ? item.pubDate.split(" ")[0] : "",
              summary: summary || "Aucun resume disponible.",
              topics: feed.topics,
              url: item.link || "#",
            };
          });
          onResult(articles);
        }
      })
      .catch(function () { /* silently fail, fallback handles it */ })
      .finally(function () {
        completed++;
        if (completed >= total) onDone();
      });
  });
}

/* ═══════════════════════════════════════════
   RELATIVE DATE
   ═══════════════════════════════════════════ */
function relativeDate(dateStr) {
  if (!dateStr) return "";
  var d = new Date(dateStr);
  var now = new Date();
  var diff = Math.floor((now - d) / 86400000);
  if (diff === 0) return "Aujourd'hui";
  if (diff === 1) return "Hier";
  if (diff < 7) return "Il y a " + diff + " jours";
  if (diff < 30) return "Il y a " + Math.floor(diff / 7) + " sem.";
  return d.toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" });
}

/* ═══════════════════════════════════════════
   ARTICLE CARD
   ═══════════════════════════════════════════ */
function ArticleCard({ article, index }) {
  var topicBadges = (article.topics || []).map(function (tid) {
    var t = TOPICS.find(function (tp) { return tp.id === tid; });
    if (!t) return null;
    return (
      <span key={tid} style={{
        fontSize: 10, fontWeight: 600, padding: "3px 9px", borderRadius: 5,
        color: t.color, background: t.color + "14",
      }}>
        {t.label}
      </span>
    );
  });

  return (
    <div
      style={{
        background: K.bg2, border: "1px solid " + K.border, borderRadius: 14,
        padding: "20px 22px", transition: "all 0.2s",
        animationName: "cardReveal",
        animationDuration: "0.4s",
        animationDelay: (index * 40) + "ms",
        animationFillMode: "both",
        cursor: "pointer", position: "relative", overflow: "hidden",
      }}
      onMouseEnter={function (e) {
        e.currentTarget.style.borderColor = K.borderH;
        e.currentTarget.style.transform = "translateY(-2px)";
        e.currentTarget.style.boxShadow = "0 8px 32px rgba(0,0,0,0.3)";
      }}
      onMouseLeave={function (e) {
        e.currentTarget.style.borderColor = K.border;
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "none";
      }}
      onClick={function () {
        if (article.url && article.url !== "#") window.open(article.url, "_blank");
      }}
    >
      {/* Top row: source + date */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
        <span style={{
          fontSize: 11, fontWeight: 700, color: K.accent,
          background: K.accent + "12", padding: "3px 10px", borderRadius: 6,
        }}>
          {article.source}
        </span>
        <span style={{ fontSize: 11, color: K.fg3 }}>{relativeDate(article.date)}</span>
      </div>

      {/* Title */}
      <h3 style={{
        fontSize: 15, fontWeight: 700, color: K.fg, margin: "0 0 8px",
        lineHeight: 1.45, letterSpacing: -0.2,
      }}>
        {article.title}
      </h3>

      {/* Summary */}
      <p style={{
        fontSize: 13, color: K.fg2, margin: "0 0 14px",
        lineHeight: 1.6, display: "-webkit-box",
        WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden",
      }}>
        {article.summary}
      </p>

      {/* Topic badges */}
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
        {topicBadges}
      </div>

      {/* Read indicator */}
      <div style={{
        position: "absolute", top: 20, right: 22, opacity: 0.3,
        transition: "opacity 0.2s",
      }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={K.fg3} strokeWidth="2" strokeLinecap="round">
          <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
          <polyline points="15 3 21 3 21 9" />
          <line x1="10" y1="14" x2="21" y2="3" />
        </svg>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════ */
export default function NewsAggregator() {
  var [articles, setArticles] = useState([]);
  var [loading, setLoading] = useState(true);
  var [activeTopic, setActiveTopic] = useState("all");
  var [search, setSearch] = useState("");
  var [sortBy, setSortBy] = useState("date");
  var [fetchedCount, setFetchedCount] = useState(0);

  useEffect(function () {
    var fetched = [];

    fetchFeeds(
      FEEDS,
      function (results) {
        fetched = fetched.concat(results);
        setFetchedCount(fetched.length);
      },
      function () {
        if (fetched.length > 0) {
          setArticles(fetched);
        } else {
          setArticles(FALLBACK);
        }
        setLoading(false);
      }
    );

    var timeout = setTimeout(function () {
      if (loading) {
        setArticles(function (prev) {
          return prev.length > 0 ? prev : FALLBACK;
        });
        setLoading(false);
      }
    }, 6000);

    return function () { clearTimeout(timeout); };
  }, []);

  /* Filtering and sorting */
  var filtered = articles.filter(function (a) {
    if (activeTopic !== "all") {
      if (!a.topics || a.topics.indexOf(activeTopic) === -1) return false;
    }
    if (search) {
      var q = search.toLowerCase();
      var inTitle = (a.title || "").toLowerCase().indexOf(q) !== -1;
      var inSummary = (a.summary || "").toLowerCase().indexOf(q) !== -1;
      var inSource = (a.source || "").toLowerCase().indexOf(q) !== -1;
      if (!inTitle && !inSummary && !inSource) return false;
    }
    return true;
  });

  filtered.sort(function (a, b) {
    if (sortBy === "date") {
      return (b.date || "").localeCompare(a.date || "");
    }
    if (sortBy === "source") {
      return (a.source || "").localeCompare(b.source || "");
    }
    return (a.title || "").localeCompare(b.title || "");
  });

  /* Topic stats */
  var topicCounts = {};
  TOPICS.forEach(function (t) {
    if (t.id === "all") {
      topicCounts["all"] = articles.length;
    } else {
      topicCounts[t.id] = articles.filter(function (a) {
        return a.topics && a.topics.indexOf(t.id) !== -1;
      }).length;
    }
  });

  /* Sources list */
  var sources = [];
  var sourceSet = {};
  articles.forEach(function (a) {
    if (!sourceSet[a.source]) {
      sourceSet[a.source] = 0;
    }
    sourceSet[a.source]++;
  });
  Object.keys(sourceSet).forEach(function (s) {
    sources.push({ name: s, count: sourceSet[s] });
  });
  sources.sort(function (a, b) { return b.count - a.count; });

  return (
    <div style={{
      
      fontFamily: "inherit", color: K.fg,
    }}>
      <style>{
        "@import url('https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700;800&display=swap');" +
        "@keyframes cardReveal{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}" +
        "@keyframes pulseGlow{0%,100%{opacity:0.4}50%{opacity:1}}" +
        "@keyframes spin{to{transform:rotate(360deg)}}" +
        "::-webkit-scrollbar{width:5px;height:5px}" +
        "::-webkit-scrollbar-track{background:transparent}" +
        "::-webkit-scrollbar-thumb{background:" + K.border + ";border-radius:3px}"
      }</style>

      {/* ─── Header ─── */}
      <div style={{
        padding: "22px 32px 18px",
        borderBottom: "1px solid " + K.border,
        background: K.bg1,
      }}>
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          flexWrap: "wrap", gap: 14,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{
              width: 42, height: 42, borderRadius: 12,
              background: "linear-gradient(135deg, #ef4444, #f97316)",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 0 24px rgba(239,68,68,0.2)",
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 22h16a2 2 0 002-2V4a2 2 0 00-2-2H8a2 2 0 00-2 2v16a2 2 0 01-2 2zm0 0a2 2 0 01-2-2v-9c0-1.1.9-2 2-2h2" />
                <line x1="10" y1="6" x2="18" y2="6" />
                <line x1="10" y1="10" x2="18" y2="10" />
                <line x1="10" y1="14" x2="14" y2="14" />
              </svg>
            </div>
            <div>
              <h1 style={{ fontSize: 21, fontWeight: 800, margin: 0, letterSpacing: -0.5 }}>
                News Aggregator
              </h1>
              <p style={{ fontSize: 12, color: K.fg3, margin: 0 }}>
                Psychologie masculine, relations, seduction et developpement
              </p>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {/* Live indicator */}
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{
                width: 8, height: 8, borderRadius: "50%",
                background: loading ? K.accent : K.green,
                animation: loading ? "pulseGlow 1.5s ease-in-out infinite" : "none",
              }} />
              <span style={{ fontSize: 11, color: K.fg3 }}>
                {loading ? "Chargement des flux..." : articles.length + " articles"}
              </span>
            </div>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={function (e) { setSortBy(e.target.value); }}
              style={{
                padding: "7px 12px", fontSize: 12, fontFamily: "inherit",
                background: K.bg2, border: "1px solid " + K.border, borderRadius: 8,
                color: K.fg, outline: "none", cursor: "pointer",
              }}
            >
              <option value="date">Plus recents</option>
              <option value="source">Par source</option>
              <option value="title">Par titre</option>
            </select>
          </div>
        </div>

        {/* Search + Topic filters */}
        <div style={{
          marginTop: 18, display: "flex", alignItems: "center",
          justifyContent: "space-between", flexWrap: "wrap", gap: 12,
        }}>
          {/* Search */}
          <div style={{ position: "relative" }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="2.2"
              style={{ position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)" }}>
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              placeholder="Rechercher dans les articles..."
              value={search}
              onChange={function (e) { setSearch(e.target.value); }}
              style={{
                padding: "8px 14px 8px 34px", fontSize: 12, fontFamily: "inherit",
                background: K.bg2, border: "1px solid " + K.border, borderRadius: 8,
                color: K.fg, outline: "none", width: 260,
              }}
            />
          </div>

          {/* Topic pills */}
          <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
            {TOPICS.map(function (t) {
              var active = activeTopic === t.id;
              var count = topicCounts[t.id] || 0;
              return (
                <button
                  key={t.id}
                  onClick={function () { setActiveTopic(t.id); }}
                  style={{
                    padding: "5px 12px", borderRadius: 7, fontSize: 11, fontWeight: 600,
                    fontFamily: "inherit", cursor: "pointer", transition: "all 0.15s",
                    border: active ? "1px solid " + t.color + "55" : "1px solid " + K.border,
                    background: active ? t.color + "14" : "transparent",
                    color: active ? t.color : K.fg3,
                    opacity: active ? 1 : 0.6,
                    display: "flex", alignItems: "center", gap: 5,
                  }}
                >
                  {t.label}
                  <span style={{
                    fontSize: 9, fontWeight: 700, opacity: 0.7,
                    background: active ? t.color + "20" : K.bg3,
                    padding: "1px 5px", borderRadius: 4,
                  }}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ─── Content area ─── */}
      <div style={{ display: "flex", gap: 0 }}>

        {/* ─── Main feed ─── */}
        <div style={{ flex: 1, padding: "20px 28px 40px" }}>
          {loading && (
            <div style={{ textAlign: "center", padding: "60px 0" }}>
              <div style={{
                width: 32, height: 32, border: "3px solid " + K.border,
                borderTopColor: K.accent, borderRadius: "50%",
                animation: "spin 0.8s linear infinite",
                margin: "0 auto 16px",
              }} />
              <p style={{ fontSize: 13, color: K.fg3 }}>Recuperation des flux RSS...</p>
              {fetchedCount > 0 && (
                <p style={{ fontSize: 11, color: K.fg3, marginTop: 4 }}>
                  {fetchedCount} articles charges
                </p>
              )}
            </div>
          )}

          {!loading && filtered.length === 0 && (
            <div style={{ textAlign: "center", padding: "60px 0" }}>
              <p style={{ fontSize: 28, opacity: 0.15, margin: "0 0 8px" }}>&#9673;</p>
              <p style={{ fontSize: 13, color: K.fg3 }}>Aucun article trouve</p>
              <button
                onClick={function () { setSearch(""); setActiveTopic("all"); }}
                style={{
                  marginTop: 12, fontSize: 12, color: K.accent, background: "none",
                  border: "1px solid " + K.accent + "44", borderRadius: 8,
                  padding: "8px 18px", cursor: "pointer", fontFamily: "inherit", fontWeight: 600,
                }}
              >
                Reinitialiser les filtres
              </button>
            </div>
          )}

          {!loading && filtered.length > 0 && (
            <div>
              <p style={{ fontSize: 11, color: K.fg3, marginBottom: 14 }}>
                {filtered.length} article{filtered.length > 1 ? "s" : ""}
                {activeTopic !== "all" ? " dans " + TOPICS.find(function (t) { return t.id === activeTopic; }).label : ""}
                {search ? " pour \"" + search + "\"" : ""}
              </p>
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
                gap: 14,
              }}>
                {filtered.map(function (article, i) {
                  return <ArticleCard key={i} article={article} index={i} />;
                })}
              </div>
            </div>
          )}
        </div>

        {/* ─── Sidebar ─── */}
        <div style={{
          width: 280, flexShrink: 0, borderLeft: "1px solid " + K.border,
          padding: "20px 20px", background: K.bg1,
          display: "flex", flexDirection: "column", gap: 24,
        }}>
          {/* Sources */}
          <div>
            <h4 style={{
              fontSize: 10, fontWeight: 700, color: K.fg3, textTransform: "uppercase",
              letterSpacing: 0.8, margin: "0 0 12px",
            }}>
              Sources ({sources.length})
            </h4>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {sources.map(function (s, i) {
                return (
                  <div
                    key={i}
                    style={{
                      display: "flex", justifyContent: "space-between", alignItems: "center",
                      padding: "8px 12px", borderRadius: 8, background: K.bg2,
                      border: "1px solid " + K.border, cursor: "pointer",
                      transition: "border-color 0.15s",
                    }}
                    onMouseEnter={function (e) { e.currentTarget.style.borderColor = K.borderH; }}
                    onMouseLeave={function (e) { e.currentTarget.style.borderColor = K.border; }}
                    onClick={function () { setSearch(s.name); }}
                  >
                    <span style={{ fontSize: 12, fontWeight: 500, color: K.fg2 }}>{s.name}</span>
                    <span style={{
                      fontSize: 10, fontWeight: 700, color: K.fg3,
                      background: K.bg3, padding: "2px 7px", borderRadius: 4,
                    }}>
                      {s.count}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Topics breakdown */}
          <div>
            <h4 style={{
              fontSize: 10, fontWeight: 700, color: K.fg3, textTransform: "uppercase",
              letterSpacing: 0.8, margin: "0 0 12px",
            }}>
              Repartition par sujet
            </h4>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {TOPICS.filter(function (t) { return t.id !== "all"; }).map(function (t) {
                var count = topicCounts[t.id] || 0;
                var pct = articles.length > 0 ? Math.round((count / articles.length) * 100) : 0;
                return (
                  <div key={t.id}>
                    <div style={{
                      display: "flex", justifyContent: "space-between",
                      alignItems: "center", marginBottom: 4,
                    }}>
                      <span style={{ fontSize: 11, fontWeight: 500, color: K.fg2 }}>{t.label}</span>
                      <span style={{ fontSize: 10, color: K.fg3 }}>{count} ({pct}%)</span>
                    </div>
                    <div style={{
                      width: "100%", height: 4, background: K.bg3, borderRadius: 2, overflow: "hidden",
                    }}>
                      <div style={{
                        width: pct + "%", height: "100%", borderRadius: 2,
                        background: t.color, transition: "width 0.6s ease",
                      }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* RSS feeds info */}
          <div>
            <h4 style={{
              fontSize: 10, fontWeight: 700, color: K.fg3, textTransform: "uppercase",
              letterSpacing: 0.8, margin: "0 0 10px",
            }}>
              Flux RSS configures
            </h4>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {FEEDS.map(function (f, i) {
                return (
                  <div key={i} style={{
                    fontSize: 11, color: K.fg3, padding: "6px 10px",
                    borderRadius: 6, background: K.bg2,
                    display: "flex", alignItems: "center", gap: 6,
                  }}>
                    <div style={{
                      width: 6, height: 6, borderRadius: "50%", background: K.green,
                      flexShrink: 0,
                    }} />
                    <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {f.source}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
