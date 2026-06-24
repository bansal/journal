import {
  limitArticlesPerSource,
  filterArticlesByKeywords,
  filterArticlesByLatestDays,
  filterArticlesByThumbnail,
} from "../utils/filters";

import { dedupeAndSort, fetchFeed } from "../utils/rss";
import type { NewsResponse, NewsSource } from "../../shared/types/news";

export default defineEventHandler(async (): Promise<NewsResponse> => {
  const { journal } = useAppConfig();
  const newsSources = journal.newsSources as NewsSource[];
  const filter = journal.filter;

  const results = await Promise.allSettled(
    newsSources.map((source) => fetchFeed(source)),
  );

  const articles = results.flatMap((result, index) => {
    if (result.status === "fulfilled") {
      return result.value;
    }
    return [];
  });

  const deduped = dedupeAndSort(articles);
  const recencyFiltered = filterArticlesByLatestDays(
    deduped,
    filter.latestDays,
  );
  const perSourceLimited = limitArticlesPerSource(
    recencyFiltered,
    filter.perSourceLimit,
  );
  const keywordFiltered = filterArticlesByKeywords(perSourceLimited, filter);
  const filtered = filterArticlesByThumbnail(
    keywordFiltered,
    filter.thumbnailOnly,
  );

  return {
    articles: filtered,
    fetchedAt: new Date().toISOString(),
    sources: newsSources.length,
  };
});
