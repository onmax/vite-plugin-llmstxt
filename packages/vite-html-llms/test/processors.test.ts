import { ContentTagsProcessor, FrontmatterProcessor, MdreamProcessor } from '@vite-plugin-llmstxt/core'
import { describe, expect, it } from 'vitest'

describe('contentTagsProcessor', () => {
  it('processes content without tags unchanged', async () => {
    const processor = new ContentTagsProcessor()
    const input = 'Before After'
    const result = await processor.process(input, { filePath: '', contentDir: '', relativePath: '' })

    expect(result).toBe('Before After')
  })
})

describe('frontmatterProcessor', () => {
  it('strips frontmatter from markdown', async () => {
    const processor = new FrontmatterProcessor()
    const input = '---\ntitle: Test\n---\n\nContent here'
    const result = await processor.process(input, { filePath: '', contentDir: '', relativePath: '' })

    expect(result).not.toContain('---')
    expect(result).toContain('Content here')
  })

  it('handles content without frontmatter', async () => {
    const processor = new FrontmatterProcessor()
    const input = 'Just content'
    const result = await processor.process(input, { filePath: '', contentDir: '', relativePath: '' })

    expect(result).toBe('Just content')
  })
})

describe('mdreamProcessor', () => {
  it('converts HTML to markdown when stripHTML is true', async () => {
    const processor = new MdreamProcessor({ stripHTML: true })
    const input = '<h1>Title</h1><p>Paragraph</p>'
    const result = await processor.process(input, { filePath: '', contentDir: '', relativePath: '' })

    expect(result).toContain('# Title')
    expect(result).toContain('Paragraph')
  })

  it('skips conversion when stripHTML is false', async () => {
    const processor = new MdreamProcessor({ stripHTML: false })
    const input = '<h1>Title</h1>'
    const result = await processor.process(input, { filePath: '', contentDir: '', relativePath: '' })

    expect(result).toBe('<h1>Title</h1>')
  })
})
