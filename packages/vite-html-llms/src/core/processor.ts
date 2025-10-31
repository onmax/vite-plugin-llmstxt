import type { ProcessContext, Processor } from '../types'

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
}
