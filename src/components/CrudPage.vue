<template>
  <VRow>
    <VCol cols="12">
      <MovieTabel />
    </VCol>
    <VCol cols="12">
      <PersonTabel />
    </VCol>
    <VCol cols="12">
      <UsersTabel />
    </VCol>
    <VCol cols="12">
      <GenreTabel />
    </VCol>
  </VRow>
</template>

<script setup lang="ts">
import { VRow } from "vuetify/components";
import PersonTabel from "./CrudPageComponents/PersonTabel.vue";
</script>
