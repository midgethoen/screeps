var R = require('ramda')
var P = require('position')

const type = 'harvest'
/**
 * Perform the harvest task:
 *  1: look for most beneficial place to harvest
 *  2: move to harvest place
 *  3: harvest until full
 * @param task {object} - the task description
 */
Creep.prototype.harvest = function (task) {

}

/**
 * Calculate the worth of avaiable harves tasks
 * account for:
 * 1. travel time to source
 * 2. carrying capacity
 * 3. harvesting speed
 * 4. availability of source
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
    return {
      type,
      worth,
      sourceId: source.
    }
  }
  return sources.map(evaluateSource)
}
