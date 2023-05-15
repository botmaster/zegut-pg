import './assets/styles/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createHead } from '@vueuse/head'
import prettyConsole from '@/plugins/pretty-console'
import Toast, { type PluginOptions } from 'vue-toastification'
import 'vue-toastification/dist/index.css'
import i18n from '@/plugins/i18n'

// @ts-ignore
import App from './App.vue'
import router from './router'

// Toast options
const options: PluginOptions = {
  // You can set your default options here
}

const app = createApp(App)
app.use(prettyConsole)
app.use(createPinia())
app.use(createHead())
app.use(router)
app.use(i18n)
app.use(Toast, options)

app.mount('#app')
