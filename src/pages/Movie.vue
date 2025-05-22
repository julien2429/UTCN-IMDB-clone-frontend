<template>
  <VContainer>
    <VRow>
      <VCard class="w-100">
        <VCardText class="d-flex py-2 pt-10 w-100">
          <VImg
            :height="500"
            :width="300"
            aspect-ratio="16/9"
            class="image-size flex-grow-0 ml-4"
            :cover="true"
            :src="imageUrl"
          />

          <div class="ml-10 d-flex flex-column w-50">
            <div>
              <h1>{{ movie?.title }}</h1>
              <h3>{{ dateString }}</h3>
              <VRating
                :model-value="movie?.averageCriticRating"
                label="Rating"
                color="amber"
                background-color="grey lighten-4"
                size="30"
                length="10"
                item-value="1"
                item-label="1"
                item-icon="mdi-star"
              />

              <div class="d-flex my-4">
                <VBtn
                  v-if="!isInFavorites"
                  color="red lighten-2"
                  class="mr-2"
                  prepend-icon="mdi-heart"
                  @click="addToFavorites"
                >
                  Add to Favorites
                </VBtn>
                <VBtn
                  v-else
                  color="red lighten-2"
                  class="mr-2"
                  prepend-icon="mdi-heart"
                  @click="removeFromFavorites"
                >
                  Remove From Favorites
                </VBtn>
                <VBtn
                  v-if="!isInWatchLater"
                  color="blue lighten-2"
                  class="mr-2"
                  prepend-icon="mdi-clock-outline"
                  @click="addToWatchLater"
                >
                  Watch Later
                </VBtn>
                <VBtn
                  v-else
                  color="blue lighten-2"
                  class="mr-2"
                  prepend-icon="mdi-clock-outline"
                  @click="removeFromWatchLater"
                >
                  Remove From Watch Later
                </VBtn>
              </div>
            </div>
            <v-divider></v-divider>
            <div class="my-4" v-if="movie?.director">
              <h2>Director: {{ movie?.director }}</h2>
            </div>
            <v-divider></v-divider>
            <div class="my-4">
              <h2>Description</h2>
              <VCard class="pa-4 elevation-0 border-radius-">
                <span class="text-body-1">
                  {{ movie?.description }}
                </span>
              </VCard>
              <v-divider></v-divider>
              <h3 class="mt-4 mb-4">Genres</h3>
              <div class="d-flex flex-wrap">
                <VChip
                  v-for="genre in movie?.genre"
                  class="mr-2 mb-2"
                  color="blue-grey lighten-4"
                  text-color="blue-grey darken-4"
                >
                  {{ genre.title }}
                </VChip>
              </div>
            </div>

            <v-divider></v-divider>
            <ShowCast :actors-and-roles="movie?.actorsAndRoles" />
          </div>
        </VCardText>
      </VCard>
    </VRow>
    <VRow class="d-flex py-2">
      <VCard class="w-100">
        <VCardTitle>Rating Summary</VCardTitle>
        <ReviewStats v-bind:reviews="movie?.userReviews ?? []" />
      </VCard>
    </VRow>
    <VRow class="d-flex py-2">
      <VCard class="w-100">
        <AddAReview :movieId="movieId" @submitted="fetchDetails" />
      </VCard>
    </VRow>
    <VRow class="d-flex py-2">
      <VCard class="w-100">
        <VCardTitle>User Reviews</VCardTitle>
        <VCardText>
          <VList dense nav>
            <VListItem
              v-for="review in movie?.userReviews"
              :key="review.reviewId"
              class="mb-4"
            >
              <VListItemContent>
                <div class="d-flex align-center mb-2">
                  <VRating
                    :model-value="review.rating"
                    color="amber"
                    background-color="grey lighten-4"
                    size="20"
                    length="10"
                    item-icon="mdi-star"
                    class="mr-2"
                  />
                  <span class="text-subtitle-2 font-weight-medium">
                    {{ review.rating }}/10
                  </span>
                </div>
                <VListItemSubtitle class="text-body-2 text-wrap">
                  "{{ review.comment }}"
                </VListItemSubtitle>
              </VListItemContent>
            </VListItem>
          </VList>
        </VCardText>
      </VCard>
    </VRow>
    <VRow class="d-flex py-2">
      <VCard class="w-100">
        <VCardTitle>Critic Reviews</VCardTitle>
        <VCardText>
          <VList dense nav>
            <VListItem
              v-for="review in movie?.criticReviews"
              :key="review.reviewId"
              class="mb-4"
            >
              <VListItemContent>
                <div class="d-flex align-center mb-2">
                  <VRating
                    :model-value="review.rating"
                    color="amber"
                    background-color="grey lighten-4"
                    size="20"
                    length="10"
                    item-icon="mdi-star"
                    class="mr-2"
                  />
                  <span class="text-subtitle-2 font-weight-medium">
                    {{ review.rating }}/10
                  </span>
                </div>
                <VListItemSubtitle class="text-body-2 text-wrap">
                  "{{ review.comment }}"
                </VListItemSubtitle>
              </VListItemContent>
            </VListItem>
          </VList>
        </VCardText>
      </VCard>
    </VRow>
  </VContainer>
</template>

<script setup lang="ts">
import type { MovieRepository } from "@/api/Repositories/movieRepository";
import type { S3Repository } from "@/api/Repositories/S3Repository";
import RepositoryFactory from "@/api/RepositoryFactory";
import type { UserService } from "@/api/Services/userService";
import ServicesFactory from "@/api/ServicesFactory";
import AddAReview from "@/components/ReviewComponents/AddAReview.vue";
import type { ListResponseDTO } from "@/models/lists";
import type { Movie } from "@/models/movie";
import {
  createDefaultMovieDetails,
  type MovieDetails,
} from "@/models/movieDetails";
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";

definePage({
  name: "Movie",
  meta: {
    title: "Movie",
    requiresAuth: true,
  },
});

///////////////////////// repositories /////////////////////////
const s3Repo = RepositoryFactory.get("s3") as typeof S3Repository;
const movieRepo = RepositoryFactory.get("movie") as typeof MovieRepository;
const userService = ServicesFactory.get("user") as typeof UserService;

const $router = useRouter();
const movieId = $router.currentRoute.value.query.movieId as string;
const imageUrl = ref<string | undefined>(undefined);
const movie = ref<MovieDetails | null>(null);

const isInFavorites = ref(false);
const isInWatchLater = ref(false);
const lists = ref<ListResponseDTO[]>([]);

const dateString = computed(() => {
  if (movie.value?.year) {
    const date = new Date(movie.value.year);
    return date.toLocaleDateString("en-EU", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }
  return null;
});

onMounted(() => {
  fetchDetails();
});

onMounted(() => {
  console.log(movie.value);
});

function checkIfMovieIsInLists() {
  const userId = localStorage.getItem("userId");

  if (!userId) {
    return;
  }

  userService
    .findMovieInLists(userId, movieId)
    .then((response) => {
      const listNames = response.data as String[];
      if (listNames.includes("Favorites")) {
        isInFavorites.value = true;
      } else {
        isInFavorites.value = false;
      }

      if (listNames.includes("Watchlist")) {
        isInWatchLater.value = true;
      } else {
        isInWatchLater.value = false;
      }
    })
    .catch((error) => {
      console.error("Error checking movie in lists:", error);
    });
}

function getUserLists() {
  const userId = localStorage.getItem("userId");
  if (!userId) {
    return;
  }
  userService
    .fetchUserLists(userId)
    .then((response) => {
      lists.value = response.data;
    })
    .catch((error) => {
      console.error("Error fetching user lists:", error);
    });
}

function fetchDetails() {
  movie.value = createDefaultMovieDetails();
  if (movieId) {
    movieRepo.getMovieDetails(movieId).then((response) => {
      movie.value = response.data;
      console.log(movie.value);
      if (movie.value?.imageUrl) {
        s3Repo.getImageUrl(movie.value.imageUrl).then((url) => {
          imageUrl.value = url;
        });
      }
    });
  }
  getUserLists();
  checkIfMovieIsInLists();
}

function addToFavorites() {
  const userId = localStorage.getItem("userId");
  if (!userId) {
    return;
  }
  userService
    .addToList(
      userId,
      lists.value.find((entry) => entry.listName === "Favorites")?.listId ?? "",
      movieId
    )
    .then(() => {
      isInFavorites.value = true;
    })
    .catch((error) => {
      console.error("Error adding movie to favorites:", error);
    });
}

function removeFromFavorites() {
  const userId = localStorage.getItem("userId");
  if (!userId) {
    return;
  }
  userService
    .removeFromList(
      userId,
      lists.value.find((entry) => entry.listName === "Favorites")?.listId ?? "",
      movieId
    )
    .then(() => {
      isInFavorites.value = false;
    })
    .catch((error) => {
      console.error("Error removing movie from favorites:", error);
    });
}

function addToWatchLater() {
  const userId = localStorage.getItem("userId");
  if (!userId) {
    return;
  }
  userService
    .addToList(
      userId,
      lists.value.find((entry) => entry.listName === "Watchlist")?.listId ?? "",
      movieId
    )
    .then(() => {
      isInWatchLater.value = true;
    })
    .catch((error) => {
      console.error("Error adding movie to watch later:", error);
    });
}

function removeFromWatchLater() {
  const userId = localStorage.getItem("userId");
  if (!userId) {
    return;
  }
  userService
    .removeFromList(
      userId,
      lists.value.find((entry) => entry.listName === "Watchlist")?.listId ?? "",
      movieId
    )
    .then(() => {
      isInWatchLater.value = false;
    })
    .catch((error) => {
      console.error("Error removing movie from watch later:", error);
    });
}
</script>

<style scoped lang="scss">
.image-size {
  background-color: aliceblue;
  border-radius: 10px;
}
</style>
