import { describe, expect, it } from 'vitest'
import { ContentTagsProcessor } from '../src/processors/content-tags'
import { FrontmatterProcessor } from '../src/processors/frontmatter'
import { MdreamProcessor } from '../src/processors/mdream'

describe('contentTagsProcessor', () => {
  it('extracts llm-only content', async () => {
    const processor = new ContentTagsProcessor()
    const input = 'Before <llm-only>Only for LLMs</llm-only> After'
    const result = await processor.process(input, { filePath: '', relativePath: '' })

    expect(result).toBe('Before Only for LLMs After')
  })

  it('removes llm-exclude content', async () => {
    const processor = new ContentTagsProcessor()
    const input = 'Keep this <llm-exclude>Remove this</llm-exclude> Keep this too'
    const result = await processor.process(input, { filePath: '', relativePath: '' })

    expect(result).toBe('Keep this  Keep this too')
  })

  it('handles multiple tags', async () => {
    const processor = new ContentTagsProcessor()
    const input = '<llm-only>Include</llm-only> Middle <llm-exclude>Exclude</llm-exclude> End'
    const result = await processor.process(input, { filePath: '', relativePath: '' })

    expect(result).toBe('Include Middle  End')
  })
})

describe('frontmatterProcessor', () => {
  it('strips frontmatter from markdown', async () => {
    const processor = new FrontmatterProcessor()
    const input = '---\ntitle: Test\n---\n\nContent here'
    const result = await processor.process(input, { filePath: '', relativePath: '' })

    expect(result).not.toContain('---')
    expect(result).toContain('Content here')
  })

  it('handles content without frontmatter', async () => {
    const processor = new FrontmatterProcessor()
    const input = 'Just content'
    const result = await processor.process(input, { filePath: '', relativePath: '' })

    expect(result).toBe('Just content')
  })
})

describe('mdreamProcessor', () => {
  it('converts HTML to markdown when stripHTML is true', async () => {
    const processor = new MdreamProcessor({ stripHTML: true })
    const input = '<h1>Title</h1><p>Paragraph</p>'
    const result = await processor.process(input, { filePath: '', relativePath: '' })

    expect(result).toContain('# Title')
    expect(result).toContain('Paragraph')
  })

  it('skips conversion when stripHTML is false', async () => {
    const processor = new MdreamProcessor({ stripHTML: false })
    const input = '<h1>Title</h1>'
    const result = await processor.process(input, { filePath: '', relativePath: '' })

    expect(result).toBe('<h1>Title</h1>')
  })
})
