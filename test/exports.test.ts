import { describe, expect, it } from 'vitest'
import * as exports from '../src/index'

describe('exports', () => {
  it('exports llmsPlugin', () => {
    expect(exports.llmsPlugin).toBeDefined()
  })

  it('exports core utilities', () => {
    expect(exports.ProcessorPipeline).toBeDefined()
    expect(exports.DocsFormatter).toBeDefined()
    expect(exports.TutorialFormatter).toBeDefined()
  })

  it('exports processors', () => {
    expect(exports.ContentTagsProcessor).toBeDefined()
    expect(exports.FrontmatterProcessor).toBeDefined()
    expect(exports.MdreamProcessor).toBeDefined()
  })

  it('exports scanners', () => {
    expect(exports.TutorialKitScanner).toBeDefined()
    expect(exports.VitePressScanner).toBeDefined()
  })

  it('exports preset creators', () => {
    expect(exports.createTutorialKitPreset).toBeDefined()
    expect(exports.createVitePressPreset).toBeDefined()
  })
})
