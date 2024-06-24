import { ChatInputCommandInteraction, Client } from 'discord.js'
import { PermissionFlagsBits } from 'discord.js'
import { Model } from 'mongoose'
import adminChannels from '../../modals/administratorChannels.js'

export default {
  name: 'set-admin-channel',
  // deleted: true,

  description: 'sets the channel for admin work',

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
      await interaction.editReply(
        `${interaction.channel} is already set as admin channel. To remove it use command: remove-admin-channel`
      )
    } else {
      const eChannel = new adminChannels({
        guildId: interaction.guild.id,
        channelId: interaction.channel.id
      })
      await eChannel.save()
      interaction.channel.send(
        `${interaction.channel} has been successfully set as admin channel!`
      )
      await interaction.editReply(
        `To remove this channel use command: remove-admin-channel`
      )
    }
  }
}
