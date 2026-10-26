<template>

    <!--Carrousel-->
    <section id="home-hero" class="pt-24 pb-10" aria-label="Trabajos destacados">
        <div class="swiper mesadas">
            <div class="swiper-wrapper">
                <div class="swiper-slide w-full" v-for="item in imagesCarrousel" :key="item.id">
                    <div class="grid h-full grid-cols-1 bg-cyan-800 text-white md:grid-cols-[0.8fr_1.2fr]">
                        <div class="flex min-h-28 items-center justify-center px-6 py-7 text-center md:min-h-0 md:px-10 lg:px-16">
                            <h2 class="text-3xl font-semibold uppercase leading-tight sm:text-4xl md:text-5xl lg:text-6xl">
                                {{ item.text }}
                            </h2>
                        </div>
                        <div class="h-64 overflow-hidden sm:h-80 md:h-[32rem]">
                            <img :src="item.img" :alt="item.alt"
                                class="hero-slide-image h-full w-full object-cover">
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
    <!--Separador-->
    <div id="quienesSomos" class="border mb-10 border-gray-200 dark:border-gray-600 arreglo-scroll"></div>

    <!--QuienesSomos-->
    <section class="px-6 py-10 md:px-12 md:py-16 lg:px-24" data-aos="fade-up" data-aos-duration="1500">
        <div class="mx-auto grid max-w-6xl grid-cols-1 items-center gap-8 md:grid-cols-2 md:gap-12 lg:gap-20">
            <div class="space-y-6 text-center md:text-left">
                <div class="space-y-3">
                    <p class="text-sm font-semibold uppercase tracking-widest text-cyan-700 dark:text-cyan-400">
                        Mármoles Thomas
                    </p>
                    <h2 class="text-3xl font-semibold leading-tight md:text-4xl lg:text-5xl">
                        Oficio familiar, hecho para durar.
                    </h2>
                </div>
                <div class="space-y-4 text-base leading-relaxed text-gray-700 dark:text-gray-200 md:text-lg">
                    <p>En Mármoles Thomas trabajamos desde hace más de 32 años en la fabricación e instalación de
                        mesadas,
                        vanitorys, pisos y revestimientos en mármol, granito y silestone.</p>
                    <p>Somos una empresa familiar que combina la experiencia artesanal con materiales de primera calidad
                        para lograr resultados únicos y duraderos. También realizamos bajomesadas y alacenas en melamina
                        de 18 mm, adaptadas a cada espacio y estilo. Nuestro compromiso es ofrecer excelencia en cada
                        detalle, para que cada proyecto refleje la calidad y dedicación que nos caracteriza.</p>
                </div>
            </div>
            <div class="relative h-72 overflow-hidden md:h-[28rem]">
                <img src="/img/image.jpg" alt="Mesada de granito instalada en una cocina"
                    class="h-full w-full object-cover object-center">
            </div>
        </div>
    </section>

    <!--Separador-->
    <div id="nuestrosTrabajos" class="border my-10 border-gray-200 dark:border-gray-600 arreglo-scroll"></div>

    <!--NuestrosTrabajos-->
    <section class="px-6 py-14 md:px-12 md:py-20 lg:px-24" data-aos="fade-up" data-aos-duration="1000">
        <div class="mx-auto max-w-6xl">
            <div class="mb-10 md:mb-14">
                <div>
                    <p class="mb-2 text-sm font-semibold uppercase tracking-widest text-cyan-700 dark:text-cyan-400">
                        Hechos a medida
                    </p>
                    <h2 class="text-3xl font-semibold md:text-4xl">Nuestros trabajos</h2>
                </div>
            </div>

            <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:auto-rows-[13rem] lg:grid-cols-12 lg:gap-6">
                <template v-if="isLoading">
                    <div v-for="n in 3" :key="n" class="relative h-56 overflow-hidden lg:h-full"
                        :class="n === 1 ? 'sm:col-span-2 lg:col-span-7 lg:row-span-2' : 'lg:col-span-5'">
                        <div class="skeleton absolute inset-0"></div>
                        <div class="absolute inset-x-0 bottom-0 flex items-center justify-between gap-3 bg-neutral-950/75 px-4 py-3">
                            <div class="skeleton h-6 w-2/5"></div>
                            <div class="skeleton h-5 w-1/4"></div>
                        </div>
                    </div>
                </template>

                <RouterLink v-for="(item, index) in works" :key="item.id" v-else :to="'/' + item.ruta"
                    class="group relative block h-56 overflow-hidden bg-neutral-800 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-600 lg:h-full"
                    :class="index === 0 ? 'sm:col-span-2 lg:col-span-7 lg:row-span-2' : index === 1 || index === 2 ? 'lg:col-span-5' : 'lg:col-span-4'"
                    :aria-label="`Ver trabajos de ${item.titulo}`">
                    <img :src="item.path ?? '/img/logo.png'" :alt="item.titulo"
                        class="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105">
                    <div class="absolute inset-x-0 bottom-0 flex items-center justify-between gap-3 bg-neutral-950/75 px-4 py-3 text-white md:px-5 md:py-4">
                        <p class="text-lg font-semibold md:text-xl">{{ item.titulo }}</p>
                        <span class="shrink-0 bg-cyan-700 px-3 py-2 text-sm font-semibold transition-colors group-hover:bg-cyan-600">
                            Ver trabajos
                        </span>
                    </div>
                </RouterLink>
            </div>
        </div>
    </section>

    <!--Separador-->
    <div id="colores" class="border my-10 border-gray-200 dark:border-gray-600 arreglo-scroll"></div>

    <!--Materiales-->
    <section aria-labelledby="materiales-title" class="px-6 py-12 md:px-12 md:py-20 lg:px-24">
        <div class="mx-auto max-w-6xl">
            <div class="mb-12 md:mb-20" data-aos="fade-up">
                <p class="mb-2 text-sm font-semibold uppercase tracking-widest text-cyan-700 dark:text-cyan-400">
                    Granitos, mármoles y cuarzos
                </p>
                <h2 id="materiales-title" class="text-3xl font-semibold md:text-4xl">Colores y materiales</h2>
            </div>

            <div class="space-y-16 md:space-y-24">
                <article class="grid grid-cols-1 items-center gap-8 md:grid-cols-2 md:gap-12 lg:gap-20">
                    <div class="aspect-[4/3] overflow-hidden" data-aos="fade-right">
                        <img src="/img/granite/grisMara.jpg" alt="Granito Gris Mara"
                            class="h-full w-full object-cover transition-transform duration-700 hover:scale-105">
                    </div>
                    <div class="space-y-5" data-aos="fade-left">
                        <h3 class="text-2xl font-semibold md:text-3xl">Granito: fortaleza y belleza sobria</h3>
                        <p class="leading-relaxed text-gray-700 dark:text-gray-200 md:text-lg">
                            Los granitos combinan porte y dureza con una gran belleza sobria. Su elegancia atemporal y
                            su resistencia son grandes ventajas que los convierten en un material perfecto para
                            exteriores e interiores. Esta piedra milenaria es versátil y se adapta a todo tipo de
                            superficies.
                        </p>
                        <RouterLink to="/detailsGranite"
                            class="inline-flex border-b-2 border-cyan-600 pb-1 font-semibold text-cyan-700 transition-colors hover:text-cyan-900 dark:text-cyan-400 dark:hover:text-cyan-200">
                            Ver granitos
                        </RouterLink>
                    </div>
                </article>

                <article class="grid grid-cols-1 items-center gap-8 md:grid-cols-2 md:gap-12 lg:gap-20">
                    <div class="space-y-5 md:order-1" data-aos="fade-right">
                        <h3 class="text-2xl font-semibold md:text-3xl">Silestone: líder en superficies de cuarzo</h3>
                        <p class="leading-relaxed text-gray-700 dark:text-gray-200 md:text-lg">
                            Líder en superficies de cuarzo desde hace 30 años, Silestone ha marcado tendencias y
                            transformado el mundo de las mesadas de cocina, convirtiéndose en un referente del diseño
                            interior. Sus superficies ofrecen ventajas y propiedades únicas a nivel estético, funcional
                            y técnico.
                        </p>
                        <p class="leading-relaxed text-gray-700 dark:text-gray-200 md:text-lg">
                            ¡Disfrutá del placer de crear tu hogar!
                        </p>
                        <RouterLink to="/detailsQuartz"
                            class="inline-flex border-b-2 border-cyan-600 pb-1 font-semibold text-cyan-700 transition-colors hover:text-cyan-900 dark:text-cyan-400 dark:hover:text-cyan-200">
                            Ver silestones
                        </RouterLink>
                    </div>
                    <div class="aspect-[4/3] overflow-hidden md:order-2" data-aos="fade-left">
                        <img src="/img/quartz/blanconorte.jpg" alt="Superficie de cuarzo Blanco Norte"
                            class="h-full w-full object-cover transition-transform duration-700 hover:scale-105">
                    </div>
                </article>

                <article class="grid grid-cols-1 items-center gap-8 md:grid-cols-2 md:gap-12 lg:gap-20">
                    <div class="aspect-[4/3] overflow-hidden" data-aos="fade-right">
                        <img src="/img/marble/carrara.jpg" alt="Mármol Carrara con vetas naturales"
                            class="h-full w-full object-cover transition-transform duration-700 hover:scale-105">
                    </div>
                    <div class="space-y-5" data-aos="fade-left">
                        <h3 class="text-2xl font-semibold md:text-3xl">Mármol: elegancia y atemporalidad</h3>
                        <p class="leading-relaxed text-gray-700 dark:text-gray-200 md:text-lg">
                            Pasado y presente se funden en un mismo material. Sus extraordinarias texturas naturales,
                            variedad y riqueza cromática son algunas de las características que han hecho del mármol uno
                            de los materiales preferidos por interioristas y arquitectos. Sus posibilidades decorativas
                            son tan variadas como se pueda imaginar.
                        </p>
                        <RouterLink to="/detailsMarble"
                            class="inline-flex border-b-2 border-cyan-600 pb-1 font-semibold text-cyan-700 transition-colors hover:text-cyan-900 dark:text-cyan-400 dark:hover:text-cyan-200">
                            Ver mármoles
                        </RouterLink>
                    </div>
                </article>
            </div>
        </div>
    </section>

    <!--Trayectoria-->
    <section ref="trajectorySection" aria-labelledby="trayectoria-title"
        class="relative isolate overflow-hidden bg-neutral-950 text-white">
        <video class="absolute inset-0 -z-20 h-full w-full object-cover" :autoplay="!prefersReducedMotion" muted loop
            playsinline preload="metadata" poster="/img/image.jpg" aria-hidden="true">
            <source src="/video/videoMarmoles.mp4" type="video/mp4">
        </video>
        <div class="absolute inset-0 -z-10 bg-neutral-800/75"></div>
        <div class="mx-auto max-w-6xl px-6 py-28 md:px-12 md:py-36">
            <h2 id="trayectoria-title" class="mb-12 text-center text-3xl font-semibold md:mb-16 md:text-4xl"
                data-aos="fade-up">Experiencia que se nota en cada detalle</h2>
            <div class="grid grid-cols-1 gap-10 text-center md:grid-cols-3 md:gap-8">
                <div v-for="(metric, index) in metrics" :key="metric.label" class="space-y-2"
                    data-aos="fade-up" :data-aos-delay="index * 100">
                    <p class="text-5xl font-semibold tabular-nums text-cyan-500 md:text-6xl">
                        {{ metric.current }}{{ metric.suffix }}
                    </p>
                    <p class="text-lg md:text-xl">{{ metric.label }}</p>
                </div>
            </div>
        </div>
    </section>

    <!--Colores Melamina-->
    <section aria-labelledby="melamina-title" class="px-6 py-16 md:px-12 md:py-24 lg:px-24">
        <div id="coloresMelamina" class="arreglo-scroll"></div>
        <div class="mx-auto grid max-w-6xl grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-16">
            <div class="space-y-6 lg:col-span-4" data-aos="fade-right">
                <p class="text-sm font-semibold uppercase tracking-widest text-cyan-700 dark:text-cyan-400">
                    Texturas para tu espacio
                </p>
                <h2 id="melamina-title" class="text-3xl font-semibold md:text-4xl">Colores de melamina</h2>
                <p class="leading-relaxed text-gray-700 dark:text-gray-200 md:text-lg">
                    Tonos y vetas para dar forma a muebles que se integran a tu casa y a tu manera de vivir.
                </p>
                <RouterLink to="/detailsFurniture"
                    class="inline-flex items-center gap-2 border-b-2 border-cyan-600 pb-1 font-semibold text-cyan-700 transition-colors hover:text-cyan-900 dark:text-cyan-400 dark:hover:text-cyan-200">
                    Explorar melaminas
                    <span aria-hidden="true">→</span>
                </RouterLink>
            </div>

            <div class="grid grid-cols-2 gap-4 sm:gap-6 lg:col-span-8">
                <template v-if="isLoading">
                    <div v-for="n in 4" :key="n" class="space-y-3">
                        <div class="skeleton aspect-[4/3] w-full"></div>
                        <div class="skeleton h-5 w-2/3"></div>
                    </div>
                </template>
                <div v-else v-for="item in furniture.slice(0, 4)" :key="item.id" class="group">
                    <div class="aspect-[4/3] overflow-hidden bg-gray-200 dark:bg-neutral-700">
                        <img :src="item.path ?? '/img/logo.png'" :alt="item.color"
                            class="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105">
                    </div>
                    <p class="pt-3 text-base font-semibold transition-colors group-hover:text-cyan-700 dark:group-hover:text-cyan-400 md:text-lg">
                        {{ item.color }}
                    </p>
                </div>
            </div>
        </div>
    </section>


</template>

<script setup lang="ts">
// VUE
import { onBeforeMount, onBeforeUnmount, onMounted, ref } from 'vue';
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
        alt: 'Mesada de piedra instalada en una cocina',
    },
    {
        id: 2,
        img: '/img/Mueble1.jpg',
        text: 'Muebles',
        alt: 'Mueble a medida realizado en el taller',
    },
    {
        id: 3,
        img: '/img/Portada-vanitory.jpg',
        text: 'Vanitorys',
        alt: 'Vanitory de piedra y mueble a medida',
    },
];

const works = ref<any>([]);

const furniture = ref<any>([]);

const isLoading = ref(true);
const prefersReducedMotion = ref(false);
const trajectorySection = ref<HTMLElement | null>(null);
const metrics = ref([
    { label: 'años de experiencia', target: 32, current: 0, suffix: '+' },
    { label: 'clientes satisfechos', target: 200, current: 0, suffix: '+' },
    { label: 'soluciones a medida', target: 3, current: 0, suffix: '' },
]);
let metricsObserver: IntersectionObserver | undefined;
let metricsAnimationFrame = 0;
let heroSwiper: Swiper | undefined;

function animateMetrics() {
    if (prefersReducedMotion.value) {
        metrics.value.forEach(metric => { metric.current = metric.target; });
        return;
    }

    const startedAt = performance.now();
    const duration = 1400;

    const update = (now: number) => {
        const progress = Math.min((now - startedAt) / duration, 1);
        const easedProgress = 1 - Math.pow(1 - progress, 4);
        metrics.value.forEach(metric => {
            metric.current = Math.round(metric.target * easedProgress);
        });

        if (progress < 1) {
            metricsAnimationFrame = requestAnimationFrame(update);
        }
    };

    metricsAnimationFrame = requestAnimationFrame(update);
}

// LIFECYCLES
onBeforeMount(async () => {
    try {
        const responseNT = await axios.get(base + '/nuestrostrabajos');
        works.value = responseNT.data.data;

        const responseMC = await axios.get(base + '/melaminacolor');
        furniture.value = responseMC.data.data;

    } catch (error) {
        console.error('Error fetching data:', error);
    } finally {
        isLoading.value = false;
    }
});

onMounted(() => {
    prefersReducedMotion.value = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion.value || !('IntersectionObserver' in window)) {
        animateMetrics();
    } else if (trajectorySection.value) {
        metricsObserver = new IntersectionObserver(([entry]) => {
            if (!entry?.isIntersecting) return;
            animateMetrics();
            metricsObserver?.disconnect();
        }, { threshold: 0.35 });
        metricsObserver.observe(trajectorySection.value);
    }

    heroSwiper = new Swiper(".mesadas", {
        autoplay: {
            delay: 2000,
            disableOnInteraction: false,
        },
        speed: 1000,
        loop: true,
    });
    AOS.init({ once: true, duration: 800, offset: 100 })
});

onBeforeUnmount(() => {
    heroSwiper?.destroy(true, true);
    metricsObserver?.disconnect();
    cancelAnimationFrame(metricsAnimationFrame);
});
</script>
