import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: [
    'src/index.ts',
    'src/adapters/tutorialkit.ts',
  ],
  dts: true,
  clean: true,
  sourcemap: true,
})
