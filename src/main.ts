import './assets/styles/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createHead } from '@vueuse/head'
import Toast, { type PluginOptions, POSITION } from 'vue-toastification'
import 'vue-toastification/dist/index.css'
import prettyConsole from '@/plugins/pretty-console'
import i18n from '@/plugins/i18n'

// @ts-ignore
import App from './App.vue'
import router from './router'

// Toast options
const options: PluginOptions = {
  // You can set your default options here
  position: POSITION.BOTTOM_RIGHT,
  filterBeforeCreate(toast, toasts) {
    // Prevent duplicate toasts with the same message
    if (toasts.filter((t) => t.content === toast.content).length) {
      return false
    }
    return toast
  },
}

const app = createApp(App)
app.use(prettyConsole)
app.use(createPinia())
app.use(createHead())
app.use(router)
app.use(i18n)
app.use(Toast, options)

app.mount('#app')
