const P = require('./position')
const R = require('./ramda')

const SPAWN_DISTANCE_FACTOR = 1.1
const type = 'store'

Creep.prototype.store = function store(task) {
  const spawn = this.room.getSpawn()

  const result = this.transfer(spawn, RESOURCE_ENERGY)
  switch (result) {
    case OK:
      break

    case ERR_NOT_IN_RANGE:
      this.moveTo(spawn)
      break

    default:
      throw new Error(`Unexpected transfer result ${result}`)
  }

  if (this.isEmpty()) {
    this.removeTask()
  }
}

Creep.prototype.store_worths = function storeWorths() {
  const spawn = this.room.getSpawn()
  const energyLoad = this.carry.energy
  const distance = P.length(P.subtract(this.pos, spawn.pos))
  const worth = energyLoad / // amount to be gained
        (
          (energyLoad / this.getBuildCapacity()) // harvest time
          + (distance * this.getSpeed() * SPAWN_DISTANCE_FACTOR)// 1.1travel time
        )
  return {
    type,
    worth,
  }
}
