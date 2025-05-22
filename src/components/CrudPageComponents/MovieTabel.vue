<template>
  <v-sheet border rounded>
    <v-data-table :headers="headers" :items="movies">
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
          <v-spacer />
          <v-btn
            class="me-2"
            prepend-icon="mdi-plus"
            rounded="lg"
            text="Add a Movie"
            border
            @click="add"
          />
        </v-toolbar>
      </template>

      <template #item.actions="{ item }">
        <div class="d-flex ga-2 justify-end">
          <v-icon
            color="medium-emphasis"
            icon="mdi-pencil"
            size="small"
            @click="edit(item.movieId)"
          />
          <v-icon
            color="medium-emphasis"
            icon="mdi-delete"
            size="small"
            @click="remove(item.movieId)"
          />
        </div>
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

  <v-dialog v-model="dialog" max-width="500">
    <v-card
      :subtitle="isEditing ? 'Update Movie' : 'Create Movie'"
      :title="isEditing ? 'Edit Movie' : 'Add Movie'"
    >
      <template #text>
        <v-row>
          <v-col cols="12" md="6">
            <v-text-field v-model="record.title" label="Title" />
          </v-col>
          <v-col cols="12" md="6">
            <v-date-input v-model="record.releaseYear" label="year" />
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field v-model="record.description" label="Description" />
          </v-col>
          <v-col cols="12" md="6">
            <v-file-input
              v-if="isEditing"
              v-model:model-value="fileToUpload"
              label="Image URL"
              accept="image/*"
              show-size
            ></v-file-input>
          </v-col>
        </v-row>
      </template>

      <v-divider />

      <v-card-actions class="bg-surface-light">
        <v-btn text="Cancel" variant="plain" @click="dialog = false" />
        <v-spacer />
        <v-btn v-if="isEditing" text="ChangeImage" @click="changeImage" />
        <v-btn text="Save" @click="save" />
      </v-card-actions>
    </v-card>
  </v-dialog>

  <v-dialog v-model="alert">
    <v-card>
      <v-card-title class="headline">Errors</v-card-title>
      <v-card-text>
        <div v-for="error in displayErrorsText" :key="error">
          {{ error }}
        </div>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" text @click="alert = false">Close</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { VDateInput } from "vuetify/labs/components";
import { ref, shallowRef, onMounted } from "vue";
import RepositoryFactory from "@/api/RepositoryFactory";
import { createDefaultMovie, type Movie } from "@/models/movie";
import type { MovieRepository } from "@/api/Repositories/movieRepository";
import { S3Repository } from "@/api/Repositories/S3Repository";

const alert = ref(false);
const displayErrorsText = ref<string[]>([]);
const movies = ref<Movie[]>([]);
const record = ref<Movie>(createDefaultMovie());
const dialog = shallowRef(false);
const isEditing = shallowRef(false);

const fileToUpload = ref<File>();

const movieRep = RepositoryFactory.get("movie") as typeof MovieRepository;

const headers = [
  { title: "Movie ID", value: "movieId" },
  { title: "Title", value: "title" },
  { title: "Description", value: "description" },
  {
    title: "releaseYear",
    value: "releaseYear",
  },
  {
    title: "Image URL",
    value: "imageUrl",
  },
  { title: "Actions", value: "actions", sortable: false },
];

onMounted(getMovies);

function getMovies() {
  movieRep.get().then((response) => (movies.value = response.data));
}

function add() {
  isEditing.value = false;
  record.value = createDefaultMovie();
  dialog.value = true;
}

async function edit(movieId: string) {
  isEditing.value = true;
  record.value = await movieRep
    .getMovie(movieId)
    .then((response) => response.data);
  dialog.value = true;
}

function remove(movieId: string) {
  movieRep.delete(movieId).then(getMovies);
}

async function changeImage() {
  if (fileToUpload.value) {
    try {
      await S3Repository.changeImage(record.value.movieId, fileToUpload.value);
      getMovies();
    } catch (error) {
      displayErrors(error);
    }
  }
}

async function save() {
  try {
    if (isEditing.value) {
      await movieRep.put(record.value);
    } else {
      await movieRep.post(record.value);
    }
    dialog.value = false;
    getMovies();
  } catch (error) {
    displayErrors(error);
  }
}

function displayErrors(data: any) {
  alert.value = true;
  let errors = data.response.data;
  for (let key in errors) {
    displayErrorsText.value.push(errors[key]);
  }
  setTimeout(() => {
    alert.value = false;
    displayErrorsText.value = [];
  }, 5000);
}

function reset() {
  getMovies();
}
</script>
