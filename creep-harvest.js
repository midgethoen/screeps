var R = require('ramda')
var P = require('position')

const type = 'harvest'
/**
 * Factor to increase cost of distance to source with
 *  2 because we generally need to go back from the source..
 *  In reality it will probably be smaller because the creep will
 *  find something useful to do which is closer by on average
 * @type {Number}
 */
const SOURCE_DISTANCE_FACTOR = 2

/**
 * Perform the harvest task:
 *  1: look for most beneficial place to harvest
 *  2: move to harvest place
 *  3: harvest until full
 * @param task {object} - the task description
 */
Creep.prototype.harvest = function (task) {
  const {sourceId} = task
  var source = R.find(
    R.propEq('id',sourceId,
    this.room.getSources())
  )
  switch (this.harvest(source)) {
    case OK:
      return

    case ERR_NOT_IN_RANGE:
      this.moveTo(source)
      return

    default:
      throw new Error('Unexpected harvest result')

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
  var sources = this.room.getSources()
    , capacity = this.carryCapacity
    , load = R.sum(R.values(this.carry))

  function evaluateSource(source) {
    var distance = P.difference(source.pos, this.pos)
      , capacityLeft = capacity - load
      //TODO: account for source availability
      , worth = capacityLeft / // amount to be gained
          (
            capacityLeft / this.getHarvestCapacity() // harvest time
            + distance * this.getSpeed() * SOURCE_DISTANCE_FACTOR // travel time
          )

    return {
      type,
      worth,
      sourceId: source.id
    }
  }
  return sources.map(evaluateSource)
}
