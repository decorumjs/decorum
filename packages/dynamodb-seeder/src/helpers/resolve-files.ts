import glob from 'glob'

export default async function resolveFiles(filePatterns: string[]): Promise<string[]> {
  const uniqueFilenames = new Set()

  for (const pattern of filePatterns) {
    const matches = await globAsync(pattern)
    matches.forEach((filename) => uniqueFilenames.add(filename))
  }

  return Array.from(uniqueFilenames) as string[]
}

function globAsync(pattern: string): Promise<string[]> {
  return new Promise((resolve, reject) => {
    glob(pattern, (err, matches) => {
      if (err) {
        return reject(err)
      }
      resolve(matches)
    })
  })
}
