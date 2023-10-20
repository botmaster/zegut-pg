import { fileURLToPath } from 'node:url'
import { mergeConfig, defineConfig, configDefaults } from 'vitest/config'
import viteConfig from './vite.config'

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      // active les API compatibles avec jest globalement
      globals: true,
      // simule le DOM avec happy-dom
      // (requiert l'installation de happy-dom en dépendance additionnelle)
      environment: 'happy-dom',
      exclude: [...configDefaults.exclude, 'e2e/*'],
      root: fileURLToPath(new URL('./', import.meta.url))
    }
  })
)
