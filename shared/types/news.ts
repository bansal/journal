export interface NewsSource {
  id: string;
  name: string;
  url: string;
  link: string;
  category: string;
}

export interface NewsArticle {
  id: string;
  title: string;
  link: string;
  summary: string;
  publishedAt: string;
  source: string;
  sourceId: string;
  category: string;
  image?: string;
}

export interface NewsFilterStats {
  thumbnailOnly: boolean;
  latestDays: number;
  perSourceLimit: number;
  includeKeywords: string[];
  excludeKeywords: string[];
  recency: {
    matchedCount: number;
    totalBeforeFilter: number;
  };
  perSource: {
    matchedCount: number;
    totalBeforeFilter: number;
  };
  thumbnail: {
    matchedCount: number;
    totalBeforeFilter: number;
  };
  keywords: {
    matchedCount: number;
    totalBeforeFilter: number;
  };
}

export interface NewsResponse {
  articles: NewsArticle[];
  fetchedAt: string;
  sources: number;
}

export interface JournalExternalLink {
  id: string;
  name: string;
  href: string;
}

export interface JournalConfig {
  name: string;
  tagline: string;
  description: string;
  mastheadSections: string[];
  footer: {
    attribution: string;
  };
  sections: {
    latestHeadlines: string;
    bySection: string;
    sources: string;
    externalLinks: string;
  };
  externalLinks: JournalExternalLink[];
  newsSources: NewsSource[];
  filter: {
    thumbnailOnly: boolean;
    latestDays: number;
    perSourceLimit: number;
    includeKeywords: string[];
    excludeKeywords: string[];
  };
  copy: {
    loading: string;
    errorTitle: string;
    errorDescription: string;
    retry: string;
    empty: string;
  };
  locale: string;
  lang: string;
}

export type DeepPartial<T> = T extends (infer U)[]
  ? DeepPartial<U>[]
  : T extends object
    ? { [P in keyof T]?: DeepPartial<T[P]> }
    : T;
