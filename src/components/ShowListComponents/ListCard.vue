<template>
  <VCard class="w-100 h-100 card-height">
    <VCardTitle class="w-100">{{ ListEntry.listName }}</VCardTitle>
    <VCardText class="w-100 h-100">
      <VRow class="d-flex overflow-x-scroll">
        <MovieCard
          v-for="(movie, index) in ListEntry.movieList"
          :key="index"
          :movie="movie"
        />
      </VRow>
    </VCardText>
  </VCard>
</template>

<script setup lang="ts">
import type { ListResponseDTO } from "@/models/lists";
import type { Review } from "@/models/review";

const ListEntry = defineModel("listEntry", {
  required: true,
  type: Object as () => ListResponseDTO,
});
</script>
