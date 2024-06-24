import { ApplicationCommandOptionType } from 'discord.js'

export default {
  name: 'multiply',
  description: 'multiplies two numbers',
  // deleted: true,
  options: [
    {
      name: 'first-num',
      description: 'enter first num',
      type: ApplicationCommandOptionType.Number,
      required: true
    },
    {
      name: 'second-num',
      description: 'enter second num',
      type: ApplicationCommandOptionType.Integer,
      required: true,
      choices: [
        {
          name: 'hundred',
          //   description: 'times 100',
          value: 100
        },
        {
          name: 'thousand',
          //   description: 'times 1000',
          value: 1000
        },
        {
          name: 'lakh',
          //   description: 'times 100000',
          value: 100000
        }
      ]
    }
  ],

  callback: (client, interaction) => {
    const n1 = interaction.options.get('first-num')?.value
    const n2 = interaction.options.get('second-num').value

    interaction.reply({
      content: `The result of ${n1}*${n2} is ${n1 * n2}`
    })
  }
}
