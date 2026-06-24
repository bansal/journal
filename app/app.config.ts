export default defineAppConfig({
  journal: {
    name: "My Journal",
    tagline: "My personal news aggregator",
    description:
      "A minimal news journal aggregating the latest headlines from various sources.",
    mastheadSections: [],
    footer: {
      attribution: "Headlines sourced via RSS",
    },
    sections: {
      latestHeadlines: "Latest Headlines",
      bySection: "By Section",
      sources: "Sources",
      externalLinks: "External Links",
    },
    externalLinks: [],
    newsSources: [],
    filter: {
      thumbnailOnly: false, // Don't show articles without a thumbnail
      latestDays: 7, // Only show articles from the last 7 days, 0 means no limit
      perSourceLimit: 10, // Limit the number of articles per source, 0 means no limit
      includeKeywords: [],
      excludeKeywords: [],
    },
    copy: {
      loading: "Gathering today's headlines…",
      errorTitle: "Unable to load news",
      errorDescription: "Please check your connection and try again.",
      retry: "Retry",
      empty: "No articles available right now.",
    },
    locale: "en-US",
    lang: "en",
  },
  ui: {
    colors: {
      primary: "stone",
      neutral: "stone",
    },
  },
});
