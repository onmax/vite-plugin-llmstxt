import { describe, expect, it } from 'vitest'
import { MdreamProcessor } from '../../src/processors/mdream'

describe('mdreamProcessor', () => {
  it('strips HTML when enabled', async () => {
    const processor = new MdreamProcessor({ stripHTML: true })
    const content = '<h1>Hello</h1><p>World</p>'

    const result = await processor.process(content, {
      filePath: 'test.md',
      contentDir: '/test',
    })

    expect(result).toContain('# Hello')
    expect(result).toContain('World')
    expect(result).not.toContain('<h1>')
    expect(result).not.toContain('<p>')
  })

  it('skips processing when stripHTML is false', async () => {
    const processor = new MdreamProcessor({ stripHTML: false })
    const content = '<h1>Hello</h1><p>World</p>'

    const result = await processor.process(content, {
      filePath: 'test.md',
      contentDir: '/test',
    })

    expect(result).toBe(content)
  })
})
