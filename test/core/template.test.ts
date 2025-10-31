import { describe, expect, it } from 'vitest'
import { DEFAULT_TEMPLATE, expandTemplate } from '../../src/core/template'

describe('template system', () => {
  it('expands variables', () => {
    const template = '# {title}\n\n{description}'
    const result = expandTemplate(template, {
      title: 'My Title',
      description: 'My Description',
    })

    expect(result).toBe('# My Title\n\nMy Description')
  })

  it('removes unused variables', () => {
    const template = '# {title}\n\n{description}\n\n{unused}'
    const result = expandTemplate(template, {
      title: 'My Title',
      description: 'My Description',
    })

    expect(result).not.toContain('{unused}')
    expect(result).toBe('# My Title\n\nMy Description')
  })

  it('handles undefined values', () => {
    const template = '# {title}\n\n{description}'
    const result = expandTemplate(template, {
      title: 'My Title',
      description: undefined,
    })

    expect(result).toBe('# My Title')
    expect(result).not.toContain('{description}')
  })

  it('cleans up extra whitespace', () => {
    const template = '# {title}\n\n\n\n{description}\n\n\n{details}'
    const result = expandTemplate(template, {
      title: 'My Title',
    })

    expect(result).toBe('# My Title')
    expect(result).not.toContain('\n\n\n')
  })

  it('handles custom variables', () => {
    const template = '# {title}\n\n{customVar}'
    const result = expandTemplate(template, {
      title: 'My Title',
      customVar: 'Custom Value',
    })

    expect(result).toBe('# My Title\n\nCustom Value')
  })

  it('uses default template', () => {
    expect(DEFAULT_TEMPLATE).toContain('{title}')
    expect(DEFAULT_TEMPLATE).toContain('{description}')
    expect(DEFAULT_TEMPLATE).toContain('{toc}')
  })
})
