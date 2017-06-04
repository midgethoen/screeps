const R = require('./ramda')
const P = require('./position')
const reverseStatuses = require('./reverseStatuses')

const HEAL_FACTOR = 1
const type = 'heal'

// TODO: use non linear weight to evaluation
// as healing near death creeps is worth more

Creep.prototype.perform_heal = function perform_heal(task) {
  const { creepId } = task
  const creep = Game.getObjectById(creepId)
  if (!creep || creep.hits === creep.hitsMax) {
    this.removeTask()
    return
  }

  let result

  const distance = P.length(P.subtract(this.pos, creep.pos))
  if (distance > 1) {
    result = this.moveTo(creep)
    if (result !== OK) {
      throw new Error(`Error healing: cant get to creep ${creep.name} due to ${reverseStatuses[result]}`)
    }
    return
  }

  result = this.heal(creep)
  switch (result) {
    case OK:
      return

    default:
      const err = new Error(`Unexpected heal result: ${reverseStatuses[result]}`)
      err.debug = {
        creepId: this.id,
      }
  }
}

Creep.prototype.heal_worths = function () {
  const healCapacity = this.getHealCapacity()
  if (healCapacity === 0) {
    return []
  }
  const { name: roomName } = this.room
  const creeps = R.values(Game.creeps).filter(c => c.room.name === roomName)
  const speed = this.getSpeed()

  const evaluateCreep = creep => {
    const cost = creep.getCost()
    const distance = P.length(P.subtract(this.pos, creep.pos))
    const damage = creep.hitsMax - creep.hits
    const rv = {
      type,
      worth: (cost * damage * HEAL_FACTOR) / ((damage / healCapacity) + (distance * speed)),
      creepId: creep.id,
      debug: { speed, distance, cost, damage, healCapacity },
    }
    log(rv)
    return rv
  }

  return creeps.map(evaluateCreep)
}
