# Playground

Test environments for vite-plugin-llmstxt with different presets.

## Available Playgrounds

### TutorialKit (tutorialkit-basic/)

Test the TutorialKit preset with Astro + TutorialKit.

```bash
cd tutorialkit-basic
pnpm dev
pnpm build

# Check generated files
ls -la public/
cat public/llms.txt
cat public/llms-full.txt
cat public/tutorial/test.txt
```

**Features tested:**
- TutorialKit preset (default)
- Tutorial scanning with lessons and solution files
- Tutorial-specific formatting
- Basic content processing

### VitePress (vitepress-basic/)

Test the VitePress preset with VitePress docs.

```bash
cd vitepress-basic
pnpm dev
pnpm build

# Check generated files
ls -la docs/.vitepress/dist/
cat docs/.vitepress/dist/llms.txt
cat docs/.vitepress/dist/llms-full.txt
```

**Features tested:**
- VitePress preset
- HTML stripping via mdream
- Content tags (`<llm-only>`, `<llm-exclude>`)
- LLM hints injection
- Domain prefixing
- Docs-style formatting

## Adding Custom Playgrounds

Create a new directory and configure:

```typescript
// your-config.ts
import { llmsPlugin } from 'vite-plugin-llmstxt'

export default {
  vite: {
    plugins: [
      llmsPlugin({
        preset: 'tutorialkit', // or 'vitepress' or custom
        // ... your options
      })
    ]
  }
}
```

## Testing Workflow

1. Make changes to plugin source (`src/`)
2. Build the plugin: `pnpm build` (from root)
3. Test in playground: `cd playground/[name] && pnpm dev`
4. Verify generated files after build
5. Test HMR by editing content files
