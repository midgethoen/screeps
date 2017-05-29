const P = require('./position')
const R = require('./ramda')

const CONTROLLER_DISTANCE_FACTOR = 1.1
const type = 'store'

Creep.prototype.store = function upgrade() {
  const { spawnId } = task
  const spawn = R.find(
    R.propEq('id', spawnId),
    this.room.getSpawns()
  )

  const result = this.transfer(spawn)
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

Creep.prototype.upgrade_worths = function upgradeWorths() {
  const controller = this.room.getController()
  const energyLoad = this.carry.energy
  const distance = P.length(P.subtract(this.pos, controller.pos))
  const worth = energyLoad / // amount to be gained
        (
          (energyLoad / this.getBuildCapacity()) // harvest time
          + (distance * this.getSpeed() * CONTROLLER_DISTANCE_FACTOR)// 1.1travel time
        )
  return {
    type,
    worth,
    sourceId: controller.id,
  }
}
