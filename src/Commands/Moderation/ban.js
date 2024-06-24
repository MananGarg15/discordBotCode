import { ApplicationCommandOptionType, PermissionFlagsBits } from 'discord.js'

export default {
  name: 'ban',
  description: 'Bans the person from the server',
  //devOnly : boolean
  // deleted: true,

  //testOnly : boolean
  options: [
    {
      name: 'ban',
      description: 'Ban the person from the server',
      required: true,
      type: ApplicationCommandOptionType.Mentionable
    },
    {
      name: 'reason',
      description: 'Mention the reason for ban',
      type: ApplicationCommandOptionType.String
    }
  ],

  // permissionsRequired: [PermissionFlagsBits.Administrator],
  // botPermissions: [PermissionFlagsBits.Administrator],

  callback: (client, interaction) => {
    interaction.reply(
      `${
        interaction.options.get('ban').user ||
        interaction.options.get('ban').role
      } has been banned from the server`
    )
  }
}
