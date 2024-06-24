import { ChatInputCommandInteraction, Client } from 'discord.js'
import { PermissionFlagsBits } from 'discord.js'
import { Model } from 'mongoose'
import adminChannels from '../../modals/administratorChannels.js'

export default {
  name: 'remove-admin-channel',
  // deleted: true,

  description: 'removes the channel from admin-channels',

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

    if (targetChannel) {
      await adminChannels.deleteOne({
        guildId: interaction.guild.id,
        channelId: interaction.channel.id
      })

      interaction.channel.send(
        `${interaction.channel} is not an admin channel anymore!`
      )

      await interaction.editReply(
        `To set this channel as admin channel use command: set-admin-channel`
      )
    } else {
      await interaction.editReply(
        `${interaction.channel} is not an admin channel. To set it as admin channel use command: set-admin-channel`
      )
    }
  }
}
