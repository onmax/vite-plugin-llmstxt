import { describe, expect, it } from 'vitest'
import * as exports from '../src/index'

describe('vitepress exports', () => {
  it('exports preset creator', () => {
    expect(exports.createVitePressPreset).toBeDefined()
  })

  it('exports scanner', () => {
    expect(exports.VitePressScanner).toBeDefined()
  })
})
