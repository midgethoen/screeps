var R = require('ramda')

exports.equals = function equals(pos1, pos2){
  return R.equals(pos1, pos2)
}

function subtract(pos1, pos2) {
  return new RoomPosition(
    pos1.x - pos2.x,
    pos1.y - pos2.y,
    (pos1.room == pos2.room)?pos1.room:undefined
  )
}

function absolute(pos) {
  return {
    x: Math.abs(pos.x),
    y: Math.abs(pos.y)
  }
}

var memSqrt = R.memoize(Math.sqrt)
function length(p) {
  return memSqrt(p.x * p.x, p.y * p.y)
}

exports.absolute = absolute
exports.length = length
exports.subtract = subtract
exports.difference = R.pipe(subtract, absolute, length)
