// test/plugin.test.ts
import { describe, expect, it } from 'vitest'
import { llmsPlugin } from '../src/plugin'

describe('llmsPlugin', () => {
  it('returns vite plugin with correct name', () => {
    const plugin = llmsPlugin()

    expect(plugin.name).toBe('vite-plugin-llmstxt')
    expect(plugin.buildStart).toBeDefined()
    expect(plugin.configureServer).toBeDefined()
  })

  it('accepts custom options', () => {
    const plugin = llmsPlugin({
      contentDir: 'custom/content',
      outputDir: 'custom/output',
    })

    expect(plugin.name).toBe('vite-plugin-llmstxt')
  })
})
