import mongoose from 'mongoose'

const botLogsSchema = new mongoose.Schema({
  guildId: {
    type: String,
    required: true,
    unique: true
  },

  channelId: {
    type: String,
    required: true
  }
})

export default new mongoose.model('botLogs', botLogsSchema)
