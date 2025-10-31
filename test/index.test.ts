import { describe, expect, it } from 'vitest'
import { llmsPlugin } from '../src'

describe('main exports', () => {
  it('exports llmsPlugin', () => {
    expect(llmsPlugin).toBeDefined()
  })

  it('creates valid Vite plugin', () => {
    const plugin = llmsPlugin({ preset: 'tutorialkit' })

    expect(plugin).toBeDefined()
    expect(plugin.name).toBe('vite-plugin-llmstxt')
    expect(typeof plugin.buildStart).toBe('function')
    expect(typeof plugin.configureServer).toBe('function')
  })
})
