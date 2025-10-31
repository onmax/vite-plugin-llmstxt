import type { ProcessContext, Processor } from '../processor'

export interface ImageUrlsProcessorOptions {
  imageMap?: Map<string, string>
  baseUrl?: string
}

export class ImageUrlsProcessor implements Processor {
  name = 'image-urls'

  constructor(private options: ImageUrlsProcessorOptions = {}) {}

  async process(content: string, _ctx: ProcessContext): Promise<string> {
    if (!this.options.imageMap || this.options.imageMap.size === 0) {
      return content
    }

    let result = content

    // Replace image references with mapped URLs
    this.options.imageMap.forEach((mappedUrl, originalName) => {
      const patterns = [
        new RegExp(`!\\[([^\\]]*)\\]\\(([^)]*)${originalName}\\)`, 'g'),
        new RegExp(`src=["']([^"']*?)${originalName}["']`, 'g'),
      ]

      patterns.forEach((pattern) => {
        result = result.replace(pattern, (match, ...groups) => {
          if (match.startsWith('![')) {
            return `![${groups[0]}](${this.options.baseUrl || ''}${mappedUrl})`
          }
          return `src="${this.options.baseUrl || ''}${mappedUrl}"`
        })
      })
    })

    return result
  }
}
