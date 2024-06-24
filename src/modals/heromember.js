import mongoose from 'mongoose'

const heroMemberSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  guildId: {
    type: String,
    required: true
  }
})

export default new mongoose.model('heroMember', heroMemberSchema)
