import { mkdtemp, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { ProcessorPipeline } from '@vite-plugin-llmstxt/core/processor'
import { TutorialFormatter } from '@vite-plugin-llmstxt/formatters/tutorial'
import { ContentTagsProcessor } from '@vite-plugin-llmstxt/processors/content-tags'
import { FrontmatterProcessor } from '@vite-plugin-llmstxt/processors/frontmatter'
import { SnippetsProcessor } from '@vite-plugin-llmstxt/processors/snippets'
import { TutorialKitScanner } from '@vite-plugin-llmstxt/scanners/tutorialkit'
import { join, resolve } from 'pathe'
import { afterEach, describe, expect, it } from 'vitest'

describe('integration: complex tutorial', () => {
  let tempDir: string

  afterEach(async () => {
    if (tempDir) {
      await rm(tempDir, { recursive: true, force: true })
    }
  })

  it('processes complex tutorial with multiple lessons', async () => {
    const fixturesDir = resolve(__dirname, 'fixtures/mock-complex-tutorial')
    tempDir = await mkdtemp(join(tmpdir(), 'llms-complex-'))

    const scanner = new TutorialKitScanner()
    const rawFiles = await scanner.scan(fixturesDir)

    expect(rawFiles.length).toBeGreaterThan(1)
    expect(rawFiles.some(f => f.path.includes('basics'))).toBe(true)
    expect(rawFiles.some(f => f.path.includes('advanced'))).toBe(true)
  })

  it('handles snippet includes', async () => {
    const fixturesDir = resolve(__dirname, 'fixtures/mock-complex-tutorial')
    const scanner = new TutorialKitScanner()
    const rawFiles = await scanner.scan(fixturesDir)

    const pipeline = new ProcessorPipeline()
    pipeline.use(new FrontmatterProcessor({ extract: true }))
    pipeline.use(new SnippetsProcessor({ baseDir: join(fixturesDir, '1-advanced/1-features') }))
    pipeline.use(new ContentTagsProcessor())

    const fileWithSnippet = rawFiles.find(f => f.content.includes('@include'))
    if (fileWithSnippet) {
      const result = await pipeline.process(fileWithSnippet.content, {
        filePath: fileWithSnippet.path,
        contentDir: fixturesDir,
        metadata: {},
      })

      expect(result).not.toContain('<!--@include')
      expect(result).toContain('Feature Details')
    }
  })

  it('formats complex tutorial structure', async () => {
    const fixturesDir = resolve(__dirname, 'fixtures/mock-complex-tutorial')
    const scanner = new TutorialKitScanner()
    const rawFiles = await scanner.scan(fixturesDir)

    const pipeline = new ProcessorPipeline()
    pipeline.use(new FrontmatterProcessor({ extract: true }))
    pipeline.use(new ContentTagsProcessor())

    const preparedFiles = await Promise.all(
      rawFiles.map(async (file) => {
        const ctx = {
          filePath: file.path,
          contentDir: fixturesDir,
          metadata: file.metadata || {},
        }

        const processedContent = await pipeline.process(file.content, ctx)

        return {
          path: file.path,
          title: ctx.metadata?.title || file.metadata?.title || 'Untitled',
          content: processedContent,
          description: ctx.metadata?.description,
          metadata: ctx.metadata,
        }
      }),
    )

    const formatter = new TutorialFormatter()
    const indexContent = formatter.formatIndex(preparedFiles, {
      templateVars: { title: 'Complex Tutorial' },
    })

    expect(indexContent).toContain('# Complex Tutorial')
    expect(preparedFiles.length).toBeGreaterThanOrEqual(2)
  })
})
