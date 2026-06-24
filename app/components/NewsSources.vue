<script setup lang="ts">
import type { JournalConfig } from "../../shared/types/news";
const { journal } = useAppConfig() as { journal: JournalConfig };

const props = defineProps<{
  articles: NewsArticle[];
}>();

const articleCountBySourceId = computed(() => {
  const counts = new Map<string, number>();
  for (const article of props.articles) {
    counts.set(article.sourceId, (counts.get(article.sourceId) ?? 0) + 1);
  }
  return counts;
});
</script>

<template>
  <div v-if="journal.newsSources.length > 0">
    <Heading>{{ journal.sections.sources }}</Heading>
    <ul class="space-y-2 text-xs leading-relaxed">
      <li
        v-for="source in journal.newsSources"
        :key="source.id"
        class="flex items-center justify-between gap-2"
      >
        <a
          :href="source.link"
          target="_blank"
          rel="noopener noreferrer"
          class="text-muted hover:text-default hover:underline underline-offset-2 transition-colors"
        >
          {{ source.name }}
        </a>
        <span class="text-muted tabular-nums shrink-0">
          {{ articleCountBySourceId.get(source.id) ?? 0 }}
        </span>
      </li>
    </ul>
  </div>
</template>
