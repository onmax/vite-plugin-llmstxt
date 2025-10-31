import type { FormatOptions, Formatter, PreparedFile } from '../core/formatter'
import { DEFAULT_TEMPLATE, expandTemplate } from '../core/template'

export class TutorialFormatter implements Formatter {
  formatIndex(files: PreparedFile[], opts: FormatOptions): string {
    const title = opts.templateVars?.title || 'Tutorials'
    const description = opts.templateVars?.description || 'Learn through interactive tutorials.'

    // Generate TOC
    const toc = files.map((file) => {
      const url = this.formatUrl(file.path, opts)
      const desc = file.description || file.title
      return `- [${file.title}](${url}): ${desc}`
    }).join('\n')

    // Use template if provided
    const template = opts.templateVars?.template || DEFAULT_TEMPLATE
    const variables = {
      title,
      description,
      details: opts.templateVars?.details,
      toc,
      ...opts.templateVars,
    }

    let result = expandTemplate(template, variables)

    // Add full documentation link if not in template
    if (!result.includes('llms-full.txt')) {
      result += '\n\n## Complete Documentation\n\n- [All Tutorials](/llms-full.txt): Full combined documentation'
    }

    return result
  }

  formatFull(files: PreparedFile[], _opts: FormatOptions): string {
    return files.map((file, idx) =>
      idx < files.length - 1
        ? `${file.content}\n========================================\n`
        : file.content,
    ).join('\n')
  }

  formatIndividual(file: PreparedFile, opts: FormatOptions): string {
    const parts: string[] = []

    // Add frontmatter
    const url = this.formatUrl(file.path, opts)
    parts.push('---')
    parts.push(`url: ${url}`)
    if (file.description) {
      parts.push(`description: ${file.description}`)
    }
    parts.push('---\n')

    // Add content
    parts.push(file.content)

    return parts.join('\n')
  }

  private formatUrl(path: string, opts: FormatOptions): string {
    let url = path

    // Handle directory filter
    if (opts.directoryFilter && opts.directoryFilter !== '.') {
      url = `${opts.directoryFilter}/${url}`
    }

    // Add domain if provided
    if (opts.domain) {
      url = `${opts.domain}/${url}`
    }
    else {
      url = `/${url}`
    }

    // Handle base path
    if (opts.base && opts.base !== '/') {
      const base = opts.base.replace(/\/$/, '')
      url = url.replace(/^\//, `${base}/`)
    }

    // Handle link extension
    if (opts.linksExtension) {
      url = url.replace(/\.txt$/, opts.linksExtension)
    }

    return url
  }
}
