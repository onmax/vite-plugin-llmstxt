import { DocsFormatter, MdreamProcessor } from '@vite-plugin-llmstxt/core'
import { VitePressScanner } from '@vite-plugin-llmstxt/vitepress'
import { describe, expect, it } from 'vitest'
import { llmsPlugin } from '../src/plugin'

describe('llmsPlugin', () => {
  it('returns vite plugin with correct name', () => {
    const plugin = llmsPlugin({ preset: 'tutorialkit' })
    expect(plugin.name).toBe('vite-plugin-llmstxt')
  })

  it('accepts custom scanner', () => {
    const scanner = new VitePressScanner()
    const plugin = llmsPlugin({ preset: 'vitepress', scanner })
    expect(plugin.name).toBe('vite-plugin-llmstxt')
  })

  it('accepts custom processors', () => {
    const processor = new MdreamProcessor()
    const plugin = llmsPlugin({ preset: 'tutorialkit', processors: [processor] })
    expect(plugin.name).toBe('vite-plugin-llmstxt')
  })

  it('accepts custom formatter', () => {
    const formatter = new DocsFormatter()
    const plugin = llmsPlugin({ preset: 'tutorialkit', formatter })
    expect(plugin.name).toBe('vite-plugin-llmstxt')
  })

  it('accepts explicit tutorialkit preset', () => {
    const plugin = llmsPlugin({ preset: 'tutorialkit' })
    expect(plugin.name).toBe('vite-plugin-llmstxt')
  })

  it('accepts explicit vitepress preset', () => {
    const plugin = llmsPlugin({ preset: 'vitepress' })
    expect(plugin.name).toBe('vite-plugin-llmstxt')
  })

  it('applies processor mode append', () => {
    const processor = new MdreamProcessor()
    const plugin = llmsPlugin({
      preset: 'tutorialkit',
      processors: { mode: 'append', list: [processor] },
    })
    expect(plugin.name).toBe('vite-plugin-llmstxt')
  })
})
