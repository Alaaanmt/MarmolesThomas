<template>
    <!--Detalles de Mesadas-->
    <section class="pt-32 md:px-48 px-12">
        <div v-for="item in detailsGranite" :key="item.id">
            <div class="w-full h-full flex flex-col md:flex-row space-x-10">
                <div class="w-full flex flex-col justify-center">
                    <h2 class="text-xl md:text-2xl font-bold text-cyan-600 mb-4">{{ item.color }}</h2>
                    <p class="text-[12px] md:text-sm text-gray-700 dark:text-gray-200 mb-6">{{ item.detalle }}
                    </p>
                </div>

                <!--SKELETON-->
                <template v-if="isLoading">
                    <div v-for="n in 1" :key="n" class="skeleton w-1/3 h-1/3 md:w-1/4 md:h-1/4 aspect-square"></div>
                </template>

                <!--Contenido-->
                <div v-else id="imagen" class="w-1/3 h-1/3 md:w-1/4 md:h-1/4 mx-auto">
                    <img :src="item.path != null ? item.path : '/img/logo.png'" alt=""
                        class="w-full h-full aspect-square object-cover rounded-md ">
                </div>
            </div>
            <!--Separador-->
            <div class="border my-10 border-gray-200 dark:border-gray-600"></div>
        </div>
    </section>


    <!--Boton-->
    <div class="flex pt-6 gap-1 justify-center items-center cursor-pointer" @click="goBack()">
        <div class="w-4 h-4">
            <img src="/img/arrow-left.svg" class="w-full h-full object-cover dark:invert">
        </div>
        <div>Volver</div>
    </div>
</template>

<script setup lang="ts">
// VUE
import { onBeforeMount, ref } from 'vue';
import { useRouter } from 'vue-router';

// BASE URL
import { baseUrl } from '@/utilities';

//AXIOS
import axios from 'axios';

// DATA
const detailsGranite = ref<any>([]);
const router = useRouter();
const isLoading = ref(true);
const base = baseUrl

//FUNCTIONS
function goBack() {
    router.back()
}


// LIFECYCLES
onBeforeMount(async () => {
    try {
    const responseDG = await axios.get(base + '/granitodetalles');
    detailsGranite.value = responseDG.data.data;
    } catch (error) {
        console.error('Error fetching details granite:', error);
    } finally {
        isLoading.value = false;
    }
});

</script>
