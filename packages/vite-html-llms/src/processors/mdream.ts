import type { ProcessContext, Processor } from '../types'
import { htmlToMarkdown } from 'mdream'

export interface MdreamProcessorOptions {
  stripHTML?: boolean
  origin?: string
}

export class MdreamProcessor implements Processor {
  constructor(private options: MdreamProcessorOptions = {}) {
    this.options.stripHTML = options.stripHTML ?? true
  }

  async process(content: string, _ctx: ProcessContext): Promise<string> {
    if (!this.options.stripHTML) {
      return content
    }

    return htmlToMarkdown(content, { origin: this.options.origin })
  }
}
