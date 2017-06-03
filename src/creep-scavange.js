const R = require('./ramda')
const P = require('./position')
const REVERSE_STATUSES = require('./reverseStatuses')

const type = 'scavange'
const RESOURCE_DISTANCE_FACTOR = 0.5

Creep.prototype.perform_scavange = function (task) {
  const { resourceId } = task
  const resource = Game.getObjectById(resourceId)

  if (!resource) {
    this.removeTask()
    return
  }

  const result = this.pickup(resource)
  switch (result) {
    case OK:
      this.removeTask()
      return

    case ERR_NOT_IN_RANGE:
      this.moveTo(resource)
      break

    default:
      const err = new Error(`Unexpected scavange result: ${REVERSE_STATUSES[res]}`)
      err.debug = {
        resource,
        screep: this,
      }
      throw err
  }
}

Creep.prototype.scavange_worths = function () {
  const resources = this.room.find(
    FIND_DROPPED_RESOURCES,
    { filter: { resourceType: 'energy' } }
  )

  const capacity = this.carryCapacity
  const load = R.sum(R.values(this.carry))
  const capacityLeft = capacity - load
  const evaluateResource = (resource) => {
    const distance = Math.max(1, P.length(P.subtract(resource.pos, this.pos)))
    const energy = resource.energy
    const worth = (Math.min(capacityLeft, energy)) / // amount to be gained
          (
            (distance * this.getSpeed() * RESOURCE_DISTANCE_FACTOR) // travel time
          )

    return {
      debug: {
        load,
        distance,
        energy,
        capacityLeft,
        speed: this.getSpeed(),
      },
      type,
      worth,
      resourceId: resource.id,
    }
  }

  return resources.map(evaluateResource)
}
