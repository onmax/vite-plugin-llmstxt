// test/generator.test.ts
import { describe, expect, it } from 'vitest'
import { LLMGenerator } from '../src/generator'
import type { Tutorial } from '../src/types'

describe('LLMGenerator', () => {
  it('generates tutorial file with lessons and solution code', () => {
    const tutorial: Tutorial = {
      slug: 'intro',
      title: 'Introduction',
      description: 'Getting started',
      lessons: [
        {
          slug: 'welcome',
          title: 'Welcome',
          content: '# Welcome\n\nHello world',
          solutionFiles: new Map([
            ['index.js', 'console.log("hello")'],
          ]),
        },
      ],
    }

    const generator = new LLMGenerator()
    const result = generator.generateTutorialFile(tutorial)

    expect(result).toContain('# Introduction')
    expect(result).toContain('> Getting started')
    expect(result).toContain('## Lesson 1: Welcome')
    expect(result).toContain('# Welcome\n\nHello world')
    expect(result).toContain('### Solution Code')
    expect(result).toContain('#### index.js')
    expect(result).toContain('```js\nconsole.log("hello")\n```')
  })

  it('generates root index with tutorial links', () => {
    const tutorials: Tutorial[] = [
      {
        slug: 'intro',
        title: 'Introduction',
        description: 'Getting started',
        lessons: [],
      },
      {
        slug: 'basics',
        title: 'Basics',
        description: 'Core concepts',
        lessons: [],
      },
    ]

    const generator = new LLMGenerator()
    const result = generator.generateRootIndex(tutorials)

    expect(result).toContain('# Tutorials')
    expect(result).toContain('[Introduction](/tutorial/intro.txt)')
    expect(result).toContain('[Basics](/tutorial/basics.txt)')
    expect(result).toContain('[All Tutorials](/llms-full.txt)')
  })
})
