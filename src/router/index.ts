/**
 * router/index.ts
 *
 * Automatic routes for `./src/pages/*.vue`
 */

// Composables
import { createRouter, createWebHistory } from 'vue-router/auto'
import { setupLayouts } from 'virtual:generated-layouts'
import { routes } from 'vue-router/auto-routes'
import { ro } from 'vuetify/locale';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: setupLayouts(routes),
})

const isAuthenticated = () => {
  return !!localStorage.getItem('userToken');
};

const getUserRole = (): string | null => {
  const role = localStorage.getItem('role');
  if (role) {
    return role;
  }
  return null;
};

/**
 * Utility function to check if the current route requires authentication or specific roles.
 */
export const checkCurrentRouteAccess = () => {
  console.log(router.currentRoute.value, isAuthenticated(), getUserRole());
  const currentRoute = router.currentRoute.value;
  console.log(currentRoute.meta.unathentificatedOnly);
  if (currentRoute.meta.unathentificatedOnly && isAuthenticated()) {
    
    router.replace('/ShowMovies');
    return false;
  }
  if (currentRoute.meta.requiresAuth) {
    if (!isAuthenticated()) {
      // Redirect unauthenticated users to login
      router.replace('/LoginPage');
      return false;
    }
    if (
      currentRoute.meta.requiredRoles &&
      Array.isArray(currentRoute.meta.requiredRoles) &&
      currentRoute.meta.requiredRoles.length > 0
    ) {
      const userRole = getUserRole();
      if (!userRole || !currentRoute.meta.requiredRoles.includes(userRole)) {
        // Redirect users without required role
        router.replace('/forbidden');
        return false;
      }
    }
  }
  return true;
};


/**
 * Ensure route access is checked even when the page is loaded directly (e.g., via URL change or refresh).
 * This can be done by calling checkCurrentRouteAccess() after the router is ready.
 */
router.isReady().then(() => {
  checkCurrentRouteAccess();
  localStorage.removeItem('vuetify:dynamic-reload');
});

router.beforeEach((to, from, next) => {
  // Check if the route requires authentication
  if (to.meta.unathentificatedOnly) {
    if (isAuthenticated()) {
      // User is already authenticated, redirect to home or another page
      console.warn(`User is already authenticated, redirecting from "${to.fullPath}"`);
      next('/ShowMovies'); // Or next('/ShowMovies');
    } else {
      // User is not authenticated, proceed
      next();
    }
  }

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