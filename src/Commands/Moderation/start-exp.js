import { ChatInputCommandInteraction, Client } from 'discord.js'
import { PermissionFlagsBits } from 'discord.js'
import { Model } from 'mongoose'
import excludedChannels from '../../modals/stopExpChannels.js'

export default {
  name: 'start-exp',
  description: 'starts exp in the channel',
  // deleted: true,

  permissionsRequired: [PermissionFlagsBits.Administrator],

  /**
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */
  callback: async (client, interaction) => {
    await interaction.deferReply({ ephemeral: true })

    const targetChannel = await excludedChannels.findOne({
      guildId: interaction.guild.id,
      channelId: interaction.channel.id
    })

    if (targetChannel) {
      await excludedChannels.deleteOne({
        guildId: interaction.guild.id,
        channelId: interaction.channel.id
      })

      interaction.channel.send(
        `${interaction.channel} has been whitelisted successfully!`
      )

      await interaction.editReply(
        `To blacklist this channel use command: stop-exp`
      )
    } else {
      await interaction.editReply(
        `${interaction.channel} is already whitelisted. To blacklist it use command: stop-exp`
      )
    }
  }
}
