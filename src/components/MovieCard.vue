<template>
  <VCard class="w-100 h-100 card-height">
    <VCardTitle class="w-100">{{ movie.title }}</VCardTitle>
    <VCardText class="w-100 h-100">
      <VImg v-if="imageUrl" :src="imageUrl" />
    </VCardText>
  </VCard>
</template>

<script setup lang="ts">
import type { S3Repository } from "@/api/Repositories/S3Repository";
import RepositoryFactory from "@/api/RepositoryFactory";

import type { Movie } from "@/models/movie";

import { ref, onMounted } from "vue";

const s3Repo = RepositoryFactory.get("s3") as typeof S3Repository;

const movie = defineModel<Movie>("movie", {
  required: true,
});

const imageUrl = ref<string | null>(null);

onMounted(async () => {
  if (movie.value.imageUrl)
    // imageUrl.value = await s3Repo.getImageUrl(movie.value.imageUrl);
    console.log(imageUrl.value);
});
</script>

<style scoped lang="scss">
.card-height {
  min-height: 500px !important;
  height: 500px !important;
  max-height: 500px !important;

  max-width: 300px !important;
  width: 300px !important;
  min-width: 300px !important;
}
</style>
