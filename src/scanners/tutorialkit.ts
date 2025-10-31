import type { RawFile, Scanner } from '../core/scanner'
import { readdir, readFile } from 'fs/promises'
import { join } from 'pathe'

export class TutorialKitScanner implements Scanner {
  async scan(contentDir: string): Promise<RawFile[]> {
    const entries = await readdir(contentDir, { withFileTypes: true })
    const tutorialDirs = entries
      .filter(e => e.isDirectory() && /^\d+-/.test(e.name))
      .sort((a, b) => a.name.localeCompare(b.name))

    const files: RawFile[] = []

    for (const dir of tutorialDirs) {
      const tutorialPath = join(contentDir, dir.name)
      const meta = await this.readMeta(tutorialPath)
      const lessons = await this.scanLessons(tutorialPath)
      const slug = dir.name.replace(/^\d+-/, '')

      // Create a combined file for this tutorial
      files.push({
        path: `${slug}.txt`,
        content: this.combineTutorialContent(meta.title || slug, meta.description, lessons),
        metadata: {
          slug,
          title: meta.title || slug,
          description: meta.description,
          lessons,
        },
      })
    }

    return files
  }

  watchPatterns(): string[] {
    return ['**/meta.md', '**/content.md', '**/_solution/*']
  }

  private async readMeta(tutorialPath: string): Promise<{ title?: string, description?: string }> {
    try {
      const metaPath = join(tutorialPath, 'meta.md')
      const content = await readFile(metaPath, 'utf-8')
      const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/)

      if (frontmatterMatch) {
        const yaml = frontmatterMatch[1]
        const titleMatch = yaml.match(/^title:(.+)$/m)
        const descMatch = yaml.match(/^description:(.+)$/m)

        return {
          title: titleMatch?.[1]?.trim(),
          description: descMatch?.[1]?.trim(),
        }
      }
    }
    catch {}

    return {}
  }

  private async scanLessons(tutorialPath: string): Promise<any[]> {
    const entries = await readdir(tutorialPath, { withFileTypes: true })
    const lessonDirs = entries
      .filter(e => e.isDirectory() && /^\d+-/.test(e.name))
      .sort((a, b) => a.name.localeCompare(b.name))

    const lessons: any[] = []

    for (const dir of lessonDirs) {
      const lessonPath = join(tutorialPath, dir.name)
      const slug = dir.name.replace(/^\d+-/, '')

      const content = await this.readContent(lessonPath)
      const solutionFiles = await this.readSolutionFiles(lessonPath)

      const titleMatch = content.match(/^# (.+)$/m)
      const title = titleMatch?.[1]?.trim() || slug

      lessons.push({
        slug,
        title,
        content,
        solutionFiles,
      })
    }

    return lessons
  }

  private async readContent(lessonPath: string): Promise<string> {
    try {
      const contentPath = join(lessonPath, 'content.md')
      return await readFile(contentPath, 'utf-8')
    }
    catch {
      return ''
    }
  }

  private async readSolutionFiles(lessonPath: string): Promise<Map<string, string>> {
    const files = new Map<string, string>()

    try {
      const solutionDir = join(lessonPath, '_solution')
      const entries = await readdir(solutionDir, { withFileTypes: true })

      for (const entry of entries) {
        if (entry.isFile()) {
          const filePath = join(solutionDir, entry.name)
          const content = await readFile(filePath, 'utf-8')
          files.set(entry.name, content)
        }
      }
    }
    catch {}

    return files
  }

  private combineTutorialContent(title: string, description: string | undefined, lessons: any[]): string {
    const parts: string[] = []

    parts.push(`# ${title}\n`)
    if (description) {
      parts.push(`> ${description}\n`)
    }

    lessons.forEach((lesson, idx) => {
      parts.push(`## Lesson ${idx + 1}: ${lesson.title}\n`)
      parts.push(`${lesson.content}\n`)

      if (lesson.solutionFiles.size > 0) {
        parts.push('### Solution Code\n')
        lesson.solutionFiles.forEach((code: string, filename: string) => {
          const ext = filename.split('.').pop() || ''
          parts.push(`#### ${filename}\n`)
          parts.push(`\`\`\`${ext}\n${code}\n\`\`\`\n`)
        })
      }

      if (idx < lessons.length - 1) {
        parts.push('---\n')
      }
    })

    return parts.join('\n')
  }
}
