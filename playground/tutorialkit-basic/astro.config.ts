import vue from '@astrojs/vue'
import tutorialkit from '@tutorialkit/astro'
import { defineConfig } from 'astro/config'
import { llmsPlugin } from 'vite-plugin-llmstxt'

export default defineConfig({
  vite: {
    plugins: [llmsPlugin({ preset: 'tutorialkit' })],
  },
  integrations: [tutorialkit(), vue()],
})
