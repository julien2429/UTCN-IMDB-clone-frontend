<template>
  <v-sheet border rounded>
    <v-data-table :headers="headers" :items="persons">
      <template #top>
        <v-toolbar flat>
          <v-toolbar-title>
            <v-icon
              color="medium-emphasis"
              icon="mdi-account-group"
              size="x-small"
              start
            />
            Persons Table
          </v-toolbar-title>
          <v-spacer />
          <v-btn
            class="me-2"
            prepend-icon="mdi-plus"
            rounded="lg"
            text="Add a Person"
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
            @click="edit(item.personId)"
          />
          <v-icon
            color="medium-emphasis"
            icon="mdi-delete"
            size="small"
            @click="remove(item.personId)"
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
      :subtitle="isEditing ? 'Update Person' : 'Create Person'"
      :title="isEditing ? 'Edit Person' : 'Add Person'"
    >
      <template #text>
        <v-row>
          <v-col cols="12" md="6">
            <v-text-field v-model="record.firstName" label="First Name" />
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field v-model="record.lastName" label="Last Name" />
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field v-model="record.gender" label="Gender" />
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field v-model="record.nationality" label="Nationality" />
          </v-col>
          <v-col cols="12" md="6">
            <v-date-input v-model="record.birthDate" label="Birth Date" />
          </v-col>
          <v-col cols="12" md="6">
            <v-date-input v-model="record.deathDate" label="Death Date" />
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
import { createDefaultPerson, type Person } from "@/models/person";
import { VDateInput } from "vuetify/labs/components";
import type { PersonRepository } from "@/api/Repositories/personRepository";

const alert = ref(false);
const displayErrorsText = ref<string[]>([]);
const persons = ref<Person[]>([]);
const record = ref<Person>(createDefaultPerson());
const dialog = shallowRef(false);
const isEditing = shallowRef(false);

const personRep = RepositoryFactory.get("person") as typeof PersonRepository;

const headers = [
  { title: "Person ID", value: "personId" },
  { title: "First Name", value: "firstName" },
  { title: "Last Name", value: "lastName" },
  { title: "Gender", value: "gender" },
  { title: "Nationality", value: "nationality" },
  { title: "birthDate", value: "birthDate" },
  { title: "deathDate", value: "deathDate" },
  { title: "Actions", value: "actions", sortable: false },
];

onMounted(getPersons);

function getPersons() {
  personRep.get().then((response) => (persons.value = response.data));
}

function add() {
  isEditing.value = false;
  record.value = createDefaultPerson();
  dialog.value = true;
}

async function edit(personId: string) {
  isEditing.value = true;
  record.value = await personRep
    .getPerson(personId)
    .then((response) => response.data);
  dialog.value = true;
}

function remove(personId: string) {
  personRep.delete(personId).then(getPersons);
}

async function save() {
  try {
    if (isEditing.value) {
      await personRep.put(record.value);
    } else {
      await personRep.post(record.value);
    }
    dialog.value = false;
    getPersons();
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
  getPersons();
}
</script>
