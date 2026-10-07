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
                <p class="text-3xl font-bold text-gray-800">Activación</p>
                <p class="text-lg text-gray-800">Se te ha enviado un codigo de activacion al siguiente mail: ...!</p>
                <input type="number" placeholder="Código de Activación" class="w-full p-3 border border-gray-300 rounded-lg focus:outline-cyan-700">
                <RouterLink to="/login">
                <button class="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-semibold py-3 mb-4 cursor-pointer rounded-lg transition duration-200">
                    CONFIRMAR
                </button>
                </RouterLink>
                <RouterLink to="/register" class="text-sm text-cyan-600 font-semibold hover:text-cyan-800">Volver atrás</RouterLink>
            </div>
        </div>
    </section>
</template>