import { ActivityType } from 'discord.js'
const status = [
  {
    name: 'palworld',
    type: ActivityType.Playing
  },
  {
    name: 'anime',
    type: ActivityType.Watching
  },
  {
    name: 'Heatwaves',
    type: ActivityType.Listening
  },
  {
    name: 'Smilie',
    emoji: '😊',
    state: `I am smiling`,
    type: ActivityType.Custom
  },
  {
    name: 'hoppip',
    type: ActivityType.Streaming,
    url: 'https://www.youtube.com/watch?v=EemI8jJtUlM&pp=ygUGaG9wcGlw'
  }
]

export default async client => {
  await console.log(`${client.user.username} has gotten online again`)

  setInterval(() => {
    let random = Math.floor(Math.random() * status.length)
    // console.log(random);

    client.user.setActivity(status[random])
  }, 15000)
}
