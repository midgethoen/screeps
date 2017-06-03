const P = require('./position')
const REVERSE_STATUSES = require('./reverseStatuses')

const CONTROLLER_DISTANCE_FACTOR = 1.1
const WORTH_FACTOR = 0.5
const type = 'upgrade'

Creep.prototype.perform_upgrade = function upgrade() {
  const controller = this.room.getController()

  // if too crowded move towards controller
  // (give other creeps space)
  const pos = this.pos
  const distance = P.length(P.absolute(P.subtract(pos, controller.pos)))
  if (distance === 3) {
    let directNeighbours = 0
    const checkNeighbours = (x, y) => {
      if (this.room.lookAt(pos.x + x, pos.y + y).filter(r => r.type === 'creep').length) {
        directNeighbours++
      }
    }
    checkNeighbours(-1, 0)
    checkNeighbours(1, 0)
    checkNeighbours(0, -1)
    checkNeighbours(0, 1)

    if (directNeighbours > 1) {
      this.moveTo(controller)
      return
    }
  }

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
  if (!controller) {
    return []
  }
  const energyLoad = this.carry.energy
  const distance = P.length(P.subtract(this.pos, controller.pos))
  const worth = (WORTH_FACTOR * energyLoad) / // amount to be gained
        (
          (energyLoad / this.getBuildCapacity()) // harvest time
          + (distance * this.getSpeed() * CONTROLLER_DISTANCE_FACTOR)// 1.1travel time
        )
  return [{
    type,
    worth,
    sourceId: controller.id,
  }]
}
