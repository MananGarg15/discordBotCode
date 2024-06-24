export default {
  name: 'hey',
  description: 'replies with hey',
  // deleted: true,

  callback: (client, interaction) => {
    interaction.reply('Hey! How are you?')
  }
}
