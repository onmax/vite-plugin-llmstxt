import { mkdtemp, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join, resolve } from 'pathe'
import { afterEach, describe, expect, it } from 'vitest'
import { ProcessorPipeline } from '../src/core/processor'
import { TutorialFormatter } from '../src/formatters/tutorial'
import { ContentTagsProcessor } from '../src/processors/content-tags'
import { FrontmatterProcessor } from '../src/processors/frontmatter'
import { TutorialKitScanner } from '../src/scanners/tutorialkit'

describe('integration: scanner → processors → formatter', () => {
  let tempDir: string

  afterEach(async () => {
    if (tempDir) {
      await rm(tempDir, { recursive: true, force: true })
    }
  })

  it('generates all files from fixtures', async () => {
    const fixturesDir = resolve(__dirname, 'fixtures/mock-tutorial')
    tempDir = await mkdtemp(join(tmpdir(), 'llms-test-'))

    // Scan content
    const scanner = new TutorialKitScanner()
    const rawFiles = await scanner.scan(fixturesDir)

    expect(rawFiles).toHaveLength(1)
    expect(rawFiles[0].path).toBe('intro.txt')

    // Process through pipeline
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

    // Format outputs
    const formatter = new TutorialFormatter()
    const indexContent = formatter.formatIndex(preparedFiles, {
      templateVars: { title: 'Test Tutorials' },
    })
    const fullContent = formatter.formatFull(preparedFiles, {})
    const individualContent = formatter.formatIndividual(preparedFiles[0], {})

    // Verify outputs
    expect(indexContent).toContain('# Test Tutorials')
    expect(indexContent).toContain('[Introduction Tutorial](/intro.txt)')
    expect(fullContent).toContain('Introduction Tutorial')
    expect(fullContent).toContain('Welcome Lesson')
    expect(individualContent).toContain('---')
    expect(individualContent).toContain('url: /intro.txt')
  })
})
