import { describe, expect, it } from 'vitest'
import { DocsFormatter } from '../src/formatters/docs'
import { llmsPlugin } from '../src/plugin'
import { MdreamProcessor } from '../src/processors/mdream'
import { VitePressScanner } from '../src/scanners/vitepress'

describe('llmsPlugin', () => {
  it('returns vite plugin with correct name', () => {
    const plugin = llmsPlugin({ preset: 'tutorialkit' })

    expect(plugin.name).toBe('vite-plugin-llmstxt')
    expect(plugin.buildStart).toBeDefined()
    expect(plugin.configureServer).toBeDefined()
  })

  it('accepts basic options', () => {
    const plugin = llmsPlugin({
      preset: 'tutorialkit',
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
      preset: 'tutorialkit',
      scanner: new VitePressScanner(),
    })

    expect(plugin.name).toBe('vite-plugin-llmstxt')
  })

  it('accepts custom processors', () => {
    const plugin = llmsPlugin({
      preset: 'tutorialkit',
      processors: [new MdreamProcessor({ stripHTML: true })],
    })

    expect(plugin.name).toBe('vite-plugin-llmstxt')
  })

  it('accepts custom formatter', () => {
    const plugin = llmsPlugin({
      preset: 'tutorialkit',
      formatter: new DocsFormatter(),
    })

    expect(plugin.name).toBe('vite-plugin-llmstxt')
  })

  it('accepts template options', () => {
    const plugin = llmsPlugin({
      preset: 'tutorialkit',
      template: '# {title}\n\n{toc}',
      templateVars: { title: 'Custom' },
    })

    expect(plugin.name).toBe('vite-plugin-llmstxt')
  })

  it('accepts filtering options', () => {
    const plugin = llmsPlugin({
      preset: 'tutorialkit',
      ignoreFiles: ['**/draft/**'],
      excludeBlog: true,
      excludeTeam: true,
    })

    expect(plugin.name).toBe('vite-plugin-llmstxt')
  })

  it('accepts experimental options', () => {
    const plugin = llmsPlugin({
      preset: 'tutorialkit',
      experimental: {
        depth: 2,
      },
    })

    expect(plugin.name).toBe('vite-plugin-llmstxt')
  })
})
