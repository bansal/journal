import Parser from "rss-parser";
import type { NewsSource, NewsArticle } from "../../shared/types/news";

const parser = new Parser({
  timeout: 10000,
  customFields: {
    item: [
      ["media:content", "mediaContent", { keepArray: true }],
      ["media:thumbnail", "mediaThumbnail", { keepArray: true }],
      ["content:encoded", "contentEncoded"],
    ],
  },
});

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function extractImage(
  item: Parser.Item & {
    mediaContent?: Array<{ $?: { url?: string } }>;
    mediaThumbnail?: Array<{ $?: { url?: string } }>;
    contentEncoded?: string;
  },
): string | undefined {
  const mediaUrl =
    item.mediaContent?.[0]?.$?.url ??
    item.mediaThumbnail?.[0]?.$?.url ??
    item.enclosure?.url;

  if (mediaUrl && /\.(jpg|jpeg|png|webp|gif)/i.test(mediaUrl)) {
    return mediaUrl;
  }

  const html = item.contentEncoded ?? item.content ?? item.summary ?? "";
  const match = html.match(/<img[^>]+src=["']([^"']+)["']/i);
  return match?.[1];
}

function toArticleId(sourceId: string, link: string): string {
  let hash = 0;
  for (const char of link) {
    hash = ((hash << 5) - hash + char.charCodeAt(0)) | 0;
  }
  return `${sourceId}-${Math.abs(hash).toString(36)}`;
}

export async function fetchFeed(source: NewsSource): Promise<NewsArticle[]> {
  const feed = await parser.parseURL(source.url);

  return (feed.items ?? [])
    .filter((item) => item.title && item.link)
    .map((item) => {
      const rawSummary =
        item.contentSnippet ?? item.summary ?? item.content ?? "";
      const summary = stripHtml(rawSummary).slice(0, 280);

      return {
        id: toArticleId(source.id, item.link!),
        title: stripHtml(item.title!),
        link: item.link!,
        summary: summary || "No summary available.",
        publishedAt: item.isoDate ?? item.pubDate ?? new Date().toISOString(),
        source: source.name,
        sourceId: source.id,
        category: source.category,
        image: extractImage(item),
      };
    });
}

export function dedupeAndSort(articles: NewsArticle[]): NewsArticle[] {
  const seen = new Set<string>();
  const unique: NewsArticle[] = [];

  for (const article of articles) {
    const key = article.link.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    unique.push(article);
  }

  return unique.sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  );
}
