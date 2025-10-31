# vite-plugin-llmstxt Design

## Overview

Extract LLM context generation logic from ~/nimiq/tutorial into reusable Vite plugin. Generates llms.txt files from tutorial content for LLM consumption.

**Package name:** `vite-plugin-llmstxt`

**Target:** Reusable library for any TutorialKit project

## Architecture

### Core Structure

```
src/
├── plugin.ts              # Main Vite plugin export
├── adapters/
│   ├── base.ts            # Adapter interface
│   └── tutorialkit.ts     # TutorialKit adapter implementation
├── generator.ts           # Core file generation logic
└── types.ts               # Shared TypeScript types

playground/                # Dev environment (not published)
test/
├── fixtures/              # Mock tutorial structures
└── *.test.ts              # Vitest tests
```

### Key Design Decisions

**Adapter Pattern:** Separates content discovery (TutorialKit-specific) from file generation (generic).

**Vite Plugin:** Integrates with build system for auto-regeneration during dev and production builds.

**Generic Core:** Core generator is content-agnostic. TutorialKit adapter provides content discovery. Users can write custom adapters.

## Adapter Interface

```ts
// adapters/base.ts
export interface Tutorial {
  slug: string // "introduction"
  title: string // "Introduction"
  description?: string
  lessons: Lesson[]
}

export interface Lesson {
  slug: string
  title: string
  content: string // Markdown content
  solutionFiles: Map<string, string> // filename -> code
}

export interface Adapter {
  scanTutorials: (contentDir: string) => Promise<Tutorial[]>
  watchPatterns: () => string[] // Glob patterns for dev mode watching
}
```

### TutorialKit Adapter

Implements content discovery for TutorialKit structure:

- Scans `src/content/tutorial/` directories (0-*, 1-*, etc.)
- Reads `meta.md` for tutorial metadata
- Reads `content.md` for lesson content
- Collects `_solution/*` files
- Returns normalized `Tutorial[]` structure

**Watch patterns:** `**/meta.md`, `**/content.md`, `**/_solution/*`

## File Generation

### Generator Class

```ts
// generator.ts
export class LLMGenerator {
  constructor(private adapter: Adapter) {}

  async generateAll(contentDir: string, outputDir: string): Promise<void>

  private generateTutorialFile(tutorial: Tutorial): string
  private generateRootIndex(tutorials: Tutorial[]): string
  private generateFullFile(tutorials: Tutorial[]): string
}
```

### Output Structure

```
public/
├── llms.txt                    # Index with links to all tutorials
├── llms-full.txt               # All tutorials concatenated
└── tutorial/
    ├── introduction.txt
    ├── connecting-to-network.txt
    └── ...
```

### File Format

**Individual tutorial file:**
```markdown
# {Tutorial Title}

> {Description}

## Lesson 1: {Title}

{Markdown content from content.md}

### Solution Code

#### index.js
```js
{solution code}
```

---

## Lesson 2: ...
```

**Processing rules:**
- Preserve original markdown formatting
- Append solution files as fenced code blocks
- Use `---` separator between lessons
- Maintain lesson order from directory structure

**Root index (llms.txt):**
```markdown
# Tutorials

Learn through interactive tutorials.

## Available Tutorials

- [Introduction](/tutorial/introduction.txt): Get started
- [Connecting to Network](/tutorial/connecting-to-network.txt): Blockchain connection
...

## Complete Documentation

- [All Tutorials](/llms-full.txt): Full combined documentation
```

**Full file (llms-full.txt):** Concatenates all `/tutorial/{slug}.txt` files with section separators.

## Plugin Implementation

### Main Export

```ts
// plugin.ts
export function llmsPlugin(options?: LLMPluginOptions): Plugin {
  return {
    name: 'vite-plugin-llmstxt',

    async buildStart() {
      // Generate all files at build start
      const generator = new LLMGenerator(adapter)
      await generator.generateAll(contentDir, outputDir)
    },

    configureServer(server) {
      // Dev mode: watch and regenerate on changes
      const patterns = adapter.watchPatterns()

      server.watcher.on('change', async (file) => {
        if (matchesPattern(file, patterns)) {
          await regenerateFiles()
          server.ws.send({ type: 'full-reload' })
        }
      })
    }
  }
}
```

### Plugin Options

```ts
interface LLMPluginOptions {
  adapter?: Adapter // Default: TutorialKitAdapter
  contentDir?: string // Default: 'src/content/tutorial'
  outputDir?: string // Default: 'public'
}
```

### Usage

```ts
// astro.config.ts
import { llmsPlugin } from 'vite-plugin-llmstxt'

export default defineConfig({
  vite: {
    plugins: [llmsPlugin()] // Uses TutorialKit adapter by default
  }
})
```

**Custom adapter:**
```ts
import { llmsPlugin } from 'vite-plugin-llmstxt'
import { MyCustomAdapter } from './my-adapter'

export default defineConfig({
  vite: {
    plugins: [
      llmsPlugin({
        adapter: new MyCustomAdapter(),
        contentDir: 'docs',
        outputDir: 'dist'
      })
    ]
  }
})
```

## Testing Strategy

### Unit Tests (Vitest)

```
test/
├── fixtures/
│   └── mock-tutorial/          # Minimal tutorial structure
│       ├── 0-intro/
│       │   ├── meta.md
│       │   └── 1-welcome/
│       │       ├── content.md
│       │       └── _solution/
│       │           └── index.js
│       └── 1-basics/
│           └── ...
├── adapter.test.ts             # TutorialKit adapter tests
├── generator.test.ts           # File generation tests
└── plugin.test.ts              # Vite plugin hooks tests
```

**Coverage:**
- Adapter scans fixtures correctly
- Generator produces expected output format
- Solution files appended properly
- Root index lists all tutorials
- Full file concatenates in correct order

### Playground

```
playground/
├── package.json               # Minimal TutorialKit project
├── astro.config.ts            # Uses local plugin via workspace
├── src/content/tutorial/      # Sample tutorials
└── README.md                  # Quick start guide
```

**Manual testing:**
- `pnpm -F playground dev` - test HMR and file watching
- `pnpm -F playground build` - test production build
- Verify generated files in `playground/public/`

## Package Distribution

### Package Structure

```json
{
  "name": "vite-plugin-llmstxt",
  "version": "0.1.0",
  "description": "Vite plugin to generate llms.txt files from tutorial content",
  "type": "module",
  "keywords": ["vite", "plugin", "llms", "tutorialkit", "llms.txt"],
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
    "test": "vitest",
    "dev": "tsup --watch"
  }
}
```

### Main Exports

```ts
export { TutorialKitAdapter } from './adapters/tutorialkit'
// src/index.ts
export { llmsPlugin } from './plugin'
export type { Adapter, Lesson, LLMPluginOptions, Tutorial } from './types'
```

### Build Tooling

- **tsup** - bundling (from starter-ts)
- **TypeScript** - type checking
- **Vitest** - testing
- **ESLint** - linting

### Workspace Structure

```
vite-plugin-llmstxt/
├── src/                    # Source (published)
├── test/                   # Tests (not published)
├── playground/             # Dev environment (not published)
├── package.json
├── tsconfig.json
└── README.md
```

## Key Principles

1. **Adapter pattern** - content discovery is pluggable
2. **Generic core** - generator works with any content structure via adapters
3. **Vite integration** - seamless dev experience with HMR
4. **Type-safe** - full TypeScript support
5. **Tested** - unit tests with fixtures + manual playground testing
6. **Extensible** - users can write custom adapters for other platforms
