<template>
  <VContainer>
    <VRow>
      <VCol cols="12" md="6">
        <VSelect
          v-model="selectedMovieId"
          :items="movies"
          item-title="title"
          item-value="movieId"
          label="Select Movie"
        />
      </VCol>
    </VRow>
    <VRow v-if="selectedMovieRoles">
      <VCol cols="12" md="6">
        <VCard>
          <VCardTitle>Edit/Delete Roles</VCardTitle>
          <VCardText>
            <VList>
              <VListItem v-for="(role, idx) in selectedMovieRoles">
                <VListItemContent>
                  <div class="d-flex align-center">
                    <span class="mr-2">{{ role.actorName }} as</span>
                    <VTextField
                      v-model="role.roleName"
                      dense
                      hide-details
                      style="max-width: 200px"
                    />
                    <VBtn
                      icon
                      class="mr-0 ml-auto"
                      color="green"
                      @click="updateRole(role)"
                    >
                      <VIcon>mdi-pen</VIcon>
                    </VBtn>
                    <VBtn
                      icon
                      class="mr-0 ml-2"
                      color="red"
                      @click="deleteRole(role)"
                    >
                      <VIcon>mdi-delete</VIcon>
                    </VBtn>
                  </div>
                </VListItemContent>
              </VListItem>
            </VList>
          </VCardText>
        </VCard>
      </VCol>
      <VCol cols="12" md="6">
        <VCard>
          <VCardTitle>Add New Role</VCardTitle>
          <VCardText>
            <VSelect
              v-model="selectedActor"
              :items="actors"
              :item-title="(actor) => actor.firstName + ' ' + actor.lastName"
              label="Select Actor"
              return-object
            />
            <VTextField v-model="roleName" label="Role Name" class="mt-2" />
            <VBtn
              color="primary"
              class="mt-2"
              :disabled="selectedActor === null || roleName === ''"
              @click="addRole"
            >
              Add Role
            </VBtn>
          </VCardText>
        </VCard>
      </VCol>

      <VCol cols="12" md="6">
        <VCard>
          <VCardTitle>Edit Genres</VCardTitle>
          <VCardText>
            <VSelect
              v-model="selectedGenres"
              :items="genres"
              item-title="title"
              item-value="genreId"
              label="Select Genres"
              multiple
              return-object
              chips
            />
            <VBtn
              color="primary"
              class="mt-2"
              :disabled="!selectedMovieId || selectedGenres.length === 0"
              @click="modifyGenres"
            >
              Save Genres
            </VBtn>
          </VCardText>
        </VCard>
      </VCol>
    </VRow>
  </VContainer>
</template>

<script setup lang="ts">
import RepositoryFactory from "@/api/RepositoryFactory";
import type { MovieRepository } from "@/api/Repositories/movieRepository";
import type { PersonRepository } from "@/api/Repositories/personRepository";
import type { MovieDetails } from "@/models/movieDetails";
import type { Person } from "@/models/person";
import type { MovieCastResponse } from "@/models/MovieCastResponse";
import type { Genre } from "@/models/genre";
import type { GenreRepository } from "@/api/Repositories/genreRepository";

const movieRepo = RepositoryFactory.get("movie") as typeof MovieRepository;
const actorRepo = RepositoryFactory.get("person") as typeof PersonRepository;
const personRepo = RepositoryFactory.get("person") as typeof PersonRepository;
const genreRepo = RepositoryFactory.get("genre") as typeof GenreRepository;

const movies = ref<MovieDetails[]>([]);
const actors = ref<Person[]>([]);
const selectedMovieId = ref<string | null>(null);
const selectedMovieRoles = ref<MovieCastResponse[] | null>(null);

const selectedActor = ref<Person | null>(null);
const roleName = ref<string | null>(null);
const genres = ref<Genre[]>([]);
const selectedGenres = ref<Genre[]>([]);

onMounted(async () => {
  const movieRes = await movieRepo.get();
  movies.value = movieRes.data;
  const actorRes = await personRepo.get();
  actors.value = actorRes.data;
  const genreRes = await genreRepo.get();
  genres.value = genreRes.data;
});

watch(
  () => selectedMovieId.value,
  async (newValue) => {
    await onMovieSelect();
  }
);

async function onMovieSelect() {
  if (!selectedMovieId.value) {
    selectedMovieRoles.value = null;
    return;
  }

  selectedGenres.value = await movieRepo
    .getGenresByMovie(selectedMovieId.value)
    .then((res) => res.data);

  const res = await movieRepo.getRoles(selectedMovieId.value);
  selectedMovieRoles.value = res.data;

  console.log(selectedGenres.value);
  console.log(genres.value);
}

async function updateRole(role: any) {
  console.log(role);
  if (!selectedMovieId.value) return;
  await movieRepo.editRoleInMovie(role.movieCastId, role.roleName);
}

async function deleteRole(role: any) {
  if (!selectedMovieId.value) return;
  await movieRepo.removeRoleFromMovie(role.movieCastId);
  await onMovieSelect();
}

async function addRole() {
  console.log(selectedActor.value, roleName.value);
  if (
    !selectedMovieId.value ||
    !selectedActor.value?.personId ||
    !roleName.value ||
    roleName.value === ""
  )
    return;
  await movieRepo.addRoleToMovie(
    selectedMovieId.value,
    selectedActor.value?.personId,
    roleName.value
  );

  selectedActor.value = null;
  roleName.value = "";
  await onMovieSelect();
}

async function modifyGenres() {
  if (!selectedMovieId.value) return;

  const genreUUIDs = selectedGenres.value.map((genre) => genre.genreId);

  const res = await movieRepo.addGerneToMovie(
    selectedMovieId.value,
    genreUUIDs
  );
}
</script>
