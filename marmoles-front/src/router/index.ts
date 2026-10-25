import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import Login from '../views/Login.vue';
import Register from '../views/Register.vue';
import Activation from '../views/Activation.vue';
import Password from '../views/Password.vue';
import DetailsGranite from '../views/DetailsGranite.vue';
import DetailsMarble from '../views/DetailsMarble.vue';
import DetailsQuartz from '../views/DetailsQuartz.vue';
import DetailsFurniture from '../views/DetailsFurniture.vue';          
import Countertop from '../views/Countertop.vue';
import Furniture from '../views/Furniture.vue';
import Vanity from '../views/Vanity.vue';
import CreateOrder from '@/views/CreateOrder.vue';
import Color from '@/views/Color.vue';
import Measures from '@/views/Measures.vue';
import Abstract from '@/views/Abstract.vue';

declare module 'vue-router' {
  interface RouteMeta {
    scrollToTopOnBack?: boolean;
  }
}

const routes = [
    { path: '/', component: Home },
    { path: '/login', component: Login },
    { path: '/register', component: Register },
    { path: '/activation', component: Activation },
    { path: '/password', component: Password },
    { path: '/detailsGranite', component: DetailsGranite },
    { path: '/detailsMarble', component: DetailsMarble },
    { path: '/detailsQuartz', component: DetailsQuartz },
    { path: '/detailsFurniture', component: DetailsFurniture },
    { path: '/countertop', component: Countertop },
    { path: '/furniture', component: Furniture },
    { path: '/vanity', component: Vanity },
    { path: '/createOrder', component: CreateOrder, meta: { scrollToTopOnBack: true } },
    { path: '/color/:colorId', component: Color, meta: { scrollToTopOnBack: true } },
    { path: '/measures/:medidaId', component: Measures, meta: { scrollToTopOnBack: true } },
    { path: '/abstract/:resumenId', component: Abstract, meta: { scrollToTopOnBack: true } },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, _from, savedPosition) {
    if (savedPosition && !to.meta.scrollToTopOnBack) return savedPosition;

    if (to.hash) {
      return false;
    }

    return {
      top: 0,
      behavior: 'instant'
    };
  },
});



export default router;
