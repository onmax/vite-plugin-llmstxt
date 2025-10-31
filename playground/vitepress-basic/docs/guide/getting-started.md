# Getting Started

Let's get started with vite-plugin-llmstxt!

## Installation

```bash
pnpm add vite-plugin-llmstxt mdream
```

## Basic Usage

Add the plugin to your Vite config:

```typescript
import { llmsPlugin } from 'vite-plugin-llmstxt'

export default defineConfig({
  vite: {
    plugins: [llmsPlugin()]
  }
})
```

## Configuration

Customize the plugin behavior:

```typescript
llmsPlugin({
  preset: 'vitepress',
  stripHTML: true,
  domain: 'https://example.com',
  handleContentTags: true,
})
```

## Output Files

The plugin generates:

- `dist/llms.txt` - Index with links
- `dist/llms-full.txt` - All content concatenated  
- `dist/*.md` - Individual page files

## Advanced Features

See the [API Reference](/api/reference) for more details.
