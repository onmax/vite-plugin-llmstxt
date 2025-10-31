import { describe, expect, it } from 'vitest'
import { shouldIgnoreFile } from '../../src/core/filter'

describe('file filtering', () => {
  const workDir = '/test'

  it('ignores files matching custom patterns', () => {
    const result = shouldIgnoreFile('/test/draft/page.md', workDir, {
      ignoreFiles: ['**/draft/**'],
    })

    expect(result).toBe(true)
  })

  it('does not ignore non-matching files', () => {
    const result = shouldIgnoreFile('/test/pages/page.md', workDir, {
      ignoreFiles: ['**/draft/**'],
    })

    expect(result).toBe(false)
  })

  it('ignores index page when enabled', () => {
    const result = shouldIgnoreFile('/test/index.md', workDir, {
      excludeIndexPage: true,
    })

    expect(result).toBe(true)
  })

  it('ignores blog when enabled', () => {
    const result = shouldIgnoreFile('/test/blog/post.md', workDir, {
      excludeBlog: true,
    })

    expect(result).toBe(true)
  })

  it('ignores team when enabled', () => {
    const result = shouldIgnoreFile('/test/about/team/member.md', workDir, {
      excludeTeam: true,
    })

    expect(result).toBe(true)
  })

  it('applies excludeUnnecessaryFiles', () => {
    const indexResult = shouldIgnoreFile('/test/index.md', workDir, {
      excludeUnnecessaryFiles: true,
    })
    const blogResult = shouldIgnoreFile('/test/blog/post.md', workDir, {
      excludeUnnecessaryFiles: true,
    })
    const teamResult = shouldIgnoreFile('/test/team/member.md', workDir, {
      excludeUnnecessaryFiles: true,
    })

    expect(indexResult).toBe(false) // index needs explicit flag
    expect(blogResult).toBe(true)
    expect(teamResult).toBe(true)
  })

  it('handles multiple patterns', () => {
    const result1 = shouldIgnoreFile('/test/draft/page.md', workDir, {
      ignoreFiles: ['**/draft/**', '**/wip/**'],
    })
    const result2 = shouldIgnoreFile('/test/wip/page.md', workDir, {
      ignoreFiles: ['**/draft/**', '**/wip/**'],
    })

    expect(result1).toBe(true)
    expect(result2).toBe(true)
  })
})
