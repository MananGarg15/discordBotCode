import { createRequire } from 'module'
import getLocalCommands from '../../utils/getLocalCommands.js'
import getApplicationCommands from '../../utils/getApplicationCommands.js'
import areCommandsDifferent from '../../utils/areCommandsDifferent.js'
import { config } from 'dotenv'
const require = createRequire(import.meta.url)
const { testServer } = require('../../../config.json')

export default async client => {
  try {
    console.log('commands are regestering...')

    const localCommands = await getLocalCommands()
    // console.log(localCommands)

    const applicationCommands = await getApplicationCommands(client, testServer)

    // console.log('app commands are received')

    for (const localCommand of localCommands) {
      const { name, description, options } = localCommand

      const existingCommand = await applicationCommands.cache.find(
        cmd => cmd.name === name
      )

      if (existingCommand) {
        if (localCommand.deleted) {
          await applicationCommands.delete(existingCommand.id)
          console.log(`🛑 ${name} was deleted from ApplicationCommands`)
          continue
        }
        // console.log('its still fine..')

        if (await areCommandsDifferent(localCommand, existingCommand)) {
          await applicationCommands.edit(existingCommand.id, {
            description,
            options
          })

          console.log(`🔁 ${name} was overwritten`)
          continue
        }
      } else {
        if (localCommand.deleted) {
          console.log(`❌ Skipping the regestering of deleted command ${name}`)
          continue
        }

        await applicationCommands.create({
          name,
          description,
          options
        })

        console.log(`👍 Registered command ${name}.`)
        continue
      }

      console.log(`⏺️  ${name} was already registered`)
    }
  } catch (error) {
    console.log(`There was an error - ${error}`)
  }
}
