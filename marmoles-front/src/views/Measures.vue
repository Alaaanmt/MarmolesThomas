    <template>
        <!--PASOS-->
        <section class="flex justify-center pt-32 lg:px-48 md:px-40 px-4">
            <div class="flex gap-4">
                <span class="px-3 py-1 bg-gray-300 text-gray-600 rounded-full text-xs">Paso 1: Producto</span>
                <span class="px-3 py-1 bg-gray-300 text-gray-600 rounded-full text-xs">Paso 2: Material</span>
                <span class="px-3 py-1 bg-cyan-700 text-white rounded-full text-xs">Paso 3: Medidas</span>
            </div>
        </section>

        <!--SELECCION DE MEDIDAS-->
        <section v-if="productId === 1" class="lg:px-48 md:px-24 px-4">
            <p class="text-3xl font-semibold uppercase text-center pt-8 ">Elegí las medidas</p>
            <div class="w-full max-w-5xl grid grid-cols-1 md:grid-cols-3 gap-6 pt-8">
                <div class="flex flex-col text-start ">
                    <p class="text-sm font-semibold">Largo (cm)</p>
                    <input type="text" placeholder="Ej: 120"
                        class="border-2 border-gray-300 rounded-md px-4 py-2 outline-cyan-700"
                        :class="[largoError ? 'outline-red-500 border-red-500' : '', medidasBloqueadas ? 'bg-gray-200 cursor-not-allowed opacity-60' : '']"
                        v-model="largo" @keyup="validateLargo()" :disabled="medidasBloqueadas">
                    <span id="error-largo" style="color: red;" v-if="largoError">Mínimo 2, Máximo 3 Caracteres</span>
                </div>
                <div class="flex flex-col">
                    <p class="text-sm font-semibold">Profundidad (cm)</p>
                    <input type="text" placeholder="Ej: 60"
                        class="border-2 border-gray-300 rounded-md px-4 py-2 outline-cyan-700"
                        :class="[profundidadError ? 'outline-red-500 border-red-500' : '', medidasBloqueadas ? 'bg-gray-200 cursor-not-allowed opacity-60' : '']"
                        v-model="profundidad" @keyup="validateProfundidad()" :disabled="medidasBloqueadas">
                    <span style="color: red;" v-if="profundidadError">Mínimo 2, Máximo 3 Caracteres</span>
                </div>
                <div class="flex flex-col">
                    <p class="text-sm font-semibold">Espesor (cm)</p>
                    <input type="text" placeholder="Ej: 2"
                        class="border-2 border-gray-300 rounded-md px-4 py-2 outline-cyan-700"
                        :class="[espesorError ? 'outline-red-500 border-red-500' : '', medidasBloqueadas ? 'bg-gray-200 cursor-not-allowed opacity-60' : '']"
                        v-model="espesor" @keyup="validateEspesor()" :disabled="medidasBloqueadas">
                    <span style="color: red;" v-if="espesorError">Mínimo y máximo de 1 carácter</span>
                </div>
            </div>
            <!--IMAGENORIENTACION-->
            <div class="pt-4 h-48">
                <img src="/img/medidaCountertop.png" alt="" class="w-full h-full object-contain dark:invert">
            </div>
            <!--CHECKS-->
            <div class="pt-4 flex text-sm md:text-base">
                <input type="checkbox" class="mr-2" v-model="conZocalo"> Con Zócalo
            </div>
            <div class="pt-2 flex text-sm md:text-base">
                <input type="checkbox" class="mr-2" v-model="medidasBloqueadas" @change="buttonDisabled2()"> Toma de
                medidas en tu domicilio (no se
                cotiza)
            </div>
        </section>




        <!--SELECCION DE MEDIDAS-->
        <section v-if="productId === 2" class="lg:px-48 md:px-24 px-4">
            <p class="text-3xl font-semibold uppercase text-center pt-8 ">Elegí las medidas</p>
            <div class="w-full max-w-5xl grid grid-cols-1 md:grid-cols-3 gap-6 pt-8">
                <div class="flex flex-col text-start ">
                    <p class="text-sm font-semibold">Largo (cm)</p>
                    <input type="text" placeholder="Ej: 120"
                        class="border-2 border-gray-300 rounded-md px-4 py-2 outline-cyan-700"
                        :class="[largoError ? 'outline-red-500 border-red-500' : '', medidasBloqueadas ? 'bg-gray-200 cursor-not-allowed opacity-60' : '']"
                        v-model="largo" @keyup="validateLargo()" :disabled="medidasBloqueadas">
                    <span id="error-largo" style="color: red;" v-if="largoError">Mínimo 2, Máximo 3
                        Caracteres</span>
                </div>
                <div class="flex flex-col">
                    <p class="text-sm font-semibold">Alto (cm)</p>
                    <input type="text" placeholder="Ej: 60"
                        class="border-2 border-gray-300 rounded-md px-4 py-2 outline-cyan-700"
                        :class="[altoError ? 'outline-red-500 border-red-500' : '', medidasBloqueadas ? 'bg-gray-200 cursor-not-allowed opacity-60' : '']"
                        v-model="alto" @keyup="validateAlto()" :disabled="medidasBloqueadas">
                    <span style="color: red;" v-if="altoError">Mínimo 2, Máximo 3 Caracteres</span>
                </div>
                <div class="flex flex-col">
                    <p class="text-sm font-semibold">Profundidad (cm)</p>
                    <input type="text" placeholder="Ej: 40"
                        class="border-2 border-gray-300 rounded-md px-4 py-2 outline-cyan-700"
                        :class="[profundidadError ? 'outline-red-500 border-red-500' : '', medidasBloqueadas ? 'bg-gray-200 cursor-not-allowed opacity-60' : '']"
                        v-model="profundidad" @keyup="validateProfundidad()" :disabled="medidasBloqueadas">
                    <span style="color: red;" v-if="profundidadError">Mínimo 2, Máximo 2 Caracteres</span>
                </div>
            </div>
            <!--IMAGENORIENTACION-->
            <div class="pt-6">
                <div class="h-60">
                    <img src="/img/medidaFurniture.png" alt="" class="w-full h-full object-contain">
                </div>
            </div>
            <!--CHECKS-->
            <div class="pt-2 flex text-sm md:text-base">
                <input type="checkbox" class="mr-2" v-model="medidasBloqueadas" @change="buttonDisabled2()"> Toma de
                medidas en tu domicilio (no se
                cotiza)
            </div>
        </section>



        <!--SELECCION DE MEDIDAS-->
        <section v-if="productId === 3" class="lg:px-48 md:px-24 px-4">
            <p class="text-3xl font-semibold uppercase text-center pt-8 ">Elegí las medidas</p>
            <div class="w-full max-w-5xl grid grid-cols-1 md:grid-cols-3 gap-6 pt-8">
                <div class="flex flex-col text-start ">
                    <p class="text-sm font-semibold">Largo (cm)</p>
                    <input type="text" placeholder="Ej: 80"
                        class="border-2 border-gray-300 rounded-md px-4 py-2 outline-cyan-700"
                        :class="[largoError ? 'outline-red-500 border-red-500' : '', medidasBloqueadas ? 'bg-gray-200 cursor-not-allowed opacity-60' : '']"
                        v-model="largo" @keyup="validateLargo()" :disabled="medidasBloqueadas">
                    <span style="color: red;" v-if="largoError">Mínimo 1, Máximo 3 Caracteres</span>
                </div>
                <div class="flex flex-col">
                    <p class="text-sm font-semibold">Profundidad (cm)</p>
                    <input type="text" placeholder="Ej: 40"
                        class="border-2 border-gray-300 rounded-md px-4 py-2 outline-cyan-700"
                        :class="[profundidadError ? 'outline-red-500 border-red-500' : '', medidasBloqueadas ? 'bg-gray-200 cursor-not-allowed opacity-60' : '']"
                        v-model="profundidad" @keyup="validateProfundidad()" :disabled="medidasBloqueadas">
                    <span style="color: red;" v-if="profundidadError">Mínimo 1, Máximo 2 Caracteres</span>
                </div>
                <div class="flex flex-col">
                    <p class="text-sm font-semibold">Tipo de Apoyo</p>
                    <select type="select" class="border-2 border-gray-300 rounded-md px-4 py-2 outline-cyan-700 "
                        :class="!sinMueble ? 'bg-gray-200 cursor-not-allowed opacity-60' : ''" v-model="apoyo"
                        :disabled="!sinMueble">
                        <option class="bg-gray-100 dark:bg-neutral-800" value="">Seleccionar opción</option>
                        <option class="bg-gray-100 dark:bg-neutral-800" value="1">Colgante (flotante)</option>
                        <option class="bg-gray-100 dark:bg-neutral-800" value="2">Con patas</option>
                    </select>
                </div>
            </div>
            <!--IMAGENORIENTACION-->
            <div class="pt-6">
                <div class="h-60">
                    <img src="/img/medidaFurniture.png" alt="" class="w-full h-full object-contain">
                </div>
            </div>
            <!--CHECKS-->
            <div class="pt-4 flex text-sm md:text-base">
                <input type="checkbox" class="mr-2" v-model="sinMueble"> Con Mueble
            </div>
            <div class="pt-2 flex text-sm md:text-base">
                <input type="checkbox" class="mr-2" v-model="medidasBloqueadas" @change="buttonDisabled2()"> Toma de
                medidas en tu domicilio (no se
                cotiza)
            </div>
        </section>
        <!--BOTONES-->
        <div>
            <div class="flex pt-6 space-y-2 gap-4 justify-center items-center">
                <button @click="irAlResumen()" type="submit" class="px-4 py-2 border-2 cursor-pointer" :class="buttonFinalizarDisabled
                    ? 'border-gray-300 text-gray-300 cursor-not-allowed pointer-events-none'
                    : 'border-cyan-700 text-cyan-700 dark:bg-cyan-700 dark:text-white'">Finalizar
                </button>
                <div @click="goBack()" class="cursor-pointer">Volver</div>
            </div>
        </div>
    </template>

<script setup lang="ts">
//VUE
import { ref } from 'vue';
import { useRouter } from 'vue-router'
import { useRoute } from 'vue-router';
import { useOrderStore } from '@/stores/Order';

//DATA
const largo = ref('');
const largoError = ref(false);
const profundidad = ref('');
const profundidadError = ref(false);
const espesor = ref('');
const espesorError = ref(false);
const medidasBloqueadas = ref(false);
const buttonFinalizarDisabled = ref(true);
const alto = ref('');
const altoError = ref(false);
const sinMueble = ref(false);
const apoyo = ref('');
const conZocalo = ref(false)
const router = useRouter()
const productId = ref<number | null>(null);

const orderStore = useOrderStore();

const route = useRoute();
productId.value = route.params.medidaId ? Number(route.params.medidaId) : null;


function validateLargo() {
    largoError.value = largo.value.length < 2 || largo.value.length > 3;
    buttonDisabled();
}

function validateProfundidad() {
    profundidadError.value = profundidad.value.length < 2 || profundidad.value.length > 2;
    buttonDisabled();
}

function validateEspesor() {
    espesorError.value = espesor.value.length < 1 || espesor.value.length > 1;
    buttonDisabled();
}

function validateAlto() {
    altoError.value = alto.value.length < 2 || alto.value.length > 3;
    buttonDisabled();
}

/*
function validateConMueble() {
    sinMueble.value = !sinMueble.value;
}*/

function validateMedidas() {
    //medidasBloqueadas.value = !medidasBloqueadas.value;
    //consultar como hacer q se resetee el valor de los campso
    if (medidasBloqueadas.value == true) {
        largo.value = '';
        profundidad.value = '';
        alto.value = '';
        espesor.value = '';
        largoError.value = false;
        profundidadError.value = false;
        espesorError.value = false;
        apoyo.value = '';
    }
}


function buttonDisabled() {
    if (medidasBloqueadas.value) {
        buttonFinalizarDisabled.value = false;
        return;
    }

    if (productId.value === 1) {
        //Mesada
        const invalido = !largo.value || !profundidad.value || !espesor.value ||
            largoError.value || profundidadError.value || espesorError.value;
        buttonFinalizarDisabled.value = invalido;
    }
    else if (productId.value === 2) {
        //Mueble
        const invalido = !largo.value || !alto.value || !profundidad.value ||
            largoError.value || altoError.value || profundidadError.value;
        buttonFinalizarDisabled.value = invalido;
    }
    else if (productId.value === 3) {
        //VAnitory
        const baseInvalida = !largo.value || !profundidad.value || largoError.value || profundidadError.value;
        const apoyoInvalido = sinMueble.value && !apoyo.value;

        buttonFinalizarDisabled.value = baseInvalida || apoyoInvalido;
    }
}
function buttonDisabled2() {
    validateMedidas();
    if (medidasBloqueadas.value == true) {
        buttonFinalizarDisabled.value = false;
    } else {
        buttonFinalizarDisabled.value = true;
    }
}

function irAlResumen() {

    orderStore.setMeasures(
        largo.value,
        profundidad.value,
        alto.value,
        espesor.value
    );


    orderStore.conZocalo = conZocalo.value;
    orderStore.medidasBloqueadas = medidasBloqueadas.value;
    orderStore.sinMueble = sinMueble.value;
    orderStore.apoyo = apoyo.value;

    router.push(`/abstract/${productId.value}`);
}


function goBack() {
    router.back()
}

</script>
