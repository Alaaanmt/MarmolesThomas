<template>
    <section class="mx-auto max-w-6xl px-6 pb-16 pt-32 md:px-12 lg:px-20">
        <div class="mb-10 text-center">
            <p class="mb-2 text-sm font-semibold uppercase tracking-widest text-cyan-700 dark:text-cyan-400">
                Paso 4
            </p>
            <h1 class="text-3xl font-semibold md:text-4xl">Tu pedido está listo</h1>
            <p class="mx-auto mt-4 max-w-2xl leading-relaxed text-gray-600 dark:text-gray-300">
                Revisá los datos. La visualización 3D es orientativa; el detalle final se confirma al contactarnos.
            </p>
        </div>

        <div class="grid min-w-0 grid-cols-1 items-start gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(22rem,.95fr)]">
            <OrderPreview :show-countertop="showCountertop" :show-furniture="showFurniture"
                :show-vanity="showVanity" :vanity-support="vanitySupport"
                :melamine-image="previewMelamineImage" :stone-image="orderStore.selectedStonePath"
                :has-zocalo="hasZocalo" :is-wide-furniture="isWideFurniture" :preview-label="previewLabel" />

            <div class="space-y-6 border border-gray-200 bg-white p-5 dark:border-neutral-700 dark:bg-neutral-900 md:p-8">
                <div>
                    <h2 class="text-xl font-semibold">Componentes del pedido</h2>
                    <div class="mt-4 space-y-3">
                        <div v-for="component in selectedComponents" :key="component.id"
                            class="border-l-4 border-cyan-700 pl-4">
                            <p class="font-semibold">{{ component.name }}</p>
                            <p class="text-sm text-gray-600 dark:text-gray-300">{{ measurementText(component.id) }}</p>
                            <p v-if="component.id === 1" class="text-sm text-gray-600 dark:text-gray-300">
                                Piedra: {{ orderStore.selectedStoneName || 'Sin definir' }}
                                · {{ hasZocalo ? 'Con zócalo' : 'Sin zócalo' }}
                            </p>
                            <p v-if="component.id === 2" class="text-sm text-gray-600 dark:text-gray-300">
                                Melamina: {{ orderStore.selectedMelamineName || 'Sin definir' }}
                            </p>
                            <p v-if="component.id === 3" class="text-sm text-gray-600 dark:text-gray-300">
                                Piedra: {{ orderStore.selectedStoneName || 'Sin definir' }}
                            </p>
                        </div>
                    </div>
                </div>

                <div v-if="sampleDetails.length" class="border-t border-gray-200 pt-5 dark:border-neutral-700">
                    <h2 class="text-xl font-semibold">Solo para la muestra</h2>
                    <p class="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                        Estas elecciones ayudan a comparar colores, pero no agregan productos al pedido.
                    </p>
                    <ul class="mt-3 space-y-2 text-sm text-gray-600 dark:text-gray-300">
                        <li v-for="detail in sampleDetails" :key="detail">{{ detail }}</li>
                    </ul>
                </div>

                <button type="button"
                    class="flex w-full items-center justify-center gap-2 bg-green-500 px-4 py-3 font-semibold text-white transition-colors hover:bg-green-600"
                    @click="sendWhatsApp">
                    <img src="/img/whatsapp.png" alt="" class="h-6 w-6 object-contain">
                    Pedir presupuesto
                </button>
            </div>
        </div>

        <div class="mt-8 flex justify-center">
            <button type="button" class="px-5 py-2 text-sm font-semibold hover:text-cyan-700 dark:hover:text-cyan-400"
                @click="goBack">
                Volver
            </button>
        </div>
    </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import OrderPreview from '@/components/OrderPreview.vue'
import { useOrderStore } from '@/stores/Order'
import type { OrderProductId } from '@/types/order'

const route = useRoute()
const router = useRouter()
const orderStore = useOrderStore()
const productNames: Record<OrderProductId, string> = { 1: 'Mesada', 2: 'Mueble', 3: 'Vanitory' }
const selectedIds = parseIds(String(route.params.resumenId ?? ''))
const selectedComponents = computed(() => selectedIds.map(id => ({ id, name: productNames[id] })))
const isFurnitureOnly = computed(() => selectedIds.length === 1 && selectedIds[0] === 2)
const hasMesada = computed(() => selectedIds.includes(1))
const hasFurniture = computed(() => selectedIds.includes(2))
const hasVanity = computed(() => selectedIds.includes(3))
const showCountertop = computed(() => hasMesada.value || (isFurnitureOnly.value && orderStore.previewCompanion === 'mesada'))
const showVanity = computed(() => hasVanity.value || (isFurnitureOnly.value && orderStore.previewCompanion === 'vanitory'))
const showFurniture = computed(() => !showVanity.value && (hasFurniture.value || showCountertop.value))
const vanitySupport = computed(() => orderStore.getComponent(3)?.measurements.apoyo || 'flotante')
const hasZocalo = computed(() => Boolean(orderStore.getComponent(1)?.measurements.conZocalo))
const isWideFurniture = computed(() => Number(orderStore.getComponent(2)?.measurements.largo ?? 0) > 120)
const previewLabel = computed(() => orderStore.productName || 'la combinación seleccionada')
const previewMelamineImage = computed(() => orderStore.selectedMelamineName.toLowerCase().includes('blanca')
    ? '/img/furniture/melaminaBlancaEjemplo.png'
    : orderStore.selectedMelamineName.toLowerCase().includes('wengue')
        ? '/img/furniture/Wengue.png'
        : orderStore.selectedMelaminePath)
const sampleDetails = computed(() => {
    const details: string[] = []
    if (isFurnitureOnly.value) {
        details.push(`Muestra con ${orderStore.previewCompanion === 'vanitory' ? 'vanitory' : 'mesada'} y piedra ${orderStore.previewOnlyMaterialName || orderStore.selectedStoneName || 'seleccionada'}.`)
        details.push(`Melamina de referencia: ${orderStore.previewOnlyMelamineName || orderStore.selectedMelamineName || 'seleccionada'}.`)
    } else if (!hasFurniture.value) {
        details.push(`Melamina de referencia: ${orderStore.selectedMelamineName || 'seleccionada'}.`)
    }
    return details
})

function parseIds(value: string): OrderProductId[] {
    return value.split('-')
        .map(Number)
        .filter((id): id is OrderProductId => id === 1 || id === 2 || id === 3)
}

function measurementText(id: OrderProductId) {
    const measurements = orderStore.getComponent(id)?.measurements
    if (!measurements) return 'Medidas a confirmar'
    if (measurements.medidasBloqueadas) return 'Toma de medidas a domicilio (a coordinar)'
    if (id === 1) return `${measurements.largo} cm × ${measurements.profundidad} cm · espesor ${measurements.espesor} cm`
    if (id === 2) return `${measurements.largo} cm × ${measurements.profundidad} cm × ${measurements.alto} cm de alto`
    return `${measurements.largo} cm × ${measurements.profundidad} cm · ${measurements.apoyo || 'apoyo a definir'}`
}

function sendWhatsApp() {
    const lines = selectedComponents.value.map(component => {
        const material = component.id === 2
            ? `Melamina: ${orderStore.selectedMelamineName}`
            : `Piedra: ${orderStore.selectedStoneName}`
        return `• ${component.name}: ${measurementText(component.id)} · ${material}`
    })
    if (hasMesada.value) lines.push(`• Zócalo: ${hasZocalo.value ? 'Sí' : 'No'}`)
    const message = [
        'Hola, quisiera solicitar un presupuesto con los siguientes detalles:',
        '',
        ...lines,
        '',
    ].join('\n')
    window.open(`https://wa.me/5491121666225?text=${encodeURIComponent(message)}`, '_blank')
}

function goBack() {
    void router.back()
}
</script>
