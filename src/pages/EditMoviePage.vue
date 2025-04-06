<template>
  <VRow>
    <VCol cols="12">
      <SelectMovie v-model:selected-movie="movie" />
    </VCol>
  </VRow>
</template>

<script setup lang="ts">
import SelectMovie from "@/components/MoviePage/SelectMovie.vue";
import type { Movie } from "@/models/movie";

const movie = ref<Movie | null>(null);
const $router = useRouter();

watch(
  () => movie.value,
  (newMovie) => {
    if (newMovie) {
      $router.push({
        name: "/Movie",
        query: { movieId: newMovie.movieId },
      });
    }
  },
  { immediate: true }
);
</script>
