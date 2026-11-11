<template>
  <section class="mx-auto max-w-6xl px-6 pb-16 pt-32 md:px-12 lg:px-20">
    <div class="mb-10 text-center">
      <p class="mb-2 text-sm font-semibold uppercase tracking-widest text-cyan-700 dark:text-cyan-400">
        Paso 1
      </p>
      <h1 class="text-3xl font-semibold md:text-4xl">¿Qué querés cotizar?</h1>
      <p class="mx-auto mt-4 max-w-2xl leading-relaxed text-gray-600 dark:text-gray-300">
        Podés combinar un mueble con una mesada o con un vanitory. Elegí una o dos opciones para continuar.
      </p>
    </div>

    <div class="grid gap-5 md:grid-cols-3">
      <button
        v-for="item in productOptions"
        :key="item.id"
        type="button"
        class="group relative text-left transition-transform duration-200 hover:-translate-y-1 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-700"
        :class="isSelected(item.id) ? 'ring-4 ring-cyan-600' : 'ring-1 ring-gray-200 dark:ring-neutral-700'"
        @click="toggleProduct(item.id)"
      >
        <div class="relative aspect-[4/3] overflow-hidden bg-gray-200 dark:bg-neutral-700">
          <img
            :src="item.img"
            :alt="item.text"
            class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          >
          <div class="absolute inset-0 bg-neutral-950/25 transition-colors group-hover:bg-neutral-950/15"></div>
          <span
            v-if="isSelected(item.id)"
            class="absolute right-4 top-4 grid h-9 w-9 place-items-center bg-cyan-700 text-white"
            aria-label="Seleccionado"
          >
            <svg viewBox="0 0 24 24" class="h-6 w-6 fill-none stroke-current stroke-2" aria-hidden="true">
              <path d="m5 12 4 4L19 6" />
            </svg>
          </span>
          <p class="absolute bottom-0 left-0 right-0 bg-neutral-950/75 px-4 py-3 text-xl font-semibold text-white">
            {{ item.text }}
          </p>
        </div>
        <p class="bg-white px-4 py-4 text-sm leading-relaxed text-gray-600 dark:bg-neutral-800 dark:text-gray-300">
          {{ item.description }}
        </p>
      </button>
    </div>

    <!-- Referencia asignada para scroll automático -->
    <p
      v-if="selectionError"
      ref="errorMessageRef"
      class="mt-6 text-center font-medium text-red-600 scroll-mt-24"
      role="alert"
    >
      {{ selectionError }}
    </p>

    <div class="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
      <button
        type="button"
        class="border-2 px-5 py-2 font-semibold transition-colors"
        :class="canContinue ? 'border-cyan-700 text-cyan-700 hover:bg-cyan-700 hover:text-white dark:border-cyan-400 dark:text-cyan-300 dark:hover:bg-cyan-700 dark:hover:text-white' : 'cursor-not-allowed border-gray-300 text-gray-400'"
        :disabled="!canContinue"
        @click="continueToMeasures"
      >
        Siguiente
      </button>
      <RouterLink to="/" class="px-5 py-2 text-sm font-semibold hover:text-cyan-700 dark:hover:text-cyan-400">
        Volver
      </RouterLink>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, nextTick, ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { useOrderStore } from '@/stores/Order'
import type { OrderProductId, ProductOption } from '@/types/order'

const router = useRouter()
const orderStore = useOrderStore()

const selectionError = ref('')
const errorMessageRef = ref<HTMLParagraphElement | null>(null)

const productOptions: ProductOption[] = [
  {
    id: 1,
    img: '/img/image.jpg',
    text: 'Mesada',
    description: 'Elegí una superficie de granito, mármol o Silestone.',
  },
  {
    id: 2,
    img: '/img/mueble.jpg',
    text: 'Mueble',
    description: 'Definí medidas, melamina y una composición de referencia.',
  },
  {
    id: 3,
    img: '/img/Portada-vanitory.jpg',
    text: 'Vanitory',
    description: 'Combiná una tapa de piedra con un mueble de baño.',
  },
]

const selectedIds = computed(() => orderStore.selectedProductIds)
const canContinue = computed(() => selectedIds.value.length > 0 && !selectionError.value)

function isSelected(id: OrderProductId) {
  return selectedIds.value.includes(id)
}

async function toggleProduct(id: OrderProductId) {
  selectionError.value = ''
  const next = isSelected(id)
    ? selectedIds.value.filter(selectedId => selectedId !== id)
    : [...selectedIds.value, id]

  const hasInvalidCombination = next.includes(1) && next.includes(3)
  const hasTooManyProducts = next.length > 2

  if (hasInvalidCombination || hasTooManyProducts) {
    selectionError.value = hasInvalidCombination
      ? 'La mesada y el vanitory no se pueden combinar directamente. Elegí mueble + mesada o mueble + vanitory.'
      : 'Podés elegir como máximo dos opciones.'

    // Desplaza suavemente la vista únicamente en celulares (< 768px)
    if (window.innerWidth < 768) {
      await nextTick()
      errorMessageRef.value?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
    return
  }

  orderStore.setProducts(next)
}

function continueToMeasures() {
  if (!canContinue.value) return
  void router.push(`/measures/${selectedIds.value.join('-')}`)
}
</script>