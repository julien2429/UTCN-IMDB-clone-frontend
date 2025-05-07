<template>
  <v-container
    class="register-page justify-center align-center"
    max-width="400"
  >
    <v-card outlined>
      <v-card-title class="text-h5 text-center">Register</v-card-title>
      <v-card-text>
        <v-form @submit.prevent="handleRegister" ref="form">
          <v-text-field
            v-model="email"
            label="Email"
            type="email"
            required
            placeholder="Enter your email"
            outlined
          ></v-text-field>
          <v-text-field
            v-model="username"
            label="Username"
            type="text"
            required
            placeholder="Enter your username"
            outlined
          ></v-text-field>
          <v-text-field
            v-model="password"
            label="Password"
            type="password"
            required
            placeholder="Enter your password"
            outlined
          ></v-text-field>
          <v-btn type="submit" color="primary" block class="mt-4">
            Register
          </v-btn>
        </v-form>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { AuthRepository } from "@/api/Repositories/authRepository";
import type { UserRepository } from "@/api/Repositories/usersRepository";
import RepositoryFactory from "@/api/RepositoryFactory";
import type { AuthService } from "@/api/Services/authService";
import ServicesFactory from "@/api/ServicesFactory";
import { UserRole } from "@/enums/UserRole";
import type { User } from "@/models/user";
import router from "@/router";
import { useAuthStore } from "@/stores/auth";
import { ref } from "vue";
import { useToast } from "vue-toastification";
const toast = useToast();

const loginRepo = ServicesFactory.get("auth") as typeof AuthService;
const email = ref("");
const username = ref("");
const password = ref("");

function handleRegister() {
  const newUser: User = {
    userId: "",
    role: UserRole.UNKNOWN,
    email: email.value,
    username: username.value,
    password: password.value,
  };

  loginRepo
    .register(newUser)
    .then((response) => {
      router.push("/LoginPage");
      toast.success("Registration complete", {
        timeout: 2000,
      });
    })
    .catch((error) => {
      console.error("Registration error:", error);
      let erros = error.response.data;
      for (let key in erros) {
        if (erros.hasOwnProperty(key)) {
          toast.error(erros[key]);
        }
      }
    });
}
</script>

<style scoped>
.register-page {
  margin: 0 auto;
  padding: 20px;
}
</style>
