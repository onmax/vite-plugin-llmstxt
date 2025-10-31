import type { Plugin } from 'vite'
import type { Formatter } from './core/formatter'
import type { Processor } from './core/processor'
import type { Scanner } from './core/scanner'

// Legacy types (for backward compat during migration)
export interface Lesson {
  slug: string
  title: string
  content: string
  solutionFiles: Map<string, string>
}

export interface Tutorial {
  slug: string
  title: string
  description?: string
  lessons: Lesson[]
}

// New composable architecture
export interface Preset {
  scanner: Scanner
  processors: Processor[]
  formatter: Formatter
  template?: string
  defaults?: Partial<LLMPluginOptions>
}

export interface ProcessorConfig {
  mode: 'replace' | 'append'
  list: Processor[]
}

export interface LLMPluginOptions {
  // Preset (provides defaults for everything)
  preset?: Preset | 'tutorialkit' | 'vitepress' | 'auto'

  // Override preset pieces
  scanner?: Scanner
  processors?: Processor[] | ProcessorConfig
  formatter?: Formatter

  // Content discovery
  contentDir?: string
  outputDir?: string
  workDir?: string

  // Filtering
  ignoreFiles?: string[]
  excludeUnnecessaryFiles?: boolean
  excludeIndexPage?: boolean
  excludeBlog?: boolean
  excludeTeam?: boolean

  // Processing
  stripHTML?: boolean
  injectLLMHint?: boolean
  handleContentTags?: boolean

  // Output control
  domain?: string
  generateIndex?: boolean
  generateFull?: boolean
  generateIndividual?: boolean

  // Template system
  template?: string
  templateVars?: Record<string, string>
  title?: string
  description?: string
  details?: string

  // VitePress features
  sidebar?: any

  // Advanced
  experimental?: {
    depth?: number
  }
}

export type LLMPlugin = (options?: LLMPluginOptions) => Plugin
