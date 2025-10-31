import { defineConfig } from 'vitepress'
import { llmsPlugin } from 'vite-plugin-llmstxt'

export default defineConfig({
  title: 'VitePress Playground',
  description: 'Testing vite-plugin-llmstxt with VitePress',
  
  vite: {
    plugins: [
      llmsPlugin({
        preset: 'vitepress',
        contentDir: 'docs',
        stripHTML: true,
        domain: 'https://example.com',
        handleContentTags: true,
        injectLLMHint: true,
      }),
    ],
  },
  
  themeConfig: {
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Guide', link: '/guide/' },
    ],
    
    sidebar: [
      {
        text: 'Guide',
        items: [
          { text: 'Introduction', link: '/guide/introduction' },
          { text: 'Getting Started', link: '/guide/getting-started' },
        ],
      },
      {
        text: 'API',
        items: [
          { text: 'Reference', link: '/api/reference' },
        ],
      },
    ],
  },
})
