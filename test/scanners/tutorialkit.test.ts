import { resolve } from 'pathe'
import { describe, expect, it } from 'vitest'
import { TutorialKitScanner } from '../../src/scanners/tutorialkit'

describe('tutorialKitScanner', () => {
  it('scans tutorials from fixtures', async () => {
    const scanner = new TutorialKitScanner()
    const fixturesDir = resolve(__dirname, '../fixtures/mock-tutorial')

    const files = await scanner.scan(fixturesDir)

    expect(files).toHaveLength(1)
    expect(files[0].path).toBe('intro.txt')
    expect(files[0].metadata?.slug).toBe('intro')
    expect(files[0].metadata?.title).toBe('Introduction Tutorial')
    expect(files[0].content).toContain('Introduction Tutorial')
    expect(files[0].content).toContain('Welcome Lesson')
    expect(files[0].content).toContain('Hello from solution')
  })

  it('returns watch patterns', () => {
    const scanner = new TutorialKitScanner()
    const patterns = scanner.watchPatterns()

    expect(patterns).toContain('**/meta.md')
    expect(patterns).toContain('**/content.md')
    expect(patterns).toContain('**/_solution/*')
  })
})
