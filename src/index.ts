// Depth utilities
export { getDirectoriesAtDepths } from './core/depth'

export type { DirectoryLevel } from './core/depth'

// Filter utilities
export { shouldIgnoreFile } from './core/filter'
export type { FileFilter } from './core/filter'
// Core interfaces
export type { ProcessContext, Processor } from './core/processor'

export { ProcessorPipeline } from './core/processor'
export type { RawFile, Scanner } from './core/scanner'

// Template utilities
export { DEFAULT_TEMPLATE, expandTemplate } from './core/template'
export type { TemplateVariables } from './core/template'

// Formatters
export { DocsFormatter } from './formatters/docs'
export { TutorialFormatter } from './formatters/tutorial'
// Main plugin
export { llmsPlugin } from './plugin'
// Presets
export { createTutorialKitPreset } from './presets/tutorialkit'
export { createVitePressPreset } from './presets/vitepress'
// Processors
export { ContentTagsProcessor } from './processors/content-tags'

export { FrontmatterProcessor } from './processors/frontmatter'
export { HintsProcessor } from './processors/hints'

export { ImageUrlsProcessor } from './processors/image-urls'
export { MdreamProcessor } from './processors/mdream'

export { SnippetsProcessor } from './processors/snippets'
// Scanners
export { TutorialKitScanner } from './scanners/tutorialkit'

export { VitePressScanner } from './scanners/vitepress'
// Types
export type {
  FormatOptions,
  Formatter,
  LLMPlugin,
  LLMPluginOptions,
  PreparedFile,
  Preset,
  ProcessorConfig,
} from './types'
