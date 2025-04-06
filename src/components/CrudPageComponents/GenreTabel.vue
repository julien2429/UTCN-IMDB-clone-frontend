<template>
  <v-sheet border rounded>
    <v-data-table :headers="headers" :items="genres">
      <template #top>
        <v-toolbar flat>
          <v-toolbar-title>
            <v-icon
              color="medium-emphasis"
              icon="mdi-account-group"
              size="x-small"
              start
            />
            Users Table
          </v-toolbar-title>
          <v-spacer />
          <v-btn
            class="me-2"
            prepend-icon="mdi-plus"
            rounded="lg"
            text="Add a Genre"
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
            @click="edit(item.genreId)"
          />
          <v-icon
            color="medium-emphasis"
            icon="mdi-delete"
            size="small"
            @click="remove(item.genreId)"
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
      :subtitle="isEditing ? 'Update Genre' : 'Create Genre'"
      :title="isEditing ? 'Edit Genre' : 'Add Genre'"
    >
      <template #text>
        <v-row>
          <v-col cols="12" md="6">
            <v-text-field v-model="record.title" label="Title" />
          </v-col>
        </v-row>
      </template>

      <v-divider />

      <v-card-actions class="bg-surface-light">
        <v-btn text="Cancel" variant="plain" @click="dialog = false" />
        <v-spacer />
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
import { ref, shallowRef, onMounted } from "vue";
import RepositoryFactory from "@/api/RepositoryFactory";
import { createDefaultGenre, type Genre } from "@/models/genre";
import type { GenreRepository } from "@/api/Repositories/genreRepository";

const alert = ref(false);
const displayErrorsText = ref<string[]>([]);
const genres = ref<Genre[]>([]);
const record = ref<Genre>(createDefaultGenre());
const dialog = shallowRef(false);
const isEditing = shallowRef(false);

const genreRep = RepositoryFactory.get("genre") as typeof GenreRepository;

const headers = [
  { title: "Genre ID", value: "genreId" },
  { title: "Title", value: "title" },
  { title: "Actions", value: "actions", sortable: false },
];

onMounted(getGenres);

function getGenres() {
  genreRep.get().then((response) => (genres.value = response.data));
}

function add() {
  isEditing.value = false;
  record.value = createDefaultGenre();
  dialog.value = true;
}

async function edit(genreId: string) {
  isEditing.value = true;
  record.value = await genreRep
    .getGenre(genreId)
    .then((response) => response.data);
  dialog.value = true;
}

function remove(genreId: string) {
  genreRep.delete(genreId).then(getGenres);
}

async function save() {
  try {
    if (isEditing.value) {
      await genreRep.put(record.value);
    } else {
      await genreRep.post(record.value);
    }
    dialog.value = false;
    getGenres();
  } catch (error) {
    displayErrors(error);
  }
}

function displayErrors(data: any) {
  alert.value = true;
  let erros = data.response.data;
  for (let key in erros) {
    displayErrorsText.value.push(erros[key]);
  }
  setTimeout(() => {
    alert.value = false;
    displayErrorsText.value = [];
  }, 5000);
}

function reset() {
  getGenres();
}
</script>
