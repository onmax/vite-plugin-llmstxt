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
      // Remove <llm-only> tags but keep the content
      result = result.replace(/<llm-only>([\s\S]*?)<\/llm-only>/g, '$1')
    }

    if (this.options.handleLLMExclude) {
      // Strip content between <llm-exclude> and </llm-exclude> (remove content)
      result = result.replace(/<llm-exclude>([\s\S]*?)<\/llm-exclude>/g, '')
    }

    return result
  }
}
