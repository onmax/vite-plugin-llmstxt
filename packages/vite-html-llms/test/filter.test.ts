import { describe, expect, it } from 'vitest'
import { shouldExcludeFile } from '../src/core/filter'

describe('shouldExcludeFile', () => {
  it('excludes blog posts when excludeBlog is true', () => {
    const result = shouldExcludeFile('blog/post-1.html', { excludeBlog: true })
    expect(result).toBe(true)
  })

  it('includes blog posts when excludeBlog is false', () => {
    const result = shouldExcludeFile('blog/post-1.html', { excludeBlog: false })
    expect(result).toBe(false)
  })

  it('excludes test files when excludeTests is true', () => {
    const result = shouldExcludeFile('pages/component.test.html', { excludeTests: true })
    expect(result).toBe(true)
  })

  it('excludes docs when excludeDocs is true', () => {
    const result = shouldExcludeFile('README.md', { excludeDocs: true })
    expect(result).toBe(true)
  })

  it('excludes config files when excludeConfig is true', () => {
    const result = shouldExcludeFile('vite.config.js', { excludeConfig: true })
    expect(result).toBe(true)
  })

  it('respects include patterns', () => {
    const result = shouldExcludeFile('pages/about.html', { include: ['pages/**'] })
    expect(result).toBe(false)
  })

  it('excludes files not matching include patterns', () => {
    const result = shouldExcludeFile('other/file.html', { include: ['pages/**'] })
    expect(result).toBe(true)
  })

  it('respects exclude patterns', () => {
    const result = shouldExcludeFile('pages/ignore.html', { exclude: ['**/ignore.html'] })
    expect(result).toBe(true)
  })

  it('excludes unnecessary files when excludeUnnecessaryFiles is true', () => {
    expect(shouldExcludeFile('package.json', { excludeUnnecessaryFiles: true })).toBe(true)
    expect(shouldExcludeFile('test.spec.html', { excludeUnnecessaryFiles: true })).toBe(true)
    expect(shouldExcludeFile('README.md', { excludeUnnecessaryFiles: true })).toBe(true)
    expect(shouldExcludeFile('blog/post.html', { excludeUnnecessaryFiles: true })).toBe(true)
  })
})
