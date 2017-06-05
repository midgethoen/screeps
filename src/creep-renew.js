const P = require('./position')
const R = require('./ramda')
const reverseStatuses = require('./reverseStatuses')

const RENEW_FACTOR = 0.0001
const type = 'renew'

Creep.prototype.perform_renew = function perform_renew(task) {
  const spawn = this.getSpawn()
  const result = spawn.renewCreep(this)
  switch (result) {
    case OK:
      break

    case ERR_NOT_IN_RANGE:
      this.moveTo(spawn)
      return

    case ERR_FULL:
      this.removeTask()
      return

    default: {
      const err = new Error(`Unexpected renew result: ${reverseStatuses[result]}`)
      err.debug = {
        spawnId: spawn.id,
        creepId: this.is,
      }
      throw err
    }
  }
  if (this.ticksToLive === CREEP_LIFE_TIME) {
    this.removeTask()
  }
}

const ttlWeight = ttl => (300 * 300) / ttl

Creep.prototype.renew_worths = function () {
  const spawn = this.getSpawn()
  const otherRenewTask = R.values(Game.creeps)
    .some(c => c.memory.task && c.memory.task.type === type)
  if (this.memory.dontRenew || otherRenewTask) {
    return []
  }
  const { ticksToLive } = this
  const speed = this.getSpeed()
  const cost = this.getCost()
  const distance = P.length(P.subtract(this.pos, spawn.pos))
  const weight = ttlWeight(ticksToLive)
  const rv = {
    type,
    worth: (weight * cost * RENEW_FACTOR) / (distance * speed),
    debug: { speed, distance, cost, weight, ticksToLive },
  }
  return [rv]
}
