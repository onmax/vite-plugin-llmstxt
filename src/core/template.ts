export interface TemplateVariables {
  title?: string
  description?: string
  details?: string
  toc?: string
  [key: string]: string | undefined
}

export function expandTemplate(template: string, variables: TemplateVariables): string {
  let result = template

  // Replace all {variable} with values
  for (const [key, value] of Object.entries(variables)) {
    if (value !== undefined) {
      const regex = new RegExp(`\\{${key}\\}`, 'g')
      result = result.replace(regex, value)
    }
  }

  // Clean up unused variables and extra whitespace
  result = result.replace(/\{[^}]+\}/g, '') // Remove unused {vars}
  result = result.replace(/\n{3,}/g, '\n\n') // Max 2 newlines
  result = result.trim()

  return result
}

export const DEFAULT_TEMPLATE = `# {title}

> {description}

{details}

## Table of Contents

{toc}`
