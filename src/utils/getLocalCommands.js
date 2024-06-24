import getAllFiles from './getAllFiles.js'
import path from 'path'

const __dirname = import.meta.dirname

export default async (exceptions = []) => {
  const localCommands = []

  const commandCategories = getAllFiles(path.join(__dirname, '..', 'Commands'))

  for (const commandCategory of commandCategories) {
    const commandFiles = getAllFiles(commandCategory)

    for (const commandFile of commandFiles) {
      const commandobject = await import(path.join('file:///', commandFile))

      const commandObject = commandobject.default

      if (exceptions.includes(commandObject.name)) {
        continue
      }

      localCommands.push(commandObject)
    }
  }

  return localCommands
}
