import './assets/styles/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import Toast, { type PluginOptions } from 'vue-toastification'
import 'vue-toastification/dist/index.css'
// @ts-ignore
import { createI18n } from 'vue-i18n'
import { usePreferredLanguages } from '@vueuse/core'

import App from './App.vue'
import router from './router'

const options: PluginOptions = {
  // You can set your default options here
}

const languages = usePreferredLanguages()

console.log('Preferred Languages', languages.value)

/*
 * All i18n resources specified in the plugin `include` option can be loaded
 * at once using the import syntax
 */
import messages from '@intlify/unplugin-vue-i18n/messages'

const i18n = createI18n({
  legacy: false,
  locale: languages.value[0].split('-')[0],
  fallbackLocale: 'en',
  messages
})

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(i18n)
app.use(Toast, options)

app.mount('#app')
