export interface PreparedFile {
  path: string
  title: string
  content: string
  description?: string
  metadata?: Record<string, any>
}

export interface FormatOptions {
  domain?: string
  base?: string
  linksExtension?: string
  directoryFilter?: string
  templateVars?: Record<string, string>
  [key: string]: any
}

export interface Formatter {
  formatIndex(files: PreparedFile[], opts: FormatOptions): string
  formatFull(files: PreparedFile[], opts: FormatOptions): string
  formatIndividual(file: PreparedFile, opts: FormatOptions): string
}
