export interface ProcessContext {
  filePath: string
  contentDir: string
  metadata?: Record<string, any>
  [key: string]: any
}

export interface Processor {
  name: string
  process(content: string, ctx: ProcessContext): Promise<string>
}

export class ProcessorPipeline {
  private processors: Processor[] = []

  use(processor: Processor): this {
    this.processors.push(processor)
    return this
  }

  async process(content: string, ctx: ProcessContext): Promise<string> {
    let result = content
    for (const processor of this.processors) {
      result = await processor.process(result, ctx)
    }
    return result
  }

  getProcessors(): Processor[] {
    return [...this.processors]
  }
}
