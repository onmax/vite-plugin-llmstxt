import type { ProcessContext, Processor } from '../processor'
import { htmlToMarkdown } from 'mdream'
import { withMinimalPreset } from 'mdream/preset/minimal'

export interface MdreamProcessorOptions {
  origin?: string
  stripHTML?: boolean
  useMinimalPreset?: boolean
}

export class MdreamProcessor implements Processor {
  name = 'mdream'

  constructor(private options: MdreamProcessorOptions = {}) {}

  async process(content: string, _ctx: ProcessContext): Promise<string> {
    if (!this.options.stripHTML) {
      return content
    }

    const mdreamOptions = this.options.useMinimalPreset
      ? withMinimalPreset({ origin: this.options.origin })
      : { origin: this.options.origin }

    return htmlToMarkdown(content, mdreamOptions)
  }
}
