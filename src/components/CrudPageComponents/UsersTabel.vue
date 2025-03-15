<template>
  <v-sheet border rounded>
    <v-data-table :headers="headers" :items="users">
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
            text="Add a User"
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
            @click="edit(item.userId)"
          />
          <v-icon
            color="medium-emphasis"
            icon="mdi-delete"
            size="small"
            @click="remove(item.userId)"
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
      :subtitle="isEditing ? 'Update User' : 'Create User'"
      :title="isEditing ? 'Edit User' : 'Add User'"
    >
      <template #text>
        <v-row>
          <v-col cols="12" md="6">
            <v-text-field v-model="record.email" label="Email" />
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field v-model="record.username" label="Username" />
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field v-model="record.password" label="Password" />
          </v-col>
          <v-col cols="12" md="6">
            <VSelect
              v-model="record.role"
              :items="availableRoles"
              label="Role"
            />
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
import { UserRole } from "@/enums/UserRole";
import { createDefaultUser } from "@/models/user";
import type { User } from "@/models/user";
import { VSelect } from "vuetify/components";

const alert = ref(false);
const displayErrorsText = ref<string[]>([]);

const users = ref<User[]>([]);
const record = ref<User>(createDefaultUser());
const dialog = shallowRef(false);
const isEditing = shallowRef(false);
const availableRoles = [
  UserRole.UNKNOWN,
  UserRole.ADMIN,
  UserRole.NORMAL,
  UserRole.REVIEWER,
];

const headers = [
  { title: "User ID", value: "userId" },
  { title: "Email", value: "email" },
  { title: "Username", value: "username" },
  { title: "Password", value: "password" },
  { title: "Role", value: "role" },
  { title: "Actions", value: "actions", sortable: false },
];

onMounted(getUsers);

function getUsers() {
  RepositoryFactory.get("user")
    .get()
    .then((response) => {
      users.value = response.data;
    });
}

function add() {
  isEditing.value = false;
  record.value = createDefaultUser();
  dialog.value = true;
}

async function edit(userId: string) {
  isEditing.value = true;
  record.value = await RepositoryFactory.get("user")
    .getUser(userId)
    .then((response) => response.data);
  dialog.value = true;
}

function remove(userId: string) {
  RepositoryFactory.get("user").delete(userId).then(getUsers);
}

async function save() {
  try {
    if (isEditing.value) {
      await RepositoryFactory.get("user").put(record.value);
    } else {
      await RepositoryFactory.get("user").post(record.value);
    }
    dialog.value = false;
    getUsers();
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
  getUsers();
}
</script>
