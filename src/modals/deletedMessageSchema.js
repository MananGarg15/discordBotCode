import { Message } from 'discord.js'
import mongoose from 'mongoose'

const deletedMessageSchema = new mongoose.Schema({
  guildId: {
    type: String,
    required: true,
    unique: true
  },
  author: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  channel: {
    type: String,
    required: true
  },

  timeStamp: {
    type: Number,
    required: true
  }
})

export default new mongoose.model('deletedMessage', deletedMessageSchema)
