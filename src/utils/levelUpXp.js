// import { Level } from '../modals/level'
// let sum = 0
export default function Level (level) {
  let xp
  if (level === 0) {
    xp = 50
    // sum += xp
    level += 1
    return xp
  } else {
    xp = Math.ceil(Level(level - 1) * (1 + 2.2 / level))
    // sum += xp
    // console.log(level, xp, sum / 20 / 24 / 60)
    level += 1
    return xp
  }
}

// console.log(Level(120))
