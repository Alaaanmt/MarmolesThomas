import { createApp } from 'vue';
import App from './App.vue';
import router from './router/index.ts';
import './style.css';
import { useRoute, useRouter } from 'vue-router';
import { createPinia } from 'pinia';
import { useOrderStore } from './stores/Order';
    
const app = createApp(App);
const pinia = createPinia();

// Agregar $route y $router como propiedad global
app.config.globalProperties.$route = useRoute();
app.config.globalProperties.$router = useRouter();

app.use(router);
app.use(pinia);

const orderStore = useOrderStore(pinia);
const persistedOrder = localStorage.getItem('marmoles-thomas-order');
if (persistedOrder) {
    try {
        Object.assign(orderStore, JSON.parse(persistedOrder));
    } catch (error) {
        console.error('Error restoring order state:', error);
        localStorage.removeItem('marmoles-thomas-order');
    }
}
orderStore.$subscribe((_mutation, state) => {
    localStorage.setItem('marmoles-thomas-order', JSON.stringify(state));
});

app.mount('#app');


