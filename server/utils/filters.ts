import type { JournalConfig, NewsArticle } from "../../shared/types/news";

function articleText(article: NewsArticle): string {
  return `${article.title} ${article.summary}`.toLowerCase();
}

function matchesKeywords(text: string, keywords: string[]): boolean {
  return keywords.some((keyword) => text.includes(keyword.toLowerCase()));
}

export function filterArticlesByKeywords(
  articles: NewsArticle[],
  { includeKeywords, excludeKeywords }: JournalConfig["filter"],
): NewsArticle[] {
  let filtered = articles;

  if (includeKeywords.length > 0) {
    filtered = filtered.filter((article) =>
      matchesKeywords(articleText(article), includeKeywords),
    );
  }

  if (excludeKeywords.length > 0) {
    filtered = filtered.filter(
      (article) => !matchesKeywords(articleText(article), excludeKeywords),
    );
  }

  return filtered;
}

export function limitArticlesPerSource(
  articles: NewsArticle[],
  perSourceLimit: number,
): NewsArticle[] {
  if (perSourceLimit <= 0) {
    return articles;
  }

  const bySource = new Map<string, NewsArticle[]>();

  for (const article of articles) {
    const sourceArticles = bySource.get(article.sourceId) ?? [];
    sourceArticles.push(article);
    bySource.set(article.sourceId, sourceArticles);
  }

  const limited: NewsArticle[] = [];

  for (const sourceArticles of bySource.values()) {
    const sorted = sourceArticles.sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
    );
    limited.push(...sorted.slice(0, perSourceLimit));
  }

  return limited.sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  );
}

export function filterArticlesByLatestDays(
  articles: NewsArticle[],
  latestDays: number,
): NewsArticle[] {
  if (latestDays <= 0) {
    return articles;
  }

  const cutoff = Date.now() - latestDays * 24 * 60 * 60 * 1000;

  return articles.filter(
    (article) => new Date(article.publishedAt).getTime() >= cutoff,
  );
}

export function filterArticlesByThumbnail(
  articles: NewsArticle[],
  thumbnailOnly: boolean,
): NewsArticle[] {
  if (!thumbnailOnly) {
    return articles;
  }

  return filterArticlesWithThumbnail(articles);
}

export function hasThumbnail(article: NewsArticle): boolean {
  return Boolean(article.image);
}

export function filterArticlesWithThumbnail(
  articles: NewsArticle[],
): NewsArticle[] {
  return articles.filter(hasThumbnail);
}
