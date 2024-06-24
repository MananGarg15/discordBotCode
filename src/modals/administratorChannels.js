import mongoose from 'mongoose'

const administratorChannelsSchema = new mongoose.Schema({
  guildId: {
    type: String,
    required: true
  },

  channelId: {
    type: String,
    required: true
  }
})

export default new mongoose.model('adminChannels', administratorChannelsSchema)
