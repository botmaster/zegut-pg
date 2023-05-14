import './assets/styles/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createHead } from '@vueuse/head'
import Toast, { type PluginOptions } from 'vue-toastification'
import 'vue-toastification/dist/index.css'
// @ts-ignore
import { usePreferredLanguages } from '@vueuse/core'
import i18n from '@/plugins/i18n'

import App from './App.vue'
import router from './router'

const options: PluginOptions = {
  // You can set your default options here
}

const app = createApp(App)
app.use(createPinia())
app.use(createHead())
app.use(router)
app.use(i18n)
app.use(Toast, options)

app.mount('#app')
