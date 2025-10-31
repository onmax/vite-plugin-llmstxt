export interface RawFile {
  path: string
  content: string
  metadata?: Record<string, any>
}

export interface Scanner {
  scan(contentDir: string): Promise<RawFile[]>
  watchPatterns(): string[]
}
