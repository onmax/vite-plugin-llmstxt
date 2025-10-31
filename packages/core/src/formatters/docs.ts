import type { FormatOptions, Formatter, PreparedFile } from '../formatter'
import { DEFAULT_TEMPLATE, expandTemplate } from '../template'

export class DocsFormatter implements Formatter {
  formatIndex(files: PreparedFile[], opts: FormatOptions): string {
    const title = opts.templateVars?.title || 'Documentation'
    const description = opts.templateVars?.description || 'Complete documentation'

    // Generate hierarchical TOC
    const toc = this.generateTOC(files, opts)

    const template = opts.templateVars?.template || DEFAULT_TEMPLATE
    const variables = {
      title,
      description,
      details: opts.templateVars?.details,
      toc,
      ...opts.templateVars,
    }

    return expandTemplate(template, variables)
  }

  formatFull(files: PreparedFile[], _opts: FormatOptions): string {
    const parts: string[] = []

    files.forEach((file, idx) => {
      // Add section header
      parts.push(`\n---\n\n# ${file.title}\n`)
      if (file.description) {
        parts.push(`> ${file.description}\n`)
      }

      parts.push(file.content)

      if (idx < files.length - 1) {
        parts.push('\n')
      }
    })

    return parts.join('\n')
  }

  formatIndividual(file: PreparedFile, opts: FormatOptions): string {
    const parts: string[] = []

    // Add frontmatter
    const url = this.formatUrl(file.path, opts)
    parts.push('---')
    parts.push(`url: ${url}`)
    parts.push(`title: ${file.title}`)
    if (file.description) {
      parts.push(`description: ${file.description}`)
    }
    parts.push('---\n')

    // Add content
    parts.push(file.content)

    return parts.join('\n')
  }

  private generateTOC(files: PreparedFile[], opts: FormatOptions): string {
    // Group by directory structure
    const grouped = new Map<string, PreparedFile[]>()

    files.forEach((file) => {
      const dir = file.path.includes('/') ? file.path.split('/')[0] : 'root'
      if (!grouped.has(dir)) {
        grouped.set(dir, [])
      }
      grouped.get(dir)!.push(file)
    })

    const parts: string[] = []

    grouped.forEach((groupFiles, dir) => {
      if (dir !== 'root' && grouped.size > 1) {
        parts.push(`\n### ${dir}\n`)
      }

      groupFiles.forEach((file) => {
        const url = this.formatUrl(file.path, opts)
        const desc = file.description || ''
        parts.push(`- [${file.title}](${url})${desc ? `: ${desc}` : ''}`)
      })
    })

    return parts.join('\n')
  }

  private formatUrl(path: string, opts: FormatOptions): string {
    let url = path

    // Convert .md to .html or custom extension
    if (opts.linksExtension) {
      url = url.replace(/\.md$/, opts.linksExtension)
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

    return url
  }
}
