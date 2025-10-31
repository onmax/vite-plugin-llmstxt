# vite-plugin-llmstxt

Vite plugin to generate llms.txt files from tutorial content with composable architecture.

## Features

- 🧩 **Composable**: Mix and match scanners, processors, and formatters
- 🎯 **Multiple Presets**: TutorialKit and VitePress out of the box
- 🔧 **Extensible**: Create custom scanners, processors, and formatters
- ⚡ **Fast**: Powered by mdream for HTML→Markdown conversion
- 🎨 **Flexible**: Template system with variable substitution
- 📁 **Smart Filtering**: Glob patterns and predefined exclusions
- 🌲 **Nested Output**: Experimental depth support for multi-level llms.txt

## Installation

```bash
pnpm add vite-plugin-llmstxt mdream
```

## Quick Start

### TutorialKit (Default)

```typescript
// astro.config.ts
import { llmsPlugin } from 'vite-plugin-llmstxt'

export default defineConfig({
  vite: {
    plugins: [llmsPlugin()]
  }
})
```

### VitePress

```typescript
import { llmsPlugin } from 'vite-plugin-llmstxt'

export default defineConfig({
  vite: {
    plugins: [
      llmsPlugin({
        preset: 'vitepress',
        contentDir: 'docs',
        stripHTML: true,
        domain: 'https://example.com'
      })
    ]
  }
})
```

## Architecture

The plugin uses a composable architecture with three main components:

- **Scanner**: Discovers content files
- **Processor**: Transforms markdown content
- **Formatter**: Generates output files

### Presets

Presets combine scanner + processors + formatter + defaults:

```typescript
llmsPlugin({ preset: 'tutorialkit' }) // or 'vitepress' or 'auto'
```

### Custom Configuration

Override any piece:

```typescript
import { llmsPlugin, MdreamProcessor, DocsFormatter } from 'vite-plugin-llmstxt'

llmsPlugin({
  preset: 'tutorialkit',
  
  // Append custom processors
  processors: [
    new MdreamProcessor({ stripHTML: true }),
  ],
  
  // Replace formatter
  formatter: new DocsFormatter(),
  
  // Template customization
  template: '# {title}\n\n{toc}',
  templateVars: { customVar: 'value' },
  
  // Output control
  domain: 'https://example.com',
  generateIndex: true,
  generateFull: true,
  generateIndividual: true,
  
  // Filtering
  ignoreFiles: ['**/draft/**'],
  excludeBlog: true,
  excludeTeam: true,
})
```

## API

### Options

```typescript
interface LLMPluginOptions {
  // Preset (provides defaults)
  preset?: 'tutorialkit' | 'vitepress' | 'auto' | Preset
  
  // Override components
  scanner?: Scanner
  processors?: Processor[] | { mode: 'replace' | 'append', list: Processor[] }
  formatter?: Formatter
  
  // Content discovery
  contentDir?: string
  outputDir?: string
  workDir?: string
  
  // Filtering
  ignoreFiles?: string[]
  excludeUnnecessaryFiles?: boolean
  excludeIndexPage?: boolean
  excludeBlog?: boolean
  excludeTeam?: boolean
  
  // Processing
  stripHTML?: boolean
  injectLLMHint?: boolean
  handleContentTags?: boolean
  
  // Output
  domain?: string
  generateIndex?: boolean
  generateFull?: boolean
  generateIndividual?: boolean
  
  // Template
  template?: string
  templateVars?: Record<string, string>
  title?: string
  description?: string
  details?: string
  
  // Advanced
  experimental?: {
    depth?: number // nested llms.txt generation
  }
}
```

### Scanners

```typescript
import { TutorialKitScanner, VitePressScanner } from 'vite-plugin-llmstxt'

// Custom scanner
class MyScanner implements Scanner {
  async scan(contentDir: string): Promise<RawFile[]> {
    // Your content discovery logic
    return []
  }
  
  watchPatterns(): string[] {
    return ['**/*.md']
  }
}
```

### Processors

Built-in processors:

- `MdreamProcessor`: HTML stripping via mdream
- `FrontmatterProcessor`: Extract/inject YAML frontmatter
- `ContentTagsProcessor`: Handle `<llm-only>` and `<llm-exclude>` tags
- `SnippetsProcessor`: Include external code snippets
- `HintsProcessor`: Inject LLM hints
- `ImageUrlsProcessor`: Map image URLs

```typescript
import { MdreamProcessor } from 'vite-plugin-llmstxt'

// Custom processor
class MyProcessor implements Processor {
  name = 'my-processor'
  
  async process(content: string, ctx: ProcessContext): Promise<string> {
    // Transform content
    return content.toUpperCase()
  }
}
```

### Formatters

```typescript
import { TutorialFormatter, DocsFormatter } from 'vite-plugin-llmstxt'

// Custom formatter
class MyFormatter implements Formatter {
  formatIndex(files: PreparedFile[], opts: FormatOptions): string {
    return files.map(f => `- ${f.title}`).join('\n')
  }
  
  formatFull(files: PreparedFile[], opts: FormatOptions): string {
    return files.map(f => f.content).join('\n---\n')
  }
  
  formatIndividual(file: PreparedFile, opts: FormatOptions): string {
    return `# ${file.title}\n\n${file.content}`
  }
}
```

## Generated Files

```
public/
├── llms.txt                    # Index with links
├── llms-full.txt               # All content concatenated
└── tutorial/
    ├── intro.txt
    ├── basics.txt
    └── ...
```

## Content Tags

Use special tags to control LLM visibility:

```markdown
<!-- Visible only in LLM output -->
<llm-only>
Technical details for LLMs only
</llm-only>

<!-- Hidden from LLM output -->
<llm-exclude>
Marketing content or human-only instructions
</llm-exclude>
```

## Template System

Customize the index format:

```typescript
llmsPlugin({
  template: `# {title}

> {description}

{details}

## Documentation

{toc}`,
  templateVars: {
    title: 'My Project',
    description: 'Awesome docs',
    details: 'Built with ❤️',
  },
})
```

Available variables:
- `{title}` - Project title
- `{description}` - Description
- `{details}` - Additional details
- `{toc}` - Auto-generated table of contents
- Custom variables via `templateVars`

## Advanced Features

### Experimental Depth

Generate nested `llms.txt` at multiple directory levels:

```typescript
llmsPlugin({
  experimental: {
    depth: 2 // generates llms.txt in root + subdirectories
  }
})
```

Output:
```
dist/
├── llms.txt
├── llms-full.txt
├── guide/
│   ├── llms.txt
│   └── llms-full.txt
└── api/
    ├── llms.txt
    └── llms-full.txt
```

### Replace vs Append Processors

```typescript
// Append (default)
llmsPlugin({
  processors: [new MyProcessor()]
})

// Replace
llmsPlugin({
  processors: {
    mode: 'replace',
    list: [new MyProcessor()]
  }
})
```

## Development

```bash
pnpm install
pnpm build
pnpm test
pnpm typecheck
```

## License

MIT
