import canvacord from 'canvacord'
import { Level } from '../../modals/level.js'
import {
  Client,
  ChatInputCommandInteraction,
  AttachmentBuilder
} from 'discord.js'

export default {
  name: 'lb',
  description: 'Shows top 10 ranks on leaderboard.',
  // deleted: true,

  /**
   *
   * @param {Client} client
   * @param {ChatInputCommandInteraction} interaction
   */
  callback: async (client, interaction) => {
    if (!interaction.inGuild()) {
      interaction.Reply('You can only run this command inside a server.')
      return
    }

    await interaction.deferReply()

    let allLevels = await Level.find({ guildID: interaction.guild.id }).select(
      '-_id userID xp level'
    )
    await allLevels

    allLevels.sort((a, b) => {
      if (a.level === b.level) {
        return b.xp - a.xp
      } else {
        return b.level - a.level
      }
    })

    const card = new canvacord.LeaderboardBuilder()
    let storedCards = []
    for (let i = 0; i < 10; i++) {
      if (i >= allLevels?.length) break
      const targetUserId = allLevels[i]?.userID
      if (!targetUserId) break

      const targetUserObj = await interaction.guild.members.fetch(targetUserId)

      const currentRank = i + 1

      let pfp = targetUserObj.user.displayAvatarURL({
        size: 256,
        extension: 'png'
      })
      if (targetUserObj.user.displayAvatarURL().endsWith('.gif')) {
        pfp =
          'C:\\Users\\manan\\OneDrive\\Desktop\\discordBot\\Images\\branislav-rodman-6Y4wlHeiGhM-unsplash.jpg'
      }

      const rank = {
        avatar: pfp,
        displayName: targetUserObj.user.displayName,
        level: allLevels[i].level,
        rank: currentRank,
        username: targetUserObj.user.username,
        xp: allLevels[i].xp
      }

      storedCards.push(rank)
    }
    if (storedCards.length === 0) {
      await interaction.editReply({
        content:
          'There are no rankings yet. Let people start talking in your server!'
      })
      return
    }
    card
      .setHeader({
        title: 'DCS Leaderboard',
        image:
          'C:\\Users\\manan\\OneDrive\\Desktop\\discordBot\\Images\\Screenshot 2024-06-22 173243.png',
        subtitle: 'Top 10 members'
      })
      .setPlayers(storedCards)
      .setVariant('horizontal')
      .setBackground(
        'C:\\Users\\manan\\OneDrive\\Desktop\\discordBot\\Images\\leaderboard_background.jpg'
      )

    const data = await card.build({ format: 'png' })
    const attachment = new AttachmentBuilder(data)

    await interaction.editReply({ files: [attachment] })
  }
}
