const R = require('./ramda')
const P = require('./position')
const REVERSE_STATUSES = require('./reverseStatuses')

const type = 'harvest'

/**
 * Factor to increase cost of distance to source with
 *  2 because we generally need to go back from the source..
 *  In reality it will probably be smaller because the creep will
 *  find something useful to do which is closer by on average
 * @type {Number}
 */
const SOURCE_DISTANCE_FACTOR = 0.5

// Creep.prototype.harvest = Creep.prototype.harvest
/**
 * Perform the harvest task:
 *  1: look for most beneficial place to harvest
 *  2: move to harvest place
 *  3: harvest until full
 * @param task {object} - the task description
 */
Creep.prototype.perform_harvest = function (task) {
  const { sourceId } = task
  const source = R.find(
    R.propEq('id', sourceId),
    this.room.getSources()
  )

  if (source.energy === 0) {
    this.removeTask()
    return
  }

  const res = this.harvest(source)
  switch (res) {
    case OK:
      break

    case ERR_NOT_IN_RANGE:
      this.moveTo(source)
      break

    default:
      const err = new Error(`Unexpected harvest result: ${REVERSE_STATUSES[res]}`)
      err.debug = {
        source,
        screep: this,
      }
      throw err
  }

  if (this.isFull()) {
    this.removeTask()
  }
}

/**
 * Calculate the worth of avaiable harves tasks
 * account for:
 * 1. travel time to source
 * 2. carrying capacity
 * 3. harvesting speed
 * 4. availability of source (too busy there?)
 * 5. current energy
 * @return {number} - Value estimate for performing this task
 *  normalized to value in energy/tick
 */
Creep.prototype.harvest_worths = function () {
  const sources = this.room.getSources()
  const capacity = this.carryCapacity
  const load = R.sum(R.values(this.carry))
  const capacityLeft = capacity - load
  const evaluateSource = (source) => {
    const distance = P.length(P.subtract(source.pos, this.pos))
    const availability = source.getAvailability()
    const availabilityFactor = Math.min(availability, 1)
    const energy = source.energy
    const worth = (availabilityFactor * Math.min(capacityLeft, energy)) / // amount to be gained
          (
            (capacityLeft / this.getHarvestCapacity()) // harvest time
            + (distance * this.getSpeed() * SOURCE_DISTANCE_FACTOR) // travel time
          )

    return {
      debug: {
        load,
        distance,
        availability,
        availabilityFactor,
        speed: this.getSpeed(),
        buildCapacity: this.getBuildCapacity(),
      },
      type,
      worth,
      sourceId: source.id,
    }
  }
  const rv = sources.map(evaluateSource)
  return rv
}
