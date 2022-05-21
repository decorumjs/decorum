import fs from 'fs'
import yaml from 'js-yaml'

export default function loadYamlFile(filename: string): Promise<unknown> {
  return new Promise((resolve, reject) => {
    fs.readFile(filename, 'utf8', (err, data) => {
      if (err) {
        return reject(err)
      }
      try {
        const doc = yaml.load(data, { filename })
        resolve(doc)
      } catch (err) {
        reject(err)
      }
    })
  })
}
