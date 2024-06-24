import { ChatInputCommandInteraction, Client } from 'discord.js'
import { PermissionFlagsBits } from 'discord.js'
import { Model } from 'mongoose'
import weeklyLevels from '../../modals/weeklyLevels.js'
import adminChannels from '../../modals/administratorChannels.js'

export default {
  name: 'reset-weekly',
  //   deleted: true,

  description: 'resets the weekly exp',

  permissionsRequired: [PermissionFlagsBits.Administrator],

  /**
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */
  callback: async (client, interaction) => {
    await interaction.deferReply({ ephemeral: true })

    const targetChannel = await adminChannels.findOne({
      guildId: interaction.guild.id,
      channelId: interaction.channel.id
    })

    if (!targetChannel) {
      await interaction.editReply(
        'This command can only be run in an admin channel. To set a channel as admin channel use command: set-admin-channel'
      )
      return
    }

    await weeklyLevels.deleteMany({
      guildID: interaction.guild.id
    })

    interaction.channel.send('The weekly levels have been reset successfully!')

    await interaction.editReply(`Reset successful`)
  }
}
