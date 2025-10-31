import type { PreparedFile } from './formatter'

export interface DirectoryLevel {
  relativePath: string
  files: PreparedFile[]
}

export function getDirectoriesAtDepths(files: PreparedFile[], depth: number = 1): DirectoryLevel[] {
  if (depth === 1) {
    return [{ relativePath: '.', files }]
  }

  const directories = new Map<string, PreparedFile[]>()

  // Root directory
  directories.set('.', files)

  // Group files by directory at each depth level
  for (let d = 1; d < depth; d++) {
    files.forEach((file) => {
      const parts = file.path.split('/')
      if (parts.length > d) {
        const dirPath = parts.slice(0, d).join('/')
        if (!directories.has(dirPath)) {
          directories.set(dirPath, [])
        }
        directories.get(dirPath)!.push(file)
      }
    })
  }

  return Array.from(directories.entries()).map(([relativePath, dirFiles]) => ({
    relativePath,
    files: dirFiles,
  }))
}
