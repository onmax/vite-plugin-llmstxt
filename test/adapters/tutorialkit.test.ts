import { resolve } from 'pathe'
import { describe, expect, it } from 'vitest'
import { TutorialKitPreset } from '../../src/presets/tutorialkit'

describe('tutorialKitPreset', () => {
  it('scans tutorials from fixtures', async () => {
    const preset = new TutorialKitPreset()
    const fixturesDir = resolve(__dirname, '../fixtures/mock-tutorial')

    const tutorials = await preset.scanTutorials(fixturesDir)

    expect(tutorials).toHaveLength(1)
    expect(tutorials[0].slug).toBe('intro')
    expect(tutorials[0].title).toBe('Introduction Tutorial')
    expect(tutorials[0].lessons).toHaveLength(1)
    expect(tutorials[0].lessons[0].slug).toBe('welcome')
    expect(tutorials[0].lessons[0].content).toContain('Welcome Lesson')
    expect(tutorials[0].lessons[0].solutionFiles.get('index.js')).toContain('Hello from solution')
  })

  it('returns watch patterns', () => {
    const preset = new TutorialKitPreset()
    const patterns = preset.watchPatterns()

    expect(patterns).toContain('**/meta.md')
    expect(patterns).toContain('**/content.md')
    expect(patterns).toContain('**/_solution/*')
  })
})
