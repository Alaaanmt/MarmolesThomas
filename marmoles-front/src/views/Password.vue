<template>
    <section class="h-screen w-full flex bg-[url('/img/quartz/blanconorte.jpg')]">
        <!--Imagen-->
        <div class="hidden md:flex w-1/2 justify-center items-center relative">
            <div class="absolute text-white text-center justify-center">
                <div class="w-full h-50">
                    <img src="/img/logoBlack.png" alt="" class="w-full h-full object-contain">
                </div>
                <p class="text-2xl text-black font-light">Diseñando tu Espacio, Piedra por Piedra.</p>
            </div>
        </div>

        <!--Formulario-->
        <div class="w-full md:w-1/2 flex justify-center items-center px-4 bg-white">
            <div class="w-full max-w-sm space-y-6">
                <p class="text-3xl font-bold text-gray-800">Cambiar Contraseña</p>
                <div id="formInput" class="relative">
                    <input :type="showPassword ? 'text' : 'password'" id="password" placeholder="Contraseña Actual"
                        class="w-full p-3 border border-gray-300 rounded-lg focus:outline-cyan-700"
                        :class="passwordError ? 'border-red-500 focus:outline-transparent' : ''" v-model="password"
                        @keyup="validatePassword()">
                    <div class="w-4 absolute top-4 right-4 cursor-pointer" @click="togglePassword()">
                        <img :src="showPassword ? '/img/eye.svg' : '/img/eye-off.svg'" alt=""
                            class="w-full h-full aspect-square">
                    </div>
                    <span id="error-password" style="color: red;" v-if="passwordError">Mínimo 5 caracteres</span>
                </div>
                <div class="relative">
                    <input :type="showPasswordConfirm ? 'text' : 'password'" placeholder="Confirmar Contraseña"
                        class="w-full p-3 border border-gray-300 rounded-lg focus:outline-cyan-700"
                        :class="confirmPasswordError ? 'border-red-500 focus:outline-transparent' : ''"
                        v-model="confirmPassword" @keyup="validateConfirmPassword()">
                    <div class="w-4 absolute top-4 right-4 cursor-pointer" @click="togglePasswordConfirm()">
                        <img :src="showPasswordConfirm ? '/img/eye.svg' : '/img/eye-off.svg'" alt=""
                            class="w-full h-full aspect-square">
                    </div>
                    <span v-if="confirmPasswordError" style="color: red;">Las contraseñas tienen que coincidir</span>
                </div>
                <RouterLink to="/login">
                    <button
                        class="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-semibold py-3 mb-4 cursor-pointer rounded-lg transition duration-200">
                        CONFIRMAR
                    </button>
                </RouterLink>
                <RouterLink to="/register" class="text-sm text-cyan-600 font-semibold hover:text-cyan-800">Volver atrás
                </RouterLink>
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
// VUE
import { ref } from 'vue';
import { RouterLink } from 'vue-router';

const password = ref('');
const passwordError = ref(false);
const showPassword = ref(false);
const confirmPassword = ref('');
const confirmPasswordError = ref(false);
const showPasswordConfirm = ref(false);
function validatePassword() {
    passwordError.value = password.value.length < 5;
}

function togglePassword() {
    showPassword.value = !showPassword.value
}
function validateConfirmPassword() {
    confirmPasswordError.value = confirmPassword.value !== password.value;
}
function togglePasswordConfirm() {
    showPasswordConfirm.value = !showPasswordConfirm.value
}

</script>