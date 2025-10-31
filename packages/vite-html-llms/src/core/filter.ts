import type { FilterOptions } from '../types'
import { minimatch } from 'minimatch'

export const UNNECESSARY_PATTERNS = {
  config: ['**/vite.config.*', '**/vitest.config.*', '**/tsconfig.json', '**/.eslintrc*', '**/package.json'],
  tests: ['**/*.test.*', '**/*.spec.*', '**/__tests__/**'],
  docs: ['**/README.md', '**/LICENSE', '**/CHANGELOG.md'],
  blog: ['**/blog/**', '**/posts/**'],
}

export function shouldExcludeFile(relativePath: string, filter: FilterOptions): boolean {
  if (filter.include && !filter.include.some(p => minimatch(relativePath, p))) {
    return true
  }

  if (filter.exclude && filter.exclude.some(p => minimatch(relativePath, p))) {
    return true
  }

  if ((filter.excludeUnnecessaryFiles || filter.excludeConfig) && UNNECESSARY_PATTERNS.config.some(p => minimatch(relativePath, p))) {
    return true
  }

  if ((filter.excludeUnnecessaryFiles || filter.excludeTests) && UNNECESSARY_PATTERNS.tests.some(p => minimatch(relativePath, p))) {
    return true
  }

  if ((filter.excludeUnnecessaryFiles || filter.excludeDocs) && UNNECESSARY_PATTERNS.docs.some(p => minimatch(relativePath, p))) {
    return true
  }

  if ((filter.excludeUnnecessaryFiles || filter.excludeBlog) && UNNECESSARY_PATTERNS.blog.some(p => minimatch(relativePath, p))) {
    return true
  }

  return false
}
