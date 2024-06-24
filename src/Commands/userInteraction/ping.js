import {
  ChatInputCommandInteraction,
  ApplicationCommandOptionType
} from 'discord.js'
import botLog from '../../modals/botLogs.js'
export default {
  name: 'ping',
  description: 'pings the user',
  // deleted: true,

  options: [
    {
      name: 'user-to-ping',
      description: 'Pings the selected user',
      type: ApplicationCommandOptionType.Mentionable
    }
  ],
  /**
   * @param {ChatInputCommandInteraction}interaction
   */
  callback: async (client, interaction) => {
    await interaction.deferReply({ ephemeral: true })

    if (interaction.options.get('user-to-ping')?.role || false) {
      await interaction.editReply({
        content: "You can't ping a role"
      })
      return
    }
    const mentionedUserId = interaction.options.get('user-to-ping')?.value

    const targetUser = await interaction.guild.members.fetch(
      mentionedUserId || interaction.user.id
    )

    interaction.channel.send(`${targetUser} You are pinged.`)

    const bChannel = await botLog.findOne({
      guildId: interaction.guild.id
    })

    if (bChannel) {
      const targetChannel = await interaction.guild.channels.fetch(
        bChannel.channelId
      )
      targetChannel.send(`${targetUser} was pinged by ${interaction.user} `)
    }
    await interaction.editReply({
      content: 'Ping successful!'
    })
  }
}
