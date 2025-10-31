import { describe, expect, it } from 'vitest'
import { MdreamProcessor } from '../../src/processors/mdream'

describe('mdreamProcessor', () => {
  const createContext = () => ({ filePath: 'test.md', contentDir: '' })

  describe('stripHTML enabled', () => {
    it('converts HTML to markdown', async () => {
      const processor = new MdreamProcessor({ stripHTML: true })
      const input = '<p>Hello <strong>world</strong></p>'
      const result = await processor.process(input, createContext())

      expect(result).toContain('Hello')
      expect(result).toContain('world')
      expect(result).not.toContain('<p>')
      expect(result).not.toContain('<strong>')
    })

    it('converts headings', async () => {
      const processor = new MdreamProcessor({ stripHTML: true })
      const input = '<h1>Title</h1><h2>Subtitle</h2>'
      const result = await processor.process(input, createContext())

      expect(result).toMatch(/^# Title/m)
      expect(result).toMatch(/^## Subtitle/m)
    })

    it('converts lists', async () => {
      const processor = new MdreamProcessor({ stripHTML: true })
      const input = '<ul><li>Item 1</li><li>Item 2</li></ul>'
      const result = await processor.process(input, createContext())

      expect(result).toContain('Item 1')
      expect(result).toContain('Item 2')
      expect(result).not.toContain('<ul>')
      expect(result).not.toContain('<li>')
    })

    it('converts links', async () => {
      const processor = new MdreamProcessor({ stripHTML: true })
      const input = '<a href="/guide">Guide</a>'
      const result = await processor.process(input, createContext())

      expect(result).toMatch(/\[Guide\]\(\/guide\)/)
    })

    it('uses minimal preset when enabled', async () => {
      const processor = new MdreamProcessor({ stripHTML: true, useMinimalPreset: true })
      const input = '<h1>Title</h1><p>Content paragraph</p>'
      const result = await processor.process(input, createContext())

      expect(result).toContain('Title')
      expect(result).toContain('Content paragraph')
    })

    it('handles origin option for absolute URLs', async () => {
      const processor = new MdreamProcessor({ stripHTML: true, origin: 'https://example.com' })
      const input = '<a href="/guide">Guide</a>'
      const result = await processor.process(input, createContext())

      // mdream should convert relative URLs to absolute with origin
      expect(result).toContain('Guide')
    })
  })

  describe('stripHTML disabled', () => {
    it('returns content unchanged when stripHTML is false', async () => {
      const processor = new MdreamProcessor({ stripHTML: false })
      const input = '<p>Should <strong>not</strong> be converted</p>'
      const result = await processor.process(input, createContext())

      expect(result).toBe(input)
    })

    it('returns content unchanged when no options provided', async () => {
      const processor = new MdreamProcessor()
      const input = '<h1>HTML Content</h1>'
      const result = await processor.process(input, createContext())

      expect(result).toBe(input)
    })
  })

  describe('edge cases', () => {
    it('handles empty content', async () => {
      const processor = new MdreamProcessor({ stripHTML: true })
      const result = await processor.process('', createContext())

      expect(result).toBe('')
    })

    it('handles plain text without HTML', async () => {
      const processor = new MdreamProcessor({ stripHTML: true })
      const input = '<span>Just plain text</span>'
      const result = await processor.process(input, createContext())

      expect(result).toContain('Just plain text')
      expect(result).not.toContain('<span>')
    })

    it('handles mixed markdown and HTML', async () => {
      const processor = new MdreamProcessor({ stripHTML: true })
      const input = '# Markdown\n\n<p>HTML paragraph</p>'
      const result = await processor.process(input, createContext())

      expect(result).not.toContain('<p>')
      expect(result).toContain('HTML paragraph')
    })

    it('handles nested HTML structures', async () => {
      const processor = new MdreamProcessor({ stripHTML: true })
      const input = '<div><section><article><p>Deep content</p></article></section></div>'
      const result = await processor.process(input, createContext())

      expect(result).toContain('Deep content')
      expect(result).not.toContain('<div>')
    })
  })
})
