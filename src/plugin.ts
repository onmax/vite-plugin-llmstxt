import type { Plugin, ViteDevServer } from 'vite'
import type { LLMPluginOptions, Preset } from './types'
import { existsSync } from 'node:fs'
import { consola } from 'consola'
import { join } from 'pathe'
import { LLMGenerator } from './generator'
import { TutorialKitPreset } from './presets/tutorialkit'

function resolvePreset(preset: LLMPluginOptions['preset'], contentDir: string): Preset {
  if (!preset || preset === 'auto') {
    // Auto-detect: check for TutorialKit structure
    const tutorialKitMarkers = [
      join(contentDir, 'meta.md'),
      join(contentDir, '../env.d.ts'),
    ]
    if (tutorialKitMarkers.some(path => existsSync(path))) {
      return new TutorialKitPreset()
    }
    throw new Error('Could not auto-detect preset. Please specify a preset explicitly.')
  }

  if (preset === 'tutorialkit') {
    return new TutorialKitPreset()
  }

  return preset
}

export function llmsPlugin(options: LLMPluginOptions = {}): Plugin {
  const {
    preset: presetOption = 'auto',
    contentDir = 'src/content/tutorial',
    outputDir = 'public',
  } = options

  const preset = resolvePreset(presetOption, contentDir)
  const generator = new LLMGenerator(preset)
  let server: ViteDevServer | undefined

  return {
    name: 'vite-plugin-llmstxt',

    async buildStart() {
      consola.start('Generating llms.txt files...')
      await generator.generateAll(contentDir, outputDir)
      consola.success('Generation complete')
    },

    configureServer(devServer) {
      server = devServer

      const patterns = preset.watchPatterns()

      server.watcher.on('change', async (file) => {
        const shouldRegenerate = patterns.some((pattern) => {
          const regex = new RegExp(pattern.replace(/\*\*/g, '.*').replace(/\*/g, '[^/]*'))
          return regex.test(file)
        })

        if (shouldRegenerate && file.includes(contentDir)) {
          consola.info('Content changed, regenerating...')
          await generator.generateAll(contentDir, outputDir)
          server?.ws.send({ type: 'full-reload' })
        }
      })
    },
  }
}
