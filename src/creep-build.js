const R = require('./ramda')
const P = require('./position')

const SITE_DISTANCE_FACTOR = 1.1
const WORTH_FACTOR = 3
const type = 'builds'

Creep.prototype.builds = function build(task) {
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

Creep.prototype.builds_worths = function buildWorths() {
  const sites = this.room.getConstructionSites()
  const load = R.sum(R.values(this.carry))

  const evaluateSite = (site) => {
    const distance = P.length(P.subtract(site.pos, this.pos))
    const worth = (WORTH_FACTOR * load) / // amount to be gained
        (
          (load / this.getBuildCapacity()) // harvest time
          + (distance * this.getSpeed() * SITE_DISTANCE_FACTOR) // 1.1travel time
        )
    return {
      debug: {
        load,
        distance,
        speed: this.getSpeed(),
        buildCapacity: this.getBuildCapacity(),
      },

      type,
      worth,
      constructionSiteId: site.id,
    }
  }
  return sites.map(evaluateSite)
}
