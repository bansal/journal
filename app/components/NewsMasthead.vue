<script setup lang="ts">
const { journal } = useAppConfig()

const now = ref(new Date())

onMounted(() => {
  const interval = setInterval(() => {
    now.value = new Date()
  }, 60_000)

  onUnmounted(() => clearInterval(interval))
})

const formattedDate = computed(() =>
  now.value.toLocaleDateString(journal.locale, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }),
)
</script>

<template>
  <header class="border-b-2 border-default py-6 text-center">
    <p class="text-xs uppercase tracking-[0.35em] text-muted mb-3">
      {{ formattedDate }}
    </p>

    <NuxtLink
      to="/"
      class="inline-block group"
    >
      <h1 class="font-serif text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-primary group-hover:opacity-80 transition-opacity">
        {{ journal.name }}
      </h1>
    </NuxtLink>

    <p class="mt-3 text-sm text-muted italic">
      {{ journal.tagline }}
    </p>

    <div
      v-if="journal.mastheadSections.length"
      class="mt-5 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs uppercase tracking-widest text-muted"
    >
      <template
        v-for="(section, index) in journal.mastheadSections"
        :key="section"
      >
        <span v-if="index > 0" class="text-muted/40">·</span>
        <span>{{ section }}</span>
      </template>
    </div>
  </header>
</template>
