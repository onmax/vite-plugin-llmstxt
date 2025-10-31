// src/types.ts
import type { Plugin } from 'vite'

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

export interface Adapter {
  scanTutorials(contentDir: string): Promise<Tutorial[]>
  watchPatterns(): string[]
}

export interface LLMPluginOptions {
  adapter?: Adapter
  contentDir?: string
  outputDir?: string
}

export type LLMPlugin = (options?: LLMPluginOptions) => Plugin
