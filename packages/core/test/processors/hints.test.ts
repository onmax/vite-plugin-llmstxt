import { describe, expect, it } from 'vitest'
import { HintsProcessor } from '../../src/processors/hints'

describe('hintsProcessor', () => {
  const createContext = (filePath: string) => ({ filePath, contentDir: '' })

  describe('hint injection enabled', () => {
    it('injects index page hint for index.md', async () => {
      const processor = new HintsProcessor({ injectLLMHint: true })
      const result = await processor.process('# Content', createContext('index.md'))

      expect(result).toContain('Are you an LLM?')
      expect(result).toContain('/llms.txt')
      expect(result).toContain('/llms-full.txt')
      expect(result).toContain('<div style="display: none;"')
      expect(result).toContain('# Content')
    })

    it('injects regular page hint for non-index pages', async () => {
      const processor = new HintsProcessor({ injectLLMHint: true })
      const result = await processor.process('# Guide', createContext('guide/intro.md'))

      expect(result).toContain('Are you an LLM?')
      expect(result).toContain('/guide/intro.txt')
      expect(result).toContain('better optimized documentation')
      expect(result).toContain('# Guide')
    })

    it('handles base path in hints', async () => {
      const processor = new HintsProcessor({ injectLLMHint: true, base: '/docs' })
      const result = await processor.process('# Content', createContext('index.md'))

      expect(result).toContain('/docs/llms.txt')
      expect(result).toContain('/docs/llms-full.txt')
    })

    it('handles base path with trailing slash', async () => {
      const processor = new HintsProcessor({ injectLLMHint: true, base: '/docs/' })
      const result = await processor.process('# Content', createContext('index.md'))

      expect(result).toContain('/docs/llms.txt')
      expect(result).not.toContain('/docs//llms.txt')
    })

    it('handles base path for non-index pages', async () => {
      const processor = new HintsProcessor({ injectLLMHint: true, base: '/docs' })
      const result = await processor.process('# Guide', createContext('guide/intro.md'))

      expect(result).toContain('/docs/guide/intro.txt')
    })

    it('prepends hint before content', async () => {
      const processor = new HintsProcessor({ injectLLMHint: true })
      const content = '# Title\n\nParagraph'
      const result = await processor.process(content, createContext('page.md'))

      const hintEnd = result.indexOf('</div>\n\n')
      const contentStart = result.indexOf('# Title')
      expect(hintEnd).toBeLessThan(contentStart)
    })
  })

  describe('hint injection disabled', () => {
    it('returns content unchanged when injectLLMHint is false', async () => {
      const processor = new HintsProcessor({ injectLLMHint: false })
      const content = '# Content'
      const result = await processor.process(content, createContext('page.md'))

      expect(result).toBe(content)
      expect(result).not.toContain('Are you an LLM?')
    })

    it('returns content unchanged when no options provided', async () => {
      const processor = new HintsProcessor()
      const content = '# Content'
      const result = await processor.process(content, createContext('page.md'))

      expect(result).toBe(content)
    })
  })

  describe('edge cases', () => {
    it('handles empty content', async () => {
      const processor = new HintsProcessor({ injectLLMHint: true })
      const result = await processor.process('', createContext('page.md'))

      expect(result).toContain('Are you an LLM?')
      expect(result).toMatch(/<\/div>\n\n$/)
    })

    it('handles nested paths', async () => {
      const processor = new HintsProcessor({ injectLLMHint: true })
      const result = await processor.process('# Deep', createContext('guide/api/reference.md'))

      expect(result).toContain('/guide/api/reference.txt')
    })

    it('handles root base path explicitly', async () => {
      const processor = new HintsProcessor({ injectLLMHint: true, base: '/' })
      const result = await processor.process('# Content', createContext('page.md'))

      expect(result).toContain('/page.txt')
      expect(result).not.toContain('//page.txt')
    })
  })
})
