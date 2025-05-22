<template>
  <v-card class="pa-4">
    <v-row>
      <v-col cols="12" md="4" class="text-center">
        <div class="text-h3 font-weight-bold">
          {{ (averageRating / 2).toFixed(1) }}
        </div>
        <v-rating
          :model-value="averageRating / 2"
          dense
          half-increments
          readonly
        ></v-rating>
        <div class="grey--text mt-1">
          {{ reviews.length.toLocaleString() }} reviews
        </div>
      </v-col>

      <v-col cols="12" md="8">
        <v-row v-for="star in [5, 4, 3, 2, 1]" :key="star" align="center">
          <v-col cols="1" class="text-right pr-0">{{ star }}</v-col>

          <v-col>
            <v-progress-linear
              :model-value="getStarPercentage(star)"
              height="8"
              rounded
            ></v-progress-linear>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-card>
</template>

<script lang="ts">
import type { Review } from "@/models/review";
import { defineComponent, computed } from "vue";

export default defineComponent({
  name: "RatingSummary",
  props: {
    reviews: {
      type: Array as () => Review[],
      required: true,
    },
  },
  setup(props) {
    const averageRating = computed(() => {
      if (props.reviews.length === 0) return 0;
      const sum = props.reviews.reduce((acc, r) => acc + r.rating, 0);
      return sum / props.reviews.length; // still 0-10 scale
    });

    // Convert a 0-10 rating to a 1-5 star "bucket"
    const toStar = (rating: number) => {
      return Math.ceil(rating / 2); // 0–2 = 1 star, 2–4 = 2 stars, etc.
    };

    const getStarPercentage = (star: number) => {
      const total = props.reviews.length;
      const count = props.reviews.filter(
        (r) => toStar(r.rating) === star
      ).length;
      return total > 0 ? (count / total) * 100 : 0;
    };

    return {
      averageRating,
      getStarPercentage,
    };
  },
});
</script>

<style scoped>
.text-h3 {
  font-size: 3rem;
}
</style>
