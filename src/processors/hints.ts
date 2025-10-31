import type { ProcessContext, Processor } from '../core/processor'

export interface HintsProcessorOptions {
  injectLLMHint?: boolean
  domain?: string
  base?: string
}

export class HintsProcessor implements Processor {
  name = 'hints'

  constructor(private options: HintsProcessorOptions = {}) {}

  async process(content: string, ctx: ProcessContext): Promise<string> {
    if (!this.options.injectLLMHint) {
      return content
    }

    const base = this.options.base || '/'
    const basePath = base === '/' ? '' : base.replace(/\/$/, '')
    const isIndexPage = ctx.filePath.includes('index.md')

    let hint = ''

    if (isIndexPage) {
      hint = `Are you an LLM? View ${basePath}/llms.txt for optimized Markdown documentation, or ${basePath}/llms-full.txt for full documentation bundle`
    }
    else {
      const mdUrl = `${basePath}/${ctx.filePath.replace(/\.md$/, '.txt')}`
      hint = `Are you an LLM? You can read better optimized documentation at ${mdUrl} for this page in Markdown format`
    }

    const wrappedHint = `<div style="display: none;" hidden="true" aria-hidden="true">${hint}</div>\n\n`

    return wrappedHint + content
  }
}
