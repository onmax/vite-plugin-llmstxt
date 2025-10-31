import type { Formatter, Processor } from '@vite-plugin-llmstxt/core'
import type { Plugin } from 'vite'

export interface PreparedFile {
  path: string
  content: string
}

export interface FormatOptions {
  title?: string
  description?: string
}

export interface FilterOptions {
  include?: string[]
  exclude?: string[]
  excludeUnnecessaryFiles?: boolean
  excludeConfig?: boolean
  excludeTests?: boolean
  excludeDocs?: boolean
  excludeBlog?: boolean
}

export interface MdreamWrapperOptions {
  outputDir?: string
  indexFile?: string
  fullFile?: string
  template?: string
  filter?: FilterOptions
  processors?: Processor[]
  formatter?: Formatter
  title?: string
  description?: string
  experimental?: {
    depth?: number
  }
}

export type MdreamWrapper = (options?: MdreamWrapperOptions) => Plugin[]
