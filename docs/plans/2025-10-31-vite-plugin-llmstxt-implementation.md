# vite-plugin-llmstxt Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build reusable Vite plugin to generate llms.txt files from TutorialKit content

**Architecture:** Adapter pattern for content discovery, generic generator for file creation, Vite plugin for build integration

**Tech Stack:** TypeScript, Vite, Vitest, tsup (from antfu/starter-ts)

---

## Task 1: Project Setup

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `.gitignore`
- Create: `README.md`

**Step 1: Initialize from starter-ts template**

```bash
cd /home/maxi/personal/tutorial-kit-llms
npx degit antfu/starter-ts .
```

**Step 2: Update package.json**

```json
{
  "name": "vite-plugin-llmstxt",
  "version": "0.1.0",
  "description": "Vite plugin to generate llms.txt files from tutorial content",
  "type": "module",
  "keywords": ["vite", "plugin", "llms", "tutorialkit", "llms.txt"],
  "author": "Your Name",
  "license": "MIT",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.js"
    },
    "./adapters/tutorialkit": {
      "types": "./dist/adapters/tutorialkit.d.ts",
      "import": "./dist/adapters/tutorialkit.js"
    }
  },
  "files": ["dist"],
  "scripts": {
    "build": "tsup",
    "dev": "tsup --watch",
    "test": "vitest",
    "lint": "eslint .",
    "typecheck": "tsc --noEmit"
  },
  "dependencies": {
    "vite": "^5.0.0"
  },
  "devDependencies": {
    "@types/node": "^20.10.0",
    "typescript": "^5.3.0",
    "tsup": "^8.0.0",
    "vitest": "^1.0.0",
    "eslint": "^8.55.0"
  }
}
```

**Step 3: Install dependencies**

```bash
ni
```

Expected: Dependencies installed successfully

**Step 4: Create directory structure**

```bash
mkdir -p src/adapters test/fixtures playground
```

**Step 5: Commit**

```bash
git init
git add .
git commit -m "init: project setup"
```

---

## Task 2: Type Definitions

**Files:**
- Create: `src/types.ts`

**Step 1: Write types file**

```typescript
// src/types.ts
import type { Plugin } from 'vite'

export interface Lesson {
  slug: string
  title: string
  content: string
  solutionFiles: Map<string, string>
}

export interface Tutorial {
  slug: string
  title: string
  description?: string
  lessons: Lesson[]
}

export interface Adapter {
  scanTutorials: (contentDir: string) => Promise<Tutorial[]>
  watchPatterns: () => string[]
}

export interface LLMPluginOptions {
  adapter?: Adapter
  contentDir?: string
  outputDir?: string
}

export type LLMPlugin = (options?: LLMPluginOptions) => Plugin
```

**Step 2: Verify types compile**

```bash
tp
```

Expected: No type errors

**Step 3: Commit**

```bash
git add src/types.ts
git commit -m "feat: add type definitions"
```

---

## Task 3: Base Adapter Interface

**Files:**
- Create: `src/adapters/base.ts`

**Step 1: Create base adapter export**

```typescript
// src/adapters/base.ts
export type { Adapter, Lesson, Tutorial } from '../types'
```

**Step 2: Verify types compile**

```bash
tp
```

Expected: No type errors

**Step 3: Commit**

```bash
git add src/adapters/base.ts
git commit -m "feat: add base adapter interface"
```

---

## Task 4: Generator Core (TDD - Test First)

**Files:**
- Create: `test/generator.test.ts`
- Create: `src/generator.ts`

**Step 1: Write failing test**

```typescript
import type { Tutorial } from '../src/types'
// test/generator.test.ts
import { describe, expect, it } from 'vitest'
import { LLMGenerator } from '../src/generator'

describe('LLMGenerator', () => {
  it('generates tutorial file with lessons and solution code', () => {
    const tutorial: Tutorial = {
      slug: 'intro',
      title: 'Introduction',
      description: 'Getting started',
      lessons: [
        {
          slug: 'welcome',
          title: 'Welcome',
          content: '# Welcome\n\nHello world',
          solutionFiles: new Map([
            ['index.js', 'console.log("hello")'],
          ]),
        },
      ],
    }

    const generator = new LLMGenerator()
    const result = generator.generateTutorialFile(tutorial)

    expect(result).toContain('# Introduction')
    expect(result).toContain('> Getting started')
    expect(result).toContain('## Lesson 1: Welcome')
    expect(result).toContain('# Welcome\n\nHello world')
    expect(result).toContain('### Solution Code')
    expect(result).toContain('#### index.js')
    expect(result).toContain('```js\nconsole.log("hello")\n```')
  })
})
```

**Step 2: Run test to verify it fails**

```bash
nr test
```

Expected: FAIL - LLMGenerator not found

**Step 3: Write minimal implementation**

```typescript
// src/generator.ts
import type { Adapter, Tutorial } from './types'

export class LLMGenerator {
  constructor(private adapter?: Adapter) {}

  generateTutorialFile(tutorial: Tutorial): string {
    const parts: string[] = []

    // Header
    parts.push(`# ${tutorial.title}\n`)
    if (tutorial.description) {
      parts.push(`> ${tutorial.description}\n`)
    }

    // Lessons
    tutorial.lessons.forEach((lesson, idx) => {
      parts.push(`## Lesson ${idx + 1}: ${lesson.title}\n`)
      parts.push(`${lesson.content}\n`)

      // Solution files
      if (lesson.solutionFiles.size > 0) {
        parts.push('### Solution Code\n')
        lesson.solutionFiles.forEach((code, filename) => {
          const ext = filename.split('.').pop() || ''
          parts.push(`#### ${filename}\n`)
          parts.push(`\`\`\`${ext}\n${code}\n\`\`\`\n`)
        })
      }

      // Separator between lessons
      if (idx < tutorial.lessons.length - 1) {
        parts.push('---\n')
      }
    })

    return parts.join('\n')
  }
}
```

**Step 4: Run test to verify it passes**

```bash
nr test
```

Expected: PASS

**Step 5: Commit**

```bash
git add test/generator.test.ts src/generator.ts
git commit -m "feat: add tutorial file generator"
```

---

## Task 5: Root Index Generator (TDD)

**Files:**
- Modify: `test/generator.test.ts`
- Modify: `src/generator.ts`

**Step 1: Write failing test**

Add to `test/generator.test.ts`:

```typescript
it('generates root index with tutorial links', () => {
  const tutorials: Tutorial[] = [
    {
      slug: 'intro',
      title: 'Introduction',
      description: 'Getting started',
      lessons: [],
    },
    {
      slug: 'basics',
      title: 'Basics',
      description: 'Core concepts',
      lessons: [],
    },
  ]

  const generator = new LLMGenerator()
  const result = generator.generateRootIndex(tutorials)

  expect(result).toContain('# Tutorials')
  expect(result).toContain('[Introduction](/tutorial/intro.txt)')
  expect(result).toContain('[Basics](/tutorial/basics.txt)')
  expect(result).toContain('[All Tutorials](/llms-full.txt)')
})
```

**Step 2: Run test to verify it fails**

```bash
nr test
```

Expected: FAIL - generateRootIndex not found

**Step 3: Write minimal implementation**

Add to `src/generator.ts`:

```typescript
generateRootIndex(tutorials: Tutorial[]): string {
  const parts: string[] = []

  parts.push('# Tutorials\n')
  parts.push('Learn through interactive tutorials.\n')
  parts.push('## Available Tutorials\n')

  tutorials.forEach((tutorial) => {
    const desc = tutorial.description || tutorial.title
    parts.push(`- [${tutorial.title}](/tutorial/${tutorial.slug}.txt): ${desc}`)
  })

  parts.push('\n## Complete Documentation\n')
  parts.push('- [All Tutorials](/llms-full.txt): Full combined documentation')

  return parts.join('\n')
}
```

**Step 4: Run test to verify it passes**

```bash
nr test
```

Expected: PASS

**Step 5: Commit**

```bash
git add test/generator.test.ts src/generator.ts
git commit -m "feat: add root index generator"
```

---

## Task 6: Full File Generator (TDD)

**Files:**
- Modify: `test/generator.test.ts`
- Modify: `src/generator.ts`

**Step 1: Write failing test**

Add to `test/generator.test.ts`:

```typescript
it('generates full file with all tutorials concatenated', () => {
  const tutorials: Tutorial[] = [
    {
      slug: 'intro',
      title: 'Introduction',
      lessons: [{
        slug: 'welcome',
        title: 'Welcome',
        content: 'Intro content',
        solutionFiles: new Map(),
      }],
    },
    {
      slug: 'basics',
      title: 'Basics',
      lessons: [{
        slug: 'start',
        title: 'Start',
        content: 'Basics content',
        solutionFiles: new Map(),
      }],
    },
  ]

  const generator = new LLMGenerator()
  const result = generator.generateFullFile(tutorials)

  expect(result).toContain('# Introduction')
  expect(result).toContain('Intro content')
  expect(result).toContain('# Basics')
  expect(result).toContain('Basics content')
  expect(result).toContain('========================================')
})
```

**Step 2: Run test to verify it fails**

```bash
nr test
```

Expected: FAIL - generateFullFile not found

**Step 3: Write minimal implementation**

Add to `src/generator.ts`:

```typescript
generateFullFile(tutorials: Tutorial[]): string {
  const parts: string[] = []

  tutorials.forEach((tutorial, idx) => {
    parts.push(this.generateTutorialFile(tutorial))

    if (idx < tutorials.length - 1) {
      parts.push('\n========================================\n')
    }
  })

  return parts.join('\n')
}
```

**Step 4: Run test to verify it passes**

```bash
nr test
```

Expected: PASS

**Step 5: Commit**

```bash
git add test/generator.test.ts src/generator.ts
git commit -m "feat: add full file generator"
```

---

## Task 7: TutorialKit Adapter - Fixtures Setup

**Files:**
- Create: `test/fixtures/mock-tutorial/0-intro/meta.md`
- Create: `test/fixtures/mock-tutorial/0-intro/1-welcome/content.md`
- Create: `test/fixtures/mock-tutorial/0-intro/1-welcome/_solution/index.js`

**Step 1: Create fixture tutorial metadata**

```markdown
<!-- test/fixtures/mock-tutorial/0-intro/meta.md -->
---
type: part
title: Introduction Tutorial
---
```

**Step 2: Create fixture lesson content**

```markdown
<!-- test/fixtures/mock-tutorial/0-intro/1-welcome/content.md -->
# Welcome Lesson

This is a test lesson.
```

**Step 3: Create fixture solution file**

```javascript
// test/fixtures/mock-tutorial/0-intro/1-welcome/_solution/index.js
console.log('Hello from solution')
```

**Step 4: Commit**

```bash
git add test/fixtures
git commit -m "test: add tutorialkit fixtures"
```

---

## Task 8: TutorialKit Adapter Implementation (TDD)

**Files:**
- Create: `test/adapters/tutorialkit.test.ts`
- Create: `src/adapters/tutorialkit.ts`

**Step 1: Write failing test**

```typescript
// test/adapters/tutorialkit.test.ts
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'
import { TutorialKitAdapter } from '../../src/adapters/tutorialkit'

describe('TutorialKitAdapter', () => {
  it('scans tutorials from fixtures', async () => {
    const adapter = new TutorialKitAdapter()
    const fixturesDir = resolve(__dirname, '../fixtures/mock-tutorial')

    const tutorials = await adapter.scanTutorials(fixturesDir)

    expect(tutorials).toHaveLength(1)
    expect(tutorials[0].slug).toBe('intro')
    expect(tutorials[0].title).toBe('Introduction Tutorial')
    expect(tutorials[0].lessons).toHaveLength(1)
    expect(tutorials[0].lessons[0].slug).toBe('welcome')
    expect(tutorials[0].lessons[0].content).toContain('Welcome Lesson')
    expect(tutorials[0].lessons[0].solutionFiles.get('index.js')).toContain('Hello from solution')
  })

  it('returns watch patterns', () => {
    const adapter = new TutorialKitAdapter()
    const patterns = adapter.watchPatterns()

    expect(patterns).toContain('**/meta.md')
    expect(patterns).toContain('**/content.md')
    expect(patterns).toContain('**/_solution/*')
  })
})
```

**Step 2: Run test to verify it fails**

```bash
nr test
```

Expected: FAIL - TutorialKitAdapter not found

**Step 3: Write minimal implementation**

```typescript
import type { Adapter, Lesson, Tutorial } from '../types'
// src/adapters/tutorialkit.ts
import { readdir, readFile } from 'node:fs/promises'
import { basename, join } from 'node:path'

export class TutorialKitAdapter implements Adapter {
  async scanTutorials(contentDir: string): Promise<Tutorial[]> {
    const entries = await readdir(contentDir, { withFileTypes: true })
    const tutorialDirs = entries
      .filter(e => e.isDirectory() && /^\d+-/.test(e.name))
      .sort((a, b) => a.name.localeCompare(b.name))

    const tutorials: Tutorial[] = []

    for (const dir of tutorialDirs) {
      const tutorialPath = join(contentDir, dir.name)
      const meta = await this.readMeta(tutorialPath)
      const lessons = await this.scanLessons(tutorialPath)

      const slug = dir.name.replace(/^\d+-/, '')

      tutorials.push({
        slug,
        title: meta.title || slug,
        description: meta.description,
        lessons,
      })
    }

    return tutorials
  }

  private async readMeta(tutorialPath: string): Promise<{ title?: string, description?: string }> {
    try {
      const metaPath = join(tutorialPath, 'meta.md')
      const content = await readFile(metaPath, 'utf-8')
      const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/)

      if (frontmatterMatch) {
        const yaml = frontmatterMatch[1]
        const titleMatch = yaml.match(/^title:\s*(.+)$/m)
        const descMatch = yaml.match(/^description:\s*(.+)$/m)

        return {
          title: titleMatch?.[1]?.trim(),
          description: descMatch?.[1]?.trim(),
        }
      }
    }
    catch {}

    return {}
  }

  private async scanLessons(tutorialPath: string): Promise<Lesson[]> {
    const entries = await readdir(tutorialPath, { withFileTypes: true })
    const lessonDirs = entries
      .filter(e => e.isDirectory() && /^\d+-/.test(e.name))
      .sort((a, b) => a.name.localeCompare(b.name))

    const lessons: Lesson[] = []

    for (const dir of lessonDirs) {
      const lessonPath = join(tutorialPath, dir.name)
      const slug = dir.name.replace(/^\d+-/, '')

      const content = await this.readContent(lessonPath)
      const solutionFiles = await this.readSolutionFiles(lessonPath)

      // Extract title from content.md first heading
      const titleMatch = content.match(/^#\s+(.+)$/m)
      const title = titleMatch?.[1] || slug

      lessons.push({
        slug,
        title,
        content,
        solutionFiles,
      })
    }

    return lessons
  }

  private async readContent(lessonPath: string): Promise<string> {
    try {
      const contentPath = join(lessonPath, 'content.md')
      return await readFile(contentPath, 'utf-8')
    }
    catch {
      return ''
    }
  }

  private async readSolutionFiles(lessonPath: string): Promise<Map<string, string>> {
    const files = new Map<string, string>()

    try {
      const solutionDir = join(lessonPath, '_solution')
      const entries = await readdir(solutionDir, { withFileTypes: true })

      for (const entry of entries) {
        if (entry.isFile()) {
          const filePath = join(solutionDir, entry.name)
          const content = await readFile(filePath, 'utf-8')
          files.set(entry.name, content)
        }
      }
    }
    catch {}

    return files
  }

  watchPatterns(): string[] {
    return ['**/meta.md', '**/content.md', '**/_solution/*']
  }
}
```

**Step 4: Run test to verify it passes**

```bash
nr test
```

Expected: PASS

**Step 5: Commit**

```bash
git add test/adapters/tutorialkit.test.ts src/adapters/tutorialkit.ts
git commit -m "feat: add tutorialkit adapter"
```

---

## Task 9: Generator Integration with File System

**Files:**
- Modify: `src/generator.ts`
- Create: `test/generator-integration.test.ts`

**Step 1: Write failing integration test**

```typescript
// test/generator-integration.test.ts
import { mkdtemp, readFile, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { afterEach, describe, expect, it } from 'vitest'
import { TutorialKitAdapter } from '../src/adapters/tutorialkit'
import { LLMGenerator } from '../src/generator'

describe('LLMGenerator file operations', () => {
  let tempDir: string

  afterEach(async () => {
    if (tempDir) {
      await rm(tempDir, { recursive: true, force: true })
    }
  })

  it('generates all files to output directory', async () => {
    const fixturesDir = join(__dirname, 'fixtures/mock-tutorial')
    tempDir = await mkdtemp(join(tmpdir(), 'llms-test-'))

    const adapter = new TutorialKitAdapter()
    const generator = new LLMGenerator(adapter)

    await generator.generateAll(fixturesDir, tempDir)

    // Check root index
    const rootIndex = await readFile(join(tempDir, 'llms.txt'), 'utf-8')
    expect(rootIndex).toContain('# Tutorials')

    // Check full file
    const fullFile = await readFile(join(tempDir, 'llms-full.txt'), 'utf-8')
    expect(fullFile).toContain('Introduction Tutorial')

    // Check individual tutorial file
    const tutorialFile = await readFile(join(tempDir, 'tutorial/intro.txt'), 'utf-8')
    expect(tutorialFile).toContain('Welcome Lesson')
  })
})
```

**Step 2: Run test to verify it fails**

```bash
nr test
```

Expected: FAIL - generateAll not found

**Step 3: Write implementation**

Add to `src/generator.ts`:

```typescript
import { mkdir, writeFile } from 'node:fs/promises'
import { join } from 'node:path'

async generateAll(contentDir: string, outputDir: string): Promise<void> {
  if (!this.adapter) {
    throw new Error('Adapter is required for generateAll')
  }

  const tutorials = await this.adapter.scanTutorials(contentDir)

  // Create output directories
  await mkdir(join(outputDir, 'tutorial'), { recursive: true })

  // Generate individual tutorial files
  for (const tutorial of tutorials) {
    const content = this.generateTutorialFile(tutorial)
    const filePath = join(outputDir, 'tutorial', `${tutorial.slug}.txt`)
    await writeFile(filePath, content, 'utf-8')
  }

  // Generate root index
  const rootIndex = this.generateRootIndex(tutorials)
  await writeFile(join(outputDir, 'llms.txt'), rootIndex, 'utf-8')

  // Generate full file
  const fullFile = this.generateFullFile(tutorials)
  await writeFile(join(outputDir, 'llms-full.txt'), fullFile, 'utf-8')
}
```

**Step 4: Run test to verify it passes**

```bash
nr test
```

Expected: PASS

**Step 5: Commit**

```bash
git add src/generator.ts test/generator-integration.test.ts
git commit -m "feat: add file system integration"
```

---

## Task 10: Vite Plugin Implementation

**Files:**
- Create: `src/plugin.ts`
- Create: `test/plugin.test.ts`

**Step 1: Write plugin implementation**

```typescript
// src/plugin.ts
import type { Plugin, ViteDevServer } from 'vite'
import type { LLMPluginOptions } from './types'
import { TutorialKitAdapter } from './adapters/tutorialkit'
import { LLMGenerator } from './generator'

export function llmsPlugin(options: LLMPluginOptions = {}): Plugin {
  const {
    adapter = new TutorialKitAdapter(),
    contentDir = 'src/content/tutorial',
    outputDir = 'public',
  } = options

  const generator = new LLMGenerator(adapter)
  let server: ViteDevServer | undefined

  return {
    name: 'vite-plugin-llmstxt',

    async buildStart() {
      console.log('[llms] Generating llms.txt files...')
      await generator.generateAll(contentDir, outputDir)
      console.log('[llms] Generation complete')
    },

    configureServer(devServer) {
      server = devServer

      const patterns = adapter.watchPatterns()

      server.watcher.on('change', async (file) => {
        const shouldRegenerate = patterns.some((pattern) => {
          const regex = new RegExp(pattern.replace(/\*\*/g, '.*').replace(/\*/g, '[^/]*'))
          return regex.test(file)
        })

        if (shouldRegenerate && file.includes(contentDir)) {
          console.log('[llms] Content changed, regenerating...')
          await generator.generateAll(contentDir, outputDir)
          server?.ws.send({ type: 'full-reload' })
        }
      })
    },
  }
}
```

**Step 2: Write basic plugin test**

```typescript
// test/plugin.test.ts
import { describe, expect, it } from 'vitest'
import { llmsPlugin } from '../src/plugin'

describe('llmsPlugin', () => {
  it('returns vite plugin with correct name', () => {
    const plugin = llmsPlugin()

    expect(plugin.name).toBe('vite-plugin-llmstxt')
    expect(plugin.buildStart).toBeDefined()
    expect(plugin.configureServer).toBeDefined()
  })

  it('accepts custom options', () => {
    const plugin = llmsPlugin({
      contentDir: 'custom/content',
      outputDir: 'custom/output',
    })

    expect(plugin.name).toBe('vite-plugin-llmstxt')
  })
})
```

**Step 3: Run tests**

```bash
nr test
```

Expected: PASS

**Step 4: Commit**

```bash
git add src/plugin.ts test/plugin.test.ts
git commit -m "feat: add vite plugin implementation"
```

---

## Task 11: Main Package Exports

**Files:**
- Create: `src/index.ts`

**Step 1: Create main exports file**

```typescript
export { TutorialKitAdapter } from './adapters/tutorialkit'
export { LLMGenerator } from './generator'
// src/index.ts
export { llmsPlugin } from './plugin'
export type { Adapter, Lesson, LLMPluginOptions, Tutorial } from './types'
```

**Step 2: Verify build works**

```bash
nr build
```

Expected: Build succeeds, dist/ created with types

**Step 3: Verify types**

```bash
tp
```

Expected: No type errors

**Step 4: Commit**

```bash
git add src/index.ts
git commit -m "feat: add main package exports"
```

---

## Task 12: Build Configuration

**Files:**
- Create: `tsup.config.ts`

**Step 1: Create tsup config**

```typescript
// tsup.config.ts
import { defineConfig } from 'tsup'

export default defineConfig({
  entry: [
    'src/index.ts',
    'src/adapters/tutorialkit.ts',
  ],
  format: ['esm'],
  dts: true,
  clean: true,
  sourcemap: true,
})
```

**Step 2: Rebuild to verify**

```bash
nr build
```

Expected: dist/ contains index.js, index.d.ts, adapters/tutorialkit.js, adapters/tutorialkit.d.ts

**Step 3: Commit**

```bash
git add tsup.config.ts
git commit -m "feat: add build configuration"
```

---

## Task 13: Playground Setup

**Files:**
- Create: `playground/package.json`
- Create: `playground/astro.config.ts`
- Create: `playground/README.md`
- Create: `playground/src/content/tutorial/0-test/meta.md`
- Create: `playground/src/content/tutorial/0-test/1-hello/content.md`
- Create: `playground/src/content/tutorial/0-test/1-hello/_solution/index.js`

**Step 1: Create playground package.json**

```json
{
  "name": "playground",
  "version": "0.0.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "astro dev",
    "build": "astro build"
  },
  "dependencies": {
    "@astrojs/vue": "^4.0.0",
    "@tutorialkit/astro": "^0.1.0",
    "astro": "^4.0.0",
    "vite-plugin-llmstxt": "workspace:*",
    "vue": "^3.4.0"
  }
}
```

**Step 2: Create Astro config**

```typescript
// playground/astro.config.ts
import vue from '@astrojs/vue'
import tutorialkit from '@tutorialkit/astro'
import { defineConfig } from 'astro/config'
import { llmsPlugin } from 'vite-plugin-llmstxt'

export default defineConfig({
  vite: {
    plugins: [llmsPlugin()],
  },
  integrations: [tutorialkit(), vue()],
})
```

**Step 3: Create test tutorial**

```markdown
<!-- playground/src/content/tutorial/0-test/meta.md -->
---
type: part
title: Test Tutorial
---
```

```markdown
<!-- playground/src/content/tutorial/0-test/1-hello/content.md -->
# Hello World

This is a test lesson for the playground.
```

```javascript
// playground/src/content/tutorial/0-test/1-hello/_solution/index.js
console.log('Hello from playground')
```

**Step 4: Create playground README**

```markdown
<!-- playground/README.md -->
# Playground

Test environment for vite-plugin-llmstxt

## Usage

\`\`\`bash
pnpm -F playground dev
\`\`\`

Check generated files in `public/`:
- `llms.txt`
- `llms-full.txt`
- `tutorial/test.txt`
```

**Step 5: Install playground dependencies**

```bash
ni
```

**Step 6: Commit**

```bash
git add playground
git commit -m "feat: add playground environment"
```

---

## Task 14: Documentation

**Files:**
- Modify: `README.md`

**Step 1: Write comprehensive README**

```markdown
# vite-plugin-llmstxt

Vite plugin to generate llms.txt files from tutorial content.

## Installation

\`\`\`bash
npm install vite-plugin-llmstxt
\`\`\`

## Usage

### Basic (TutorialKit)

\`\`\`typescript
// astro.config.ts
import { defineConfig } from 'astro/config'
import { llmsPlugin } from 'vite-plugin-llmstxt'

export default defineConfig({
  vite: {
    plugins: [llmsPlugin()]
  }
})
\`\`\`

### Custom Options

\`\`\`typescript
llmsPlugin({
  contentDir: 'src/content/tutorial',  // default
  outputDir: 'public',                 // default
  adapter: new TutorialKitAdapter()    // default
})
\`\`\`

### Custom Adapter

\`\`\`typescript
import { llmsPlugin } from 'vite-plugin-llmstxt'
import type { Adapter } from 'vite-plugin-llmstxt'

class MyAdapter implements Adapter {
  async scanTutorials(contentDir: string) {
    // Your content discovery logic
    return []
  }

  watchPatterns() {
    return ['**/*.md']
  }
}

llmsPlugin({ adapter: new MyAdapter() })
\`\`\`

## Generated Files

- `public/llms.txt` - Index with links
- `public/llms-full.txt` - All tutorials concatenated
- `public/tutorial/{slug}.txt` - Individual tutorial files

## Development

\`\`\`bash
pnpm install
pnpm build
pnpm test
\`\`\`

### Playground

\`\`\`bash
pnpm -F playground dev
\`\`\`

## License

MIT
```

**Step 2: Commit**

```bash
git add README.md
git commit -m "docs: add comprehensive README"
```

---

## Task 15: Final Testing & Verification

**Step 1: Run all tests**

```bash
nr test
```

Expected: All tests pass

**Step 2: Build package**

```bash
nr build
```

Expected: Clean build with no errors

**Step 3: Type check**

```bash
tp
```

Expected: No type errors

**Step 4: Test playground**

```bash
pnpm -F playground dev
```

Expected: Dev server starts, check `playground/public/` for generated files

**Step 5: Verify generated files**

```bash
ls -la playground/public/
cat playground/public/llms.txt
cat playground/public/tutorial/test.txt
```

Expected: Files exist with correct content

**Step 6: Final commit**

```bash
git add .
git commit -m "chore: final verification"
```

---

## Unresolved Questions

- Publish to npm? Need access/scope
- Add CI/CD?
- Version strategy?
- License confirmation (MIT ok?)
