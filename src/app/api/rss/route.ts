import { NextResponse } from "next/server";

var FEEDS = [
  // ═══ SOURCES FRANÇAISES — Blogs ═══
  { url: "https://www.artdeseduire.com/feed/", source: "Art de Séduire", topics: ["seduction", "relations", "dating"], lang: "fr" },
  { url: "https://moncoachingseduction.com/feed/", source: "Mon Coaching Séduction", topics: ["seduction", "dating", "developpement"], lang: "fr" },
  { url: "https://hommeexplique.fr/feed/", source: "Yann Piette", topics: ["psychologie", "relations", "seduction"], lang: "fr" },
  { url: "https://www.seductionbykamal.com/feed/", source: "Seduction by Kamal", topics: ["seduction", "dating", "developpement"], lang: "fr" },
  { url: "https://www.hommesdinfluence.com/feed/", source: "Hommes d'Influence", topics: ["seduction", "psychologie", "masculinite"], lang: "fr" },
  { url: "https://www.alexandrecormont.com/feed/", source: "Alexandre Cormont", topics: ["relations", "psychologie", "seduction"], lang: "fr" },
  { url: "https://www.antoinepeytavin.com/feed/", source: "Antoine Peytavin", topics: ["seduction", "dating", "masculinite"], lang: "fr" },
  { url: "https://www.dragueurdeparis.com/feed/", source: "Dragueur de Paris", topics: ["seduction", "dating"], lang: "fr" },
  { url: "https://comprendreleshommes.com/feed/", source: "Comprendre les Hommes", topics: ["psychologie", "relations"], lang: "fr" },
  // ═══ SOURCES FRANÇAISES — YouTube ═══
  { url: "https://www.youtube.com/feeds/videos.xml?channel_id=UCr2YEoH_RB8vq5MYb71NwWw", source: "SC 100Pitié (YT)", topics: ["masculinite", "developpement", "seduction"], lang: "fr" },
  { url: "https://www.youtube.com/feeds/videos.xml?channel_id=UCGjY3xt4LXMFGk4GrdDBIOQ", source: "Mon Coaching Séduction (YT)", topics: ["seduction", "dating"], lang: "fr" },
  // ═══ SOURCES ANGLAISES — Blogs majeurs ═══
  { url: "https://www.artofmanliness.com/feed/", source: "Art of Manliness", topics: ["masculinite", "developpement"], lang: "en" },
  { url: "https://www.gottman.com/blog/feed/", source: "The Gottman Institute", topics: ["relations", "psychologie"], lang: "en" },
  { url: "https://www.sexandpsychology.com/feed/", source: "Sex and Psychology", topics: ["sexualite", "psychologie", "dating"], lang: "en" },
  { url: "https://goodmenproject.com/feed/", source: "The Good Men Project", topics: ["masculinite", "relations"], lang: "en" },
  { url: "https://markmanson.net/feed", source: "Mark Manson", topics: ["developpement", "relations"], lang: "en" },
  { url: "https://www.doctornerdlove.com/feed/", source: "Dr. NerdLove", topics: ["dating", "seduction", "relations"], lang: "en" },
  { url: "https://ifstudies.org/blog/feed", source: "Institute for Family Studies", topics: ["relations", "psychologie"], lang: "en" },
  { url: "https://www.conquerandwin.com/feed/", source: "Conquer and Win", topics: ["seduction", "masculinite", "developpement"], lang: "en" },
  { url: "https://www.evanmarckatz.com/blog/feed", source: "Evan Marc Katz", topics: ["dating", "relations"], lang: "en" },
  { url: "https://therationalmale.com/feed/", source: "The Rational Male", topics: ["psychologie", "relations", "masculinite"], lang: "en" },
  { url: "https://clients.datingbyblaine.com/blog?format=rss", source: "Dating by Blaine", topics: ["dating", "seduction"], lang: "en" },
  { url: "https://www.matthewhussey.com/blog/feed", source: "Matthew Hussey", topics: ["dating", "relations", "seduction"], lang: "en" },
  { url: "https://www.scienceofpeople.com/feed/", source: "Vanessa Van Edwards", topics: ["psychologie", "developpement", "relations"], lang: "en" },
  { url: "https://www.garyvaynerchuk.com/feed/", source: "Gary Vaynerchuk", topics: ["developpement", "masculinite"], lang: "en" },
  { url: "https://theawakenelifestyle.com/feed/", source: "John Keegan", topics: ["seduction", "dating", "developpement"], lang: "en" },
  // ═══ SOURCES ANGLAISES — YouTube (de tes follows) ═══
  { url: "https://www.youtube.com/feeds/videos.xml?channel_id=UCMjKIiNEqbjQBHaGOKxbMgQ", source: "Chris Williamson (YT)", topics: ["masculinite", "psychologie", "developpement"], lang: "en" },
  { url: "https://www.youtube.com/feeds/videos.xml?channel_id=UC_lxnWCjXHOBbrBOrCJzeEg", source: "Hamza Ahmed (YT)", topics: ["masculinite", "developpement", "seduction"], lang: "en" },
  { url: "https://www.youtube.com/feeds/videos.xml?channel_id=UC9HGzFGt7BHmRnX_3MYjBPg", source: "Casey Zander (YT)", topics: ["masculinite", "seduction", "developpement"], lang: "en" },
  { url: "https://www.youtube.com/feeds/videos.xml?channel_id=UCGBMFGKLb_ANQ2cNgq5fJjw", source: "Tripp Advice (YT)", topics: ["dating", "seduction"], lang: "en" },
  { url: "https://www.youtube.com/feeds/videos.xml?channel_id=UC0v-tlzsn0QZwJnkiaUSJVQ", source: "Playing With Fire (YT)", topics: ["relations", "psychologie"], lang: "en" },
];

function stripHtml(html) {
  return (html || "")
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&[^;]+;/g, " ")
    .trim();
}

async function fetchSingleFeed(feed) {
  try {
    var apiUrl = "https://api.rss2json.com/v1/api.json?rss_url=" + encodeURIComponent(feed.url);
    var res = await fetch(apiUrl, { next: { revalidate: 900 } });
    var data = await res.json();

    if (data.status !== "ok" || !data.items) return [];

    return data.items.slice(0, 8).map(function (item) {
      var plain = stripHtml(item.description || "");
      var summary = plain.length > 220 ? plain.substring(0, 220) + "..." : plain;
      return {
        title: item.title || "Sans titre",
        source: feed.source,
        date: item.pubDate ? item.pubDate.split(" ")[0] : "",
        summary: summary || "Aucun résumé disponible.",
        topics: feed.topics,
        lang: feed.lang || "en",
        url: item.link || "#",
      };
    });
  } catch (e) {
    console.error("RSS fetch error for " + feed.source + ":", e.message);
    return [];
  }
}

export async function GET() {
  try {
    var results = await Promise.allSettled(
      FEEDS.map(function (feed) {
        return fetchSingleFeed(feed);
      })
    );

    var articles = [];
    results.forEach(function (result) {
      if (result.status === "fulfilled" && result.value.length > 0) {
        articles = articles.concat(result.value);
      }
    });

    articles.sort(function (a, b) {
      return (b.date || "").localeCompare(a.date || "");
    });

    return NextResponse.json({
      success: true,
      count: articles.length,
      sources: FEEDS.length,
      articles: articles,
    });
  } catch (e) {
    return NextResponse.json(
      { success: false, error: e.message, articles: [] },
      { status: 500 }
    );
  }
}
