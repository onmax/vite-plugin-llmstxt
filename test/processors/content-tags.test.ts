import { describe, expect, it } from 'vitest'
import { ContentTagsProcessor } from '../../src/processors/content-tags'

describe('contentTagsProcessor', () => {
  it('removes llm-only tags and content', async () => {
    const processor = new ContentTagsProcessor({ handleLLMOnly: true })
    const content = 'Before <llm-only>hidden content</llm-only> After'

    const result = await processor.process(content, {
      filePath: 'test.md',
      contentDir: '/test',
    })

    expect(result).toBe('Before  After')
    expect(result).not.toContain('hidden content')
  })

  it('removes llm-exclude tags but keeps content', async () => {
    const processor = new ContentTagsProcessor({ handleLLMExclude: true })
    const content = 'Before <llm-exclude>visible content</llm-exclude> After'

    const result = await processor.process(content, {
      filePath: 'test.md',
      contentDir: '/test',
    })

    expect(result).toBe('Before visible content After')
    expect(result).toContain('visible content')
    expect(result).not.toContain('<llm-exclude>')
  })
})
