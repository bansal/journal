<script setup lang="ts">
import type { JournalConfig } from "../../shared/types/news";
const { journal } = useAppConfig() as { journal: JournalConfig };

const props = defineProps<{
  articles: NewsArticle[];
}>();
const categories = computed(() => {
  const counts = new Map<string, number>();
  for (const article of props.articles) {
    counts.set(article.category, (counts.get(article.category) ?? 0) + 1);
  }
  return [...counts.entries()].sort((a, b) => b[1] - a[1]);
});
</script>

<template>
  <div v-if="categories.length > 0">
    <Heading>{{ journal.sections.bySection }}</Heading>

    <ul class="space-y-3">
      <li
        v-for="[category, count] in categories"
        :key="category"
        class="flex items-center justify-between text-sm"
      >
        <span class="text-default">{{ category }}</span>
        <span class="text-muted tabular-nums">{{ count }}</span>
      </li>
    </ul>
  </div>
</template>
