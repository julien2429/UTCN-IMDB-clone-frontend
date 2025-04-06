<template>
  <VContainer>
    <VRow>
      <VCard class="w-100">
        <VCardText class="d-flex py-2 w-100">
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
            </div>
            <div class="my-2">
              <h2>Director: {{ movie?.director }}</h2>
            </div>
            <VTextarea
              :model-value="movie?.description"
              label="Description"
              readonly
              filled
            ></VTextarea>
          </div>
        </VCardText>
        <VCardActions class="d-flex justify-end">
          <VBtn color="primary" variant="text" class="ml-2">
            Back to Home
          </VBtn>
          <VBtn color="primary" variant="text" class="ml-2">
            Back to Movie List
          </VBtn>
        </VCardActions>
      </VCard>
    </VRow>
    <VRow class="d-flex py-2">
      <VCard class="w-100">
        <AddAReview :movieId="movieId" />
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
import AddAReview from "@/components/ReviewComponents/AddAReview.vue";
import type { Movie } from "@/models/movie";
import {
  createDefaultMovieDetails,
  type MovieDetails,
} from "@/models/movieDetails";
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";

///////////////////////// repositories /////////////////////////
const s3Repo = RepositoryFactory.get("s3") as typeof S3Repository;
const movieRepo = RepositoryFactory.get("movie") as typeof MovieRepository;

const $router = useRouter();
const movieId = $router.currentRoute.value.query.movieId as string;
const imageUrl = ref<string | undefined>(undefined);
const movie = ref<MovieDetails | null>(null);

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
});
</script>

<style scoped lang="scss">
.image-size {
  background-color: aliceblue;
  border-radius: 10px;
}
</style>
