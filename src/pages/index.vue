<template>
  <CrudPage />
</template>

<script lang="ts" setup>
definePage({
  meta: {
    requiresAuth: true,
    requiredRoles: ["ADMIN"], // Only users with the 'admin' role can access
  },
});
</script>
