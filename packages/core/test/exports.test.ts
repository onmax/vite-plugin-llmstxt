import { describe, expect, it } from 'vitest'
import * as exports from '../src/index'

describe('core exports', () => {
  it('exports formatters', () => {
    expect(exports.DocsFormatter).toBeDefined()
    expect(exports.TutorialFormatter).toBeDefined()
  })

  it('exports processors', () => {
    expect(exports.ContentTagsProcessor).toBeDefined()
    expect(exports.FrontmatterProcessor).toBeDefined()
    expect(exports.HintsProcessor).toBeDefined()
    expect(exports.ImageUrlsProcessor).toBeDefined()
    expect(exports.MdreamProcessor).toBeDefined()
    expect(exports.SnippetsProcessor).toBeDefined()
    expect(exports.ProcessorPipeline).toBeDefined()
  })

  it('exports utilities', () => {
    expect(exports.getDirectoriesAtDepths).toBeDefined()
    expect(exports.shouldIgnoreFile).toBeDefined()
    expect(exports.expandTemplate).toBeDefined()
    expect(exports.DEFAULT_TEMPLATE).toBeDefined()
  })
})
