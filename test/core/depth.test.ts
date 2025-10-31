import { describe, expect, it } from 'vitest'
import type { PreparedFile } from '../../src/core/formatter'
import { getDirectoriesAtDepths } from '../../src/core/depth'

describe('depth utilities', () => {
  const mockFiles: PreparedFile[] = [
    { path: 'intro.md', title: 'Intro', content: 'intro' },
    { path: 'guide/start.md', title: 'Start', content: 'start' },
    { path: 'guide/advanced.md', title: 'Advanced', content: 'advanced' },
    { path: 'api/reference.md', title: 'Reference', content: 'reference' },
    { path: 'api/examples/basic.md', title: 'Basic', content: 'basic' },
  ]

  it('returns root only at depth 1', () => {
    const dirs = getDirectoriesAtDepths(mockFiles, 1)

    expect(dirs).toHaveLength(1)
    expect(dirs[0].relativePath).toBe('.')
    expect(dirs[0].files).toHaveLength(5)
  })

  it('returns root + first level at depth 2', () => {
    const dirs = getDirectoriesAtDepths(mockFiles, 2)

    expect(dirs.length).toBeGreaterThan(1)
    expect(dirs.some(d => d.relativePath === '.')).toBe(true)
    expect(dirs.some(d => d.relativePath === 'guide')).toBe(true)
    expect(dirs.some(d => d.relativePath === 'api')).toBe(true)
  })

  it('groups files correctly by directory', () => {
    const dirs = getDirectoriesAtDepths(mockFiles, 2)
    const guideDir = dirs.find(d => d.relativePath === 'guide')

    expect(guideDir).toBeDefined()
    expect(guideDir!.files.length).toBeGreaterThanOrEqual(2)
    expect(guideDir!.files.some(f => f.path.includes('guide/start.md'))).toBe(true)
  })

  it('handles depth 3', () => {
    const dirs = getDirectoriesAtDepths(mockFiles, 3)

    expect(dirs.some(d => d.relativePath === '.')).toBe(true)
    expect(dirs.some(d => d.relativePath === 'guide')).toBe(true)
    expect(dirs.some(d => d.relativePath === 'api')).toBe(true)
    expect(dirs.some(d => d.relativePath === 'api/examples')).toBe(true)
  })
})
