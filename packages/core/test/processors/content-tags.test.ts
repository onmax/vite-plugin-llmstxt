import { describe, expect, it } from 'vitest'
import { ContentTagsProcessor } from '../../src/processors/content-tags'

describe('contentTagsProcessor', () => {
  const createContext = () => ({ filePath: 'test.md', contentDir: '' })

  describe('llm-only tag handling', () => {
    it('unwraps content from single llm-only tag', async () => {
      const processor = new ContentTagsProcessor({ handleLLMOnly: true })
      const input = '<llm-only>Special text for LLMs</llm-only>'
      const result = await processor.process(input, createContext())
      expect(result).toBe('Special text for LLMs')
    })

    it('unwraps content with newlines', async () => {
      const processor = new ContentTagsProcessor({ handleLLMOnly: true })
      const input = '<llm-only>\n\n## Special section for LLMs\n\n</llm-only>'
      const result = await processor.process(input, createContext())
      expect(result).toBe('\n\n## Special section for LLMs\n\n')
    })

    it('handles multiple llm-only blocks', async () => {
      const processor = new ContentTagsProcessor({ handleLLMOnly: true })
      const input = '<llm-only>First block</llm-only>\n\nRegular content\n\n<llm-only>Second block</llm-only>'
      const result = await processor.process(input, createContext())
      expect(result).toBe('First block\n\nRegular content\n\nSecond block')
    })

    it('does not process llm-only when disabled', async () => {
      const processor = new ContentTagsProcessor({ handleLLMOnly: false })
      const input = '<llm-only>Should remain tagged</llm-only>'
      const result = await processor.process(input, createContext())
      expect(result).toBe('<llm-only>Should remain tagged</llm-only>')
    })
  })

  describe('llm-exclude tag handling', () => {
    it('removes single llm-exclude block with content', async () => {
      const processor = new ContentTagsProcessor({ handleLLMExclude: true })
      const input = '<llm-exclude>\n## Section to remove\n</llm-exclude>'
      const result = await processor.process(input, createContext())
      expect(result).toBe('')
    })

    it('removes content with newlines', async () => {
      const processor = new ContentTagsProcessor({ handleLLMExclude: true })
      const input = '<llm-exclude>\n\n## Section to remove\n\n</llm-exclude>'
      const result = await processor.process(input, createContext())
      expect(result).toBe('')
    })

    it('removes multiple blocks preserving other content', async () => {
      const processor = new ContentTagsProcessor({ handleLLMExclude: true })
      const input = '<llm-exclude>First remove</llm-exclude>\n\nKeep this\n\n<llm-exclude>Second remove</llm-exclude>\n\n<llm-exclude>Third remove</llm-exclude>'
      const result = await processor.process(input, createContext())
      expect(result).toBe('\n\nKeep this\n\n\n\n')
    })

    it('does not process llm-exclude when disabled', async () => {
      const processor = new ContentTagsProcessor({ handleLLMExclude: false })
      const input = '<llm-exclude>Should remain</llm-exclude>'
      const result = await processor.process(input, createContext())
      expect(result).toBe('<llm-exclude>Should remain</llm-exclude>')
    })
  })

  describe('combined tag handling', () => {
    it('handles both tag types in same content', async () => {
      const processor = new ContentTagsProcessor({ handleLLMOnly: true, handleLLMExclude: true })
      const input = '<llm-only>Keep this</llm-only>\n\nRegular\n\n<llm-exclude>Remove this</llm-exclude>'
      const result = await processor.process(input, createContext())
      expect(result).toBe('Keep this\n\nRegular\n\n')
    })

    it('processes nothing when both disabled', async () => {
      const processor = new ContentTagsProcessor({ handleLLMOnly: false, handleLLMExclude: false })
      const input = '<llm-only>A</llm-only><llm-exclude>B</llm-exclude>'
      const result = await processor.process(input, createContext())
      expect(result).toBe('<llm-only>A</llm-only><llm-exclude>B</llm-exclude>')
    })
  })

  describe('edge cases', () => {
    it('handles empty content', async () => {
      const processor = new ContentTagsProcessor()
      const result = await processor.process('', createContext())
      expect(result).toBe('')
    })

    it('handles content without tags', async () => {
      const processor = new ContentTagsProcessor()
      const input = '# Regular markdown\n\nNo special tags here'
      const result = await processor.process(input, createContext())
      expect(result).toBe('# Regular markdown\n\nNo special tags here')
    })

    it('handles empty tag content', async () => {
      const processor = new ContentTagsProcessor()
      const input = '<llm-only></llm-only><llm-exclude></llm-exclude>'
      const result = await processor.process(input, createContext())
      expect(result).toBe('')
    })
  })
})
