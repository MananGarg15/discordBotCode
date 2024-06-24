import mongoose from 'mongoose'

const stopExpChannelSchema = new mongoose.Schema({
  guildId: {
    type: String,
    required: true
  },

  channelId: {
    type: String,
    required: true
  }
})

export default new mongoose.model('excludedChannels', stopExpChannelSchema)
