<script setup lang="ts">
import type { JournalConfig } from "../../shared/types/news";
const { journal } = useAppConfig() as { journal: JournalConfig };
</script>

<template>
  <div>
    <Heading>{{ journal.sections.externalLinks }}</Heading>
    <ul class="space-y-2 text-xs leading-relaxed">
      <li v-for="link in journal.externalLinks" :key="link.id">
        <a
          :href="link.href"
          target="_blank"
          rel="noopener"
          class="text-muted hover:text-default hover:underline underline-offset-2 transition-colors"
        >
          {{ link.name }}
        </a>
      </li>
    </ul>
  </div>
</template>
