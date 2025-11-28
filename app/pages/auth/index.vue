<template>
  <main class=" bg-[#F0F8FF] text-[#34495E] antialiased font-['Cabin'] min-h-screen flex items-center justify-center p-4">
    <div class="w-full max-w-md bg-white rounded-xl shadow-2xl overflow-hidden">
      
      <!-- Header -->
      <div class="bg-[#2F4F4F] text-white p-8 text-center">
        <i class="fas fa-mug-hot text-5xl text-[#48D1CC] mb-4"></i>
        <h1 class="text-3xl font-bold">Bienvenido/a a CAFÉ ORDEN</h1>
        <p class="text-sm opacity-80 mt-1">Ingresa tus credenciales para continuar.</p>
      </div>

      <!-- Formulario -->
      <form class="p-8 space-y-6" @submit.prevent="submitLogin">
        <div class="space-y-2">
          <label for="username" class="text-sm font-semibold block">Usuario o Email</label>
          <div class="relative">
            <input
              type="email"
              id="username"
              placeholder="ejemplo@correo.com"
              class="w-full p-3 border border-gray-300 rounded-lg pl-10 focus:ring-[#48D1CC] focus:border-[#48D1CC] transition duration-200"
                v-model="formData.email"
            />
            <i class="fas fa-user absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
          </div>
        </div>

        <div class="space-y-2">
          <label for="password" class="text-sm font-semibold block">Contraseña</label>
          <div class="relative">
            <input
              type="password"
              v-model="formData.password"
              id="password"
              placeholder="••••••••"
              class="w-full p-3 border border-gray-300 rounded-lg pl-10 focus:ring-[#48D1CC] focus:border-[#48D1CC] transition duration-200"
            />
            <i class="fas fa-lock absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
          </div>
        </div>

        <div class="flex justify-between items-center text-sm">
          <label class="flex items-center space-x-2">
            <input type="checkbox" class="rounded text-[#48D1CC] focus:ring-[#48D1CC] border-gray-300" />
            <span class="text-gray-600">Recordarme</span>
          </label>
          <a href="#" class="text-[#48D1CC] hover:text-[#2F4F4F] transition duration-200 font-medium">
            ¿Olvidaste tu contraseña?
          </a>
        </div>

        <button
          type="submit"
          :disabled="loading"
          class="w-full bg-[#2F4F4F] text-white py-3 rounded-lg text-lg font-bold hover:bg-[#192d2d] transition duration-200 shadow-lg"
        >
          <i class="fas fa-sign-in-alt mr-2"></i> {{ loading?'Espere..':'Iniciar Sesión' }}
        </button>
      </form>
    </div>
  </main>
</template>
<style>
</style>
<script setup>
import '~/assets/css/login.css'

import { ref,onMounted } from 'vue'
import axios from 'axios'
import { push } from 'notivue'

const formData = ref({
    email:'',
    password:''
})
const error = ref('')
const loading = ref(false)


const submitLogin = async () =>{
    loading.value=true
    error.value = ''

    try {
        const {data} = await axios.post(URL_BASE_API+'/api/v1/public/auth/login',formData.value)
        localStorage.setItem('token',data.token)
        localStorage.setItem('token_type',data.type)
        localStorage.setItem('user', JSON.stringify(data.user))

        await navigateTo({path:'/home'})
    } catch (error) {
        push.error({title:'Acceso denegado',message:'Usuario y/o contraseña incorrecta'})
        formData.value.password=''
        formData.value.email=''
    }finally{
        loading.value=false
    }
}

</script>