// src/generator.ts
import { mkdir, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import type { Adapter, Tutorial } from './types'

export class LLMGenerator {
  constructor(private adapter?: Adapter) {}

  generateTutorialFile(tutorial: Tutorial): string {
    const parts: string[] = []

    // Header
    parts.push(`# ${tutorial.title}\n`)
    if (tutorial.description) {
      parts.push(`> ${tutorial.description}\n`)
    }

    // Lessons
    tutorial.lessons.forEach((lesson, idx) => {
      parts.push(`## Lesson ${idx + 1}: ${lesson.title}\n`)
      parts.push(`${lesson.content}\n`)

      // Solution files
      if (lesson.solutionFiles.size > 0) {
        parts.push('### Solution Code\n')
        lesson.solutionFiles.forEach((code, filename) => {
          const ext = filename.split('.').pop() || ''
          parts.push(`#### ${filename}\n`)
          parts.push(`\`\`\`${ext}\n${code}\n\`\`\`\n`)
        })
      }

      // Separator between lessons
      if (idx < tutorial.lessons.length - 1) {
        parts.push('---\n')
      }
    })

    return parts.join('\n')
  }

  generateRootIndex(tutorials: Tutorial[]): string {
    const parts: string[] = []

    parts.push('# Tutorials\n')
    parts.push('Learn through interactive tutorials.\n')
    parts.push('## Available Tutorials\n')

    tutorials.forEach((tutorial) => {
      const desc = tutorial.description || tutorial.title
      parts.push(`- [${tutorial.title}](/tutorial/${tutorial.slug}.txt): ${desc}`)
    })

    parts.push('\n## Complete Documentation\n')
    parts.push('- [All Tutorials](/llms-full.txt): Full combined documentation')

    return parts.join('\n')
  }

  generateFullFile(tutorials: Tutorial[]): string {
    const parts: string[] = []

    tutorials.forEach((tutorial, idx) => {
      parts.push(this.generateTutorialFile(tutorial))

      if (idx < tutorials.length - 1) {
        parts.push('\n========================================\n')
      }
    })

    return parts.join('\n')
  }

  async generateAll(contentDir: string, outputDir: string): Promise<void> {
    if (!this.adapter) {
      throw new Error('Adapter is required for generateAll')
    }

    const tutorials = await this.adapter.scanTutorials(contentDir)

    // Create output directories
    await mkdir(join(outputDir, 'tutorial'), { recursive: true })

    // Generate individual tutorial files
    for (const tutorial of tutorials) {
      const content = this.generateTutorialFile(tutorial)
      const filePath = join(outputDir, 'tutorial', `${tutorial.slug}.txt`)
      await writeFile(filePath, content, 'utf-8')
    }

    // Generate root index
    const rootIndex = this.generateRootIndex(tutorials)
    await writeFile(join(outputDir, 'llms.txt'), rootIndex, 'utf-8')

    // Generate full file
    const fullFile = this.generateFullFile(tutorials)
    await writeFile(join(outputDir, 'llms-full.txt'), fullFile, 'utf-8')
  }
}
