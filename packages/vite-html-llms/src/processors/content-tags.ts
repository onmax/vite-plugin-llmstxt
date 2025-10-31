import type { ProcessContext, Processor } from '../types'

export class ContentTagsProcessor implements Processor {
  process(content: string, _ctx: ProcessContext): string {
    const llmOnlyRegex = /<llm-only>([\s\S]*?)<\/llm-only>/g
    const llmExcludeRegex = /<llm-exclude>[\s\S]*?<\/llm-exclude>/g

    let result = content.replace(llmOnlyRegex, '$1')
    result = result.replace(llmExcludeRegex, '')

    return result
  }
}
