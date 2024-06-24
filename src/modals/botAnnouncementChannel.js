import mongoose from 'mongoose'

const botAnnouncementChannelSchema = new mongoose.Schema({
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

export default new mongoose.model(
  'botAnnouncementChannels',
  botAnnouncementChannelSchema
)
