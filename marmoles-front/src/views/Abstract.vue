<template>
  <section v-if="productId" class="lg:px-24 md:px-16 px-8 pt-32 flex flex-col justify-center items-center">
    <p class="text-3xl font-semibold text-center pb-4">¡Tu Pedido está listo!</p>
    <p class="pb-4 text-center justify-center">Revisá los detalles de tu selección y solicitá tu presupuesto</p>
    
    <div class="p-4 rounded-md border-2 border-cyan-600 gap-6 md:gap-12 lg:gap-18 md:grid grid-cols-2 flex flex-col">
      
      <!-- Imagen según el Producto -->
      <div class="w-full">
        <img v-if="productId === 1" src="/img/image.jpg" alt="Mesada" class="w-full h-full object-cover rounded">
        <img v-else-if="productId === 2" src="/img/mueble.jpg" alt="Mueble" class="w-full h-full object-cover rounded">
        <img v-else-if="productId === 3" src="/img/Portada-vanitory.jpg" alt="Vanitory" class="w-full h-full object-cover rounded">
      </div>

      <!-- Detalles del Pedido -->
      <div class="text-sm md:text-lg flex flex-col justify-center">
        <p class="font-semibold text-lg md:text-xl">Detalles del pedido</p>
        <div class="border-b mb-6 border-gray-300"></div>

        <div v-for="item in detailProduct" :key="item.id" class="mb-4 flex items-center gap-3">
          <div class="w-6 h-6 flex-shrink-0">
            <img :src="item.img" alt="" class="w-full h-full object-contain dark:invert">
          </div>
          <p class="font-medium">{{ item.text }}</p>
        </div>

        <div class="border-b mt-4 mb-4 border-gray-300"></div>

        <!-- Botón WhatsApp -->
        <div 
          @click="mandarMensaje()"
          class="flex justify-center items-center gap-2 text-white bg-green-500 hover:bg-green-600 transition-colors cursor-pointer px-4 py-2 rounded-md font-semibold"
        >
          <div class="h-6 w-6">
            <img src="/img/whatsapp.png" alt="WhatsApp" class="w-full h-full object-contain">
          </div>
          <p>Pedir presupuesto</p>
        </div>
      </div>
    </div>
  </section>

  <!-- Botón Volver -->
  <div class="flex pt-6 gap-1 justify-center items-center cursor-pointer" @click="goBack()">
    <div class="w-4 h-4">
      <img src="/img/arrow-left.svg" class="w-full h-full object-cover dark:invert">
    </div>
    <div>Volver</div>
  </div>
</template>

<script setup lang="ts">
//IMPORTS
import { useRouter } from 'vue-router';
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import { useOrderStore } from '@/stores/Order';
import { computed } from 'vue';

//DATA
const router = useRouter()
const productId = ref<number | null>(null);
const orderStore = useOrderStore();

const route = useRoute();
productId.value = route.params.resumenId ? Number(route.params.resumenId) : null;

const detailProduct = computed(() => {
    const items = [
        {
            id: 1,
            img: '/img/package.svg',
            text: `Producto: ${orderStore.productName || 'No especificado'}`
        },
        {
            id: 2,
            img: '/img/palette.svg',
            text: `Color: ${orderStore.selectedColorName || 'No especificado'}`
        }
    ]

    // SI PIDIÓ TOMA DE MEDIDAS A DOMICILIO
    if (orderStore.medidasBloqueadas) {
        items.push({
            id: 3,
            img: '/img/ruler.svg',
            text: 'Medidas: Toma de medidas en domicilio (A coordinar)'
        })
    } else {
        // SEGÚN EL PRODUCTO, CONSTRUIMOS EL TEXTO DE MEDIDAS
        let textoMedidas = ''

        if (productId.value === 1) {
            // 1. MESADA: Largo x Profundidad x Espesor
            textoMedidas = `Medidas: ${orderStore.largo}cm (Largo) x ${orderStore.profundidad}cm (Profundidad) x ${orderStore.espesor}cm (Espesor)`
        } else if (productId.value === 2) {
            // 2. MUEBLE: Largo x Alto x Profundidad
            textoMedidas = `Medidas: ${orderStore.largo}cm (Largo) x ${orderStore.alto}cm (Alto) x ${orderStore.profundidad}cm (Profundidad)`
        } else if (productId.value === 3) {
            // 3. VANITORY: Largo x Profundidad
            textoMedidas = `Medidas: ${orderStore.largo}cm (Largo) x ${orderStore.profundidad}cm (Profundidad)`
        }

        items.push({
            id: 3,
            img: '/img/ruler.svg',
            text: textoMedidas
        })
    }
    //ZOCALO PARA MESADA
    if (productId.value === 1) {
        items.push({
            id: 4,
            img: '/img/dresser.svg',
            text: `Zócalo: ${orderStore.conZocalo ? 'Con zócalo' : 'Sin zócalo'}`
        })
    }
    // MUEBLE PARA VANIORY
    if (productId.value === 3) {
        const textoMueble = orderStore.sinMueble ? '' : 'Sin Mueble'

        let textoApoyo = ''
        if (orderStore.sinMueble && orderStore.apoyo) {
            textoApoyo = orderStore.apoyo === '1' ? ' Flotante' : ' Con patas'
        }

        items.push({
            id: 4,
            img: '/img/dresser.svg',
            text: `Mueble: ${textoMueble}${textoApoyo}`
        })
    }

    return items
})

function mandarMensaje() {
    let mensaje = "Hola, quisiera solicitar un presupuesto con los siguientes detalles:\n\n";

    detailProduct.value.forEach(item => {
        mensaje += `• ${item.text}\n`;
    });

    window.open("https://wa.me/5491121666225?text=" + encodeURIComponent(mensaje), "_blank");
}

function goBack() {
    router.back()
}


</script>