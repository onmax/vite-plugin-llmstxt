import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import { htmlLlms } from 'vite-html-llms'

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        about: resolve(__dirname, 'about.html'),
      },
    },
  },
  plugins: [
    htmlLlms({
      outputDir: 'dist',
      title: 'HTML Playground',
      description: 'Testing vite-html-llms plugin',
    }),
  ],
})
