const P = require('./position')
const REVERSE_STATUSES = require('./reverseStatuses')

const type = 'attack'

Creep.prototype.perform_attack = function (task) {
  const { enemyId } = task
  const enemy = Game.getObjectById(enemyId)

  if (!enemy) {
    this.removeTask()
    return
  }

  const result = this.attack(enemy)
  switch (result) {
    case OK:
      break

    case ERR_NOT_IN_RANGE:
      this.moveTo(enemy)
      break

    default:
      throw new Error(`Unexpected build result ${REVERSE_STATUSES[result]}`)

  }
}

Creep.prototype.attack_worths = function () {
  if (this.body.filter(b => b.type === ATTACK).length === 0) {
    return []
  }
  const enemies = this.room.find(FIND_HOSTILE_CREEPS)
  const evaluateEnemy = (enemy) => {
    const distance = P.length(P.subtract(this.pos, enemy.pos))
    return {
      type,
      worth: 1000 / distance,
      enemyId: enemy.id,
    }
  }

  return enemies.map(evaluateEnemy)
}
