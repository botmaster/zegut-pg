// @ts-ignore
import { createI18n } from 'vue-i18n'

/*
 * All i18n resources specified in the plugin `include` option can be loaded
 * at once using the import syntax
 */
import messages from '@intlify/unplugin-vue-i18n/messages'
import { usePreferredLanguages } from '@vueuse/core'

const languages = usePreferredLanguages()

const datetimeFormats = {
  en: {
    short: {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    },
    long: {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    }
  },
  fr: {
    short: {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    },
    long: {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long',
      hour: 'numeric',
      minute: 'numeric',
      hour12: false
    }
  }
} as const

const i18n = createI18n({
  legacy: false,
  locale: languages.value[0].split('-')[0],
  fallbackLocale: 'en',
  messages,
  datetimeFormats
})

export default i18n
