import type { Plugin } from 'vite'

export interface ProcessContext {
  filePath: string
  relativePath: string
}

export interface Processor {
  process: (content: string, ctx: ProcessContext) => Promise<string> | string
}

export interface PreparedFile {
  path: string
  content: string
}

export interface FormatOptions {
  title?: string
  description?: string
}

export interface Formatter {
  formatIndex: (files: PreparedFile[], opts: FormatOptions) => string
  formatFull: (files: PreparedFile[], opts: FormatOptions) => string
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
  publicDir?: string
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
