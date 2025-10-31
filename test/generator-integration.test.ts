// test/generator-integration.test.ts
import { mkdtemp, readFile, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { describe, expect, it, afterEach } from 'vitest'
import { LLMGenerator } from '../src/generator'
import { TutorialKitAdapter } from '../src/adapters/tutorialkit'

describe('LLMGenerator file operations', () => {
  let tempDir: string

  afterEach(async () => {
    if (tempDir) {
      await rm(tempDir, { recursive: true, force: true })
    }
  })

  it('generates all files to output directory', async () => {
    const fixturesDir = join(__dirname, 'fixtures/mock-tutorial')
    tempDir = await mkdtemp(join(tmpdir(), 'llms-test-'))

    const adapter = new TutorialKitAdapter()
    const generator = new LLMGenerator(adapter)

    await generator.generateAll(fixturesDir, tempDir)

    // Check root index
    const rootIndex = await readFile(join(tempDir, 'llms.txt'), 'utf-8')
    expect(rootIndex).toContain('# Tutorials')

    // Check full file
    const fullFile = await readFile(join(tempDir, 'llms-full.txt'), 'utf-8')
    expect(fullFile).toContain('Introduction Tutorial')

    // Check individual tutorial file
    const tutorialFile = await readFile(join(tempDir, 'tutorial/intro.txt'), 'utf-8')
    expect(tutorialFile).toContain('Welcome Lesson')
  })
})
