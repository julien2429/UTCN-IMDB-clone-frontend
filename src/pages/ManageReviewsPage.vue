<template>
  <v-container>
    <v-row>
      <v-col cols="12" md="4">
        <v-card>
          <v-card-title>Pending Reviews</v-card-title>
          <v-data-table
            :headers="headers"
            :items="pendingReviews"
            :loading="loading.pending"
            class="elevation-1"
          >
            <template #item.actions="{ item }">
              <v-btn @click="updateStatus(item.reviewId, 'approved')">
                <v-icon>mdi-check</v-icon>
              </v-btn>
              <v-btn @click="updateStatus(item.reviewId, 'rejected')">
                <v-icon>mdi-close</v-icon>
              </v-btn>
            </template>
          </v-data-table>
        </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <v-card>
          <v-card-title>Approved Reviews</v-card-title>
          <v-data-table
            :headers="headers"
            :items="approvedReviews"
            :loading="loading.approved"
            class="elevation-1"
          >
            <template #item.actions="{ item }">
              <v-btn @click="updateStatus(item.reviewId, 'rejected')">
                <v-icon>mdi-close</v-icon>
              </v-btn>
              <v-btn @click="updateStatus(item.reviewId, 'pending')">
                <v-icon>mdi-help</v-icon>
              </v-btn>
            </template>
          </v-data-table>
        </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <v-card>
          <v-card-title>Rejected Reviews</v-card-title>
          <v-data-table
            :headers="headers"
            :items="rejectedReviews"
            :loading="loading.rejected"
            class="elevation-1"
          >
            <template #item.actions="{ item }">
              <v-btn @click="updateStatus(item.reviewId, 'approved')">
                <v-icon>mdi-check</v-icon>
              </v-btn>
              <v-btn @click="updateStatus(item.reviewId, 'pending')">
                <v-icon>mdi-help</v-icon>
              </v-btn>
            </template>
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
<script setup lang="ts">
import type { MovieRepository } from "@/api/Repositories/movieRepository";
import RepositoryFactory from "@/api/RepositoryFactory";
import type { Review } from "@/models/review";
import { ref, onMounted } from "vue";

const headers = [
  { text: "Id", value: "id" },
  { text: "rating", value: "rating" },
  { text: "comment", value: "comment" },
  { text: "Actions", value: "actions", sortable: false },
];

const movieRepo = RepositoryFactory.get("movie") as typeof MovieRepository;

const pendingReviews = ref<Review[]>();
const approvedReviews = ref<Review[]>();
const rejectedReviews = ref<Review[]>();
const loading = ref({
  pending: false,
  approved: false,
  rejected: false,
});

const fetchReviews = async () => {
  loading.value.pending = true;
  loading.value.approved = true;
  loading.value.rejected = true;
  try {
    movieRepo.getAllApprovedReviews().then((response) => {
      const approved = response.data;
      approvedReviews.value = approved;
    });

    movieRepo.getAllPendingReviews().then((response) => {
      const pending = response.data;
      pendingReviews.value = pending;
    });

    movieRepo.getAllRejectedReviews().then((response) => {
      const rejected = response.data;
      rejectedReviews.value = rejected;
    });
  } catch (e) {
    // Handle error
  } finally {
    loading.value.pending = false;
    loading.value.approved = false;
    loading.value.rejected = false;
  }
};

const updateStatus = async (reviewId: string, status: string) => {
  if (status === "approved") {
    await movieRepo.approveReview(reviewId);
  } else if (status === "rejected") {
    await movieRepo.rejectReview(reviewId);
  } else if (status === "pending") {
    await movieRepo.setToPending(reviewId);
  }
  fetchReviews();
};

onMounted(fetchReviews);
</script>
