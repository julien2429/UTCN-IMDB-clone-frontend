<template>
  <VCard class="w-100 h-100">
    <VCardTitle class="w-100">{{ review.rating + "/10" }}</VCardTitle>
    <VCardText class="w-100 h-100">
      <div>{{ review.comment }}</div>
    </VCardText>
  </VCard>
</template>

<script setup lang="ts">
import type { Review } from "@/models/review";
const review = defineModel("review", {
  required: true,
  type: Object as () => Review,
});
</script>
