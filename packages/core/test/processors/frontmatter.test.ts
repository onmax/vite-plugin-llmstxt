import { describe, expect, it } from 'vitest'
import { FrontmatterProcessor } from '../../src/processors/frontmatter'

describe('frontmatterProcessor', () => {
  const createContext = () => ({ filePath: 'test.md', contentDir: '', metadata: {} })

  describe('extract mode', () => {
    it('extracts frontmatter and stores in context', async () => {
      const processor = new FrontmatterProcessor({ extract: true })
      const input = `---
title: My Awesome Title
description: Test description
---

# Content here`
      const ctx = createContext()
      const result = await processor.process(input, ctx)

      expect(result).toBe('\n# Content here')
      expect(ctx.metadata).toEqual({
        title: 'My Awesome Title',
        description: 'Test description',
      })
    })

    it('handles frontmatter without content', async () => {
      const processor = new FrontmatterProcessor({ extract: true })
      const input = `---
title: Just Title
---`
      const ctx = createContext()
      const result = await processor.process(input, ctx)

      expect(result).toBe('')
      expect(ctx.metadata).toEqual({ title: 'Just Title' })
    })

    it('handles content without frontmatter', async () => {
      const processor = new FrontmatterProcessor({ extract: true })
      const input = '# Regular Markdown\n\nNo frontmatter here'
      const ctx = createContext()
      const result = await processor.process(input, ctx)

      expect(result).toBe('# Regular Markdown\n\nNo frontmatter here')
      expect(ctx.metadata).toEqual({})
    })

    it('merges with existing metadata', async () => {
      const processor = new FrontmatterProcessor({ extract: true })
      const input = `---
title: New Title
---

Content`
      const ctx = { ...createContext(), metadata: { existing: 'value' } }
      await processor.process(input, ctx)

      expect(ctx.metadata).toEqual({
        existing: 'value',
        title: 'New Title',
      })
    })

    it('handles empty frontmatter', async () => {
      const processor = new FrontmatterProcessor({ extract: true })
      const input = `---
---

Content`
      const ctx = createContext()
      const result = await processor.process(input, ctx)

      expect(result).toBe('\nContent')
      expect(ctx.metadata).toEqual({})
    })

    it('handles various frontmatter data types', async () => {
      const processor = new FrontmatterProcessor({ extract: true })
      const input = `---
title: String Title
number: 42
boolean: true
array:
  - item1
  - item2
nested:
  key: value
---

Content`
      const ctx = createContext()
      await processor.process(input, ctx)

      expect(ctx.metadata).toEqual({
        title: 'String Title',
        number: 42,
        boolean: true,
        array: ['item1', 'item2'],
        nested: { key: 'value' },
      })
    })
  })

  describe('extract disabled', () => {
    it('returns content unchanged when extract is false', async () => {
      const processor = new FrontmatterProcessor({ extract: false })
      const input = `---
title: Should Not Extract
---

Content`
      const ctx = createContext()
      const result = await processor.process(input, ctx)

      expect(result).toBe(input)
      expect(ctx.metadata).toEqual({})
    })
  })

  describe('edge cases', () => {
    it('handles empty content', async () => {
      const processor = new FrontmatterProcessor({ extract: true })
      const ctx = createContext()
      const result = await processor.process('', ctx)

      expect(result).toBe('')
      expect(ctx.metadata).toEqual({})
    })

    it('handles content with --- separator not as frontmatter', async () => {
      const processor = new FrontmatterProcessor({ extract: true })
      const input = `Some content

---

More content`
      const ctx = createContext()
      const result = await processor.process(input, ctx)
      // Should not parse this as frontmatter
      expect(result).toContain('Some content')
      expect(ctx.metadata).toEqual({})
    })
  })
})
