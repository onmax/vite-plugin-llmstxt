// src/plugin.ts
import type { Plugin, ViteDevServer } from 'vite'
import { LLMGenerator } from './generator'
import { TutorialKitAdapter } from './adapters/tutorialkit'
import type { LLMPluginOptions } from './types'

export function llmsPlugin(options: LLMPluginOptions = {}): Plugin {
  const {
    adapter = new TutorialKitAdapter(),
    contentDir = 'src/content/tutorial',
    outputDir = 'public',
  } = options

  const generator = new LLMGenerator(adapter)
  let server: ViteDevServer | undefined

  return {
    name: 'vite-plugin-llmstxt',

    async buildStart() {
      console.log('[llms] Generating llms.txt files...')
      await generator.generateAll(contentDir, outputDir)
      console.log('[llms] Generation complete')
    },

    configureServer(devServer) {
      server = devServer

      const patterns = adapter.watchPatterns()

      server.watcher.on('change', async (file) => {
        const shouldRegenerate = patterns.some((pattern) => {
          const regex = new RegExp(pattern.replace(/\*\*/g, '.*').replace(/\*/g, '[^/]*'))
          return regex.test(file)
        })

        if (shouldRegenerate && file.includes(contentDir)) {
          console.log('[llms] Content changed, regenerating...')
          await generator.generateAll(contentDir, outputDir)
          server?.ws.send({ type: 'full-reload' })
        }
      })
    },
  }
}
