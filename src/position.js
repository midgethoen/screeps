const R = require('ramda')

exports.equals = function equals(pos1, pos2) {
  return R.equals(pos1, pos2)
}

function subtract(pos1, pos2) {
  // console.log(JSON.stringify([pos1, pos2], null, 2))
  return new RoomPosition(
    pos1.x - pos2.x,
    pos1.y - pos2.y,
    (pos1.roomName === pos2.roomName) ? pos1.roomName : null
  )
}

function absolute(pos) {
  return {
    x: Math.abs(pos.x),
    y: Math.abs(pos.y),
  }
}

function length(p) {
  // Pythagoras wont be accurate here,
  // considering that diagonal movement is as costly as orthagonal movement,
  // the longest distance can be considered the total distance... (how weird)
  return Math.max(Math.abs(p.x), Math.abs(p.y))
}

exports.absolute = absolute
exports.length = length
exports.subtract = subtract