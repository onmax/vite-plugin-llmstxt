// src/generator.ts
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
}
