import type { RawFile, Scanner } from '../core/scanner'
import { readdir, readFile } from 'node:fs/promises'
import { join } from 'pathe'

export class VitePressScanner implements Scanner {
  async scan(contentDir: string): Promise<RawFile[]> {
    const files: RawFile[] = []
    await this.scanDirectory(contentDir, contentDir, files)
    return files
  }

  watchPatterns(): string[] {
    return ['**/*.md']
  }

  private async scanDirectory(baseDir: string, currentDir: string, files: RawFile[]): Promise<void> {
    const entries = await readdir(currentDir, { withFileTypes: true })

    for (const entry of entries) {
      const fullPath = join(currentDir, entry.name)

      if (entry.isDirectory()) {
        // Skip hidden dirs and common excludes
        if (!entry.name.startsWith('.') && entry.name !== 'node_modules') {
          await this.scanDirectory(baseDir, fullPath, files)
        }
      }
      else if (entry.isFile() && entry.name.endsWith('.md')) {
        const content = await readFile(fullPath, 'utf-8')
        const relativePath = fullPath.replace(baseDir, '').replace(/^\//, '')

        files.push({
          path: relativePath,
          content,
          metadata: {},
        })
      }
    }
  }
}
