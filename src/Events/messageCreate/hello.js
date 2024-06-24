import { PermissionFlagsBits } from 'discord.js'
// import { Permissions } from 'discord.js'

export default async (client, msg) => {
  if (msg.author.bot) return
  if (msg.content === 'hello') {
    msg.reply(`Hello ${msg.author}! Welcome to ${msg.guild.name}`)
  }
}
