# Journal

A [Nuxt layer](https://nuxt.com/docs/getting-started/layers) that turns RSS feeds into a personal news reader. Extend it in your own Nuxt app, configure your journal in `app.config.ts`, and get a newspaper-style homepage with headlines, categories, and source listings.

Built with [Nuxt UI](https://ui.nuxt.com) and Tailwind CSS.

## Using the layer

Nuxt layers are extended directly in `nuxt.config.ts`—no npm install required. Point `extends` at the GitHub source:

```ts
export default defineNuxtConfig({
  extends: ["github:bansal/journal"],
});
```

You can pin a branch, tag, or commit:

```ts
extends: ["github:bansal/journal#main"],
```

For local development, clone [github.com/bansal/journal](https://github.com/bansal/journal) and extend the path instead:

```ts
export default defineNuxtConfig({
  extends: ["../journal"],
});
```

That pulls in the layer's pages, components, server API (`/api/news`), styling, and default app config. Your app only needs to override what you want to change—most importantly the `journal` block in `app.config.ts`.

### Configure your journal

Create or edit `app/app.config.ts` in your project. Values you set are deep-merged with the layer defaults:

```ts
export default defineAppConfig({
  journal: {
    name: "The Daily Reader",
    tagline: "Curated headlines for curious minds",
    description:
      "A personal news journal aggregating tech, science, and culture.",
    locale: "en-US",
    lang: "en",

    mastheadSections: ["Tech", "Science", "Culture"],

    newsSources: [
      {
        id: "hn",
        name: "Hacker News",
        url: "https://hnrss.org/frontpage",
        link: "https://news.ycombinator.com",
        category: "Tech",
      },
      {
        id: "bbc-tech",
        name: "BBC Technology",
        url: "http://feeds.bbci.co.uk/news/technology/rss.xml",
        link: "https://www.bbc.com/news/technology",
        category: "Tech",
      },
    ],

    externalLinks: [
      {
        id: "about",
        name: "About this site",
        href: "https://example.com/about",
      },
    ],

    filter: {
      thumbnailOnly: false,
      latestDays: 7,
      perSourceLimit: 10,
      includeKeywords: [],
      excludeKeywords: ["sponsored"],
    },

    copy: {
      loading: "Gathering today's headlines…",
      errorTitle: "Unable to load news",
      errorDescription: "Please check your connection and try again.",
      retry: "Retry",
      empty: "No articles available right now.",
    },

    sections: {
      latestHeadlines: "Latest Headlines",
      bySection: "By Section",
      sources: "Sources",
      externalLinks: "External Links",
    },
  },

  ui: {
    colors: {
      primary: "stone",
      neutral: "stone",
    },
  },
});
```

Run your app as usual:

```bash
pnpm dev
```

The homepage fetches articles from `/api/news`, which reads `journal.newsSources` and applies your filters server-side.

## Journal config reference

All journal settings live under `app.config.ts` → `journal`. TypeScript types are provided by the layer via module augmentation, so `defineAppConfig({ journal: { ... } })` is fully typed.

When the layer is extended, TypeScript picks up `JournalConfig` and related types automatically via module augmentation—no separate type import needed.

### Branding & metadata

| Field         | Type     | Description                                                   |
| ------------- | -------- | ------------------------------------------------------------- |
| `name`        | `string` | Journal title shown in the masthead, page title, and footer   |
| `tagline`     | `string` | Subtitle under the masthead                                   |
| `description` | `string` | Site description used for SEO meta tags                       |
| `locale`      | `string` | BCP 47 locale for dates and times (e.g. `"en-US"`, `"de-DE"`) |
| `lang`        | `string` | HTML `lang` attribute (e.g. `"en"`)                           |

### Layout copy

| Field                      | Type       | Description                                                  |
| -------------------------- | ---------- | ------------------------------------------------------------ |
| `mastheadSections`         | `string[]` | Optional labels shown below the tagline (e.g. section names) |
| `sections.latestHeadlines` | `string`   | Heading for the article list                                 |
| `sections.bySection`       | `string`   | Heading for the category sidebar                             |
| `sections.sources`         | `string`   | Heading for the sources sidebar                              |
| `sections.externalLinks`   | `string`   | Heading for external links sidebar                           |
| `footer.attribution`       | `string`   | Footer attribution text (reserved for custom layouts)        |

### User-facing strings

| Field                   | Type     | Used when                          |
| ----------------------- | -------- | ---------------------------------- |
| `copy.loading`          | `string` | Initial fetch is in progress       |
| `copy.errorTitle`       | `string` | Feed fetch failed                  |
| `copy.errorDescription` | `string` | Error state description            |
| `copy.retry`            | `string` | Retry button label                 |
| `copy.empty`            | `string` | No articles remain after filtering |

### News sources

Each entry in `newsSources` defines one RSS feed:

```ts
{
  id: "unique-id",       // Stable identifier; used for deduping and per-source limits
  name: "Source Name",   // Display name in article bylines and sidebar
  url: "https://...",    // RSS/Atom feed URL (fetched server-side)
  link: "https://...",   // Homepage link shown in the sources sidebar
  category: "Tech",      // Grouping label for the "By Section" sidebar
}
```

Articles inherit `category` from their source. Categories with zero articles are hidden automatically.

### External links

Optional sidebar links:

```ts
{
  id: "unique-id",
  name: "Link label",
  href: "https://example.com",
}
```

### Filters

Filters run on the server after all feeds are fetched, deduplicated, and sorted by date.

| Field                    | Type       | Default | Description                                                                                     |
| ------------------------ | ---------- | ------- | ----------------------------------------------------------------------------------------------- |
| `filter.thumbnailOnly`   | `boolean`  | `false` | When `true`, drop articles without an image                                                     |
| `filter.latestDays`      | `number`   | `7`     | Only include articles from the last N days; `0` = no limit                                      |
| `filter.perSourceLimit`  | `number`   | `10`    | Max articles per source; `0` = no limit                                                         |
| `filter.includeKeywords` | `string[]` | `[]`    | Keep articles whose title or summary contains any keyword (case-insensitive); empty = no filter |
| `filter.excludeKeywords` | `string[]` | `[]`    | Drop articles matching any keyword                                                              |

Filter order: dedupe → recency → per-source limit → keywords → thumbnail.

### UI theme

Override Nuxt UI colors under `ui.colors` in the same `app.config.ts`:

```ts
ui: {
  colors: {
    primary: "stone",
    neutral: "stone",
  },
}
```

## What the layer provides

| Path        | Description                                                                                                      |
| ----------- | ---------------------------------------------------------------------------------------------------------------- |
| `/`         | Journal homepage with masthead, hero cards, headline list, and sidebar                                           |
| `/api/news` | Server route that fetches RSS feeds and returns filtered articles                                                |
| Components  | `NewsMasthead`, `NewsArticleCard`, `NewsArticleRow`, `NewsCategories`, `NewsSources`, `ExternalLinks`, `Heading` |
| Styling     | Journal typography and stone color palette via Tailwind CSS                                                      |

In production, `/` and `/api/news` are cached with SWR for 10 minutes.

## Response shape

`GET /api/news` returns:

```ts
{
  articles: NewsArticle[];
  fetchedAt: string;   // ISO timestamp
  sources: number;     // Number of configured sources
}
```

Each article includes `id`, `title`, `link`, `summary`, `publishedAt`, `source`, `sourceId`, `category`, and optional `image`.

## Developing the layer

Clone this repo and run it standalone (the included `app/app.config.ts` is the default journal config):

```bash
pnpm install
pnpm dev
```

Other commands:

```bash
pnpm build      # Production build
pnpm preview    # Preview production build
pnpm typecheck  # TypeScript check
```

To try config changes locally, edit `app/app.config.ts` in this repository—the same structure applies when consuming the layer in another project.

## License

[MIT](LICENSE)
