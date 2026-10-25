<template>
  <section class="bg-gray-100 dark:bg-neutral-800 dark:text-white transition-all duration-300">
    <!--Header-->
    <section v-if="!['/login', '/register', '/activation', '/password'].includes($route.path)"
      class="w-full h-24 flex items-center justify-between p-4 text-white fixed z-30 bg-cyan-800">

      <router-link to="/" class="h-16 lg:h-24">
        <img src="/img/logoSinFondo.png" alt="" class="w-full h-full object-cover">
      </router-link>

      <nav class="hidden md:flex gap-8 text-white font-semibold uppercase">
        <a href="/#quienesSomos" @click.prevent="navigateToSection('quienesSomos')" class="h-8 transition-all duration-150 hover:border-b-4 hover:border-white ">Quienes
          somos</a>
        <a href="/#nuestrosTrabajos" @click.prevent="navigateToSection('nuestrosTrabajos')"
          class="h-8 transition-all duration-150 hover:border-b-4 hover:border-white ">Nuestros Trabajos</a>
        <a href="/#colores" @click.prevent="navigateToSection('colores')" class="h-8 transition-all duration-150 hover:border-b-4 hover:border-white ">Colores</a>
        <a href="/#contacto" @click.prevent="navigateToSection('contacto')" class="h-8 transition-all duration-150 hover:border-b-4 hover:border-white ">Contacto</a>
      </nav>


      <div class="flex gap-4 items-center">

        <router-link
          v-if="!($route.path.startsWith('/createOrder/') || $route.path.startsWith('/measures/') || $route.path.startsWith('/abstract/') || $route.path.startsWith('/color/') || ['/buildOrder', '/color', '/measures', '/abstract', '/createOrder',].includes($route.path))"
          to="/createOrder"
          class="bg-white dark:bg-cyan-700 transition-all hover:bg-gray-300 dark:hover:bg-cyan-600 duration-350 font-semibold text-white px-3 py-2 rounded-lg uppercase cursor-pointer">
          <p class="text-xs text-cyan-600 dark:text-white  md:text-[14px]">Armar Pedido</p>
        </router-link>
        <button @click="burger = !burger" class=" md:hidden cursor-pointer flex items-center">
          <img v-if="!burger" src="/img/hamburger-button.svg" alt="" class="w-6 h-6" />
          <img v-else src="/img/x1.svg" alt="" class="w-6 h-6">
        </button>
        <nav
          class="text-center bg-gray-300 dark:bg-cyan-700 text-cyan-600 dark:text-white space-y-6 overflow-hidden text-sm px-4 rounded-b-lg font-semibold uppercase fixed top-24 right-0 transition-[height] "
          :class="burger ? 'h-46 py-4' : 'h-0'">
          <a href="/#quienesSomos" @click.prevent="navigateToSection('quienesSomos')"
            class="block hover:text-cyan-500 cursor-pointer dark:hover:text-gray-400 transition-all duration-300">
            Quienes somos</a>
          <a href="/#nuestrosTrabajos" @click.prevent="navigateToSection('nuestrosTrabajos')"
            class="block hover:text-cyan-500 dark:hover:text-gray-400 cursor-pointer transition-all duration-300">
            Nuestros Trabajos</a>
          <a href="/#colores" @click.prevent="navigateToSection('colores')"
            class="block hover:text-cyan-500 dark:hover:text-gray-400 cursor-pointer transition-all duration-300">
            Colores
          </a>
          <a href="/#contacto" @click.prevent="navigateToSection('contacto')"
            class="block hover:text-cyan-500 dark:hover:text-gray-400  cursor-pointer transition-all duration-300">
            Contacto
          </a>
        </nav>
      </div>

    </section>

    <div class="flex gap-2 w-fit p-2 dark:bg-gray-600 bg-gray-300 rounded-full fixed bottom-4 right-4 z-50">
      <div class="w-5">
        <img :src="darkMode ? '/img/moon.svg' : '/img/moonWhite.svg'" alt="" class="w-full h-full object-cover">
      </div>
      <label class="relative inline-flex items-center cursor-pointer">
        <input type="checkbox" class="toggle" @change="dark()" />
      </label>
    </div>

    <RouterView v-slot="{ Component }">
      <Transition :name="transitionName" mode="out-in">
        <div :key="route.path">
          <component :is="Component" />
        </div>
      </Transition>
    </RouterView>
    <!--Footer-->
    <footer v-if="!['/login', '/register', '/activation', '/password'].includes($route.path)" id="contacto"
      class="bg-cyan-800 text-white mt-12">
      <div class="pt-12 pb-6">
        <div class="flex items-center justify-center">
          <div class="space-y-4">
            <div class="h-20">
              <img src="/img/logoSinFondo.png" alt="" class="w-full h-full object-contain">
            </div>
            <p class="text-sm text-center">
              Contactate y hacé tu pedido
            </p>
            <div class="flex items-center justify-center gap-4">
              <div v-for="item in social" :key="item.id">
                <a :href=item.link class="h-10 w-10 flex" target="_blank">
                  <img :src="item.img" alt=""
                    class="w-full h-full object-cover object-center transition-all duration-500 hover:scale-125">
                </a>
              </div>
            </div>
          </div>
        </div>

        <div class="mt-10 pt-6 border-t border-gray-700 text-center">
          <p class="text-xs text-gray-400">
            © 2025 MarmolesThomas
          </p>
        </div>
      </div>
    </footer>
  </section>
</template>

<script setup lang="ts">
// VUE
import { computed, nextTick, ref } from 'vue';
import { RouterLink, RouterView, useRoute, useRouter } from 'vue-router';
import { onMounted } from 'vue'; 

//DATA
const darkMode = ref(false);
const burger = ref(false);
const route = useRoute();
const router = useRouter();
const transitionName = computed(() => typeof route.meta.transition === 'string'
  ? route.meta.transition
  : 'page-fade-up');

const social = [
  {
    id: 1,
    img: '/img/Facebook-logo.png',
    link: 'https://www.facebook.com/marketplace/profile/100035472392683/?locale=es_LA'
  },
  {
    id: 2,
    img: '/img/instagram-logo.png',
    link: mandarMensaje()
  },
  {
    id: 3,
    img: '/img/whatsapplogo.webp',
    link: mandarMensaje()
  },

]


//FUNCTIONS

function dark() {
  darkMode.value = !darkMode.value;
  if (darkMode.value) {
    document.documentElement.classList.add('dark');
    localStorage.setItem('theme', 'light');
  } else {
    document.documentElement.classList.remove('dark');
    localStorage.setItem('theme', 'dark');
  }
}

function mandarMensaje(): string {
  let mensaje = "Quiero hacerle una consulta";
  return ("https://wa.me/5491121666225?text=" + encodeURI(mensaje))
}

async function navigateToSection(id: string) {
  burger.value = false;
  const changedPage = route.path !== '/';
  if (changedPage || route.hash !== `#${id}`) {
    await router.push({ path: '/', hash: `#${id}` });
  }
  if (changedPage) {
    await new Promise(resolve => window.setTimeout(resolve, 400));
  }
  await nextTick();

  const section = document.getElementById(id);
  if (!section) return;

  const start = window.scrollY;
  const target = section.getBoundingClientRect().top + start - 112;
  const startedAt = performance.now();
  const duration = 1200;
  const animate = (now: number) => {
    const progress = Math.min((now - startedAt) / duration, 1);
    const eased = progress < 0.5
      ? 4 * progress ** 3
      : 1 - Math.pow(-2 * progress + 2, 3) / 2;
    window.scrollTo(0, start + (target - start) * eased);
    if (progress < 1) requestAnimationFrame(animate);
  };
  requestAnimationFrame(animate);
}



onMounted(() => {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    darkMode.value = true;
    document.documentElement.classList.add('dark');
  } else {
    darkMode.value = false;
    document.documentElement.classList.remove('dark');
  }
});
</script>
