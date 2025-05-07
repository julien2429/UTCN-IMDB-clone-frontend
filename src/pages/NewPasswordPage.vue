<template>
  <v-container class="new-password-page fill-height justify-center" fluid>
    <v-row justify="center" align="center" class="fill-height">
      <v-col cols="12" sm="8" md="4">
        <v-card class="pa-4">
          <v-card-title class="justify-center">
            <h1>Reset Password</h1>
          </v-card-title>
          <v-card-text>
            <v-form
              @submit.prevent="handleResetPassword"
              ref="resetPasswordForm"
            >
              <v-text-field
                v-model="code"
                label="6-Letter Code"
                type="text"
                placeholder="Enter the code sent to your email"
                required
                outlined
              ></v-text-field>

              <v-text-field
                v-model="newPassword"
                label="New Password"
                type="password"
                placeholder="Enter your new password"
                required
                outlined
              ></v-text-field>

              <v-text-field
                v-model="confirmPassword"
                label="Confirm Password"
                type="password"
                placeholder="Confirm your new password"
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

const email = useRoute().query.email as string;
const code = ref<string>("");
const newPassword = ref<string>("");
const confirmPassword = ref<string>("");
const router = useRouter();
const toast = useToast();
const authService = ServicesFactory.get("auth") as typeof AuthService;

const handleResetPassword = () => {
  if (newPassword.value !== confirmPassword.value) {
    toast.error("Passwords do not match.");
    return;
  }

  authService
    .resetPassword(newPassword.value, code.value, email)
    .then(() => {
      toast.success("Password reset successfully.");
      router.push("/LoginPage");
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
.new-password-page {
  background-color: var(--v-theme-background-base);
}
</style>
