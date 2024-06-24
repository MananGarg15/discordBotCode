import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js'

const roles = [
  {
    id: '1251376963663302677',
    label: 'Pink'
  },
  {
    id: '1251377054515986443',
    label: 'Blu'
  },
  {
    id: '1251377100666179615',
    label: 'Green'
  }
]

export default async client => {
  try {
    const channel = await client.channels.cache.get('1251376925918756957')
    if (!channel) return

    const row = new ActionRowBuilder()

    roles.forEach(item => {
      row.components.push(
        new ButtonBuilder()
          .setCustomId(item.id)
          .setLabel(item.label)
          .setStyle(ButtonStyle.Primary)
      )
    })

    await channel.send({
      content: 'Choose a role color',
      components: [row]
    })
  } catch (error) {
    console.log(error)
  }
}
