// @ts-ignore
import { createI18n } from 'vue-i18n'

/*
 * All i18n resources specified in the plugin `include` option can be loaded
 * at once using the import syntax
 */
import messages from '@intlify/unplugin-vue-i18n/messages'
import { usePreferredLanguages } from '@vueuse/core'

const languages = usePreferredLanguages()

console.log('Preferred Languages', languages.value)

const i18n = createI18n({
  legacy: false,
  locale: languages.value[0].split('-')[0],
  fallbackLocale: 'en',
  messages
})

export default i18n
