# API Reference

Complete API documentation for vite-plugin-llmstxt.

## Plugin Options

### preset

- Type: `'tutorialkit' | 'vitepress' | 'auto' | Preset`
- Default: `'auto'`

The preset to use for content scanning and formatting.

### contentDir

- Type: `string`
- Default: `'src/content/tutorial'` (tutorialkit) or `'docs'` (vitepress)

Directory containing source content.

### outputDir

- Type: `string`  
- Default: `'public'` (tutorialkit) or `'dist'` (vitepress)

Output directory for generated files.

### stripHTML

- Type: `boolean`
- Default: `false` (tutorialkit) or `true` (vitepress)

Strip HTML tags using mdream.

### domain

- Type: `string`
- Default: `undefined`

Domain prefix for absolute URLs in output.

### handleContentTags

- Type: `boolean`
- Default: `true`

Handle `<llm-only>` and `<llm-exclude>` tags.

### template

- Type: `string`
- Default: Preset-specific template

Custom template for llms.txt with variable substitution.

### experimental

- Type: `{ depth?: number }`
- Default: `{ depth: 1 }`

Experimental features like nested llms.txt generation.

## Custom Components

### Scanner

```typescript
interface Scanner {
  scan(contentDir: string): Promise<RawFile[]>
  watchPatterns(): string[]
}
```

### Processor

```typescript
interface Processor {
  name: string
  process(content: string, ctx: ProcessContext): Promise<string>
}
```

### Formatter

```typescript
interface Formatter {
  formatIndex(files: PreparedFile[], opts: FormatOptions): string
  formatFull(files: PreparedFile[], opts: FormatOptions): string
  formatIndividual(file: PreparedFile, opts: FormatOptions): string
}
```
