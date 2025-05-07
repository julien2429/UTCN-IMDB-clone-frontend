<template>
  <v-container class="forgot-password-page fill-height justify-center" fluid>
    <v-row justify="center" align="center" class="fill-height">
      <v-col cols="12" sm="8" md="4">
        <v-card class="pa-4">
          <v-card-title class="justify-center">
            <h1>Forgot Password</h1>
          </v-card-title>
          <v-card-text>
            <v-form
              @submit.prevent="handleForgotPassword"
              ref="forgotPasswordForm"
            >
              <v-text-field
                v-model="email"
                label="Email"
                type="email"
                placeholder="Enter your email"
                required
                outlined
              ></v-text-field>

              <span class="text-center d-block mb-2">
                Remembered your password?
                <router-link to="/LoginPage">Login</router-link>
              </span>

              <v-btn type="submit" color="primary" block class="mt-4">
                Reset Password
              </v-btn>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useToast } from "vue-toastification";
import type { AuthService } from "@/api/Services/authService";
import ServicesFactory from "@/api/ServicesFactory";

const email = ref<string>("");
const router = useRouter();
const toast = useToast();
const authService = ServicesFactory.get("auth") as typeof AuthService;

const handleForgotPassword = () => {
  authService
    .forgotPasswordSendEmail(email.value)
    .then(() => {
      toast.success("Password reset link sent to your email.");
      router.push({
        path: "/NewPasswordPage",
        query: { email: email.value },
      });
    })
    .catch((error) => {
      let errors = error.response?.data || { message: "An error occurred." };
      for (let key in errors) {
        if (errors.hasOwnProperty(key) && errors[key]) {
          toast.error(errors[key]);
        }
      }
    });
};
</script>

<style scoped>
.forgot-password-page {
  background-color: var(--v-theme-background-base);
}
</style>
