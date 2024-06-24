import mongoose from 'mongoose'

const levelSchema = new mongoose.Schema({
  userID: {
    type: String,
    required: true
  },
  guildID: {
    type: String,
    required: true
  },
  xp: {
    type: Number,
    default: 0
  },
  level: {
    type: Number,
    default: 0
  }
})

export const Level = new mongoose.model('Level', levelSchema)
