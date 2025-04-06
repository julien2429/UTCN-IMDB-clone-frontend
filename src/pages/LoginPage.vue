<template>
  <v-container class="login-page fill-height justify-center" fluid>
    <v-row justify="center" align="center" class="fill-height">
      <v-col cols="12" sm="8" md="4">
        <v-card class="pa-4">
          <v-card-title class="justify-center">
            <h1>Login</h1>
          </v-card-title>
          <v-card-text>
            <v-form @submit.prevent="handleLogin" ref="loginForm">
              <v-text-field
                v-model="loginRequest.username"
                label="Username"
                type="username"
                placeholder="Enter your username"
                required
                outlined
              ></v-text-field>
              <v-text-field
                v-model="loginRequest.password"
                label="Password"
                type="password"
                placeholder="Enter your password"
                required
                outlined
              ></v-text-field>

              <span class="text-center d-block mb-2">
                Don't have an account?
                <router-link to="/RegisterPage">Register</router-link>
              </span>

              <v-btn type="submit" color="primary" block class="mt-4">
                Login
              </v-btn>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import type { UserRepository } from "@/api/Repositories/usersRepository";
import RepositoryFactory from "@/api/RepositoryFactory";
import {
  createDefaultLoginRequest,
  type LoginRequest,
} from "@/models/loginRequest";
import type { LoginResponse } from "@/models/loginResponse";
import { useAuthStore } from "@/stores/auth";
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useToast } from "vue-toastification";
import { ro } from "vuetify/locale";

const loginRequest = ref<LoginRequest>(createDefaultLoginRequest());
const router = useRouter();
const loginRepo = RepositoryFactory.get("user") as typeof UserRepository;
const toast = useToast();
const authStore = useAuthStore(); // Assuming you have a Pinia store for authentication

const handleLogin = () => {
  loginRepo
    .login(loginRequest.value)
    .then((response) => {
      const loginResponse = response.data as unknown as LoginResponse;
      console.log(loginResponse);
      // TODO : Save the token in local storage or a cookie
      localStorage.setItem(
        "userName",
        JSON.stringify(loginRequest.value.username)
      );
      localStorage.setItem("role", loginResponse.role);
      authStore.login("tokenActivat");
    })
    .catch((error) => {
      let erros = error.response.data;
      for (let key in erros) {
        if (erros.hasOwnProperty(key) && erros[key]) {
          toast.error(erros[key]);
        }
      }
    });
};
</script>

<style scoped>
.login-page {
  background-color: var(--v-theme-background-base);
}
</style>
