const P = require('./position')
const R = require('./ramda')

const SPAWN_DISTANCE_FACTOR = 1.1
const type = 'repairs'

Creep.prototype.repairs = function store(task) {
  const { structureId } = task
  const structure = Game.getObjectById(structureId)

  const result = this.repair(structure, RESOURCE_ENERGY)
  switch (result) {
    case OK:
      break

    case ERR_NOT_IN_RANGE:
      this.moveTo(structure)
      break

    default:
      throw new Error(`Unexpected transfer result ${result}`)
  }

  if (this.isEmpty()) {
    this.removeTask()
  }
}

Creep.prototype.repairs_worths = function storeWorths() {
  const structures = this.room.getStructures()
  const load = R.sum(R.values(this.carry))

  const evaluateStructure = (structure) => {
    const distance = P.length(P.subtract(this.pos, structure.pos))
    const tranferable = Math.min(load, (structure.hitsMax - structure.hits) * REPAIR_COST)
    let worth = 0
    if (structure.hits && structure.hitsMax - structure.hits >= 100) {
      worth = tranferable / // amount to be gained
      (
        (tranferable / this.getRepairCapacity()) // harvest time
        + (distance * this.getSpeed() * SPAWN_DISTANCE_FACTOR)// 1.1travel time
      )
    }
    return {
      debug: {
        tranferable,
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
