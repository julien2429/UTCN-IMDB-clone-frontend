<template>
  <v-footer height="40" app>
    <v-btn :flat="true" text to="/" class="ml-2"> Home </v-btn>

    <v-btn :flat="true" text to="/movies" class="ml-2"> Movies </v-btn>

    <v-btn
      v-if="authStore.isLoggedIn"
      :flat="true"
      text
      @click="logout"
      class="ml-auto mr-2"
    >
      Logout
    </v-btn>
    <v-btn v-else :flat="true" text to="/LoginPage" class="ml-auto mr-2">
      Login
    </v-btn>
  </v-footer>
</template>

<script setup lang="ts">
import { useAuthStore } from "@/stores/auth";
import { ref, computed, onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const isLoggedIn = ref(!!localStorage.getItem("userToken"));
const authStore = useAuthStore();

function logout() {
  localStorage.removeItem("userName");
  localStorage.removeItem("role");
  authStore.logout();
}
</script>
