<template>
    <!--PASOS-->
    <section class="flex justify-center pt-32 lg:px-48 md:px-40 px-4">
        <div class="flex gap-4">
            <span class="px-3 py-1 bg-gray-300 text-gray-600 rounded-full text-xs">Paso 1: Producto</span>
            <span class="px-3 py-1 bg-cyan-700 text-white rounded-full text-xs">Paso 2: Material</span>
            <span class="px-3 py-1 bg-gray-300 text-gray-600 rounded-full text-xs">Paso 3: Medidas</span>
        </div>
    </section>

    <!--SELECCION DE PRODUCTOS-->
    <section v-if="productId == 1 || productId == 3">
        <p class="text-3xl font-semibold uppercase text-center py-8 ">Elegí el color</p>
        <!--Granitos-->
        <p class="text-center text-xl font-semibold pb-4 dark:text-cyan-700">Granitos</p>

        <!--SKELETON-->
        <div v-if="isLoading" class="swiper skeleton-swiper">
            <div class="swiper-wrapper">
                <div v-for="n in 5" :key="n" class="swiper-slide">
                    <div class="flex flex-col items-center">
                        <div class="skeleton w-32 aspect-square rounded-full"></div>
                    </div>
                </div>
            </div>
        </div>

        <!--CONTENIDO-->
        <div v-else class="swiper granitos">
            <div class="swiper-wrapper">
                <div class="swiper-slide" v-for="item in granites" :key="item.id">
                    <div class="flex flex-col items-center">
                        <div class="w-32 aspect-square rounded-full overflow-hidden cursor-pointer"
                            :class="selectedColorGranite === item.id ? 'border-4 border-cyan-700' : ''"
                            @click="selectColorGranite(item.id); selectColor(item.id, item.color)">
                            <img :src="item.path" class="object-cover w-full h-full hover:scale-110 transition-all">
                        </div>
                        <p class="pt-2 text-sm font-semibold uppercase text-center">{{ item.color }}</p>
                    </div>
                </div>
            </div>
            <div class="swiper-button-next"></div>
            <div class="swiper-button-prev"></div>
        </div>
        <!--Silestones-->
        <p class="text-center text-xl font-semibold pt-8 pb-4  dark:text-cyan-700">Silestones</p>

        <!--SKELETON-->
        <div v-if="isLoading" class="swiper skeleton-swiper">
            <div class="swiper-wrapper">
                <div v-for="n in 5" :key="n" class="swiper-slide">
                    <div class="flex flex-col items-center">
                        <div class="skeleton w-32 aspect-square rounded-full"></div>
                    </div>
                </div>
            </div>
        </div>

        <!--CONTENIDO-->
        <div v-else class="swiper quartz">
            <div class="swiper-wrapper">
                <div class="swiper-slide" v-for="item in quartz" :key="item.id">
                    <div class="flex flex-col items-center">
                        <div class="w-32 aspect-square rounded-full overflow-hidden cursor-pointer "
                            :class="selectedColorQuartz === item.id ? 'border-4 border-cyan-700' : ''"
                            @click="selectColorQuartz(item.id); selectColor(item.id, item.color)">
                            <img :src="item.path" class="object-cover w-full h-full hover:scale-110 transition-all">
                        </div>
                        <p class="pt-2 text-sm font-semibold uppercase text-center">{{ item.color }}</p>
                    </div>
                </div>
            </div>
            <div class="swiper-button-next"></div>
            <div class="swiper-button-prev"></div>
        </div>
        <!--Marmoles-->
        <p class="text-center text-xl font-semibold dark:text-cyan-700 pt-8 pb-4">Marmoles</p>

        <!--SKELETON-->
        <div v-if="isLoading" class="swiper skeleton-swiper">
            <div class="swiper-wrapper">
                <div v-for="n in 3" :key="n" class="swiper-slide">
                    <div class="flex flex-col items-center">
                        <div class="skeleton w-32 aspect-square rounded-full"></div>
                    </div>
                </div>
            </div>
        </div>

        <!--CONTENIDO-->
        <div v-else class="swiper marmoles">
            <div class="swiper-wrapper">
                <div class="swiper-slide" v-for="item in marbles" :key="item.id">
                    <div class="flex flex-col items-center">
                        <div class="w-32 aspect-square rounded-full overflow-hidden cursor-pointer"
                            :class="selectedColorMarble === item.id ? 'border-4 border-cyan-700' : ''"
                            @click="selectColorMarble(item.id); selectColor(item.id, item.color)">
                            <img :src="item.path" class="object-cover w-full h-full hover:scale-110 transition-all">
                        </div>
                        <p class="pt-2 text-sm font-semibold uppercase text-center">{{ item.color }}</p>
                    </div>
                </div>
            </div>
            <div class="swiper-button-next"></div>
            <div class="swiper-button-prev"></div>
        </div>
    </section>

    <!--SELECCION DE PRODUCTOS-->
    <section v-if="productId == 2">
        <p class="text-3xl font-semibold uppercase text-center pt-8 ">Elegí el color</p>
        <!--Melaminas-->
        <p class="text-center text-xl font-semibold pt-8 pb-4 dark:text-cyan-700">Melaminas</p>
       
        <!--SKELETON-->
        <div v-if="isLoading" class="swiper skeleton-swiper">
            <div class="swiper-wrapper">
                <div v-for="n in 5" :key="n" class="swiper-slide">
                    <div class="flex flex-col items-center">
                        <div class="skeleton w-32 aspect-square rounded-full"></div>
                    </div>
                </div>
            </div>
        </div>

        <!--CONTENIDO-->
        <div v-else class="swiper melaminas">
            <div class="swiper-wrapper">
                <div class="swiper-slide" v-for="item in melamines" :key="item.id">
                    <div class="flex flex-col items-center">
                        <div class="w-32 aspect-square rounded-full overflow-hidden cursor-pointer"
                            :class="selectedColorMelamine === item.id ? 'border-4 border-cyan-700' : ''"
                            @click="selectColorMelamine(item.id); selectColor(item.id, item.color)">
                            <img :src="item.path" class="object-cover w-full h-full hover:scale-110 transition-all">
                        </div>
                        <p class="pt-2 text-sm w-1/2 font-semibold uppercase text-center">{{ item.color }}</p>
                    </div>
                </div>
            </div>
            <div class="swiper-button-next"></div>
            <div class="swiper-button-prev"></div>
        </div>
    </section>

    <!--BOTONES-->
    <div class="flex pt-8 space-y-2 flex-col justify-center items-center">
        <RouterLink :to="`/measures/${productId}`" class="px-4 py-2 border-2 cursor-pointer" :class="buttonFinalizarDisabled
            ? 'border-gray-300 text-gray-300 cursor-not-allowed pointer-events-none'
            : 'border-cyan-700 text-cyan-700 bg-white dark:bg-cyan-700 dark:text-white'">Siguiente</RouterLink>
        <RouterLink to="/createOrder" class="cursor-pointer">Volver</RouterLink>
    </div>
</template>

<script setup lang="ts">

// VUE
import { onBeforeMount, onMounted, ref, nextTick } from 'vue';
import { useRoute } from 'vue-router';
import { useOrderStore } from '@/stores/Order';

//AXIOS
import axios from 'axios';

//BaseUrl
import { baseUrl } from '@/utilities';

// SWIPER
import Swiper from 'swiper';
import { Navigation } from 'swiper/modules';
import 'swiper/swiper-bundle.css';
Swiper.use([Navigation]);

// DATA
const granites = ref<any>([]);
const quartz = ref<any>([]);
const marbles = ref<any>([]);
const melamines = ref<any>([]);
const selectedColorGranite = ref<number | null>(null); //arranca en null, puede ser number o null
const selectedColorQuartz = ref<number | null>(null);
const selectedColorMarble = ref<number | null>(null);
const selectedColorMelamine = ref<number | null>(null);
const buttonFinalizarDisabled = ref(true);
const productId = ref<number | null>(null);
const isLoading = ref(true);

const base = baseUrl

const orderStore = useOrderStore();

//getFurnitureId from route params
const route = useRoute();
productId.value = route.params.colorId ? Number(route.params.colorId) : null;

const swiperConfig = {
    speed: 1000,
    loop: true,
    slidesPerView: 2,
    slidesPerGroup: 2,
    spaceBetween: -40,

    breakpoints: {
        768: {
            slidesPerView: 4,
            slidesPerGroup: 4,
            spaceBetween: -50,
        },
        1024: {
            slidesPerView: 5,
            slidesPerGroup: 5,
            spaceBetween: -50,
        },
    },
};

//Functions
function selectColorGranite(id: number) {
    if (selectedColorGranite.value === id) { //si vuevlo a hacer click en el mismo ahi lo desselecciono
        selectedColorGranite.value = null;
    } else {
        selectedColorGranite.value = id; //si hago click en otro color selecciono ese y desselecciono los demas
        selectedColorQuartz.value = null;
        selectedColorMarble.value = null;
    }
    buttonDisabled();
}

function selectColorQuartz(id: number) {
    if (selectedColorQuartz.value === id) {
        selectedColorQuartz.value = null;
    } else {
        selectedColorQuartz.value = id;
        selectedColorGranite.value = null;
        selectedColorMarble.value = null;
    }
    buttonDisabled();
}

function selectColorMarble(id: number) {
    if (selectedColorMarble.value === id) {
        selectedColorMarble.value = null;
    } else {
        selectedColorMarble.value = id;
        selectedColorGranite.value = null;
        selectedColorQuartz.value = null;
    }
    buttonDisabled();
}

function selectColorMelamine(id: number) {
    if (selectedColorMelamine.value === id) {
        selectedColorMelamine.value = null;
    } else {
        selectedColorMelamine.value = id;
    }
    buttonDisabled();
}

function buttonDisabled() {
    if (selectedColorGranite.value !== null || selectedColorQuartz.value !== null || selectedColorMarble.value !== null || selectedColorMelamine.value !== null) {
        buttonFinalizarDisabled.value = false;
    } else {
        buttonFinalizarDisabled.value = true;
    }
}

function selectColor(id: number, color: string) {
    orderStore.setColor(id, color);
}

const initRealSwipers = () => { 
    const selectors = [".granitos", ".quartz", ".marmoles", ".melaminas"];
    selectors.forEach(selector => {
        new Swiper(selector, {
            ...swiperConfig,
            navigation: {
                nextEl: `${selector} .swiper-button-next`,
                prevEl: `${selector} .swiper-button-prev`,
            },
        });
    });
};

//LIFECYCLES
onBeforeMount(async () => {
    try {
        const responseDG = await axios.get(base + '/granitodetalles');
        granites.value = responseDG.data.data;
        const responseDQ = await axios.get(base + '/silestonedetalles');
        quartz.value = responseDQ.data.data;
        const responseDM = await axios.get(base + '/marmoldetalles');
        marbles.value = responseDM.data.data;
        const responseDF = await axios.get(base + '/melaminadetalles');
        melamines.value = responseDF.data.data;
    } catch (error) {
        console.error('Error fetching data:', error);
    }
    finally {
        isLoading.value = false;

        await nextTick(); // 2. IMPORTANTE: Esperamos a que Vue dibuje el v-else
        
        initRealSwipers(); // 3. Ahora sí, inicializamos los materiales reales
    
    }
});

onMounted(() => {
    //swiper creation
    new Swiper(".granitos", {
        ...swiperConfig,
    });
    new Swiper(".quartz", {
        ...swiperConfig,
    });
    new Swiper(".marmoles", {
        ...swiperConfig,
    });
    new Swiper(".melaminas", {
        ...swiperConfig,
    });
    new Swiper(".skeleton-swiper", {
        ...swiperConfig,
    });

});

</script>
