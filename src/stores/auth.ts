// store/auth.ts
import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

export const useAuthStore = defineStore('auth', () => {
  const router = useRouter();
  const userToken = ref<string | null>(localStorage.getItem('userToken'));

  const isLoggedIn = computed(() => !!userToken.value);

  function setToken(token: string | null) {
    userToken.value = token;
    if (token) {
      localStorage.setItem('userToken', token);
    } else {
      localStorage.removeItem('userToken');
    }
  }

  function login(token: string) {
    setToken(token);
    const role = localStorage.getItem('role');
    console.log('User role:', role); // Debugging line to check the role
    if (role === 'ADMIN') {
      router.push('/'); // Redirect to admin page if the user is an admin
    }
    else {

      router.push('/ShowMovies'); // Or your desired route after login
    }
  }

  function logout() {
    setToken(null);
    localStorage.removeItem('userId');
    localStorage.removeItem("userName");
    localStorage.removeItem("role");
    localStorage.removeItem("token");
    router.push('/LoginPage');
  }

  return { userToken, isLoggedIn, login, logout };
});