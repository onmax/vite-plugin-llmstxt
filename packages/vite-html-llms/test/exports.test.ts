import { describe, expect, it } from 'vitest'
import * as exports from '../src/index'

describe('vite-html-llms exports', () => {
  it('exports plugin', () => {
    expect(exports.htmlLlms).toBeDefined()
  })

  it('exports formatter', () => {
    expect(exports.HtmlFormatter).toBeDefined()
  })

  it('exports filter utilities', () => {
    expect(exports.UNNECESSARY_PATTERNS).toBeDefined()
    expect(exports.shouldExcludeFile).toBeDefined()
  })

  it('re-exports core processors', () => {
    expect(exports.ContentTagsProcessor).toBeDefined()
    expect(exports.FrontmatterProcessor).toBeDefined()
    expect(exports.MdreamProcessor).toBeDefined()
    expect(exports.ProcessorPipeline).toBeDefined()
  })
})
