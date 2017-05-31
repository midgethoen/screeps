const R = require('./ramda')
const P = require('./position')
const REVERSE_STATUSES = require('./reverseStatuses')

const SITE_DISTANCE_FACTOR = 1.1
const WORTH_FACTOR = 1
const type = 'build'

Creep.prototype.perform_build = function build(task) {
  const { constructionSiteId } = task
  // TODO optimize
  const site = R.find(
    R.propEq('id', constructionSiteId),
    this.room.getConstructionSites()
  )
  if (!site) {
    return this.removeTask()
  }
  const result = this.build(site)
  switch (result) {
    case OK:
      break

    case ERR_NOT_IN_RANGE:
      this.moveTo(site)
      break

    default:
      throw new Error(`Unexpected build result ${REVERSE_STATUSES[result]}`)
  }
  if (this.isEmpty()) {
    this.removeTask()
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
