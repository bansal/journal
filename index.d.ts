import type { DeepPartial, JournalConfig } from "./shared/types/news";

type UiColorsInput = {
  primary?: string;
  secondary?: string;
  success?: string;
  info?: string;
  warning?: string;
  error?: string;
  neutral?: string;
};

declare module "@nuxt/schema" {
  interface AppConfigInput {
    /** Journal layer journal branding, copy, and layout strings */
    journal?: DeepPartial<JournalConfig>;
    /** Partial @nuxt/ui theme overrides (merged with module defaults) */
    ui?: DeepPartial<{ colors: UiColorsInput }>;
  }
}

declare module "nuxt/schema" {
  interface AppConfigInput {
    /** Journal layer journal branding, copy, and layout strings */
    journal?: DeepPartial<JournalConfig>;
    /** Partial @nuxt/ui theme overrides (merged with module defaults) */
    ui?: DeepPartial<{ colors: UiColorsInput }>;
  }
}

export type {
  DeepPartial,
  JournalConfig,
  JournalExternalLink,
} from "./shared/types/news";
