<script setup>
const { journal } = useAppConfig();

useHead({
  meta: [{ name: "viewport", content: "width=device-width, initial-scale=1" }],
  htmlAttrs: {
    lang: journal.lang || "en",
  },
});

useSeoMeta({
  title: journal.name,
  description: journal.description,
  ogTitle: journal.name,
  ogDescription: journal.description,
  twitterCard: "summary_large_image",
});

const year = useState("footer-year", () => new Date().getFullYear());

const footerItems = computed(() => [
  {
    label: "Made By Bansal",
    to: "https://bansal.io/journal",
  },
  {
    label: "Featured On",
    to: "https://pitchwall.co/product/my-journal",
  },
]);
</script>

<template>
  <UApp>
    <UMain>
      <UContainer class="py-6 sm:py-10">
        <NuxtPage />
      </UContainer>
    </UMain>

    <USeparator />
    <UFooter>
      <template #left>
        <p class="text-xs text-muted">
          <span>© {{ year }} {{ journal.name }}</span>
        </p>
      </template>
      <UNavigationMenu
        :items="footerItems"
        variant="link"
        :ui="{ link: 'text-xs text-muted' }"
      />
      <template #right>
        <UColorModeButton size="xs" />
      </template>
    </UFooter>
  </UApp>
</template>
