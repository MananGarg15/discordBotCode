import { ChatInputCommandInteraction, Client } from 'discord.js'
import { PermissionFlagsBits } from 'discord.js'
import { Model } from 'mongoose'
import botChannel from '../../modals/botAnnouncementChannel.js'

export default {
  name: 'set-bot-announcement',
  //   deleted: true,

  description:
    'Sets the channel for bot announcements. Only one channel can be set at a time.',

  permissionsRequired: [PermissionFlagsBits.Administrator],

  /**
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */
  callback: async (client, interaction) => {
    await interaction.deferReply({ ephemeral: true })

    const isExist = await botChannel.findOne({
      guildId: interaction.guild.id
    })

    if (isExist) {
      //   await botChannel.findOne({ guildId: interaction.guild.id })
      isExist.channelId = interaction.channel.id

      await isExist.save()
      await interaction.editReply(
        `${interaction.channel} has been set for bot announcements. If a new channel is set, this will be automatically deselected.`
      )
      return
    }

    const eChannel = new botChannel({
      guildId: interaction.guild.id,
      channelId: interaction.channel.id
    })
    await eChannel.save()
    await interaction.editReply(
      `${interaction.channel} has been set first for bot announcements. If a new channel is set, this will be automatically deselected.`
    )
    return
  }
}
