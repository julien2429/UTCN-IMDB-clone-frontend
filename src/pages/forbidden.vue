<template>
  <div class="forbidden-page">
    <h1>403 - Forbidden</h1>
    <p>You don't have permission to access this page.</p>
    <router-link to="/">Go back to Home</router-link>
  </div>
</template>

<script>
export default {
  name: "ForbiddenPage",
};
</script>

<style scoped>
.forbidden-page {
  text-align: center;
  margin-top: 50px;
}

.forbidden-page h1 {
  font-size: 3rem;
  color: #ff4d4f;
}

.forbidden-page p {
  font-size: 1.2rem;
  margin: 20px 0;
}

.forbidden-page a {
  color: #1890ff;
  text-decoration: none;
  font-weight: bold;
}

.forbidden-page a:hover {
  text-decoration: underline;
}
</style>
