const P = require('./position')
const reverseStatuses = require('./reverseStatuses')

const RENEW_FACTOR = 0.0001
const type = 'renew'

Creep.prototype.perform_renew = function perform_renew(task) {
  const spawn = this.getSpawn()

  const result = spawn.renewCreep(this)
  switch (result) {
    case OK:
      return

    case ERR_NOT_IN_RANGE:
      this.moveTo(spawn)
      return

    default:
      const err = new Error(`Unexpected renew result: ${reverseStatuses[result]}`)
      err.debug = {
        spawnId,
        creepId: this.is,
      }
  }
}

const ttlWeight = ttl => (200 * 200) / ttl

Creep.prototype.renew_worths = function () {
  const { ticksToLive } = this
  const speed = this.getSpeed()
  const cost = this.getCost()
  const spawn = this.getSpawn()
  const distance = P.length(P.subtract(this.pos, spawn.pos))
  const weight = ttlWeight(ticksToLive)
  const rv = {
    type,
    worth: (weight * cost * RENEW_FACTOR) / (distance * speed),
    debug: { speed, distance, cost, weight, ticksToLive },
  }
  return [rv]
}
