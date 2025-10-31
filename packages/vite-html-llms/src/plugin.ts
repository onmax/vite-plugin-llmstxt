import type { PreparedFile } from '@vite-plugin-llmstxt/core'
import type { Plugin, ResolvedConfig } from 'vite'
import type { MdreamWrapperOptions } from './types'
import { readdir, readFile, writeFile } from 'node:fs/promises'
import mdream from '@mdream/vite'
import { ContentTagsProcessor, FrontmatterProcessor, MdreamProcessor, ProcessorPipeline } from '@vite-plugin-llmstxt/core'
import { consola } from 'consola'
import { join } from 'pathe'
import { shouldExcludeFile } from './core/filter'
import { HtmlFormatter } from './formatters/html'

const logger = consola.withTag('vite-html-llms')

export function htmlLlms(options: MdreamWrapperOptions = {}): Plugin[] {
  const {
    outputDir = 'dist',
    indexFile = 'llms.txt',
    fullFile = 'llms-full.txt',
    filter = {},
    processors = [],
    formatter = new HtmlFormatter(),
    title,
    description,
  } = options

  let config: ResolvedConfig

  const customPlugin: Plugin = {
    name: 'vite-html-llms',
    enforce: 'post',

    configResolved(resolvedConfig) {
      config = resolvedConfig
    },

    async closeBundle() {
      if (config.command !== 'build')
        return

      logger.start('Generating LLM index files...')

      const pipeline = new ProcessorPipeline()
      pipeline.use(new MdreamProcessor({ stripHTML: true }))
      pipeline.use(new ContentTagsProcessor())
      pipeline.use(new FrontmatterProcessor())

      for (const processor of processors) {
        pipeline.use(processor)
      }

      const files = await collectHtmlFiles(join(config.root, outputDir), outputDir, filter)
      const prepared: PreparedFile[] = []

      for (const file of files) {
        const content = await readFile(file.fullPath, 'utf-8')
        const processed = await pipeline.process(content, {
          filePath: file.fullPath,
          contentDir: join(config.root, outputDir),
          relativePath: file.relativePath,
        })
        prepared.push({ path: file.relativePath, title: file.relativePath, content: processed })
      }

      const indexContent = formatter.formatIndex(prepared, { title, description })
      const fullContent = formatter.formatFull(prepared, { title, description })

      await writeFile(join(config.root, outputDir, indexFile), indexContent, 'utf-8')
      await writeFile(join(config.root, outputDir, fullFile), fullContent, 'utf-8')

      logger.success(`Generated ${indexFile} and ${fullFile}`)
    },
  }

  return [mdream(), customPlugin]
}

async function collectHtmlFiles(dir: string, baseDir: string, filter: NonNullable<MdreamWrapperOptions['filter']>): Promise<Array<{ fullPath: string, relativePath: string }>> {
  const files: Array<{ fullPath: string, relativePath: string }> = []

  async function walk(currentDir: string): Promise<void> {
    const entries = await readdir(currentDir, { withFileTypes: true })

    for (const entry of entries) {
      const fullPath = join(currentDir, entry.name)
      const relativePath = fullPath.replace(`${dir}/`, '')

      if (entry.isDirectory()) {
        await walk(fullPath)
      }
      else if (entry.isFile() && entry.name.endsWith('.html')) {
        if (!shouldExcludeFile(relativePath, filter)) {
          files.push({ fullPath, relativePath })
        }
      }
    }
  }

  await walk(dir)
  return files
}
