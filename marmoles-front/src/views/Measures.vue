<template>
    <section class="mx-auto max-w-6xl px-6 pb-16 pt-32 md:px-12 lg:px-20">
        <div class="mb-10 text-center">
            <p class="mb-2 text-sm font-semibold uppercase tracking-widest text-cyan-700 dark:text-cyan-400">
                Paso 2
            </p>
            <h1 class="text-3xl font-semibold md:text-4xl">Tomemos las medidas</h1>
            <p class="mx-auto mt-4 max-w-2xl leading-relaxed text-gray-600 dark:text-gray-300">
                Completá los datos de cada componente. Si todavía no tenés las medidas, podés solicitar una visita a
                domicilio.
            </p>
        </div>

        <div class="space-y-8">
            <article v-for="component in measurementComponents" :key="component.id"
                class="border border-gray-200 bg-white p-5 dark:border-neutral-700 dark:bg-neutral-900 md:p-8">
                <div class="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <p class="text-sm font-semibold uppercase tracking-widest text-cyan-700 dark:text-cyan-400">
                            Componente
                        </p>
                        <h2 class="text-2xl font-semibold">{{ component.name }}</h2>
                    </div>
                    <p class="text-sm text-gray-500 dark:text-gray-400">
                        {{ componentHint(component.id) }}
                    </p>
                </div>

                <div class="grid gap-5 md:grid-cols-3">
                    <label class="flex flex-col gap-2 text-sm font-semibold">
                        Largo (cm)
                        <input v-model="drafts[component.id].largo" type="number" min="1" placeholder="Ej: 120"
                            :disabled="drafts[component.id].medidasBloqueadas"
                            class="border-2 border-gray-300 bg-transparent px-4 py-3 outline-none focus:border-cyan-700 disabled:cursor-not-allowed disabled:bg-gray-100 dark:border-neutral-600 dark:disabled:bg-neutral-800">
                    </label>

                    <label class="flex flex-col gap-2 text-sm font-semibold">
                        <template v-if="component.id === 2">
                            Alto (cm)
                            <input v-model="drafts[component.id].alto" type="number" min="1" placeholder="Ej: 85"
                                :disabled="drafts[component.id].medidasBloqueadas"
                                class="border-2 border-gray-300 bg-transparent px-4 py-3 outline-none focus:border-cyan-700 disabled:cursor-not-allowed disabled:bg-gray-100 dark:border-neutral-600 dark:disabled:bg-neutral-800">
                        </template>
                        <template v-else>
                            Profundidad (cm)
                            <input v-model="drafts[component.id].profundidad" type="number" min="1" placeholder="Ej: 60"
                                :disabled="drafts[component.id].medidasBloqueadas"
                                class="border-2 border-gray-300 bg-transparent px-4 py-3 outline-none focus:border-cyan-700 disabled:cursor-not-allowed disabled:bg-gray-100 dark:border-neutral-600 dark:disabled:bg-neutral-800">
                        </template>
                    </label>

                    <label v-if="component.id === 1" class="flex flex-col gap-2 text-sm font-semibold">
                        Espesor (cm)
                        <input v-model="drafts[component.id].espesor" type="number" min="1" placeholder="Ej: 2"
                            :disabled="drafts[component.id].medidasBloqueadas"
                            class="border-2 border-gray-300 bg-transparent px-4 py-3 outline-none focus:border-cyan-700 disabled:cursor-not-allowed disabled:bg-gray-100 dark:border-neutral-600 dark:disabled:bg-neutral-800">
                    </label>
                    <label v-else-if="component.id === 2" class="flex flex-col gap-2 text-sm font-semibold">
                        Profundidad (cm)
                        <input v-model="drafts[component.id].profundidad" type="number" min="1" placeholder="Ej: 60"
                            :disabled="drafts[component.id].medidasBloqueadas"
                            class="border-2 border-gray-300 bg-transparent px-4 py-3 outline-none focus:border-cyan-700 disabled:cursor-not-allowed disabled:bg-gray-100 dark:border-neutral-600 dark:disabled:bg-neutral-800">
                    </label>
                </div>

                <div v-if="component.id === 1" class="mt-5 flex items-center gap-2 text-sm">
                    <input v-model="drafts[component.id].conZocalo" type="checkbox" class="order-checkbox">
                    <span>Agregar zócalo recto en el frente</span>
                </div>

                <div v-if="component.id === 3" class="mt-6 border-t border-gray-200 pt-5 dark:border-neutral-700">
                    <p class="mb-3 text-sm font-semibold">¿Cómo querés ver el vanitory?</p>
                    <div class="flex flex-wrap gap-3">
                        <label v-for="option in vanitySupportOptions" :key="option.value"
                            class="flex cursor-pointer items-center gap-2 border px-4 py-3 text-sm transition-colors"
                            :class="drafts[component.id].apoyo === option.value
                                ? 'border-cyan-700 bg-cyan-50 text-cyan-800 dark:border-cyan-400 dark:bg-cyan-950 dark:text-cyan-200'
                                : 'border-gray-300 dark:border-neutral-600'">
                            <input v-model="drafts[component.id].apoyo" type="radio" name="vanity-support"
                                :value="option.value" class="accent-cyan-700">
                            {{ option.label }}
                        </label>
                    </div>
                </div>

                <label class="mt-6 flex cursor-pointer items-start gap-3 border-t border-gray-200 pt-5 text-sm dark:border-neutral-700">
                    <input v-model="drafts[component.id].medidasBloqueadas" type="checkbox" class="order-checkbox mt-0.5">
                    <span>
                        <strong>Toma de medidas a domicilio</strong>
                        <span class="mt-1 block text-gray-600 dark:text-gray-400">
                            Mostraremos una medida estándar orientativa y la medida final se coordina por WhatsApp.
                        </span>
                    </span>
                </label>

                <p v-if="drafts[component.id].medidasBloqueadas" class="mt-4 bg-cyan-50 px-4 py-3 text-sm text-cyan-900 dark:bg-cyan-950 dark:text-cyan-100">
                    Referencia visual: {{ standardText(component.id) }}. No es una medida de cotización.
                </p>
            </article>
        </div>

        <p v-if="formError" class="mt-6 text-center font-medium text-red-600" role="alert">{{ formError }}</p>

        <div class="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <button type="button" class="border-2 px-5 py-2 font-semibold transition-colors"
                :class="canContinue
                    ? 'border-cyan-700 text-cyan-700 hover:bg-cyan-700 hover:text-white dark:border-cyan-400 dark:text-cyan-300 dark:hover:bg-cyan-700 dark:hover:text-white'
                    : 'cursor-not-allowed border-gray-300 text-gray-400'"
                :disabled="!canContinue" @click="continueToColors">
                Ver combinación y colores
            </button>
            <button type="button" class="px-5 py-2 text-sm font-semibold hover:text-cyan-700 dark:hover:text-cyan-400"
                @click="goBack">
                Volver
            </button>
        </div>
    </section>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useOrderStore } from '@/stores/Order'
import type { OrderProductId, ProductMeasurements } from '@/types/order'

interface SelectedComponent {
    id: OrderProductId
    name: string
}

const route = useRoute()
const router = useRouter()
const orderStore = useOrderStore()
const formError = ref('')

const productNames: Record<OrderProductId, string> = {
    1: 'Mesada',
    2: 'Mueble',
    3: 'Vanitory',
}

const selectedIds = parseIds(String(route.params.medidaId ?? ''))
if (selectedIds.length && selectedIds.join('-') !== orderStore.selectedProductIds.join('-')) {
    orderStore.setProducts(selectedIds)
}

const selectedComponents = computed<SelectedComponent[]>(() =>
    orderStore.selectedProductIds.map(id => ({ id, name: productNames[id] })),
)
const hasFurniture = computed(() => orderStore.selectedProductIds.includes(2))
const hasMesada = computed(() => orderStore.selectedProductIds.includes(1))
const hasVanity = computed(() => orderStore.selectedProductIds.includes(3))
const measurementComponents = computed(() =>
    selectedComponents.value.filter(component =>
        component.id !== 2 || (!hasMesada.value && !hasVanity.value),
    ),
)
const drafts = reactive<Record<OrderProductId, ProductMeasurements>>({
    1: orderStore.getComponent(1)?.measurements ?? emptyMeasurements(),
    2: orderStore.getComponent(2)?.measurements ?? emptyMeasurements(),
    3: orderStore.getComponent(3)?.measurements ?? emptyMeasurements(),
})

const vanitySupportOptions = [
    { value: 'flotante' as const, label: 'Mueble flotante' },
    { value: 'patas' as const, label: 'Mueble con patas' },
]

const canContinue = computed(() => measurementComponents.value.every(component => {
    const draft = drafts[component.id]
    if (draft.medidasBloqueadas) return true
    if (component.id === 1) return Boolean(draft.largo && draft.profundidad && draft.espesor)
    if (component.id === 2) return Boolean(draft.largo && draft.profundidad && draft.alto)
    return Boolean(draft.largo && draft.profundidad && (hasFurniture.value || draft.apoyo))
}))

function parseIds(value: string): OrderProductId[] {
    return value.split('-')
        .map(Number)
        .filter((id): id is OrderProductId => id === 1 || id === 2 || id === 3)
}

function emptyMeasurements(): ProductMeasurements {
    return {
        largo: '',
        profundidad: '',
        alto: '',
        espesor: '',
        medidasBloqueadas: false,
        conZocalo: false,
        sinMueble: false,
        apoyo: '',
    }
}

function componentHint(id: OrderProductId) {
    if (id === 1) return 'Superficie y espesor de la mesada'
    if (id === 2) return 'Medida general del mueble'
    return hasFurniture.value ? 'Tapa y módulo de baño' : 'Medida general del vanitory'
}

function standardText(id: OrderProductId) {
    if (id === 1) return '120 cm de largo × 60 cm de profundidad × 2 cm de espesor'
    if (id === 2) return '120 cm de largo × 60 cm de profundidad × 85 cm de alto'
    return '80 cm de largo × 45 cm de profundidad'
}

function continueToColors() {
    if (!canContinue.value) {
        formError.value = 'Completá las medidas o elegí la toma de medidas a domicilio en cada componente.'
        return
    }

    measurementComponents.value.forEach(component => {
        orderStore.setComponentMeasurements(component.id, {
            ...drafts[component.id],
            largo: drafts[component.id].medidasBloqueadas ? standardValue(component.id, 'largo') : drafts[component.id].largo,
            profundidad: drafts[component.id].medidasBloqueadas ? standardValue(component.id, 'profundidad') : drafts[component.id].profundidad,
            alto: drafts[component.id].medidasBloqueadas ? standardValue(component.id, 'alto') : drafts[component.id].alto,
            espesor: drafts[component.id].medidasBloqueadas ? standardValue(component.id, 'espesor') : drafts[component.id].espesor,
        })
        if (hasFurniture.value && (hasMesada.value || hasVanity.value)) {
            const referenceId: OrderProductId = hasMesada.value ? 1 : 3
            const reference = drafts[referenceId]
            orderStore.setComponentMeasurements(2, {
                ...emptyMeasurements(),
                largo: reference.medidasBloqueadas ? standardValue(referenceId, 'largo') : reference.largo,
                profundidad: reference.medidasBloqueadas ? standardValue(referenceId, 'profundidad') : reference.profundidad,
                alto: '85',
                medidasBloqueadas: reference.medidasBloqueadas,
            })
        }
    })
    const vanity = drafts[3]
    orderStore.sinMueble = !hasFurniture.value
    orderStore.apoyo = vanity.apoyo
    orderStore.medidasBloqueadas = measurementComponents.value.some(component => drafts[component.id].medidasBloqueadas)
    void router.push(`/color/${orderStore.selectedProductIds.join('-')}`)
}

function standardValue(id: OrderProductId, measure: 'largo' | 'profundidad' | 'alto' | 'espesor') {
    const values: Record<OrderProductId, ProductMeasurements> = {
        1: { ...emptyMeasurements(), largo: '120', profundidad: '60', espesor: '2' },
        2: { ...emptyMeasurements(), largo: '120', profundidad: '60', alto: '85' },
        3: { ...emptyMeasurements(), largo: '80', profundidad: '45' },
    }
    return values[id][measure]
}

function goBack() {
    void router.back()
}
</script>
