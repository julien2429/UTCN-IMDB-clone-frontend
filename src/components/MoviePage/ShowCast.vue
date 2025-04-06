<template></template>

<script setup lang="ts">
import type { ActorRoles } from "@/models/movieDetails";

const actorsAndRoles = defineModel<ActorRoles[]>("actorsAndRoles", {
  required: true,
});
</script>
