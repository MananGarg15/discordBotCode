import { Message, Client } from 'discord.js'
import dmodel from '../../modals/deletedMessageSchema.js'

/**
 * @param {Message} message
 * @param {Client} client
 */
export default async (client, message) => {
  if (message.author.bot) return

  try {
    const dmessage = await dmodel.findOne({ guildId: message.guild.id })
    if (dmessage) {
      console.log('before updating', message.author.id)
      dmessage.author = message.author.id
      dmessage.content = message
      dmessage.channel = message.channel
      dmessage.timeStamp = message.createdTimestamp

      console.log('after updating', dmessage.author)
      await dmessage.save()
    } else {
      const dmessageDetails = new dmodel({
        guildId: message.guild.id,
        author: message.author.id,
        content: message,
        channel: message.channel,
        timeStamp: message.createdTimestamp
      })
      console.log('in else ', message.author)
      console.log(message.author.id)

      await dmessageDetails.save()
    }
  } catch (error) {
    console.log('There was an error storing/updating deleted message', error)
  }
}
