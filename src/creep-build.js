const R = require('./ramda')
const P = require('./position')

const SITE_DISTANCE_FACTOR = 1.1
const type = 'build'

Creep.prototype.build = function build(task) {
  const { constructionSiteId } = task
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

Creep.prototype.build_worths = function buildWorths() {
  const sites = this.room.getConstructionSites()
  const energyLoad = this.carry.energy

  function evaluateSite(site) {
    const distance = P.length(site.pos, this.pos)
    const worth = energyLoad / // amount to be gained
        (
          (energyLoad / this.getBuildCapacity()) // harvest time
          + (distance * this.getSpeed() * SITE_DISTANCE_FACTOR) // 1.1travel time
        )
    return {
      type,
      worth,
      sourceId: site.id,
    }
  }
  return sites.map(evaluateSite)
}
