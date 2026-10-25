<template>
    <!--Presentacion-->
    <section>
        <div class=" relative pt-24 flex justify-center">
            <div class="w-full h-96 md:h-110 lg:h-120">
                <img src="/img/granite/negroBrasil.jpg" alt="" class="w-full h-full object-cover">
            </div>
            <div class="absolute top-1/3 bg-gray-800 opacity-80 p-6 md:p-8 text-white text-center space-y-3 z-20">
                <p class="text-xl md:text-3xl uppercase font-semibold">
                    Nuestros Trabajos
                </p>
                <p class="text-sm md:text-lg">
                    Mesadas con materiales como granito, silestone y marmol
                </p>
                <p class="text-[12px] md:text-sm">
                    Cualquier consulta no dude comunicarse con nosotros 1121666225
                </p>
            </div>
        </div>
    </section>
    <!--Trabajos-->
    <section class="pt-24 lg:px-48 md:px-24 px-8">
        <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
            <template v-if="isLoading">
                <div v-for="n in 6" :key="n" class="w-full">
                    <div class="skeleton w-full aspect-square"></div>
                    <div class="skeleton h-4 w-2/3 mx-auto mt-4 mb-4"></div>
                </div>
            </template>
            <template v-else>
                <div class="w-full h-full" v-for="item in detailsWorks" :key="item.id">
                    <img :src="item.path != null ? item.path : '/img/logo.png'" alt=""
                        class="w-full aspect-square object-cover rounded-md ">
                    <p class="text-sm font-bold text-center text-gray-800 dark:text-gray-200 mb-4">{{ item.titulo }}</p>
                </div>
            </template>
        </div>
    </section>

    <!--Boton-->
    <div class="flex pt-6 gap-1 justify-center items-center cursor-pointer" @click="goBack()">
        <div class="w-4 h-4">
            <img src="/img/arrow-left.svg" alt="" class="w-full h-full object-cover dark:invert">
        </div>
        <div>Volver</div>
    </div>
</template>

<script setup lang="ts">
// VUE
import { onBeforeMount, ref } from 'vue';
import { useRouter } from 'vue-router';
//AXIOS
import axios from 'axios';

//BaseUrl
import { baseUrl } from '@/utilities';

// DATA
const detailsWorks = ref<any>([]);
const router = useRouter();
const isLoading = ref(true);
const base = baseUrl

function goBack() {
    router.back()
}

// LIFECYCLES
onBeforeMount(async () => {
    try {
        const responseDT = await axios.get(base + '/detallestrabajos/1');
        detailsWorks.value = responseDT.data.data;
    } catch (error) {
        console.error('Error fetching details works:', error);
    } finally {
        isLoading.value = false;
    }
});

</script>