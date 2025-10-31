import type { ProcessContext, Processor } from '../types'
import matter from 'gray-matter'

export class FrontmatterProcessor implements Processor {
  process(content: string, _ctx: ProcessContext): string {
    const { content: stripped } = matter(content)
    return stripped
  }
}
