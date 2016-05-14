var P = require('position')

const CONTROLLER_DISTANCE_FACTOR = 1.1
const type = 'upgrade'

Creep.prototype.build = function () {
  const controller = this.room.getController()

  switch (this.upgradeController(controller)) {
    case OK:
      return

    case ERR_NOT_IN_RANGE:
      this.moveTo(controller)
      return

    default:
      throw new Error('Unexpected controller result')
  }
}

Creep.prototype.build_worts = function () {
  const controller = this.room.getController()
      , energyLoad = this.carry.energy
      , distance = P.difference(controller.pos, this.pos)
      , worth = energyLoad / // amount to be gained
        (
          energyLoad / this.getBuildCapacity() // harvest time
          + distance * this.getSpeed() * CONTROLLER_DISTANCE_FACTOR //1.1travel time
        )
  return {
    type,
    worth,
    sourceId: controller.id
  }
}
