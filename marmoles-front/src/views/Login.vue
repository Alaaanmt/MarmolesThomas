<template>
    <section class="h-screen w-full flex bg-[url('/img/granite/negroBrasil.jpg')]">
        <!--Imagen-->
        <div class="hidden md:flex w-1/2 justify-center items-center relative">
            <div class="absolute text-white text-center justify-center">
                <div class="w-full h-50">
                    <img src="/img/logoSinFondo.png" alt="" class="w-full h-full object-contain">
                </div>
                <p class="text-2xl text-white font-light">Diseñando tu Espacio, Piedra por Piedra.</p>
            </div>
        </div>

        <!--Formulario-->
        <div class="w-full md:w-1/2 flex justify-center items-center px-4 bg-white">
            <div class="w-full max-w-sm space-y-6">
                <p class="text-3xl font-bold text-gray-800">Iniciar Sesión</p>
                <div id="formInput">
                    <input type="email" id="email" placeholder="Correo Electrónico"
                        class="w-full p-3 border border-gray-300 rounded-lg focus:outline-cyan-700"
                        :class="emailError ? 'border-red-500 focus:outline-transparent' : ''" v-model="email"
                        @keyup="validateEmail()">
                    <span id="error-email" style="color: red;" v-if="emailError">Email inválido</span>
                </div>
                <div id="formInput" class="relative">
                    <input :type="showPassword ? 'text' : 'password'" id="password" placeholder="Contraseña"
                        class="w-full p-3 border border-gray-300 rounded-lg focus:outline-cyan-700"
                        :class="passwordError ? 'border-red-500 focus:outline-transparent' : ''" v-model="password"
                        @keyup="validatePassword()">
                    <div class="w-4 absolute top-4 right-4 cursor-pointer" @click="togglePassword()">
                        <img :src="showPassword ? '/img/eye.svg' : '/img/eye-off.svg'" alt=""
                            class="w-full h-full aspect-square">
                    </div>
                    <span id="error-password" style="color: red;" v-if="passwordError">Mínimo 5 caracteres</span>
                </div>
                <button type="submit"
                    class="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-semibold py-3 mb-4 cursor-pointer rounded-lg transition duration-200">
                    INICIAR SESIÓN
                </button>
                <div id="opciones" class="flex justify-between text-sm">
                    <RouterLink to="/password" class="text-gray-500 hover:text-cyan-600">¿Olvidaste tu contraseña?
                    </RouterLink>
                    <RouterLink to="/register" class="text-cyan-600 font-semibold hover:text-cyan-800">Regístrate aquí
                    </RouterLink>
                </div>
                <RouterLink to="/">
                    <p class="text-center">Volver al Inicio</p>
                </RouterLink>
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
// VUE
import { ref } from 'vue';
import { RouterLink } from 'vue-router';

const email = ref('');
const password = ref('');
const emailError = ref(false);
const passwordError = ref(false);
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const showPassword = ref(false);

/*function login() {
    // Lógica de inicio de sesión
    if (email.value !== '') {
        emailError.value = !emailPattern.test(email.value);
    } else {
        emailError.value = true;
    }

    if (password.value.length < 5) {
        passwordError.value = true;
    } else {
        passwordError.value = false;
    }
}*/

function validateEmail() {
    if (email.value.length > 0) {
        emailError.value = !emailPattern.test(email.value);
    } else {
        emailError.value = true;
    }
}

function validatePassword() {
    passwordError.value = password.value.length < 5;
}

function togglePassword() {
    showPassword.value = !showPassword.value
}
</script>