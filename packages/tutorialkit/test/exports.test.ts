import { describe, expect, it } from 'vitest'
import * as exports from '../src/index'

describe('tutorialkit exports', () => {
  it('exports preset creator', () => {
    expect(exports.createTutorialKitPreset).toBeDefined()
  })

  it('exports scanner', () => {
    expect(exports.TutorialKitScanner).toBeDefined()
  })
})
