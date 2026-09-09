import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// Configuracion basica de Vite para un proyecto Vue 3.
// No se necesita nada especial aqui: solo activar el plugin de Vue.
export default defineConfig({
  plugins: [vue()],
})
