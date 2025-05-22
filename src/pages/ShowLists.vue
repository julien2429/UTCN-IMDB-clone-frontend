<template>
  <VContainer>
    <VRow class="d-flex justify-center align-center">
      <VCol cols="12" class="text-center">
        <h1>Lists</h1>
      </VCol>
    </VRow>

    <VRow>
      <ListCard
        class="my-2"
        v-for="(list, index) in movieList"
        v-model:list-entry="movieList[index]"
        :key="index"
        :ListEntry="list"
      />
    </VRow>
  </VContainer>
</template>

<script setup lang="ts">
import RepositoryFactory from "@/api/RepositoryFactory";
import type { UserService } from "@/api/Services/userService";
import ServicesFactory from "@/api/ServicesFactory";
import ListCard from "@/components/ShowListComponents/ListCard.vue";
import type { ListResponseDTO } from "@/models/lists";

definePage({
  meta: {
    requiresAuth: true,
  },
});

const movieList: Ref<ListResponseDTO[]> = ref([]);

const movieListRepository = ServicesFactory.get("user") as typeof UserService;

onMounted(async () => {
  try {
    const userId = localStorage.getItem("userId");
    const response = await movieListRepository.fetchUserLists(userId!);
    movieList.value = response.data;
  } catch (error) {
    console.error("Error fetching lists:", error);
  }

  console.log(movieList.value);
});
</script>
