<script setup lang="ts">
import type { NewsArticle } from "../../shared/types/news";

const props = defineProps<{
  article: NewsArticle;
}>();

const { journal } = useAppConfig();

const imageError = ref(false);

const showImage = computed(() => props.article.image && !imageError.value);

watch(
  () => props.article.image,
  () => {
    imageError.value = false;
  },
);

function onImageError() {
  imageError.value = true;
}

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
  <article class="group">
    <a
      :href="article.link"
      target="_blank"
      rel="noopener noreferrer nofollow"
      class="block"
    >
      <div class="aspect-video overflow-hidden bg-elevated mb-4">
        <img
          v-if="showImage"
          :src="article.image"
          :alt="article.title"
          class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
          loading="lazy"
          @error="onImageError"
        />
        <div
          v-else
          class="w-full h-full flex items-center justify-center"
          aria-hidden="true"
        >
          <UIcon name="i-lucide-image-off" class="size-10 text-muted" />
        </div>
      </div>

      <div class="flex items-center gap-2 mb-2">
        <UBadge
          color="neutral"
          variant="subtle"
          size="sm"
          class="rounded-none uppercase tracking-wider text-[10px]"
        >
          {{ article.source }}
        </UBadge>
        <span class="text-xs text-muted">
          {{ formatTime(article.publishedAt) }}
        </span>
      </div>

      <h2
        class="font-serif text-xl sm:text-2xl font-bold leading-snug text-primary group-hover:underline decoration-1 underline-offset-4"
      >
        {{ article.title }}
      </h2>

      <p class="mt-2 text-base text-muted leading-relaxed line-clamp-3">
        {{ article.summary }}
      </p>
    </a>
  </article>
</template>
