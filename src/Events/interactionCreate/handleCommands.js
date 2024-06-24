import { PermissionFlagsBits } from 'discord.js'
import getLocalCommands from '../../utils/getLocalCommands.js'
import { createRequire } from 'module'
const require = new createRequire(import.meta.url)
const { testServer, devs } = require('../../../config.json')

export default async (client, interaction) => {
  if (!interaction.isChatInputCommand()) return

  const localCommands = await getLocalCommands()

  try {
    const commandObject = localCommands.find(
      cmd => cmd.name === interaction.commandName
    )

    if (!commandObject) {
      interaction.reply({
        content: "The command doesn't exist",
        ephemeral: true
      })
      return
    }

    if (commandObject.devOnly) {
      if (!devs.includes(interaction.member.id)) {
        interaction.reply({
          content: `Only devs are allowed to use this command`,
          ephemeral: true
        })
        return
      }
    }

    if (commandObject.testOnly) {
      if (!testServer === interaction.guild.id) {
        interaction.reply({
          content: "This command can't be used in this server",
          ephemeral: true
        })
        return
      }
    }

    if (commandObject.permissionsRequired?.length) {
      for (const permission of commandObject.permissionsRequired) {
        if (!interaction.member.permissions.has(permission)) {
          interaction.reply({
            content: "You don't have enough permissions to run this command",
            ephemeral: true
          })
          return
        }
      }
    }
    if (commandObject.botPermissions?.length) {
      for (const permission of commandObject.botPermissions) {
        if (!interaction.guild.members.me.permissions.has(permission)) {
          interaction.reply({
            content: "I don't have enough permissions to run this command",
            ephemeral: true
          })
          return
        }
      }
    }

    await commandObject.callback(client, interaction)
  } catch (error) {
    console.log(`There was an error in handCommands - ${error}`)
  }
}
