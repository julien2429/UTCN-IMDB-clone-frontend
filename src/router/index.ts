/**
 * router/index.ts
 *
 * Automatic routes for `./src/pages/*.vue`
 */

// Composables
import { createRouter, createWebHistory } from 'vue-router/auto'
import { setupLayouts } from 'virtual:generated-layouts'
import { routes } from 'vue-router/auto-routes'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: setupLayouts(routes),
})

// Function to check if the user is logged in
const isAuthenticated = () => {
  return !!localStorage.getItem('userToken');
};

// Function to get the user's role (replace with your actual logic)
const getUserRole = (): string | null => {
  // This is a placeholder - in a real application, you would likely:
  // 1. Decode the JWT token from localStorage (if you're using JWT).
  // 2. Fetch the user's role from your backend based on the token.
  // 3. Store the user's role in localStorage or a reactive store after login.
  const role = localStorage.getItem('role');
  if (role) {
    return role;
  }
  return null;
};

router.beforeEach((to, from, next) => {
  // Check if the route requires authentication
  if (to.meta.requiresAuth) {
    if (isAuthenticated()) {
      // Check if the route requires specific roles
      if (to.meta.requiredRoles && Array.isArray(to.meta.requiredRoles) && to.meta.requiredRoles.length > 0) {
        const userRole = getUserRole();
        if (userRole && to.meta.requiredRoles.includes(userRole)) {
          // User has the required role, proceed
          next();
        } else {
          // User does not have the required role, redirect to a forbidden page or home
          console.warn(`User with role "${userRole}" does not have access to "${to.fullPath}"`);
          next('/forbidden'); // Or next('/');
        }
      } else {
        // Route requires authentication but no specific roles, proceed
        next();
      }
    } else {
      // User is not logged in, redirect to the login page
      next('/LoginPage');
    }
  } else {
    // Route does not require authentication, proceed
    next();
  }
});

// Workaround for https://github.com/vitejs/vite/issues/11804
router.onError((err, to) => {
  if (err?.message?.includes?.('Failed to fetch dynamically imported module')) {
    if (!localStorage.getItem('vuetify:dynamic-reload')) {
      console.log('Reloading page to fix dynamic import error');
      localStorage.setItem('vuetify:dynamic-reload', 'true');
      location.assign(to.fullPath);
    } else {
      console.error('Dynamic import error, reloading page did not fix it', err);
    }
  } else {
    console.error(err);
  }
});

router.isReady().then(() => {
  localStorage.removeItem('vuetify:dynamic-reload');
});

export default router;