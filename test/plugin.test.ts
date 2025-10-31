import { describe, expect, it } from 'vitest'
import { llmsPlugin } from '../src/plugin'
import { DocsFormatter } from '../src/formatters/docs'
import { MdreamProcessor } from '../src/processors/mdream'
import { VitePressScanner } from '../src/scanners/vitepress'

describe('llmsPlugin', () => {
  it('returns vite plugin with correct name', () => {
    const plugin = llmsPlugin()

    expect(plugin.name).toBe('vite-plugin-llmstxt')
    expect(plugin.buildStart).toBeDefined()
    expect(plugin.configureServer).toBeDefined()
  })

  it('accepts basic options', () => {
    const plugin = llmsPlugin({
      contentDir: 'custom/content',
      outputDir: 'custom/output',
    })

    expect(plugin.name).toBe('vite-plugin-llmstxt')
  })

  it('accepts preset option', () => {
    const plugin = llmsPlugin({
      preset: 'tutorialkit',
    })

    expect(plugin.name).toBe('vite-plugin-llmstxt')
  })

  it('accepts custom scanner', () => {
    const plugin = llmsPlugin({
      scanner: new VitePressScanner(),
    })

    expect(plugin.name).toBe('vite-plugin-llmstxt')
  })

  it('accepts custom processors', () => {
    const plugin = llmsPlugin({
      processors: [new MdreamProcessor({ stripHTML: true })],
    })

    expect(plugin.name).toBe('vite-plugin-llmstxt')
  })

  it('accepts custom formatter', () => {
    const plugin = llmsPlugin({
      formatter: new DocsFormatter(),
    })

    expect(plugin.name).toBe('vite-plugin-llmstxt')
  })

  it('accepts template options', () => {
    const plugin = llmsPlugin({
      template: '# {title}\n\n{toc}',
      templateVars: { title: 'Custom' },
    })

    expect(plugin.name).toBe('vite-plugin-llmstxt')
  })

  it('accepts filtering options', () => {
    const plugin = llmsPlugin({
      ignoreFiles: ['**/draft/**'],
      excludeBlog: true,
      excludeTeam: true,
    })

    expect(plugin.name).toBe('vite-plugin-llmstxt')
  })

  it('accepts experimental options', () => {
    const plugin = llmsPlugin({
      experimental: {
        depth: 2,
      },
    })

    expect(plugin.name).toBe('vite-plugin-llmstxt')
  })
})
