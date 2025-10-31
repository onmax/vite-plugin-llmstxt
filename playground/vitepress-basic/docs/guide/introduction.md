# Introduction

Welcome to the VitePress playground for testing vite-plugin-llmstxt!

## What is this?

This is a simple VitePress documentation site used to test the plugin's ability to:

- Generate `llms.txt` index files
- Generate `llms-full.txt` with all content
- Generate individual `.md` files for each page
- Handle content tags like `<llm-only>` and `<llm-exclude>`
- Strip HTML from output
- Inject LLM hints

## Features

### Content Tags

You can use special tags to control what appears in LLM output:

<llm-only>
**For LLMs only**: This section contains technical details optimized for AI consumption.
</llm-only>

<llm-exclude>
**For humans only**: Visit our website at example.com for more information!
</llm-exclude>

### HTML Stripping

The plugin uses mdream to strip HTML and convert it to clean Markdown:

<div class="custom-block tip">
  <p>This HTML block will be converted to clean Markdown in the LLM output.</p>
</div>

## Next Steps

Continue to [Getting Started](/guide/getting-started) to learn more.
