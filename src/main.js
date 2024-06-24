import { Client, IntentsBitField } from 'discord.js'
import dot from 'dotenv'
import mongoose from 'mongoose'
import eventHandler from './Handlers/eventHandler.js'

dot.config()

const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
    IntentsBitField.Flags.GuildPresences
  ]
})

try {
  const conn = await mongoose.connect(process.env.mongoDBconn)
  console.log('Connected to Database')
  eventHandler(client)
  client.login(process.env.token)
} catch (error) {
  console.log(`Database connection failed ${error}`)
}
