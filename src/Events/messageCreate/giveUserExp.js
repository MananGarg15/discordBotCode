import { Client, Message } from 'discord.js'
import dot from 'dotenv'
import { Level } from '../../modals/level.js'
import weeklyLevels from '../../modals/weeklyLevels.js'
import excludedChannels from '../../modals/stopExpChannels.js'
import levelUpExp from '../../utils/levelUpXp.js'
dot.config()

function randomXP (min, max) {
  min = Math.ceil(min)
  max = Math.ceil(max)
  // console.log(Math.floor(Math.random() * (max - min + 1) + min))
  return Math.floor(Math.random() * (max - min + 1) + min)
}

/**
 * @param {Client} client
 * @param {Message} message
 */

export default async (client, message) => {
  if (message.author.bot || !message.inGuild()) return

  const eChannel = await excludedChannels.findOne({
    guildId: message.guild.id,
    channelId: message.channel.id
  })

  if (eChannel) return

  const length = message.content.length
  let xpToGive
  if (length < 3) xpToGive = 1
  else if (length < 6) xpToGive = randomXP(2, 5)
  else if (length < 11) xpToGive = randomXP(6, 10)
  else if (length < 31) xpToGive = randomXP(11, 20)
  else if (length < 101) xpToGive = randomXP(21, 30)
  else if (length < 501) xpToGive = randomXP(31, 40)
  else xpToGive = randomXP(41, 50)

  const query = {
    userID: message.author.id,
    guildID: message.guild.id
  }

  try {
    const level = await Level.findOne(query)

    if (level) {
      level.xp += xpToGive
      if (level.xp >= levelUpExp(level.level)) {
        level.xp = 0
        level.level += 1
        message.channel.send(
          `Congratulations! ${message.member}. You have levelled up to 🎊 **level - ${level.level}** 🎊`
        )

        await level.save().catch(e => console.log('Error saving data', e))
      } else {
        await level.save().catch(e => console.log('error updating xp', e))
      }
    } else {
      const newLevel = new Level({
        userID: message.author.id,
        guildID: message.guild.id,
        xp: xpToGive
      })

      await newLevel
        .save()
        .catch(e => console.log('error creating new data', e))
    }
    const weeklyLevel = await weeklyLevels.findOne(query)

    if (weeklyLevel) {
      weeklyLevel.xp += xpToGive
      if (weeklyLevel.xp >= levelUpExp(weeklyLevel.level)) {
        weeklyLevel.xp = 0
        weeklyLevel.level += 1

        await weeklyLevel
          .save()
          .catch(e => console.log('Error saving weekly data', e))
      } else {
        await weeklyLevel
          .save()
          .catch(e => console.log('error updating weekly xp', e))
      }
    } else {
      const newLevel = new weeklyLevels({
        userID: message.author.id,
        guildID: message.guild.id,
        xp: xpToGive
      })

      await newLevel
        .save()
        .catch(e => console.log('error creating new weekly data', e))
    }
  } catch (error) {
    console.log('error in weekly levelling - ', error)
  }
}
