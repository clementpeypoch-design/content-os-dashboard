import { NextResponse } from "next/server";

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
