import type { PreparedFile } from '@vite-plugin-llmstxt/core'
import type { Plugin, ViteDevServer } from 'vite'
import type { LLMPluginOptions, Preset, ProcessorConfig } from './types'
import { existsSync } from 'node:fs'
import { mkdir, writeFile } from 'node:fs/promises'
import { getDirectoriesAtDepths, ProcessorPipeline, shouldIgnoreFile } from '@vite-plugin-llmstxt/core'
import { createTutorialKitPreset } from '@vite-plugin-llmstxt/tutorialkit'
import { createVitePressPreset } from '@vite-plugin-llmstxt/vitepress'
import { consola } from 'consola'
import { join } from 'pathe'

function resolvePreset(preset: LLMPluginOptions['preset'], contentDir: string): Preset {
  if (!preset || preset === 'auto') {
    // Auto-detect: check for TutorialKit structure
    const tutorialKitMarkers = [
      join(contentDir, 'meta.md'),
      join(contentDir, '../env.d.ts'),
    ]
    if (tutorialKitMarkers.some(path => existsSync(path))) {
      consola.info('Auto-detected TutorialKit preset')
      return createTutorialKitPreset()
    }

    // Check for VitePress
    const vitepressMarkers = [
      join(contentDir, '../.vitepress'),
      join(contentDir, '.vitepress'),
    ]
    if (vitepressMarkers.some(path => existsSync(path))) {
      consola.info('Auto-detected VitePress preset')
      return createVitePressPreset()
    }

    throw new Error('Could not auto-detect preset. Please specify a preset explicitly.')
  }

  if (preset === 'tutorialkit') {
    return createTutorialKitPreset()
  }

  if (preset === 'vitepress') {
    return createVitePressPreset()
  }

  return preset
}

function mergeProcessors(preset: Preset, userProcessors?: LLMPluginOptions['processors']): Processor[] {
  if (!userProcessors) {
    return preset.processors
  }

  if (Array.isArray(userProcessors)) {
    // Default: append mode
    return [...preset.processors, ...userProcessors]
  }

  // Explicit mode
  const config = userProcessors as ProcessorConfig
  if (config.mode === 'replace') {
    return config.list
  }

  return [...preset.processors, ...config.list]
}

export function llmsPlugin(options: LLMPluginOptions = {}): Plugin {
  const {
    preset: presetOption = 'auto',
    contentDir: userContentDir,
    outputDir: userOutputDir,
    scanner: userScanner,
    processors: userProcessors,
    formatter: userFormatter,
    ...userOptions
  } = options

  // Resolve preset
  const preset = resolvePreset(presetOption, userContentDir || 'src/content/tutorial')

  // Merge options (user options override preset defaults)
  const mergedOptions = {
    ...preset.defaults,
    ...userOptions,
    contentDir: userContentDir || preset.defaults?.contentDir || 'src/content/tutorial',
    outputDir: userOutputDir || preset.defaults?.outputDir || 'public',
  }

  // Resolve components (user overrides take precedence)
  const scanner = userScanner || preset.scanner
  const processors = mergeProcessors(preset, userProcessors)
  const formatter = userFormatter || preset.formatter
  const template = options.template || preset.template

  let server: ViteDevServer | undefined

  async function generate(): Promise<void> {
    consola.start('Generating llms.txt files...')

    try {
      // Scan content
      const rawFiles = await scanner.scan(mergedOptions.contentDir)
      consola.info(`Found ${rawFiles.length} files`)

      // Filter files
      const filtered = rawFiles.filter((file) => {
        const shouldIgnore = shouldIgnoreFile(
          join(mergedOptions.contentDir, file.path),
          mergedOptions.contentDir,
          {
            ignoreFiles: mergedOptions.ignoreFiles,
            excludeIndexPage: mergedOptions.excludeIndexPage,
            excludeBlog: mergedOptions.excludeBlog,
            excludeTeam: mergedOptions.excludeTeam,
            excludeUnnecessaryFiles: mergedOptions.excludeUnnecessaryFiles,
          },
        )
        return !shouldIgnore
      })

      consola.info(`Processing ${filtered.length} files after filtering`)

      // Process files through pipeline
      const pipeline = new ProcessorPipeline()
      processors.forEach(p => pipeline.use(p))

      const preparedFiles: PreparedFile[] = await Promise.all(
        filtered.map(async (file) => {
          const ctx = {
            filePath: file.path,
            contentDir: mergedOptions.contentDir,
            metadata: file.metadata || {},
          }

          const processedContent = await pipeline.process(file.content, ctx)

          // Extract title from metadata or content
          const title = ctx.metadata?.title
            || file.metadata?.title
            || file.path.replace(/\.txt$/, '').replace(/\.md$/, '')

          return {
            path: file.path,
            title,
            content: processedContent,
            description: ctx.metadata?.description || file.metadata?.description,
            metadata: ctx.metadata,
          }
        }),
      )

      // Sort by title
      preparedFiles.sort((a, b) => a.title.localeCompare(b.title))

      // Create output directory
      await mkdir(mergedOptions.outputDir, { recursive: true })

      // Format and write outputs
      const formatOpts = {
        domain: mergedOptions.domain,
        base: '/',
        linksExtension: mergedOptions.generateIndividual ? undefined : '.html',
        directoryFilter: '.',
        templateVars: {
          title: mergedOptions.title,
          description: mergedOptions.description,
          details: mergedOptions.details,
          template,
          ...mergedOptions.templateVars,
        },
      }

      const tasks: Promise<void>[] = []
      const depth = mergedOptions.experimental?.depth || 1

      // Get directories at specified depth
      const directories = getDirectoriesAtDepths(preparedFiles, depth)

      // Generate index (llms.txt) at each depth level
      if (mergedOptions.generateIndex !== false) {
        for (const dir of directories) {
          tasks.push(
            (async () => {
              const isRoot = dir.relativePath === '.'
              const fileName = isRoot ? 'llms.txt' : join(dir.relativePath, 'llms.txt')
              const dirFormatOpts = { ...formatOpts, directoryFilter: dir.relativePath }

              const indexContent = formatter.formatIndex(dir.files, dirFormatOpts)
              const indexPath = join(mergedOptions.outputDir, fileName)

              await mkdir(join(indexPath, '..'), { recursive: true })
              await writeFile(indexPath, indexContent, 'utf-8')
              consola.success(`Generated ${fileName}`)
            })(),
          )
        }
      }

      // Generate full (llms-full.txt) at each depth level
      if (mergedOptions.generateFull !== false) {
        for (const dir of directories) {
          tasks.push(
            (async () => {
              const isRoot = dir.relativePath === '.'
              const fileName = isRoot ? 'llms-full.txt' : join(dir.relativePath, 'llms-full.txt')
              const dirFormatOpts = { ...formatOpts, directoryFilter: dir.relativePath }

              const fullContent = formatter.formatFull(dir.files, dirFormatOpts)
              const fullPath = join(mergedOptions.outputDir, fileName)

              await mkdir(join(fullPath, '..'), { recursive: true })
              await writeFile(fullPath, fullContent, 'utf-8')
              consola.success(`Generated ${fileName}`)
            })(),
          )
        }
      }

      // Generate individual files
      if (mergedOptions.generateIndividual !== false) {
        const tutorialDir = join(mergedOptions.outputDir, 'tutorial')
        await mkdir(tutorialDir, { recursive: true })

        for (const file of preparedFiles) {
          tasks.push(
            (async () => {
              const individualContent = formatter.formatIndividual(file, formatOpts)
              const filePath = join(mergedOptions.outputDir, 'tutorial', file.path)
              await mkdir(join(filePath, '..'), { recursive: true })
              await writeFile(filePath, individualContent, 'utf-8')
            })(),
          )
        }

        consola.success(`Generated ${preparedFiles.length} individual files`)
      }

      await Promise.all(tasks)
      consola.success('Generation complete')
    }
    catch (error) {
      consola.error('Generation failed:', error)
      throw error
    }
  }

  return {
    name: 'vite-plugin-llmstxt',

    async buildStart() {
      await generate()
    },

    configureServer(devServer) {
      server = devServer

      const patterns = scanner.watchPatterns()

      server.watcher.on('change', async (file) => {
        const shouldRegenerate = patterns.some((pattern) => {
          const regex = new RegExp(pattern.replace(/\*\*/g, '.*').replace(/\*/g, '[^/]*'))
          return regex.test(file)
        })

        if (shouldRegenerate && file.includes(mergedOptions.contentDir)) {
          consola.info('Content changed, regenerating...')
          await generate()
          server?.ws.send({ type: 'full-reload' })
        }
      })
    },
  }
}
