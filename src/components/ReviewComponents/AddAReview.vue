<template>
  <VCard class="w-100 h-100">
    <VCardTitle class="w-100">Add a review</VCardTitle>
    <VCardText>
      <VRating
        v-model="review.rating"
        label="Rating"
        color="amber"
        background-color="grey lighten-4"
        size="30"
        length="10"
        item-value="1"
        item-label="1"
        item-icon="mdi-star"
      />

      <VTextarea
        v-model="review.comment"
        label="Comment"
        rows="5"
        outlined
        auto-grow
      />
    </VCardText>
    <VCardActions class="d-flex justify-end">
      <VBtn @click="submitReview" color="primary" variant="text" class="ml-2">
        Submit Review
      </VBtn>
      <VBtn @click="clearReview" color="grey" variant="text" class="ml-2">
        Cancel Review
      </VBtn>
    </VCardActions>
  </VCard>
</template>

<script setup lang="ts">
import { UserService } from "@/api/Services/userService";
import ServicesFactory from "@/api/ServicesFactory";
import { createDefaultReview, type Review } from "@/models/review";
import type { ReviewRequest } from "@/models/reviewRequest";

const emits = defineEmits(["submitted"]);

const movieId = defineModel("movieId", {
  required: true,
  type: String,
});

const review = ref(createDefaultReview());

function clearReview() {
  review.value = createDefaultReview();
}

async function submitReview() {
  const username = localStorage.getItem("userName");
  const reviewRequest: ReviewRequest = {
    movieId: movieId.value,
    rating: review.value.rating,
    reviewText: review.value.comment ?? "",
    username: username,
  };

  UserService.addAReview(reviewRequest).then(() => emits("submitted"));
}
</script>
