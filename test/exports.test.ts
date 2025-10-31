import { describe, expect, it } from 'vitest'
import * as exports from '../src/index'

describe('package exports', () => {
  it('exports main plugin', () => {
    expect(exports.llmsPlugin).toBeDefined()
    expect(typeof exports.llmsPlugin).toBe('function')
  })

  it('exports presets', () => {
    expect(exports.createTutorialKitPreset).toBeDefined()
    expect(exports.createVitePressPreset).toBeDefined()
  })

  it('exports scanners', () => {
    expect(exports.TutorialKitScanner).toBeDefined()
    expect(exports.VitePressScanner).toBeDefined()
  })

  it('exports processors', () => {
    expect(exports.ContentTagsProcessor).toBeDefined()
    expect(exports.FrontmatterProcessor).toBeDefined()
    expect(exports.HintsProcessor).toBeDefined()
    expect(exports.ImageUrlsProcessor).toBeDefined()
    expect(exports.MdreamProcessor).toBeDefined()
    expect(exports.SnippetsProcessor).toBeDefined()
  })

  it('exports formatters', () => {
    expect(exports.TutorialFormatter).toBeDefined()
    expect(exports.DocsFormatter).toBeDefined()
  })

  it('exports core utilities', () => {
    expect(exports.ProcessorPipeline).toBeDefined()
    expect(exports.expandTemplate).toBeDefined()
    expect(exports.DEFAULT_TEMPLATE).toBeDefined()
    expect(exports.shouldIgnoreFile).toBeDefined()
    expect(exports.getDirectoriesAtDepths).toBeDefined()
  })
})
