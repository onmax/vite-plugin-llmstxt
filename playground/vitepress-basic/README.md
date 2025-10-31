# VitePress Playground

Test environment for vite-plugin-llmstxt with VitePress.

## Usage

```bash
# Development
pnpm dev

# Build
pnpm build

# Check generated files
ls -la docs/.vitepress/dist/
cat docs/.vitepress/dist/llms.txt
```

## Features Tested

- VitePress preset
- HTML stripping via mdream
- Content tags (`<llm-only>`, `<llm-exclude>`)
- LLM hints injection
- Domain prefixing
- Sidebar-based TOC (if implemented)

## Generated Files

After build, check:
- `docs/.vitepress/dist/llms.txt`
- `docs/.vitepress/dist/llms-full.txt`
- `docs/.vitepress/dist/**/*.md`
