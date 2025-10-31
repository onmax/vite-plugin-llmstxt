import type { ProcessContext, Processor } from '../core/processor'
import { readFile } from 'fs/promises'
import { join } from 'pathe'

export interface SnippetsProcessorOptions {
  baseDir?: string
}

export class SnippetsProcessor implements Processor {
  name = 'snippets'

  constructor(private options: SnippetsProcessorOptions = {}) {}

  async process(content: string, ctx: ProcessContext): Promise<string> {
    const baseDir = this.options.baseDir || ctx.contentDir
    const snippetRegex = /<!--@include:\s*(.+?)-->/g
    let result = content
    const matches = content.matchAll(snippetRegex)

    for (const match of matches) {
      const snippetPath = match[1].trim()
      try {
        const fullPath = join(baseDir, snippetPath)
        const snippetContent = await readFile(fullPath, 'utf-8')
        result = result.replace(match[0], snippetContent)
      }
      catch (err) {
        // Keep original if file not found
        console.warn(`Failed to include snippet: ${snippetPath}`)
      }
    }

    return result
  }
}
