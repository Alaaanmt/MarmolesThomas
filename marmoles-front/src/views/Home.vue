<template>

    <!--Carrousel-->
    <section class="pt-24 pb-10">
        <div class="swiper mesadas">
            <div class="swiper-wrapper">
                <div class="swiper-slide w-full" v-for="item in imagesCarrousel" :key="item.id">
                    <div
                        class="w-full h-full bg-cyan-800 text-white flex md:grid md:grid-cols-2 items-center justify-center">
                        <p class="text-lg px-8 md:text-3xl lg:text-5xl text-center font-semibold uppercase">{{
                            item.text
                        }}</p>
                        <div id="images" class="w-full h-100 md:h-115 lg:h-130">
                            <img :src="item.img" alt="" class="w-full h-full object-top-center object-cover">
                        </div>
                    </div>

                </div>
            </div>
        </div>
    </section>
    <!--Separador-->
    <div id="quienesSomos" class="border mb-10 border-gray-200 dark:border-gray-600 arreglo-scroll"></div>

    <!--QuienesSomos-->
    <section class="px-6 md:px-12 lg:px-24" data-aos="fade-up"
        data-aos-duration="1500">
        <div class="mx-auto grid max-w-6xl grid-cols-1 items-center gap-8 md:grid-cols-2 lg:gap-16">
            <div class="space-y-6 text-center md:text-left">
                <div class="flex flex-col gap-2 text-xl md:flex-row md:items-center md:gap-4 md:text-2xl lg:text-3xl">
                    <p class="text-cyan-600">MÁRMOLES THOMAS</p>
                    <div class="hidden h-8 border-l border-gray-400 md:block"></div>
                    <p>Mesadas y muebles a medida</p>
                </div>
                <div class="space-y-3 text-sm leading-relaxed md:text-lg lg:text-xl">
                    <p>En Mármoles Thomas trabajamos desde hace más de 32 años en la fabricación e instalación de mesadas,
                        vanitorys, pisos y revestimientos en mármol, granito y silestone.</p>
                    <p>Somos una empresa familiar que combina la experiencia artesanal con materiales de primera calidad
                        para lograr resultados únicos y duraderos. También realizamos bajomesadas y alacenas en melamina
                        de 18 mm, adaptadas a cada espacio y estilo. Nuestro compromiso es ofrecer excelencia en cada
                        detalle, para que cada proyecto refleje la calidad y dedicación que nos caracteriza.</p>
                </div>
            </div>
            <div class="h-64 overflow-hidden rounded-xl shadow-lg md:h-96">
                <img src="/img/image.jpg" alt="Mesada de granito instalada en una cocina"
                    class="h-full w-full object-cover">
            </div>
        </div>
    </section>

    <!--Separador-->
    <div id="nuestrosTrabajos" class="border my-10 border-gray-200 dark:border-gray-600 arreglo-scroll"></div>

    <!--NuestrosTrabajos-->
    <section class="px-4 md:px-40 lg:px-48" data-aos="fade-up"
        data-aos-duration="1000">
        <p class="text-center text-2xl md:text-3xl lg:text-4xl text-cyan-600 uppercase font-semibold">Nuestros
            Trabajos
        </p>
        <div class="w-full grid grid-cols-4 space-y-4 lg:space-y-0 lg:grid lg:grid-cols-3 gap-4 pt-10">

            <!--SKELETON-->
            <template v-if="isLoading">
                <div v-for="n in 3" :key="n" class="col-span-2 lg:col-span-1 group"
                    :class="{ 'col-start-2': (n - 1 === 2) }">
                    <div class="skeleton w-full aspect-square mx-auto md:h-50 md:w-50"></div>
                    <div class="skeleton h-6 md:h-8 lg:h-9 w-3/4 mx-auto mt-4"></div>
                </div>
            </template>

            <!--CONTENIDO-->
            <RouterLink :to="'/' + item.ruta" v-for="(item, index) in works" :key="item.id" v-else
                class="col-span-2 lg:col-span-1 group" :class="{
                    'col-start-2': (index === 2)
                }">
                <div class="w-full aspect-square mx-auto md:h-50 md:w-50 cursor-pointer ">
                    <img :src="item.path != null ? item.path : '/img/logo.png'" alt=""
                        class="w-full h-full object-cover transition-all duration-500 hover:scale-105 ">
                </div>
                <p
                    class="text-center text-xl md:text-2xl lg:text-3xl pt-4 group-hover:text-cyan-600 group-hover:font-semibold transition-all duration-100 ">
                    {{ item.titulo }}</p>
            </RouterLink>
        </div>
    </section>

    <!--Separador-->
    <div id="colores" class="border my-10 border-gray-200 dark:border-gray-600 arreglo-scroll"></div>

    <!--Colores-->
    <section>
        <!--Colores Mesada-->
        <p class="text-center text-2xl md:text-3xl lg:text-4xl text-cyan-600 uppercase font-semibold" data-aos="fade-up">Colores</p>
        <div class="w-full grid grid-cols-2 lg:grid lg:grid-cols-3 gap-4 pt-10 lg:px-48 md:px-40 px-4" data-aos="fade-up">

            <!--SKELETON-->
            <template v-if="isLoading">
                <div v-for="n in 6" :key="n" :class="{ 'hidden md:block': n >= 5 }">
                    <div class="skeleton w-full aspect-square mx-auto md:h-50 md:w-50"></div>
                    <div class="skeleton h-6 w-2/3 mx-auto my-4"></div>
                </div>
            </template>

            <!--CONTENIDO-->
            <div v-else v-for="(item, index) in granite" :key="item.id" class="group"
                :class="{ 'hidden md:block': index >= 4 }">
                <div class="w-full aspect-square mx-auto md:h-50 md:w-50">
                    <img :src="item.path != null ? item.path : '/img/logo.png'" alt=""
                        class="w-full h-full object-cover transition-all duration-500 hover:scale-105">
                </div>
                <p class="text-center py-4 font-semibold group-hover:text-cyan-600 transition-all duration-500 ">{{
                    item.color }}</p>
            </div>
        </div>
        <div
            class="flex flex-col lg:grid lg:grid-cols-3 justify-between space-y-2 text-center pt-2 font-bold lg:px-46 md:px-40 px-12"
            data-aos="fade-up">
            <div class="flex justify-center gap-1" v-for="item in seeMore" :key="item.id">
                <RouterLink :to="item.link"
                    class="text-cyan-500 hover:text-cyan-700 cursor-pointer transition-all duration-300 ">{{
                        item.text
                    }}</RouterLink>
            </div>
        </div>
        <!--Separador-->
        <div id="coloresMelamina" class="border my-10 border-gray-200 dark:border-gray-600 arreglo-scroll"></div>
        <!--Colores Melamina-->
        <div class="w-full grid grid-cols-2 lg:grid lg:grid-cols-3 gap-4 pt-10 lg:px-48 md:px-40 px-4" data-aos="fade-up">

            <!--SKELETON-->
            <template v-if="isLoading">
                <div v-for="n in 6" :key="n" :class="{ 'hidden md:block': n >= 5 }">
                    <div class="skeleton w-full aspect-square mx-auto md:h-50 md:w-50"></div>
                    <div class="skeleton h-6 w-2/3 mx-auto my-4"></div>
                </div>
            </template>

            <!--CONTENIDO-->
            <div v-else v-for="(item, index) in furniture" :key="item.id" class="group"
                :class="{ 'hidden md:block': index >= 4 }">
                <div class="w-full aspect-square mx-auto md:h-50 md:w-50">
                    <img :src="item.path != null ? item.path : '/img/logo.png'" alt=""
                        class="w-full h-full object-cover transition-all duration-500 hover:scale-105">
                </div>
                <p
                    class="text-center py-4 font-semibold group-hover:text-cyan-600 group-hover:font-semibold transition-all duration-500 ">
                    {{ item.color }}</p>
            </div>
        </div>
        <RouterLink to="/detailsFurniture"
            class="block text-center text-cyan-500 font-bold cursor-pointer hover:text-cyan-700 transition-all duration-300 pt-2"
            data-aos="fade-up">
            Ver
            detalles de Melamina</RouterLink>
    </section>

    
</template>

<script setup lang="ts">
// VUE
import { onBeforeMount, onMounted, ref } from 'vue';
import { RouterLink } from 'vue-router';

//AXIOS
import axios from 'axios';

//BaseUrl
import { baseUrl } from '@/utilities';
const base = baseUrl

// SWIPER
import Swiper from 'swiper';
import { Autoplay } from 'swiper/modules';
import 'swiper/swiper-bundle.css';
Swiper.use([Autoplay]);

//AOS
import AOS from 'aos'
import 'aos/dist/aos.css'

// DATA
const imagesCarrousel = [
    {
        id: 1,
        img: '/img/image.jpg',
        text: 'Mesadas',
    },
    {
        id: 2,
        img: '/img/Mueble1.jpg',
        text: 'Muebles',
    },
    {
        id: 3,
        img: '/img/Portada-vanitory.jpg',
        text: 'Vanitorys',
    },
];

const works = ref<any>([]);

const granite = ref<any>([]);

const seeMore = [
    {
        id: 1,
        text: 'Ver Granitos',
        link: '/detailsGranite',
    },
    {
        id: 2,
        text: 'Ver Marmoles',
        link: '/detailsMarble',
    },
    {
        id: 3,
        text: 'Ver Silestones',
        link: '/detailsQuartz',
    }
]

const furniture = ref<any>([]);

const isLoading = ref(true);

// LIFECYCLES
onBeforeMount(async () => {
    try {
        const responseNT = await axios.get(base +'/nuestrostrabajos');
        works.value = responseNT.data.data; 

        const responseGC = await axios.get(base + '/granitocolor?limit=6'); //verr con pablo
        granite.value = responseGC.data.data;

        const responseMC = await axios.get(base +'/melaminacolor');
        furniture.value = responseMC.data.data;

    } catch (error) {
        console.error('Error fetching data:', error);
    } finally {
        isLoading.value = false;
    }
});

onMounted(() => {
    new Swiper(".mesadas", {
        autoplay: {
            delay: 2000,
            disableOnInteraction: false,
        },
        speed: 1000,
        loop: true,
    });
    AOS.init({ once: true, duration: 800, offset: 100 })
});
</script>
