import { ChatInputCommandInteraction, Client } from 'discord.js'
import { ApplicationCommandOptionType, PermissionFlagsBits } from 'discord.js'
import roles from '../../StoredData/roles.js'
import botLog from '../../modals/botLogs.js'
export default {
  name: 'timeout-three',
  description: 'Timeouts the person for 3 min',
  //devOnly : boolean
  // deleted: true,

  //testOnly : boolean
  options: [
    {
      name: 'target-user',
      description: 'Timeout the person for 3 min',
      required: true,
      type: ApplicationCommandOptionType.Mentionable
    }
  ],

  // permissionsRequired: [PermissionFlagsBits.Administrator],
  // botPermissions: [PermissionFlagsBits.Administrator],
  /**
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */
  callback: async (client, interaction) => {
    await interaction.deferReply()
    const userObj = await interaction.guild.members.fetch(interaction.user.id)

    const hasPerm = userObj.roles.cache.has(
      roles.find(cmd => cmd.label === 'DCS-Heroes').id
    )

    if (!hasPerm) {
      await interaction.editReply(
        "You don't have enough roles to run this command!"
      )
      return
    }

    if (interaction.options.get('target-user')?.role || false) {
      await interaction.editReply({
        content: "You can't timeout a role"
      })
      return
    }
    const targetId = interaction.options.get('target-user').value

    const targetObj = await interaction.guild.members.fetch(targetId)

    if (!targetObj) {
      await interaction.editReply(`That user doesn't exist in the server.`)
      return
    }

    if (targetObj.user.bot) {
      await interaction.editReply("I can't timeout a bot.")
      return
    }
    const targetUserRolePosition = targetObj.roles.highest.position // Highest role of the target user
    const requestUserRolePosition = interaction.member.roles.highest.position // Highest role of the user running the cmd
    const botRolePosition = interaction.guild.members.me.roles.highest.position // Highest role of the bot

    if (targetUserRolePosition >= requestUserRolePosition) {
      await interaction.editReply(
        "You can't timeout that user because they have the same/higher role than you."
      )
      return
    }

    if (targetUserRolePosition >= botRolePosition) {
      await interaction.editReply(
        "I can't timeout that user because they have the same/higher role than me."
      )
      return
    }

    try {
      if (targetObj.isCommunicationDisabled()) {
        await interaction.editReply(`The user is already timed out.`)
        return
      }

      targetObj.timeout(180000)

      const bChannel = await botLog.findOne({
        guildId: interaction.guild.id
      })

      if (bChannel) {
        const targetChannel = await interaction.guild.channels.fetch(
          bChannel.channelId
        )
        targetChannel.send(
          `${targetObj.user} was timed out for 3 min by ${interaction.user} `
        )
      }
      await interaction.editReply({
        content: `${targetObj.user} has been timed out for 3 minutes`
      })
    } catch (error) {
      console.log('error timing out the user', error)
    }
    // interaction.options.get('timeout').value
  }
}
