const P = require('./position')

const CONTROLLER_DISTANCE_FACTOR = 1.1
const type = 'upgrade'

Creep.prototype.upgrade = function upgrade() {
  const controller = this.room.getController()

  switch (this.upgradeController(controller)) {
    case OK:
      break

    case ERR_NOT_IN_RANGE:
      this.moveTo(controller)
      break

    default:
      throw new Error(`Unexpected controller result ${result}`)
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
