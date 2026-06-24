<script setup lang="ts">
import type { NewsArticle } from "../../shared/types/news";

defineProps<{
  article: NewsArticle;
}>();

const { journal } = useAppConfig();

function formatTime(date: string) {
  return new Date(date).toLocaleString(journal.locale, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}
</script>

<template>
  <article class="group border-b border-muted pb-5 last:border-b-0 last:pb-0">
    <a
      :href="article.link"
      target="_blank"
      rel="noopener noreferrer"
      class="grid grid-cols-1 sm:grid-cols-[1fr_140px] gap-4 items-start"
    >
      <div>
        <div class="flex items-center gap-2 mb-1.5">
          <span
            class="text-[10px] uppercase tracking-widest text-muted font-medium"
          >
            {{ article.source }}
          </span>
          <span class="text-muted/40">·</span>
          <span class="text-xs text-muted">
            {{ formatTime(article.publishedAt) }}
          </span>
        </div>

        <h3
          class="font-serif text-lg font-semibold leading-snug text-default group-hover:underline decoration-1 underline-offset-2"
        >
          {{ article.title }}
        </h3>

        <p
          class="mt-1.5 text-sm text-muted leading-relaxed line-clamp-2 hidden sm:block"
        >
          {{ article.summary }}
        </p>
      </div>

      <div
        v-if="article.image"
        class="aspect-4/3 overflow-hidden bg-elevated order-first sm:order-last"
      >
        <img
          :src="article.image"
          :alt="article.title"
          class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
          loading="lazy"
        />
      </div>
    </a>
  </article>
</template>
