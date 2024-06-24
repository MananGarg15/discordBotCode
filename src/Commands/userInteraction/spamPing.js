import {
  ChatInputCommandInteraction,
  ApplicationCommandOptionType
} from 'discord.js'
import botLog from '../../modals/botLogs.js'

import roles from '../../StoredData/roles.js'
export default {
  name: 'spam-ping',
  description: 'spam pings the target for 10 seconds',
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

    const userObj = await interaction.guild.members.fetch(interaction.user.id)
    const hasPerm = userObj.roles.cache.has(
      roles.find(cmd => cmd.label === 'Dynamic-Dwellers').id
    )
    const hasPerm2 = userObj.roles.cache.has(
      roles.find(cmd => cmd.label === 'DCS-Heroes').id
    )

    if (!(hasPerm || hasPerm2)) {
      await interaction.editReply(
        "You don't have enough roles to run this command!"
      )
      return
    }

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

    let i = 10
    const stopId = setInterval(() => {
      if (i <= 0) clearInterval(stopId)
      i -= 1
      interaction.channel.send(`${targetUser} You are spam pinged!`)
    }, 500)

    const bChannel = await botLog.findOne({
      guildId: interaction.guild.id
    })

    if (bChannel) {
      const targetChannel = await interaction.guild.channels.fetch(
        bChannel.channelId
      )
      targetChannel.send(
        `${targetUser} was spam pinged by ${interaction.user} `
      )
    }

    await interaction.editReply({
      content: 'Ping successful!'
    })
  }
}
