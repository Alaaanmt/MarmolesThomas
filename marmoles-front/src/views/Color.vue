<template>
  <section class="mx-auto max-w-7xl px-6 pb-16 pt-32 md:px-12 lg:px-20">
    <div class="mb-10 text-center">
      <p class="mb-2 text-sm font-semibold uppercase tracking-widest text-cyan-700 dark:text-cyan-400">
        Paso 3
      </p>
      <h1 class="text-3xl font-semibold md:text-4xl">Probá tu combinación</h1>
      <p class="mx-auto mt-4 max-w-3xl leading-relaxed text-gray-600 dark:text-gray-300">
        Elegí una piedra y una melamina para ver cómo pueden combinar. La escena 3D es orientativa y sirve para comparar materiales, proporciones y estilos antes de definir el trabajo final.
      </p>
    </div>

    <div v-if="isFurnitureOnly" class="mb-10 border border-cyan-200 bg-cyan-50 p-5 dark:border-cyan-900 dark:bg-cyan-950">
      <p class="font-semibold text-cyan-900 dark:text-cyan-100">
        Elegiste un mueble solo
      </p>
      <p class="mt-1 text-sm leading-relaxed text-cyan-800 dark:text-cyan-200">
        ¿Con qué querés verlo combinado? Esto es únicamente una muestra visual y no se agrega como producto al resumen.
      </p>
      <div class="mt-4 flex flex-wrap gap-3">
        <label
          v-for="option in companionOptions"
          :key="option.value"
          class="flex cursor-pointer items-center gap-2 border px-4 py-3 text-sm font-semibold"
          :class="previewCompanion === option.value ? 'border-cyan-700 bg-white dark:border-cyan-400 dark:bg-neutral-900' : 'border-cyan-200 dark:border-cyan-800'"
        >
          <input
            v-model="previewCompanion"
            type="radio"
            name="preview-companion"
            :value="option.value"
            class="accent-cyan-700"
          >
          {{ option.label }}
        </label>
      </div>
    </div>

    <div class="min-w-0 space-y-12">
      <OrderPreview
        :show-countertop="showCountertop"
        :show-furniture="showFurniture"
        :show-vanity="showVanity"
        :vanity-support="vanitySupport"
        :melamine-image="previewMelamineImage"
        :stone-image="selectedStone?.path"
        :has-zocalo="hasZocalo"
        :is-wide-furniture="isWideFurniture"
        :preview-label="previewLabel"
      />

      <!-- SECCIÓN PIEDRAS -->
      <section>
        <div class="mb-5">
          <h2 class="text-xl font-semibold">Piedra para tapa o mesada</h2>
          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {{ stoneSelectionNote }}
          </p>
        </div>

        <div class="mb-6 flex overflow-x-auto border-b border-gray-200 dark:border-neutral-700">
          <button
            v-for="group in stoneGroups"
            :key="group.key"
            type="button"
            class="min-w-[7.5rem] flex-1 whitespace-nowrap border-b-2 px-3 py-3 text-sm font-semibold transition-colors sm:text-base"
            :class="activeStoneCategory === group.key ? 'border-cyan-700 text-cyan-700 dark:border-cyan-400 dark:text-cyan-300' : 'border-transparent text-gray-500 hover:text-cyan-700 dark:text-gray-400 dark:hover:text-cyan-300'"
            :aria-pressed="activeStoneCategory === group.key"
            @click="activeStoneCategory = group.key"
          >
            {{ group.title }}
          </button>
        </div>

        <!-- Habilitamos la tira interactiva con scroll/swiper táctil para todas las categorías, incluida mármoles -->
        <MaterialStrip
          v-if="activeStoneGroup"
          :key="activeStoneGroup.key"
          :title="activeStoneGroup.title"
          :items="activeStoneGroup.items"
          :selected-key="selectedStone ? `${selectedStone.category}:${selectedStone.id}` : undefined"
          :loading="isLoading"
          :skeleton-count="3"
          :show-arrows="true"
          @select="selectStone"
        />
      </section>

      <!-- SECCIÓN MELAMINAS -->
      <section>
        <div class="mb-4">
          <h2 class="text-xl font-semibold">Melamina para el mueble</h2>
          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {{ melamineSelectionNote }}
          </p>
        </div>

        <MaterialStrip
          title="Melaminas"
          :items="melamines"
          :selected-key="selectedMelamine ? `${selectedMelamine.category}:${selectedMelamine.id}` : undefined"
          :loading="isLoading"
          :skeleton-count="5"
          show-arrows
          @select="selectMelamine"
        />
      </section>
    </div>

    <p v-if="formError" class="mt-8 text-center font-medium text-red-600" role="alert">
      {{ formError }}
    </p>

    <div class="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
      <button
        type="button"
        class="border-2 px-5 py-2 font-semibold transition-colors"
        :class="canContinue ? 'border-cyan-700 text-cyan-700 hover:bg-cyan-700 hover:text-white dark:border-cyan-400 dark:text-cyan-300 dark:hover:bg-cyan-700 dark:hover:text-white' : 'cursor-not-allowed border-gray-300 text-gray-400'"
        :disabled="!canContinue"
        @click="continueToSummary"
      >
        Ver resumen
      </button>

      <button
        type="button"
        class="px-5 py-2 text-sm font-semibold hover:text-cyan-700 dark:hover:text-cyan-400"
        @click="goBack"
      >
        Volver
      </button>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'
import OrderPreview from '@/components/OrderPreview.vue'
import MaterialStrip from '@/components/MaterialStrip.vue'
import { useOrderStore } from '@/stores/Order'
import { baseUrl } from '@/utilities'
import type { MaterialOption, OrderProductId } from '@/types/order'

interface ApiMaterial {
  id: number
  color: string
  path: string
}

interface MaterialGroup {
  key: 'granitos' | 'silestones' | 'marmoles'
  title: string
  items: MaterialOption[]
}

const route = useRoute()
const router = useRouter()
const orderStore = useOrderStore()

const isLoading = ref(true)
const formError = ref('')

const granites = ref<MaterialOption[]>([])
const quartz = ref<MaterialOption[]>([])
const marbles = ref<MaterialOption[]>([])
const melamines = ref<MaterialOption[]>([])

const previewCompanion = ref<'mesada' | 'vanitory' | null>(orderStore.previewCompanion)
const selectedStone = ref<MaterialOption | null>(null)
const selectedMelamine = ref<MaterialOption | null>(null)
const activeStoneCategory = ref<MaterialGroup['key']>('granitos')

const companionOptions = [
  { value: 'mesada' as const, label: 'Con una mesada' },
  { value: 'vanitory' as const, label: 'Con un vanitory' },
]

const selectedIds = parseIds(String(route.params.colorId ?? ''))
if (selectedIds.length && selectedIds.join('-') !== orderStore.selectedProductIds.join('-')) {
  orderStore.setProducts(selectedIds)
}

const isFurnitureOnly = computed(() => selectedIds.length === 1 && selectedIds[0] === 2)
const hasMesada = computed(() => selectedIds.includes(1))
const hasFurniture = computed(() => selectedIds.includes(2))
const hasVanity = computed(() => selectedIds.includes(3))

const showCountertop = computed(() => hasMesada.value || (isFurnitureOnly.value && previewCompanion.value === 'mesada'))
const showVanity = computed(() => hasVanity.value || (isFurnitureOnly.value && previewCompanion.value === 'vanitory'))
const showFurniture = computed(() => !showVanity.value && (hasFurniture.value || showCountertop.value))

const vanitySupport = computed(() => {
  const component = orderStore.getComponent(3)
  if (component?.measurements.apoyo) return component.measurements.apoyo
  return 'flotante'
})

const hasZocalo = computed(() => Boolean(orderStore.getComponent(1)?.measurements.conZocalo))
const isWideFurniture = computed(() => Number(orderStore.getComponent(2)?.measurements.largo ?? 0) > 120)

const previewLabel = computed(() => {
  if (hasMesada.value && hasVanity.value) return 'mesada y vanitory'
  if (hasMesada.value) return 'mesada y mueble'
  if (hasVanity.value) return 'vanitory y mueble'
  return previewCompanion.value === 'vanitory' ? 'mueble y vanitory de muestra' : 'mueble y mesada de muestra'
})

const stoneGroups = computed<MaterialGroup[]>(() => [
  { key: 'granitos', title: 'Granitos', items: granites.value },
  { key: 'silestones', title: 'Silestones', items: quartz.value },
  { key: 'marmoles', title: 'Mármoles', items: marbles.value },
])

const activeStoneGroup = computed(() => stoneGroups.value.find(group => group.key === activeStoneCategory.value))

const previewMelamineImage = computed(() => {
  if (selectedMelamine.value?.color.toLowerCase().includes('blanca')) {
    return '/img/furniture/melaminaBlancaEjemplo.png'
  }
  if (selectedMelamine.value?.color.toLowerCase().includes('wengue')) {
    return '/img/furniture/Wengue.png'
  }
  return selectedMelamine.value?.path
})

const canContinue = computed(() => Boolean(selectedStone.value && selectedMelamine.value && (!isFurnitureOnly.value || previewCompanion.value)))

const stoneSelectionNote = computed(() => hasMesada.value || hasVanity.value ? 'Esta elección forma parte del pedido.' : 'Se usa solo para mostrar cómo podría combinarse el mueble.')
const melamineSelectionNote = computed(() => hasFurniture.value ? 'Esta elección forma parte del pedido.' : 'Se usa solo para mostrar cómo podría combinarse la piedra.')

function parseIds(value: string): OrderProductId[] {
  return value.split('-')
    .map(Number)
    .filter((id): id is OrderProductId => id === 1 || id === 2 || id === 3)
}

function selectStone(item: MaterialOption) {
  selectedStone.value = item
  orderStore.setStoneColor(item.id, item.color, item.path, item.category)
}

function selectMelamine(item: MaterialOption) {
  selectedMelamine.value = item
  orderStore.setMelamineColor(item.id, item.color, item.path)
}

function normalizeMaterials(items: ApiMaterial[], category: MaterialOption['category']): MaterialOption[] {
  return items.map(item => ({ id: item.id, color: item.color, path: item.path, category }))
}

async function loadMaterials() {
  try {
    const [graniteResponse, quartzResponse, marbleResponse, melamineResponse] = await Promise.all([
      axios.get(`${baseUrl}/granitodetalles`),
      axios.get(`${baseUrl}/silestonedetalles`),
      axios.get(`${baseUrl}/marmoldetalles`),
      axios.get(`${baseUrl}/melaminadetalles`),
    ])

    granites.value = normalizeMaterials(graniteResponse.data.data as ApiMaterial[], 'granitos')
    quartz.value = normalizeMaterials(quartzResponse.data.data as ApiMaterial[], 'silestones')
    marbles.value = normalizeMaterials(marbleResponse.data.data as ApiMaterial[], 'marmoles')
    melamines.value = normalizeMaterials(melamineResponse.data.data as ApiMaterial[], 'melaminas')

    selectedStone.value = granites.value.concat(quartz.value, marbles.value)
      .find(item => item.id === orderStore.selectedStoneId && item.category === orderStore.selectedStoneCategory) ?? null

    selectedMelamine.value = melamines.value.find(item => item.id === orderStore.selectedMelamineId) ?? null

    if (selectedStone.value) activeStoneCategory.value = selectedStone.value.category as MaterialGroup['key']
  } catch (error) {
    console.error('Error fetching order materials:', error)
    formError.value = 'No pudimos cargar los materiales. Intentá nuevamente.'
  } finally {
    isLoading.value = false
  }
}

watch(previewCompanion, companion => {
  orderStore.setPreviewCompanion(companion)
})

async function continueToSummary() {
  if (!canContinue.value || !selectedStone.value || !selectedMelamine.value) {
    formError.value = 'Elegí una piedra y una melamina para continuar.'
    return
  }

  if (isFurnitureOnly.value && !previewCompanion.value) {
    formError.value = 'Elegí si querés ver el mueble con una mesada o con un vanitory.'
    return
  }

  orderStore.setPreviewCompanion(previewCompanion.value)
  orderStore.setPreviewOnlyColors(
    hasFurniture.value ? '' : selectedMelamine.value.color,
    hasMesada.value || hasVanity.value ? '' : selectedStone.value.color,
  )

  await router.push(`/abstract/${selectedIds.join('-')}`)
}

function goBack() {
  void router.back()
}

onMounted(async () => {
  await loadMaterials()
})
</script>