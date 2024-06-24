import dot from 'dotenv'

import { REST, Routes, ApplicationCommandOptionType } from 'discord.js'
import options from 'dotenv/lib/env-options'

dot.config()

const commands = [
  {
    name: 'hey',
    description: 'replies with hey'
  },
  {
    name: 'ping',
    description: 'pings the user'
  },

  {
    name: 'multiply',
    description: 'multiplies two numbers',
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
        type: ApplicationCommandOptionType.Number,
        required: true,
        choices: [
          {
            name: 'hundred',
            description: 'times 100',
            value: 100
          },
          {
            name: 'thousand',
            description: 'times 1000',
            value: 1000
          },
          {
            name: 'lakh',
            description: 'times 100000',
            value: 100000
          }
        ]
      }
    ]
  },

  {
    name: 'embed',
    description: 'sends an embed'
  }
]

const rest = new REST({ version: 10 }).setToken(process.env.token)

try {
  console.log('Regestering commands...')

  await rest.put(
    Routes.applicationGuildCommands(process.env.clientID, process.env.guildID),
    { body: commands }
  )
  console.log('Commands regestered')
} catch (error) {
  console.log(error)
}
