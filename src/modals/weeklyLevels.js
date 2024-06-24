import mongoose from 'mongoose'

const weeklyLevelSchema = new mongoose.Schema({
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

export default new mongoose.model('WeeklyLevels', weeklyLevelSchema)
