import { Client, ChatInputCommandInteraction } from 'discord.js'

export default {
  name: 'show-ping',
  description: 'Shows bot ping in ms.',
  //devOnly : boolean
  //testOnly : boolean
  //options: Object[]
  // deleted: true,

  /**
   *
   * @param {Client} client
   * @param {ChatInputCommandInteraction} interaction
   *
   *
   *
   */

  callback: async (client, interaction) => {
    await interaction.deferReply()

    const response = await interaction.fetchReply()
    const responseTime = response.createdTimestamp
    // console.log(responseTime)

    const requestTime = interaction.createdTimestamp
    // console.log(requestTime)

    const ping = responseTime - requestTime

    await interaction.editReply(
      `Client : ${ping}ms| Websocket : ${client.ws.ping}ms `
    )
    // await interaction.editReply(`The ping is ${client.ws.ping}ms `)
  }
}
