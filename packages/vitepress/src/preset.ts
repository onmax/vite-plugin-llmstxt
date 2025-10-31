import type { Preset } from './types'
import { ContentTagsProcessor, DocsFormatter, FrontmatterProcessor, HintsProcessor, MdreamProcessor } from '@vite-plugin-llmstxt/core'
import { VitePressScanner } from './scanner'

export function createVitePressPreset(): Preset {
  return {
    scanner: new VitePressScanner(),
    processors: [
      new FrontmatterProcessor({ extract: true }),
      new ContentTagsProcessor({ handleLLMOnly: true, handleLLMExclude: true }),
      new MdreamProcessor({ stripHTML: true, useMinimalPreset: true }),
      new HintsProcessor({ injectLLMHint: true }),
    ],
    formatter: new DocsFormatter(),
    template: `# {title}

> {description}

{details}

## Table of Contents

{toc}`,
    defaults: {
      contentDir: 'docs',
      outputDir: 'dist',
      generateIndex: true,
      generateFull: true,
      generateIndividual: true,
      stripHTML: true,
      injectLLMHint: true,
      handleContentTags: true,
      excludeUnnecessaryFiles: true,
      excludeIndexPage: false,
      excludeBlog: true,
      excludeTeam: true,
    },
  }
}
