import { resolve } from 'pathe'
import { describe, expect, it } from 'vitest'
import { VitePressScanner } from '../../src/scanners/vitepress'

describe('vitePressScanner', () => {
  it('scans VitePress docs directory', async () => {
    const scanner = new VitePressScanner()
    const fixturesDir = resolve(__dirname, '../fixtures/mock-vitepress/docs')
    const files = await scanner.scan(fixturesDir)

    expect(files.length).toBeGreaterThan(0)
    expect(files.some(f => f.path.includes('index.md'))).toBe(true)
    expect(files.some(f => f.path.includes('guide/getting-started.md'))).toBe(true)
  })

  it('scans nested directories', async () => {
    const scanner = new VitePressScanner()
    const fixturesDir = resolve(__dirname, '../fixtures/mock-vitepress/docs')
    const files = await scanner.scan(fixturesDir)

    expect(files.some(f => f.path.includes('api/index.md'))).toBe(true)
    expect(files.some(f => f.path.includes('examples/basic.md'))).toBe(true)
  })

  it('returns correct watch patterns', () => {
    const scanner = new VitePressScanner()
    const patterns = scanner.watchPatterns()

    expect(patterns).toContain('**/*.md')
  })

  it('includes blog posts in scan', async () => {
    const scanner = new VitePressScanner()
    const fixturesDir = resolve(__dirname, '../fixtures/mock-vitepress/docs')
    const files = await scanner.scan(fixturesDir)

    expect(files.some(f => f.path.includes('blog/post-1.md'))).toBe(true)
  })

  it('reads file content correctly', async () => {
    const scanner = new VitePressScanner()
    const fixturesDir = resolve(__dirname, '../fixtures/mock-vitepress/docs')
    const files = await scanner.scan(fixturesDir)
    const gettingStartedFile = files.find(f => f.path.includes('getting-started.md'))

    expect(gettingStartedFile).toBeDefined()
    expect(gettingStartedFile?.content).toContain('Getting Started')
  })
})
