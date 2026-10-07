import { createApp } from 'vue';
import App from './App.vue';
import router from './router/index.ts';
import './style.css';
import { useRoute, useRouter } from 'vue-router';
import { createPinia } from 'pinia';
    
const app = createApp(App);
const pinia = createPinia();

// Agregar $route y $router como propiedad global
app.config.globalProperties.$route = useRoute();
app.config.globalProperties.$router = useRouter();

app.use(router);
app.use(pinia);
app.mount('#app');



