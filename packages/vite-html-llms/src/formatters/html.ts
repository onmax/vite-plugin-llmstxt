import type { FormatOptions, Formatter, PreparedFile } from '../types'

export class HtmlFormatter implements Formatter {
  formatIndex(files: PreparedFile[], opts: FormatOptions): string {
    const title = opts.title || 'Available Pages'
    const description = opts.description || 'LLM-optimized content index'

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
    const title = opts.title || 'Full Content'
    const description = opts.description || 'Complete LLM-optimized content'

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
}
