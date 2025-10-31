import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'
import { TutorialKitAdapter } from '../../src/adapters/tutorialkit'

describe('TutorialKitAdapter', () => {
  it('scans tutorials from fixtures', async () => {
    const adapter = new TutorialKitAdapter()
    const fixturesDir = resolve(__dirname, '../fixtures/mock-tutorial')

    const tutorials = await adapter.scanTutorials(fixturesDir)

    expect(tutorials).toHaveLength(1)
    expect(tutorials[0].slug).toBe('intro')
    expect(tutorials[0].title).toBe('Introduction Tutorial')
    expect(tutorials[0].lessons).toHaveLength(1)
    expect(tutorials[0].lessons[0].slug).toBe('welcome')
    expect(tutorials[0].lessons[0].content).toContain('Welcome Lesson')
    expect(tutorials[0].lessons[0].solutionFiles.get('index.js')).toContain('Hello from solution')
  })

  it('returns watch patterns', () => {
    const adapter = new TutorialKitAdapter()
    const patterns = adapter.watchPatterns()

    expect(patterns).toContain('**/meta.md')
    expect(patterns).toContain('**/content.md')
    expect(patterns).toContain('**/_solution/*')
  })
})
