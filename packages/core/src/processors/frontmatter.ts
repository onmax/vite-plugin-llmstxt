import type { ProcessContext, Processor } from '../processor'
import matter from 'gray-matter'

export interface FrontmatterProcessorOptions {
  extract?: boolean
  inject?: boolean
}

export class FrontmatterProcessor implements Processor {
  name = 'frontmatter'

  constructor(private options: FrontmatterProcessorOptions = { extract: true }) {}

  async process(content: string, ctx: ProcessContext): Promise<string> {
    if (this.options.extract) {
      const parsed = matter(content)

      // Store frontmatter in context
      if (parsed.data && Object.keys(parsed.data).length > 0) {
        ctx.metadata = { ...ctx.metadata, ...parsed.data }
      }

      return parsed.content
    }

    return content
  }
}
