import { exec } from 'node:child_process'
import { readFile } from 'node:fs/promises'
import { promisify } from 'node:util'
import { join, resolve } from 'pathe'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

const execAsync = promisify(exec)

describe('e2e: vitepress-basic playground', () => {
  const playgroundDir = resolve(__dirname, '../playground/vitepress-basic')
  const fixturesDir = resolve(__dirname, './fixtures/vitepress-basic')

  beforeAll(async () => {
    // Build the playground - generates files in dist/
    await execAsync('bash -c "source ~/.bashrc && fnm use 24 && pnpm run build"', {
      cwd: playgroundDir,
    })
  })

  afterAll(async () => {
    // Cleanup could go here if needed
  })

  it('generates llms.txt matching fixture', async () => {
    const generated = await readFile(join(playgroundDir, 'dist/llms.txt'), 'utf-8')
    const expected = await readFile(join(fixturesDir, 'llms.txt'), 'utf-8')

    expect(generated.trim()).toBe(expected.trim())
  })

  it('generates llms-full.txt matching fixture', async () => {
    const generated = await readFile(join(playgroundDir, 'dist/llms-full.txt'), 'utf-8')
    const expected = await readFile(join(fixturesDir, 'llms-full.txt'), 'utf-8')

    expect(generated.trim()).toBe(expected.trim())
  })
})
