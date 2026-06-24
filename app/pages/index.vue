<script setup lang="ts">
import type { NewsResponse } from "#shared/types/news";

const { journal } = useAppConfig();

const { data, pending, error, refresh } =
  await useFetch<NewsResponse>("/api/news");

const articles = computed(() => data.value?.articles ?? []);

const primary = computed(() => articles.value.slice(0, 2));
const secondary = computed(() => articles.value.slice(2, 5));
const rest = computed(() => articles.value.slice(5));

function formatFetchedAt(date?: string) {
  if (!date) return "";
  return new Date(date).toLocaleTimeString(journal.locale, {
    hour: "numeric",
    minute: "2-digit",
  });
}
</script>

<template>
  <div>
    <NewsMasthead />

    <div
      class="border-b border-muted py-3 flex flex-wrap items-center justify-between gap-3 text-xs text-muted"
    >
      <div class="flex items-center gap-3">
        <span v-if="data" class="uppercase tracking-widest">
          {{ articles.length }} stories · {{ data.sources }} sources
        </span>
      </div>

      <div class="flex items-center gap-3">
        <span v-if="data"> Updated {{ formatFetchedAt(data.fetchedAt) }} </span>
        <UButton
          icon="i-lucide-refresh-cw"
          color="neutral"
          variant="ghost"
          size="xs"
          :loading="pending"
          aria-label="Refresh news"
          @click="refresh()"
        />
      </div>
    </div>

    <div v-if="pending && !articles.length" class="py-20 text-center">
      <UIcon
        name="i-lucide-newspaper"
        class="size-10 text-muted mx-auto mb-4 animate-pulse"
      />
      <p class="text-muted">
        {{ journal.copy.loading }}
      </p>
    </div>

    <UEmpty
      v-else-if="error"
      class="py-20"
      variant="naked"
      icon="i-lucide-alert-circle"
      :title="journal.copy.errorTitle"
      :description="journal.copy.errorDescription"
      :ui="{ avatar: 'text-error' }"
      :actions="[
        {
          label: journal.copy.retry,
          color: 'neutral',
          variant: 'outline',
          onClick: () => refresh(),
        },
      ]"
    />

    <template v-else-if="primary">
      <section class="py-8 border-b border-muted">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-6">
          <NewsArticleCard
            v-for="article in primary"
            :key="article.id"
            :article="article"
          />
        </div>
      </section>

      <section v-if="secondary.length" class="py-8 border-b border-muted">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6">
          <NewsArticleCard
            v-for="article in secondary"
            :key="article.id"
            :article="article"
          />
        </div>
      </section>

      <section class="py-8 grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-10">
        <div>
          <Heading>{{ journal.sections.latestHeadlines }}</Heading>

          <div class="space-y-5">
            <NewsArticleRow
              v-for="article in rest"
              :key="article.id"
              :article="article"
            />
          </div>
        </div>

        <aside class="lg:sticky lg:top-6 lg:self-start flex flex-col gap-8">
          <NewsCategories :articles="articles" />
          <ExternalLinks />
          <NewsSources :articles="articles" />
        </aside>
      </section>
    </template>

    <div v-else class="py-20 text-center">
      <UIcon name="i-lucide-inbox" class="size-10 text-muted mx-auto mb-4" />
      <p class="text-muted">
        {{ journal.copy.empty }}
      </p>
    </div>
  </div>
</template>
