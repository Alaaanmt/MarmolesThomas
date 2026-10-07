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
                <p class="text-3xl font-bold text-gray-800">Registrarse</p>
                <div>
                    <input type="text" placeholder="Nombre Completo"
                        class="w-full p-3 border border-gray-300 rounded-lg focus:outline-cyan-700"
                        :class="nameError ? 'border-red-500 focus:outline-transparent' : ''" v-model="name"
                        @keyup="validateName()">
                    <span v-if="nameError" style="color: red;">Minimo 4 digitos</span>
                </div>
                <div>
                    <input type="email" placeholder="Correo Electronico"
                        class="w-full p-3 border border-gray-300 rounded-lg focus:outline-cyan-700"
                        :class="emailError ? 'border-red-500 focus:outline-transparent' : ''" v-model="email"
                        @keyup="validateEmail()">
                    <span id="error-email" style="color: red;" v-if="emailError">Email inválido</span>
                </div>
                <div class="relative">
                    <input :type="showPassword ? 'text' : 'password'" placeholder="Contraseña"
                        class="w-full p-3 border border-gray-300 rounded-lg focus:outline-cyan-700"
                        :class="passwordError ? 'border-red-500 focus:outline-transparent' : ''" v-model="password"
                        @keyup="validatePassword()">
                    <div class="w-4 absolute top-4 right-4 cursor-pointer" @click="togglePassword()">
                        <img :src="showPassword ? '/img/eye.svg' : '/img/eye-off.svg'" alt=""
                            class="w-full h-full aspect-square">
                    </div>
                    <span v-if="passwordError" style="color: red;">Minimo 5 digitos</span>

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
                <div>
                    <input type="date" placeholder="Fecha de Nacimiento"
                        class="w-full p-3 border border-gray-300 rounded-lg focus:outline-cyan-700"
                        :class="dateError ? 'border-red-500 focus:outline-transparent' : ''" v-model="date"
                        @keyup="validateDate">
                    <span v-if="dateError" style="color: red;">Formato DD-MM-AAAA</span>
                </div>
                <RouterLink to="/activation">
                    <button type="submit"
                        class="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-semibold py-3 mb-3 cursor-pointer rounded-lg transition duration-200">
                        REGISTRARME
                    </button>
                </RouterLink>
                <div id="opciones" class="flex gap-2 text-sm">
                    <p class="text-gray-500">¿Ya tenés Cuenta?</p>
                    <RouterLink to="/login" class="text-cyan-600 font-semibold hover:text-cyan-800">Iniciar Sesión
                    </RouterLink>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
// VUE
import { ref } from 'vue';
import { RouterLink } from 'vue-router';

const name = ref('');
const nameError = ref(false);
const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const date = ref('');
const dateError = ref(false);
const emailError = ref(false);
const passwordError = ref(false);
const confirmPasswordError = ref(false);
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const showPassword = ref(false);
const showPasswordConfirm = ref(false);

function validateName() {
    nameError.value = name.value.length < 4;
}

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

function validateConfirmPassword() {
    confirmPasswordError.value = password.value !== confirmPassword.value;
}

function togglePassword() {
    showPassword.value = !showPassword.value
}

function togglePasswordConfirm() {
    showPasswordConfirm.value = !showPasswordConfirm.value
}

function validateDate() {
    dateError.value = date.value.length !== 10;
}
</script>