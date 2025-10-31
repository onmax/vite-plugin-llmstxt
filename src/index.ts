// Main plugin
export { llmsPlugin } from './plugin'

// Types
export type {
  Formatter,
  FormatOptions,
  LLMPlugin,
  LLMPluginOptions,
  Preset,
  PreparedFile,
  ProcessorConfig,
} from './types'

// Core interfaces
export type { Processor, ProcessContext } from './core/processor'
export type { RawFile, Scanner } from './core/scanner'
export { ProcessorPipeline } from './core/processor'

// Presets
export { createTutorialKitPreset } from './presets/tutorialkit'
export { createVitePressPreset } from './presets/vitepress'

// Scanners
export { TutorialKitScanner } from './scanners/tutorialkit'
export { VitePressScanner } from './scanners/vitepress'

// Processors
export { ContentTagsProcessor } from './processors/content-tags'
export { FrontmatterProcessor } from './processors/frontmatter'
export { HintsProcessor } from './processors/hints'
export { ImageUrlsProcessor } from './processors/image-urls'
export { MdreamProcessor } from './processors/mdream'
export { SnippetsProcessor } from './processors/snippets'

// Formatters
export { DocsFormatter } from './formatters/docs'
export { TutorialFormatter } from './formatters/tutorial'

// Template utilities
export { DEFAULT_TEMPLATE, expandTemplate } from './core/template'
export type { TemplateVariables } from './core/template'

// Filter utilities
export { shouldIgnoreFile } from './core/filter'
export type { FileFilter } from './core/filter'

// Depth utilities
export { getDirectoriesAtDepths } from './core/depth'
export type { DirectoryLevel } from './core/depth'
