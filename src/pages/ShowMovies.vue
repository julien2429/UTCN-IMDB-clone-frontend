<template>
  <VContainer>
    <VRow class="d-flex justify-center align-center">
      <VCol cols="12" class="text-center">
        <h1>Movies</h1>
      </VCol>
    </VRow>
    <VRow class="d-flex justify-center align-center mb-4">
      <VCol cols="12">
        <VCard outlined>
          <VCardTitle class="d-flex justify-space-between align-center">
            <span>Filters</span>
            <VBtn icon @click="filtersExpanded = !filtersExpanded" :flat="true">
              <VIcon>{{
                filtersExpanded ? "mdi-chevron-up" : "mdi-chevron-down"
              }}</VIcon>
            </VBtn>
          </VCardTitle>
          <VExpandTransition>
            <div v-show="filtersExpanded">
              <VCardText>
                <VRow class="d-flex">
                  <VCol cols="12" md="3">
                    <VTextField
                      v-model="movieFilers.title"
                      label="Search Movies"
                      outlined
                      dense
                      clearable
                    />
                  </VCol>
                  <VCol cols="12" md="3">
                    <VSelect
                      v-model="movieFilers.genresNames"
                      :items="genres"
                      label="Filter by Genre"
                      outlined
                      dense
                      multiple
                      clearable
                    />
                  </VCol>
                  <VCol cols="12" md="3">
                    <VDateInput
                      v-model="movieFilers.startDate"
                      label="Start date"
                      outlined
                    ></VDateInput>
                    <VDateInput
                      v-model="movieFilers.endDate"
                      label="End date"
                      outlined
                    ></VDateInput>
                  </VCol>
                  <VCol cols="12" md="3">
                    <VBtn
                      @click="searchMovies"
                      color="primary"
                      class="w-100 mt-auto"
                      >Search</VBtn
                    >
                  </VCol>
                </VRow>
              </VCardText>
            </div>
          </VExpandTransition>
        </VCard>
      </VCol>
    </VRow>
    <VRow>
      <div v-for="movie in movies" :key="movie.movieId" class="px-2 py-6">
        <div @dblclick="displayMovie(movie)">
          <MovieCard :movie="movie" />
        </div>
      </div> </VRow
  ></VContainer>
</template>

<script setup lang="ts">
import type { MovieRepository } from "@/api/Repositories/movieRepository";
import RepositoryFactory from "@/api/RepositoryFactory";
import type { Movie } from "@/models/movie";
import type { MovieFilters } from "@/models/movieFilters";
import router from "@/router";
import { ref, onMounted } from "vue";
import { VDateInput } from "vuetify/labs/VDateInput";

definePage({
  meta: {
    requiresAuth: true,
  },
});

const movieRepo = RepositoryFactory.get("movie") as typeof MovieRepository;
const movies = ref<Movie[]>([]);
const filtersExpanded = ref(false);
const genres = ref<string[]>([]);
const genresRepo = RepositoryFactory.get("genre") as typeof MovieRepository;

const movieFilers = ref<MovieFilters>({
  title: "",
  director: null,
  genresNames: [],
  startDate: null,
  endDate: null,
});

onMounted(() => {
  genresRepo.get().then((response) => {
    genres.value = response.data.map((genre) => genre.title);
  });

  movieRepo.get().then((response) => {
    movies.value = response.data;
  });
});

function displayMovie(movie: Movie) {
  const movieId = movie.movieId;
  router.push({
    name: "Movie",
    query: { movieId },
  });
}

function searchMovies() {
  movieRepo
    .getMoviesByFilters(movieFilers.value)
    .then((response) => {
      movies.value = response.data;
    })
    .catch((error) => {
      console.error("Error fetching movies:", error);
    });
}
</script>
