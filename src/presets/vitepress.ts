import type { Preset } from '../types'
import { DocsFormatter } from '../formatters/docs'
import { ContentTagsProcessor } from '../processors/content-tags'
import { FrontmatterProcessor } from '../processors/frontmatter'
import { HintsProcessor } from '../processors/hints'
import { MdreamProcessor } from '../processors/mdream'
import { VitePressScanner } from '../scanners/vitepress'

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
