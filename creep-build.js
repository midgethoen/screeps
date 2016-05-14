var R = require('ramda')
var P = require('position')

const SITE_DISTANCE_FACTOR = 1.1
const type = 'build'

Creep.prototype.build = function (task) {
  const {constructionSiteId} = task
  const site = R.find(
    R.propEq('id', constructionSiteId),
    this.room.getConstructionSites()
  )
  switch (this.build(site)) {
    case OK:
      return

    case ERR_NOT_IN_RANGE:
      this.moveTo(site)
      return

    default:
      throw new Error('Unexpected build result')
  }
}

Creep.prototype.build_worts = function () {
  const sites = this.room.getConstructionSites()
  , energyLoad = this.carry.energy

  function evaluateSite(site) {
    var distance = P.difference(site.pos, this.pos)
      , worth = energyLoad / // amount to be gained
        (
          energyLoad / this.getBuildCapacity() // harvest time
          + distance * this.getSpeed() * SITE_DISTANCE_FACTOR //1.1travel time
        )
    return {
      type,
      worth,
      sourceId: site.id
    }
  }
  return sites.map(evaluateSite)
}
