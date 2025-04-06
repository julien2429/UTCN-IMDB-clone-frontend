/**
 * main.ts
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Plugins
import Toast, { type PluginOptions } from "vue-toastification";
import { registerPlugins } from '@/plugins'
import "vue-toastification/dist/index.css";
// Components
import App from './App.vue'

// Composables
import { createApp } from 'vue'

const app = createApp(App)

registerPlugins(app)

const options: PluginOptions = {
    // You can set your default options here
};

app.use(Toast, options);
app.mount('#app')
