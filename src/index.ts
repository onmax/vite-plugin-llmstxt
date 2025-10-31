// Main plugin
export { llmsPlugin } from './plugin'
export type { LLMPlugin, LLMPluginOptions, Preset, ProcessorConfig } from './types'
// Re-export everything from packages
export * from '@vite-plugin-llmstxt/core'

export * from '@vite-plugin-llmstxt/tutorialkit'
export * from '@vite-plugin-llmstxt/vitepress'
