<template>
    <div class="mb-7">
        <h3 class="mb-3 text-sm font-semibold uppercase tracking-widest text-cyan-700 dark:text-cyan-400">
            {{ title }}
        </h3>
        <div ref="container" class="swiper">
            <div class="swiper-wrapper">
                <div v-if="loading" v-for="index in skeletonCount" :key="`skeleton-${index}`" class="swiper-slide">
                    <div class="flex flex-col items-center gap-2">
                        <div class="skeleton h-20 w-20 rounded-full sm:h-24 sm:w-24"></div>
                        <div class="skeleton h-4 w-20"></div>
                    </div>
                </div>
                <div v-else v-for="item in items" :key="`${item.category}-${item.id}`" class="swiper-slide">
                    <button type="button" class="flex w-full flex-col items-center gap-2 text-center"
                        :aria-pressed="selectedKey === materialKey(item)" @click="$emit('select', item)">
                        <span
                            class="block h-20 w-20 overflow-hidden rounded-full border-4 transition-transform hover:scale-105 sm:h-24 sm:w-24"
                            :class="selectedKey === materialKey(item)
                                ? 'border-cyan-700 dark:border-cyan-400'
                                : 'border-transparent'">
                            <img :src="item.path" :alt="item.color" class="h-full w-full object-cover">
                        </span>
                        <span class="max-w-28 text-xs font-semibold uppercase">{{ item.color }}</span>
                    </button>
                </div>
            </div>
            <template v-if="showArrows && !loading">
                <button ref="nextButton" type="button" class="swiper-button-next color-swiper-arrow"
                    :aria-label="`Ver más ${title.toLowerCase()}`"></button>
                <button ref="prevButton" type="button" class="swiper-button-prev color-swiper-arrow"
                    :aria-label="`Ver ${title.toLowerCase()} anteriores`"></button>
            </template>
        </div>
    </div>
</template>

<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import Swiper from 'swiper'
import { Navigation } from 'swiper/modules'
import 'swiper/swiper-bundle.css'
import type { MaterialOption } from '@/types/order'

Swiper.use([Navigation])

const props = defineProps<{
    title: string
    items: MaterialOption[]
    selectedKey?: string
    loading: boolean
    skeletonCount: number
    showArrows?: boolean
}>()

defineEmits<{
    select: [item: MaterialOption]
}>()

const container = ref<HTMLElement | null>(null)
const nextButton = ref<HTMLElement | null>(null)
const prevButton = ref<HTMLElement | null>(null)
let swiper: Swiper | undefined

function materialKey(item: MaterialOption) {
    return `${item.category}:${item.id}`
}

async function initSwiper() {
    await nextTick()
    if (!container.value || props.loading || swiper) return
    swiper = new Swiper(container.value, {
        speed: 500,
        loop: false,
        slidesPerView: 2,
        slidesPerGroup: 2,
        spaceBetween: 8,
        breakpoints: {
            640: { slidesPerView: 3, slidesPerGroup: 3, spaceBetween: 12 },
            1024: { slidesPerView: 4, slidesPerGroup: 4, spaceBetween: 16 },
        },
        navigation: props.showArrows && nextButton.value && prevButton.value
            ? { nextEl: nextButton.value, prevEl: prevButton.value }
            : undefined,
    })
}

onMounted(initSwiper)
watch(() => props.loading, loading => {
    if (!loading) void initSwiper()
})

onBeforeUnmount(() => {
    swiper?.destroy(true, true)
})
</script>
