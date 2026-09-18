import { NewsItem } from "@/components/basic/pages/news";
import { RootState } from "@/store/store";
import { XMLParser } from "fast-xml-parser";
import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";

// Extract the first <img src> from an HTML string (Google News embeds these)
function extractImage(html: string): string | undefined {
  const match = html?.match(/<img[^>]+src="([^"]+)"/);
  return match?.[1];
}

export const NEWS_LANGUAGES = {
  en: {
    hl: "en",
    gl: "IN",
    ceid: "IN:en",
  },
  hi: {
    hl: "hi",
    gl: "IN",
    ceid: "IN:hi",
  },
  gu: {
    hl: "gu",
    gl: "IN",
    ceid: "IN:gu",
  },
  ta: {
    hl: "ta",
    gl: "IN",
    ceid: "IN:ta",
  },
  te: {
    hl: "te",
    gl: "IN",
    ceid: "IN:te",
  },
  pa: {
    hl: "pa",
    gl: "IN",
    ceid: "IN:pa",
  },
  mr: {
    hl: "mr",
    gl: "IN",
    ceid: "IN:mr",
  },
} as const;

export type NewsLanguage = keyof typeof NEWS_LANGUAGES;

export default function useAgriNews() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const appLanguage = useSelector(
    (state: RootState) => state?.appSlice?.language,
  );

  const fetchNews = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const config = NEWS_LANGUAGES[appLanguage as NewsLanguage];

      // Broaden query to cover Haryana + national agri news
      const queries = ["agriculture", "kisan+news+india", "crop+msp+india"];
      const query = queries[Math.floor(Math.random() * queries.length)]; // rotate topics
      const rssUrl = `https://news.google.com/rss/search?q=${encodeURIComponent(query)}&hl=${config.hl}&gl=${config.gl}&ceid=${config.ceid}`;

      const response = await fetch(rssUrl);
      if (!response.ok) throw new Error("Network error");
      const xml = await response.text();

      const parser = new XMLParser({ ignoreAttributes: false });
      const result = parser.parse(xml);

      const items = result?.rss?.channel?.item ?? [];
      const articles: NewsItem[] = (Array.isArray(items) ? items : [items])
        .slice(0, 10) // cap at 10 cards
        .map((item: any) => ({
          title: item.title ?? "",
          link: item.link ?? "",
          pubDate: item.pubDate ?? "",
          description: item.description
            ? item.description.replace(/<[^>]+>/g, "") // strip HTML tags
            : "",
          source: item.source?.["#text"] ?? "Google News",
          imageUrl: extractImage(
            item["media:content"] ?? item.description ?? "",
          ),
        }));

      setNews(articles);
    } catch (e: any) {
      setError("Could not load news. Pull to refresh.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNews();
  }, [fetchNews]);

  return { news, loading, error, refetch: fetchNews };
}
