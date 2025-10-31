import type { ProcessContext, Processor } from '../processor'

export interface ContentTagsProcessorOptions {
  handleLLMOnly?: boolean
  handleLLMExclude?: boolean
}

export class ContentTagsProcessor implements Processor {
  name = 'content-tags'

  constructor(private options: ContentTagsProcessorOptions = { handleLLMOnly: true, handleLLMExclude: true }) {}

  async process(content: string, _ctx: ProcessContext): Promise<string> {
    let result = content

    if (this.options.handleLLMOnly) {
      // Strip content between <llm-only> and </llm-only> (remove content)
      result = result.replace(/<llm-only>([\s\S]*?)<\/llm-only>/g, '')
    }

    if (this.options.handleLLMExclude) {
      // Remove <llm-exclude> tags but keep the content
      result = result.replace(/<llm-exclude>([\s\S]*?)<\/llm-exclude>/g, '$1')
    }

    return result
  }
}
