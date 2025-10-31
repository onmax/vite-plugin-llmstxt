import { describe, expect, it } from 'vitest'
import { htmlLlms } from '../src/plugin'

describe('htmlLlms plugin', () => {
  it('returns array of plugins', () => {
    const plugins = htmlLlms()

    expect(Array.isArray(plugins)).toBe(true)
    expect(plugins.length).toBe(2)
  })

  it('includes mdream plugin', () => {
    const plugins = htmlLlms()

    expect(plugins[0].name).toBe('vite-html-to-markdown')
  })

  it('includes custom plugin with correct name', () => {
    const plugins = htmlLlms()

    expect(plugins[1].name).toBe('vite-html-llms')
  })

  it('accepts custom options', () => {
    const plugins = htmlLlms({
      outputDir: 'custom',
      indexFile: 'custom-llms.txt',
      fullFile: 'custom-llms-full.txt',
    })

    expect(plugins.length).toBe(2)
  })

  it('uses default formatter when not provided', () => {
    const plugins = htmlLlms()

    expect(plugins[1].name).toBe('vite-html-llms')
  })

  it('accepts custom processors', () => {
    const customProcessor = {
      process: (content: string) => content.toUpperCase(),
    }

    const plugins = htmlLlms({
      processors: [customProcessor],
    })

    expect(plugins.length).toBe(2)
  })

  it('accepts filter options', () => {
    const plugins = htmlLlms({
      filter: {
        excludeBlog: true,
        excludeTests: true,
      },
    })

    expect(plugins.length).toBe(2)
  })
})
