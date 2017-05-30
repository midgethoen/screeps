const P = require('./position')
const R = require('./ramda')

const SPAWN_DISTANCE_FACTOR = 1.1
const type = 'store'

Creep.prototype.store = function store(task) {
  const { storageSturctureId } = task
  const storageSturcture = Game.getObjectById(storageSturctureId)

  const result = this.transfer(storageSturcture, RESOURCE_ENERGY)
  switch (result) {
    case OK:
      break

    case ERR_NOT_IN_RANGE:
      this.moveTo(storageSturcture)
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
  const extensions = this.room.getExtensions()
  const load = R.sum(R.values(this.carry))
  const evaluateStorage = (storageSturcture) => {
    const distance = P.length(P.subtract(this.pos, storageSturcture.pos))
    const tranferable = Math.min(load, storageSturcture.energyCapacity - storageSturcture.energy)
    const worth = tranferable / // amount to be gained
    (
      (tranferable / this.getBuildCapacity()) // harvest time
      + (distance * this.getSpeed() * SPAWN_DISTANCE_FACTOR)// 1.1travel time
    )
    return {
      debug: {
        tranferable,
        distance,
        speed: this.getSpeed(),
        buildCapacity: this.getBuildCapacity(),
      },
      type,
      worth,
      storageSturctureId,
    }
  }
  return [spawn, ...extensions].map(evaluateStorage)
}
