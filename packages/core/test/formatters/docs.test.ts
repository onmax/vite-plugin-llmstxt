import type { PreparedFile } from '../../src/formatter'
import { describe, expect, it } from 'vitest'
import { DocsFormatter } from '../../src/formatters/docs'

describe('docsFormatter', () => {
  const formatter = new DocsFormatter()

  const createFile = (overrides: Partial<PreparedFile> = {}): PreparedFile => ({
    path: 'test.md',
    title: 'Test',
    description: '',
    content: 'Content',
    metadata: {},
    ...overrides,
  })

  describe('formatIndex', () => {
    it('generates index with TOC', () => {
      const files = [
        createFile({ path: 'intro.md', title: 'Introduction', description: 'Getting started' }),
        createFile({ path: 'guide.md', title: 'Guide', description: 'Learn more' }),
      ]
      const opts = { templateVars: { title: 'Docs', description: 'Documentation' } }

      const result = formatter.formatIndex(files, opts)

      expect(result).toContain('# Docs')
      expect(result).toContain('Introduction')
      expect(result).toContain('Guide')
      expect(result).toContain('/intro.md')
      expect(result).toContain('/guide.md')
    })

    it('uses default title and description', () => {
      const files = [createFile()]
      const result = formatter.formatIndex(files, {})

      expect(result).toContain('Documentation')
      expect(result).toContain('Complete documentation')
    })

    it('groups files by directory', () => {
      const files = [
        createFile({ path: 'guide/intro.md', title: 'Intro' }),
        createFile({ path: 'guide/advanced.md', title: 'Advanced' }),
        createFile({ path: 'api/reference.md', title: 'Reference' }),
      ]

      const result = formatter.formatIndex(files, {})

      expect(result).toContain('### guide')
      expect(result).toContain('### api')
    })

    it('handles custom template', () => {
      const files = [createFile({ title: 'Test' })]
      const opts = {
        templateVars: {
          title: 'Custom',
          template: '# {title}\n\n{toc}',
        },
      }

      const result = formatter.formatIndex(files, opts)

      expect(result).toContain('# Custom')
      expect(result).toContain('Test')
    })

    it('includes descriptions in TOC', () => {
      const files = [createFile({ title: 'Test', description: 'Test desc' })]
      const result = formatter.formatIndex(files, {})

      expect(result).toContain('Test desc')
    })
  })

  describe('formatFull', () => {
    it('combines all files with separators', () => {
      const files = [
        createFile({ path: 'intro.md', title: 'Intro', content: 'First content' }),
        createFile({ path: 'guide.md', title: 'Guide', content: 'Second content' }),
      ]

      const result = formatter.formatFull(files, {})

      expect(result).toContain('---')
      expect(result).toContain('# Intro')
      expect(result).toContain('First content')
      expect(result).toContain('# Guide')
      expect(result).toContain('Second content')
    })

    it('includes descriptions when present', () => {
      const files = [createFile({ title: 'Test', description: 'Test description', content: 'Content' })]
      const result = formatter.formatFull(files, {})

      expect(result).toContain('> Test description')
    })

    it('omits descriptions when empty', () => {
      const files = [createFile({ title: 'Test', description: '', content: 'Content' })]
      const result = formatter.formatFull(files, {})

      expect(result).not.toContain('>')
    })

    it('handles single file', () => {
      const files = [createFile({ title: 'Solo', content: 'Only content' })]
      const result = formatter.formatFull(files, {})

      expect(result).toContain('# Solo')
      expect(result).toContain('Only content')
    })

    it('handles empty files array', () => {
      const result = formatter.formatFull([], {})
      expect(result).toBe('')
    })
  })

  describe('formatIndividual', () => {
    it('formats single file with frontmatter', () => {
      const file = createFile({ path: 'guide.md', title: 'Guide', description: 'A guide', content: 'Body' })
      const result = formatter.formatIndividual(file, {})

      expect(result).toContain('---')
      expect(result).toContain('url: /guide.md')
      expect(result).toContain('title: Guide')
      expect(result).toContain('description: A guide')
      expect(result).toContain('Body')
    })

    it('omits description when empty', () => {
      const file = createFile({ title: 'Test', description: '' })
      const result = formatter.formatIndividual(file, {})

      expect(result).not.toContain('description:')
    })

    it('handles domain in URL', () => {
      const file = createFile({ path: 'guide.md' })
      const result = formatter.formatIndividual(file, { domain: 'https://example.com' })

      expect(result).toContain('url: https://example.com/guide.md')
    })

    it('handles base path in URL', () => {
      const file = createFile({ path: 'guide.md' })
      const result = formatter.formatIndividual(file, { base: '/docs' })

      expect(result).toContain('url: /docs/guide.md')
    })

    it('handles custom link extension', () => {
      const file = createFile({ path: 'guide.md' })
      const result = formatter.formatIndividual(file, { linksExtension: '.html' })

      expect(result).toContain('url: /guide.html')
    })

    it('combines domain and base path', () => {
      const file = createFile({ path: 'guide.md' })
      const result = formatter.formatIndividual(file, { domain: 'https://example.com', base: '/docs' })

      expect(result).toContain('url: https://example.com/docs/guide.md')
    })
  })

  describe('uRL formatting edge cases', () => {
    it('handles base path with trailing slash', () => {
      const file = createFile({ path: 'test.md' })
      const result = formatter.formatIndividual(file, { base: '/docs/' })

      expect(result).toContain('url: /docs/test.md')
      expect(result).not.toContain('/docs//test.md')
    })

    it('handles root base path', () => {
      const file = createFile({ path: 'test.md' })
      const result = formatter.formatIndividual(file, { base: '/' })

      expect(result).toContain('url: /test.md')
    })

    it('handles nested paths', () => {
      const file = createFile({ path: 'guide/api/reference.md' })
      const result = formatter.formatIndividual(file, {})

      expect(result).toContain('url: /guide/api/reference.md')
    })
  })
})
