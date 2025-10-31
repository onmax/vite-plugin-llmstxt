import { describe, expect, it } from 'vitest'
import type { PreparedFile } from '../../src/core/formatter'
import { TutorialFormatter } from '../../src/formatters/tutorial'

describe('tutorialFormatter', () => {
  const formatter = new TutorialFormatter()

  it('formats index with tutorial links', () => {
    const files: PreparedFile[] = [
      {
        path: 'intro.txt',
        title: 'Introduction',
        content: 'Intro content',
        description: 'Getting started',
      },
      {
        path: 'basics.txt',
        title: 'Basics',
        content: 'Basics content',
        description: 'Core concepts',
      },
    ]

    const result = formatter.formatIndex(files, {
      templateVars: { title: 'Tutorials' },
    })

    expect(result).toContain('# Tutorials')
    expect(result).toContain('[Introduction](/intro.txt)')
    expect(result).toContain('[Basics](/basics.txt)')
    expect(result).toContain('llms-full.txt')
  })

  it('formats full file with all content concatenated', () => {
    const files: PreparedFile[] = [
      { path: 'intro.txt', title: 'Introduction', content: 'Intro content' },
      { path: 'basics.txt', title: 'Basics', content: 'Basics content' },
    ]

    const result = formatter.formatFull(files, {})

    expect(result).toContain('Intro content')
    expect(result).toContain('Basics content')
    expect(result).toContain('========================================')
  })

  it('formats individual file with frontmatter', () => {
    const file: PreparedFile = {
      path: 'intro.txt',
      title: 'Introduction',
      content: '# Introduction\n\nHello world',
      description: 'Getting started',
    }

    const result = formatter.formatIndividual(file, { domain: 'https://example.com' })

    expect(result).toContain('---')
    expect(result).toContain('url: https://example.com/intro.txt')
    expect(result).toContain('description: Getting started')
    expect(result).toContain('# Introduction')
  })
})
