<template>
  <table class="table-auto w-full border-collapse">
    <thead>
      <tr class="bg-gray-200">
        <th class="px-4 py-2 text-left">Name</th>
        <th class="px-4 py-2 text-left">Role(s)</th>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="entry in listEntries"
        :key="entry.actorId"
        class="cursor-pointer hover:bg-gray-100"
        @click="console.log(entry.actorId)"
      >
        <td class="px-4 py-2">{{ entry.name }}</td>
        <td class="px-4 py-2">{{ entry.roleName }}</td>
      </tr>
    </tbody>
  </table>
</template>

<script setup lang="ts">
import type { ActorRoles } from "@/models/movieDetails";

const actorsAndRoles = defineModel<ActorRoles[] | undefined>("actorsAndRoles", {
  required: true,
});

interface ListEntry {
  name: string;
  roleName: string;
  actorId: string;
}

const listEntries = ref<ListEntry[]>([]);

watch(actorsAndRoles, (newValue) => {
  listEntries.value = newValue!.map((actorRole) => ({
    name: actorRole.actor.firstName + " " + actorRole.actor.lastName,
    roleName: actorRole.roles.map((role) => role.roleName).join(", "),
    actorId: actorRole.actor.personId,
  }));
});

watch(listEntries, (newValue) => {
  console.log("List entries updated:", newValue);
});
</script>
