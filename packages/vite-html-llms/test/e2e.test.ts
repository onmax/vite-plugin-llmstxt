import { readFile } from 'node:fs/promises'
import { join, resolve } from 'pathe'
import { build } from 'vite'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

describe('e2e: html-basic playground', () => {
  const playgroundDir = resolve(__dirname, '../../../playground/html-basic')
  const fixturesDir = resolve(__dirname, '../../../test/fixtures/html-basic')
  let buildOutput: string

  beforeAll(async () => {
    // Build the playground
    await build({
      root: playgroundDir,
      logLevel: 'silent',
    })
    buildOutput = join(playgroundDir, 'dist')
  })

  afterAll(async () => {
    // Cleanup could go here if needed
  })

  it('generates llms.txt matching fixture', async () => {
    const generated = await readFile(join(buildOutput, 'llms.txt'), 'utf-8')
    const expected = await readFile(join(fixturesDir, 'llms.txt'), 'utf-8')

    expect(generated.trim()).toBe(expected.trim())
  })

  it('generates llms-full.txt matching fixture', async () => {
    const generated = await readFile(join(buildOutput, 'llms-full.txt'), 'utf-8')
    const expected = await readFile(join(fixturesDir, 'llms-full.txt'), 'utf-8')

    expect(generated.trim()).toBe(expected.trim())
  })
})
