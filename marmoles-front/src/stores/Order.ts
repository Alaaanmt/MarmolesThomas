import { defineStore } from 'pinia'

export const useOrderStore = defineStore('order', {
    state: () => ({
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


