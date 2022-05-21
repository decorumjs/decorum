import fs from 'fs'
import yaml from 'js-yaml'

export function loadYamlFile<T>(filename: string): Promise<T> {
  return new Promise((resolve, reject) => {
    fs.readFile(filename, 'utf8', (err, data) => {
      if (err) {
        return reject(err)
      }
      try {
        const doc = yaml.load(data, { filename })
        resolve(doc as T)
      } catch (err) {
        reject(err)
      }
    })
  })
}
