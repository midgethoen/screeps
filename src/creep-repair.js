const P = require('./position')
const R = require('./ramda')
const REVERSE_STATUSES = require('./reverseStatuses')

const SPAWN_DISTANCE_FACTOR = 1.1
const WORTH_FACTOR = 1
const HITS_CAP = 5000
const type = 'repair'

Creep.prototype.perform_repair = function store(task) {
  const { structureId } = task
  const structure = Game.getObjectById(structureId)

  if (structure.hits === structure.hitsMax || structure.hits > HITS_CAP) {
    this.removeTask()
    return
  }

  const result = this.repair(structure, RESOURCE_ENERGY)
  switch (result) {
    case OK:
      break

    case ERR_NOT_IN_RANGE:
      this.moveTo(structure)
      break

    default:
      throw new Error(`Unexpected transfer result ${REVERSE_STATUSES[result]}`)
  }

  if (structure.hits === structure.hitsMax || this.isEmpty() || structure.hits > HITS_CAP) {
    this.removeTask()
  }
}

Creep.prototype.repair_worths = function storeWorths() {
  const structures = this.room.getStructures()
  const load = R.sum(R.values(this.carry))

  const evaluateStructure = (structure) => {
    const distance = P.length(P.subtract(this.pos, structure.pos))
    const tranferable = Math.min(
      load,
      (structure.hitsMax - structure.hits) * REPAIR_COST,
      Math.max(0, HITS_CAP - structure.hits) * REPAIR_COST
    )
    let worth = 0
    if (structure.hits && structure.hitsMax - structure.hits >= 100) {
      worth = (WORTH_FACTOR * tranferable) / // amount to be gained
      (
        (tranferable / this.getRepairCapacity()) // harvest time
        + (distance * this.getSpeed() * SPAWN_DISTANCE_FACTOR)// 1.1travel time
      )
    }
    return {
      debug: {
        tranferable,
        load,
        hitsMax: structure.hitsMax,
        hits: structure.hits,
        distance,
        speed: this.getSpeed(),
        buildCapacity: this.getBuildCapacity(),
      },
      type,
      worth,
      structureId: structure.id,
    }
  }
  return structures.map(evaluateStructure)
}
