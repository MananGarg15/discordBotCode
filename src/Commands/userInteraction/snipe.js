import { Client, ChatInputCommandInteraction, EmbedBuilder } from 'discord.js'
import dmodel from '../../modals/deletedMessageSchema.js'
import mongoose from 'mongoose'
import prettyMs from 'pretty-ms'

export default {
  name: 'snipe',
  // deleted: true,

  description: 'Shows the last deleted message in the server',

  /**
   *
   * @param {Client} client
   * @param {ChatInputCommandInteraction} interaction
   */
  callback: async (client, interaction) => {
    await interaction.deferReply()

    try {
      const deletedMessage = await dmodel.findOne({
        guildId: interaction.guild.id
      })

      if (deletedMessage) {
        const targetUserObj = await interaction.guild.members.fetch(
          deletedMessage.author
        )
        const sentAgo = interaction.createdTimestamp - deletedMessage.timeStamp

        const sentAgoTime = prettyMs(sentAgo)

        const embed = new EmbedBuilder()
          .setTitle(
            `🚮 ${targetUserObj.user.username} deleted a message in ${deletedMessage.channel}. `
          )
          .setDescription(`**content:**\n${deletedMessage.content}. `)
          .setThumbnail(targetUserObj.user.displayAvatarURL())
          .setFooter({
            text: `Time passed since message was deleted: ${sentAgoTime}`
          })

        interaction.channel.send({
          embeds: [embed]
        })

        await interaction.editReply({
          content: 'Last deleted message in the server retrieved!',
          ephemeral: true
        })
      } else {
        await interaction.editReply({
          content: 'No message has been deleted yet.',
          ephemeral: true
        })
      }
    } catch (error) {
      console.log('error occured in snipe', error)
    }
  }
}
