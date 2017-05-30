const P = require('./position')
const REVERSE_STATUSES = require('./reverseStatuses')

const CONTROLLER_DISTANCE_FACTOR = 1.1
const WORTH_FACTOR = 0.5
const type = 'upgrade'

Creep.prototype.upgrade = function upgrade() {
  const controller = this.room.getController()

  const result = this.upgradeController(controller)
  switch (result) {
    case OK:
      break

    case ERR_NOT_IN_RANGE:
      this.moveTo(controller)
      break

    default:
      throw new Error(`Unexpected controller result ${REVERSE_STATUSES[result]}`)
  }

  if (this.isEmpty()) {
    this.removeTask()
  }
}

Creep.prototype.upgrade_worths = function upgradeWorths() {
  const controller = this.room.getController()
  const energyLoad = this.carry.energy
  const distance = P.length(P.subtract(this.pos, controller.pos))
  const worth = (WORTH_FACTOR * energyLoad) / // amount to be gained
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
