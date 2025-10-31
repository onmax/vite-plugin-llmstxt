import type { Formatter, Processor, Scanner } from '@vite-plugin-llmstxt/core'

export interface Preset {
  scanner: Scanner
  processors: Processor[]
  formatter: Formatter
  template?: string
  defaults?: Record<string, any>
}
