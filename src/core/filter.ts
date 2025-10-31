import { minimatch } from 'minimatch'

export interface FileFilter {
  ignoreFiles?: string[]
  excludeIndexPage?: boolean
  excludeBlog?: boolean
  excludeTeam?: boolean
  excludeUnnecessaryFiles?: boolean
}

const UNNECESSARY_PATTERNS = {
  indexPage: ['index.md'],
  blog: ['**/blog/**', '**/posts/**'],
  team: ['**/team/**', '**/about/team/**'],
}

export function shouldIgnoreFile(filePath: string, workDir: string, filter: FileFilter): boolean {
  const relativePath = filePath.replace(workDir, '').replace(/^\//, '')

  // Check custom ignore patterns
  if (filter.ignoreFiles?.length) {
    for (const pattern of filter.ignoreFiles) {
      if (minimatch(relativePath, pattern)) {
        return true
      }
    }
  }

  // Check predefined exclusions
  if (filter.excludeUnnecessaryFiles || filter.excludeIndexPage) {
    if (filter.excludeIndexPage && UNNECESSARY_PATTERNS.indexPage.some(p => minimatch(relativePath, p))) {
      return true
    }
  }

  if (filter.excludeUnnecessaryFiles || filter.excludeBlog) {
    if (filter.excludeBlog && UNNECESSARY_PATTERNS.blog.some(p => minimatch(relativePath, p))) {
      return true
    }
  }

  if (filter.excludeUnnecessaryFiles || filter.excludeTeam) {
    if (filter.excludeTeam && UNNECESSARY_PATTERNS.team.some(p => minimatch(relativePath, p))) {
      return true
    }
  }

  return false
}
