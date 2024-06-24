import { RankCardBuilder, Font } from 'canvacord'
import { ApplicationCommandOptionType, AttachmentBuilder } from 'discord.js'
import weeklyLevels from '../../modals/weeklyLevels.js'
import levelUpXp from '../../utils/levelUpXp.js'
Font.loadDefault()
export default {
  name: 'weekly-level',
  //   deleted: true,

  description: "Shows your/someone's weekly level.",
  options: [
    {
      name: 'target-user',
      description: 'The user whose weekly level you want to see.',
      type: ApplicationCommandOptionType.Mentionable
    }
  ],

  callback: async (client, interaction) => {
    if (!interaction.inGuild()) {
      interaction.Reply('You can only run this command inside a server.')
      return
    }

    await interaction.deferReply()

    const mentionedUserId = interaction.options.get('target-user')?.value
    const targetUserId = mentionedUserId || interaction.member.id
    const targetUserObj = await interaction.guild.members.fetch(targetUserId)

    const fetchedLevel = await weeklyLevels.findOne({
      userID: targetUserId,
      guildID: interaction.guild.id
    })

    if (!fetchedLevel) {
      await interaction.editReply(
        mentionedUserId
          ? `${targetUserObj.user.tag} doesn't have levels yet. Wait for the user to talk more`
          : "You don't have enough levels yet. Talk a little more."
      )
      return
    }

    let allLevels = await weeklyLevels
      .find({ guildID: interaction.guild.id })
      .select('-_id userID xp level')

    allLevels.sort((a, b) => {
      if (a.level === b.level) {
        return b.xp - a.xp
      } else {
        return b.level - a.level
      }
    })

    let currentRank =
      allLevels.findIndex(lvl => lvl.userID === targetUserId) + 1

    const rank = new RankCardBuilder()
      .setAvatar(targetUserObj.user.displayAvatarURL({ size: 256 }))
      .setRank(currentRank)
      .setLevel(fetchedLevel.level)
      .setCurrentXP(fetchedLevel.xp)
      .setRequiredXP(levelUpXp(fetchedLevel.level))
      .setStatus(targetUserObj.presence?.status)
      .setStyles({
        progressbar: {
          thumb: { style: { backgroundColor: '#FFC250' } },
          track: { style: { backgroundColor: '#333333' } }
        },
        username: {
          handle: {
            style: {
              color: '#ff9100',
              'font-size': 32
            }
          }
        },
        statistics: {
          rank: {
            text: {
              style: {
                color: '#000',
                'font-size': 25
              }
            },
            value: {
              style: {
                color: '#000',
                'font-size': 25
              }
            }
          },

          level: {
            text: {
              style: {
                color: '#000',
                'font-size': 25
              }
            },
            value: {
              style: {
                color: '#000',
                'font-size': 25
              }
            }
          },

          xp: {
            text: {
              style: {
                color: '#000',
                'font-size': 25
              }
            },
            value: {
              style: {
                color: '#000',
                'font-size': 25
              }
            }
          }
        }
      })
      .setUsername(targetUserObj.user.username)
      .setBackground(
        'C:\\Users\\manan\\OneDrive\\Desktop\\discordBot\\Images\\level_background.jpg'
      )
      .setOverlay()

    const data = await rank.build()
    const attachment = new AttachmentBuilder(data)
    await interaction.editReply({ files: [attachment] })
  }
}
