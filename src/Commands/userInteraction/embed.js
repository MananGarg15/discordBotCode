import { EmbedBuilder } from 'discord.js'

export default {
  name: 'embed',
  // deleted: true,

  description: 'sends an embed',

  callback: (client, interaction) => {
    const embed = new EmbedBuilder()
      .setTitle('new embed')
      .setDescription('This is the embed')
      .setAuthor({ name: 'Dark' })
      .setColor('Random')

    interaction.reply({
      content: 'The embed is sent',
      ephemeral: true
    })

    interaction.channel.send({
      embeds: [embed]
    })
  }
}
