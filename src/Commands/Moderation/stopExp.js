import { ChatInputCommandInteraction, Client } from 'discord.js'
import { PermissionFlagsBits } from 'discord.js'
import { Model } from 'mongoose'
import excludedChannels from '../../modals/stopExpChannels.js'

export default {
  name: 'stop-exp',
  description: 'stops exp in the channel',
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
      await interaction.editReply(
        `${interaction.channel} is already blacklisted. To whitelist it again use command: start-exp`
      )
    } else {
      const eChannel = new excludedChannels({
        guildId: interaction.guild.id,
        channelId: interaction.channel.id
      })
      await eChannel.save()
      interaction.channel.send(
        `${interaction.channel} has been successfully blacklisted!`
      )
      await interaction.editReply(
        `To whitelist this channel use command: start-exp`
      )
    }
  }
}
