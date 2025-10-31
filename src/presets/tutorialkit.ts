import type { Preset } from '../types'
import { TutorialFormatter } from '../formatters/tutorial'
import { ContentTagsProcessor } from '../processors/content-tags'
import { FrontmatterProcessor } from '../processors/frontmatter'
import { TutorialKitScanner } from '../scanners/tutorialkit'

export function createTutorialKitPreset(): Preset {
  return {
    scanner: new TutorialKitScanner(),
    processors: [
      new FrontmatterProcessor({ extract: true }),
      new ContentTagsProcessor({ handleLLMOnly: true, handleLLMExclude: true }),
    ],
    formatter: new TutorialFormatter(),
    template: `# {title}

> {description}

{details}

## Available Tutorials

{toc}`,
    defaults: {
      contentDir: 'src/content/tutorial',
      outputDir: 'public',
      generateIndex: true,
      generateFull: true,
      generateIndividual: true,
      stripHTML: false, // tutorials are already markdown
      injectLLMHint: false,
      handleContentTags: true,
    },
  }
}
