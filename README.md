# vite-plugin-llmstxt

Vite plugin to generate llms.txt files from tutorial content.

## Installation

```bash
npm install vite-plugin-llmstxt
```

## Usage

### Basic (TutorialKit)

```typescript
// astro.config.ts
import { defineConfig } from 'astro/config'
import { llmsPlugin } from 'vite-plugin-llmstxt'

export default defineConfig({
  vite: {
    plugins: [llmsPlugin()]
  }
})
```

### Custom Options

```typescript
llmsPlugin({
  contentDir: 'src/content/tutorial', // default
  outputDir: 'public', // default
  adapter: new TutorialKitAdapter() // default
})
```

### Custom Adapter

```typescript
import type { Adapter } from 'vite-plugin-llmstxt'
import { llmsPlugin } from 'vite-plugin-llmstxt'

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
```

## Generated Files

- `public/llms.txt` - Index with links
- `public/llms-full.txt` - All tutorials concatenated
- `public/tutorial/{slug}.txt` - Individual tutorial files

## Development

```bash
pnpm install
pnpm build
pnpm test
```

### Playground

```bash
pnpm -F playground dev
```

## License

MIT
