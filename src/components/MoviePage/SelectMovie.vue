<template>
  <v-sheet border rounded>
    <v-data-table :headers="headers" :items="movies" @click:row="selectMovie">
      <template #top>
        <v-toolbar flat>
          <v-toolbar-title>
            <v-icon
              color="medium-emphasis"
              icon="mdi-movie"
              size="x-small"
              start
            />
            Movies Table
          </v-toolbar-title>
        </v-toolbar>
      </template>

      <template #no-data>
        <v-btn
          prepend-icon="mdi-backup-restore"
          rounded="lg"
          text="Reset Data"
          variant="text"
          border
          @click="reset"
        />
      </template>
    </v-data-table>
  </v-sheet>
</template>

<script setup lang="ts">
import { VDateInput } from "vuetify/labs/components";
import { ref, shallowRef, onMounted } from "vue";
import RepositoryFactory from "@/api/RepositoryFactory";
import { createDefaultMovie, type Movie } from "@/models/movie";

const selectedMovie = defineModel<Movie | null>("selectedMovie", {
  default: [],
});
const alert = ref(false);
const displayErrorsText = ref<string[]>([]);
const movies = ref<Movie[]>([]);

const movieRep = RepositoryFactory.getMovieRepository();

const headers = [
  { title: "Movie ID", value: "movieId" },
  { title: "Title", value: "title" },
  {
    title: "Year",
    value: "year",
  },
];

onMounted(getMovies);

function getMovies() {
  movieRep.get().then((response) => (movies.value = response.data));
}

function selectMovie(event: any, row: any) {
  selectedMovie.value = row.item as Movie;
}

function reset() {
  getMovies();
}
</script>
