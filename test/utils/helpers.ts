import { mkdtemp, rm, writeFile } from 'fs/promises'
import { tmpdir } from 'os'
import { join } from 'pathe'

export interface TestContext {
  tempDir: string
  cleanup: () => Promise<void>
}

export async function createTempTestDir(): Promise<TestContext> {
  const tempDir = await mkdtemp(join(tmpdir(), 'llms-test-'))
  
  return {
    tempDir,
    cleanup: async () => {
      await rm(tempDir, { recursive: true, force: true })
    },
  }
}

export interface MockTutorial {
  slug: string
  title: string
  description?: string
  lessons: Array<{
    slug: string
    title: string
    content: string
    solutionFiles?: Record<string, string>
  }>
}

export async function createMockTutorial(baseDir: string, tutorial: MockTutorial) {
  const tutorialDir = join(baseDir, `0-${tutorial.slug}`)
  
  // Create meta.md
  const metaContent = `---
type: part
title: ${tutorial.title}
${tutorial.description ? `description: ${tutorial.description}` : ''}
---`
  
  await writeFile(join(tutorialDir, 'meta.md'), metaContent, 'utf-8')
  
  // Create lessons
  for (let i = 0; i < tutorial.lessons.length; i++) {
    const lesson = tutorial.lessons[i]
    const lessonDir = join(tutorialDir, `${i + 1}-${lesson.slug}`)
    
    // Create content.md
    await writeFile(
      join(lessonDir, 'content.md'),
      `# ${lesson.title}\n\n${lesson.content}`,
      'utf-8',
    )
    
    // Create solution files
    if (lesson.solutionFiles) {
      const solutionDir = join(lessonDir, '_solution')
      for (const [filename, content] of Object.entries(lesson.solutionFiles)) {
        await writeFile(join(solutionDir, filename), content, 'utf-8')
      }
    }
  }
}

export interface MockVitePressDoc {
  path: string
  title: string
  content: string
  frontmatter?: Record<string, any>
}

export async function createMockVitePressDoc(baseDir: string, doc: MockVitePressDoc) {
  const filePath = join(baseDir, doc.path)
  
  let content = ''
  
  if (doc.frontmatter) {
    content += '---\n'
    for (const [key, value] of Object.entries(doc.frontmatter)) {
      content += `${key}: ${value}\n`
    }
    content += '---\n\n'
  }
  
  content += `# ${doc.title}\n\n${doc.content}`
  
  await writeFile(filePath, content, 'utf-8')
}

export function stripAnsi(str: string): string {
  return str.replace(/\x1b\[[0-9;]*m/g, '')
}

export function normalizeLineEndings(str: string): string {
  return str.replace(/\r\n/g, '\n')
}
