import { mkdtemp, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join, resolve } from 'pathe'
import { afterEach, describe, expect, it } from 'vitest'
import { ProcessorPipeline } from '../src/core/processor'
import { DocsFormatter } from '../src/formatters/docs'
import { ContentTagsProcessor } from '../src/processors/content-tags'
import { FrontmatterProcessor } from '../src/processors/frontmatter'
import { SnippetsProcessor } from '../src/processors/snippets'
import { VitePressScanner } from '../src/scanners/vitepress'

describe('integration: VitePress docs', () => {
  let tempDir: string

  afterEach(async () => {
    if (tempDir) {
      await rm(tempDir, { recursive: true, force: true })
    }
  })

  it('processes VitePress documentation', async () => {
    const fixturesDir = resolve(__dirname, 'fixtures/mock-vitepress/docs')
    tempDir = await mkdtemp(join(tmpdir(), 'llms-vitepress-'))

    const scanner = new VitePressScanner()
    const rawFiles = await scanner.scan(fixturesDir)

    expect(rawFiles.length).toBeGreaterThan(0)
    expect(rawFiles.some(f => f.path.includes('guide'))).toBe(true)
    expect(rawFiles.some(f => f.path.includes('api'))).toBe(true)
  })

  it('handles VitePress snippet includes', async () => {
    const fixturesDir = resolve(__dirname, 'fixtures/mock-vitepress/docs')
    const scanner = new VitePressScanner()
    const rawFiles = await scanner.scan(fixturesDir)

    const pipeline = new ProcessorPipeline()
    pipeline.use(new FrontmatterProcessor({ extract: true }))
    pipeline.use(new SnippetsProcessor({ baseDir: join(fixturesDir, 'guide') }))
    pipeline.use(new ContentTagsProcessor())

    const configFile = rawFiles.find(f => f.path.includes('configuration.md'))
    if (configFile) {
      const result = await pipeline.process(configFile.content, {
        filePath: configFile.path,
        contentDir: fixturesDir,
        metadata: {},
      })

      expect(result).toContain('Example Configuration')
      expect(result).not.toContain('<!--@include')
    }
  })

  it('formats VitePress docs with DocsFormatter', async () => {
    const fixturesDir = resolve(__dirname, 'fixtures/mock-vitepress/docs')
    const scanner = new VitePressScanner()
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
          title: ctx.metadata?.title || 'Untitled',
          content: processedContent,
          description: ctx.metadata?.description,
          metadata: ctx.metadata,
        }
      }),
    )

    const formatter = new DocsFormatter()
    const indexContent = formatter.formatIndex(preparedFiles, {
      templateVars: { title: 'Documentation', description: 'VitePress docs' },
    })
    const fullContent = formatter.formatFull(preparedFiles, {})

    expect(indexContent).toContain('# Documentation')
    expect(indexContent).toContain('VitePress docs')
    expect(fullContent).toContain('Getting Started')
    expect(preparedFiles.length).toBeGreaterThan(3)
  })

  it('excludes blog posts when filter is applied', async () => {
    const fixturesDir = resolve(__dirname, 'fixtures/mock-vitepress/docs')
    const scanner = new VitePressScanner()
    const rawFiles = await scanner.scan(fixturesDir)

    const blogFiles = rawFiles.filter(f => f.path.includes('blog'))
    expect(blogFiles.length).toBeGreaterThan(0)
  })
})
