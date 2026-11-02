import { defineStore } from 'pinia'
import type {
    OrderComponent,
    OrderProductId,
    OrderProductType,
    ProductMeasurements,
    MaterialOption,
} from '@/types/order'

const productNames: Record<OrderProductId, string> = {
    1: 'Mesada',
    2: 'Mueble',
    3: 'Vanitory',
}

const emptyMeasurements = (): ProductMeasurements => ({
    largo: '',
    profundidad: '',
    alto: '',
    espesor: '',
    medidasBloqueadas: false,
    conZocalo: false,
    sinMueble: false,
    apoyo: '',
})

function sortProductIds(ids: OrderProductId[]) {
    return [...new Set(ids)].sort((a, b) => a - b)
}

export const useOrderStore = defineStore('order', {
    state: () => ({
        selectedProductIds: [] as OrderProductId[],
        components: [] as OrderComponent[],
        previewCompanion: null as Exclude<OrderProductType, 'mueble'> | null,
        previewOnlyMelamineName: '',
        previewOnlyMaterialName: '',
        selectedStoneId: null as number | null,
        selectedStoneName: '',
        selectedStonePath: '',
        selectedStoneCategory: null as MaterialOption['category'] | null,
        selectedMelamineId: null as number | null,
        selectedMelamineName: '',
        selectedMelaminePath: '',
        productId: null as number | null,
        productName: '',

        selectedColorId: null as number | null,
        selectedColorName: '',


        largo: '',
        profundidad: '',
        alto: '',
        espesor: '',


        conZocalo: false,
        medidasBloqueadas: false,
        apoyo: '', 
        sinMueble: false,
    }),

    actions: {
        setProducts(ids: OrderProductId[]) {
            const sortedIds = sortProductIds(ids)
            this.selectedProductIds = sortedIds
            this.components = sortedIds.map(id => {
                const existing = this.components.find(component => component.id === id)
                return existing ?? {
                    id,
                    name: productNames[id],
                    measurements: emptyMeasurements(),
                }
            })

            const primaryId = sortedIds[0] ?? null
            this.productId = primaryId
            this.productName = sortedIds.map(id => productNames[id]).join(' + ')
        },

        toggleProduct(id: OrderProductId) {
            const selected = this.selectedProductIds.includes(id)
            const nextIds = selected
                ? this.selectedProductIds.filter(productId => productId !== id)
                : [...this.selectedProductIds, id]
            this.setProducts(nextIds)
        },

        setComponentMeasurements(id: OrderProductId, measurements: ProductMeasurements) {
            const component = this.components.find(item => item.id === id)
            if (component) {
                component.measurements = { ...measurements }
            }
        },

        getComponent(id: OrderProductId) {
            return this.components.find(component => component.id === id)
        },

        setPreviewCompanion(companion: Exclude<OrderProductType, 'mueble'> | null) {
            this.previewCompanion = companion
        },

        setPreviewOnlyColors(melamineName: string, materialName: string) {
            this.previewOnlyMelamineName = melamineName
            this.previewOnlyMaterialName = materialName
        },

        setStoneColor(id: number, name: string, path: string, category: MaterialOption['category']) {
            this.selectedStoneId = id
            this.selectedStoneName = name
            this.selectedStonePath = path
            this.selectedStoneCategory = category
            this.selectedColorId = id
            this.selectedColorName = name
        },

        setMelamineColor(id: number, name: string, path: string) {
            this.selectedMelamineId = id
            this.selectedMelamineName = name
            this.selectedMelaminePath = path
        },

        setProduct(id: number, name: string) {
            this.productId = id
            this.productName = name
        },

        setColor(id: number, name: string) {
            this.selectedColorId = id
            this.selectedColorName = name
        },

        setMeasures(largo: string, profundidad: string, alto: string, espesor: string) {
            this.largo = largo
            this.profundidad = profundidad
            this.alto = alto
            this.espesor = espesor
        },

        setZocalo(valor: boolean) {
            this.conZocalo = valor
        },

        setOpcionesVanitory(sinMueble: boolean, apoyo: string) {
            this.sinMueble = sinMueble
            this.apoyo = apoyo
        },
    }
})
