export { shouldExcludeFile, UNNECESSARY_PATTERNS } from './core/filter'
export { HtmlFormatter } from './formatters/html'
export { htmlLlms } from './plugin'
export type { FilterOptions, FormatOptions, MdreamWrapperOptions, PreparedFile } from './types'

// Re-export from core
export { ContentTagsProcessor, FrontmatterProcessor, MdreamProcessor, ProcessorPipeline } from '@vite-plugin-llmstxt/core'
export type { Formatter, ProcessContext, Processor } from '@vite-plugin-llmstxt/core'
