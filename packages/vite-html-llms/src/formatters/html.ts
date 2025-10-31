import type { FormatOptions, Formatter, PreparedFile } from '@vite-plugin-llmstxt/core'

interface HtmlFormatOptions extends FormatOptions {
  title?: string
  description?: string
}

export class HtmlFormatter implements Formatter {
  formatIndex(files: PreparedFile[], opts: FormatOptions): string {
    const htmlOpts = opts as HtmlFormatOptions
    const title = htmlOpts.title || 'Available Pages'
    const description = htmlOpts.description || 'LLM-optimized content index'

    const sections = [
      `# ${title}`,
      '',
      description,
      '',
      '## Pages',
      '',
      ...files.map(f => `- ${f.path}`),
    ]

    return sections.join('\n')
  }

  formatFull(files: PreparedFile[], opts: FormatOptions): string {
    const htmlOpts = opts as HtmlFormatOptions
    const title = htmlOpts.title || 'Full Content'
    const description = htmlOpts.description || 'Complete LLM-optimized content'

    const sections = [
      `# ${title}`,
      '',
      description,
      '',
    ]

    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      sections.push(`## ${file.path}`)
      sections.push('')
      sections.push(file.content)
      if (i < files.length - 1) {
        sections.push('')
        sections.push('========================================')
        sections.push('')
      }
    }

    return sections.join('\n')
  }

  formatIndividual(file: PreparedFile, _opts: FormatOptions): string {
    return `# ${file.title}\n\n${file.content}`
  }
}
