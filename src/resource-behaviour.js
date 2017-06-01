const P = require('./position')
const R = require('./ramda')

const AVAILABILITY_WINDOW_SIZE = 1000

Source.prototype.loop = function () {
  this.trackAvailability()
  // console.log(`Source ${this.id} availability is ${this.getAvailability()}`)
}

Source.prototype.trackAvailability = function () {
  const query = this.room.lookAtArea(this.pos.y - 1, this.pos.x - 1, this.pos.y + 1, this.pos.x + 1, true)
  const results = R.countBy(x => x.type + (x.terrain || ''), query)
  const availability =
    this.energy === 0 ?
      0 :
      ((results.terrainplain || 0) + (results.terrainsmap || 0)) - (results.creep || 0)

  const mem = this.getMemory()
  if (!mem.availability) {
    mem.availability = []
  }
  while (mem.availability.length >= AVAILABILITY_WINDOW_SIZE) {
    mem.availability.shift()
  }
  mem.availability.push(availability)
}

Source.prototype.getAvailability = function () {
  const { availability } = this.getMemory()
  if (this._availability === undefined) {
    this._availability = R.sum(availability) / availability.length
  }
  return this._availability
}

Source.prototype.getMemory = function () {
  if (!Memory.sources) {
    Memory.sources = {}
  }
  if (!Memory.sources[this.id]) {
    Memory.sources[this.id] = {}
  }
  return Memory.sources[this.id]
}
