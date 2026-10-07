<template>
    <!--PASOS-->
    <section class="flex justify-center pt-32 lg:px-48 md:px-40 px-4">
        <div class="flex gap-4">
            <span class="px-3 py-1 bg-cyan-700 text-white rounded-full text-xs">Paso 1: Producto</span>
            <span class="px-3 py-1 bg-gray-300 text-gray-600 rounded-full text-xs">Paso 2: Material</span>
            <span class="px-3 py-1 bg-gray-300 text-gray-600 rounded-full text-xs">Paso 3: Medidas</span>
        </div>
    </section>

    <!--SELECCION DE PRODUCTOS-->
    <section>
        <p class="text-3xl font-semibold uppercase text-center py-8">Elegí tu producto</p>
        <div class="lg:px-48 md:px-24 px-4 grid grid-cols-4 md:grid-cols-3 lg:grid-cols-3 gap-6">
            <RouterLink v-for="(item, index) in imageProduct" :key="item.id" :to="`/color/${item.id}`" @click="selectProduct(item.id, item.text)"
                class="relative col-span-2 md:col-span-1" :class="{
                    'col-start-2': (index === 2)
                }">
                <div>
                    <div class="aspect-square rounded-full overflow-hidden cursor-pointer border-4 border-cyan-700">
                        <img :src="item.img" class="object-cover w-full h-full hover:scale-110 transition-all duration-400">
                    </div>
                    <p
                        class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2  font-bold uppercase text-white">
                        {{ item.text }}</p>
                </div>
            </RouterLink>
        </div>
    </section>
    <div class="text-center pt-12">
        <RouterLink to="/" class="cursor-pointer">Volver</RouterLink>
    </div>

</template>

<script setup lang="ts">
//IMPORTS
import { useOrderStore } from '@/stores/Order';
// DATA
const orderStore = useOrderStore();

const imageProduct = [
    {
        id: 1,
        img: '/img/image.jpg',
        text: 'Mesada',
    },
    {
        id: 2,
        img: '/img/mueble.jpg',
        text: 'Mueble',
    },
    {
        id: 3,
        img: '/img/Portada-vanitory.jpg',
        text: 'Vanitory',
    },
];

function selectProduct(id: number, text: string){
    orderStore.setProduct(id, text)
}

</script>
