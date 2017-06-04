const R = require('./ramda')

/**
 * Calculate movement speed of creep
 * inversely expressed as ticks/movement
 * @return {Number} speed of creep
 */
Creep.prototype.getSpeed = function getSpeed() {
  if (!this._speed) {
    const body = this.body
    const moveParts = R.filter(R.propEq('type', 'move'), body).length
    const carryParts = R.filter(R.propEq('type', 'carry'), body).length
    const otherParts = body.length - (moveParts + carryParts)
    const weightedCarryParts = R.sum(R.map(
      load => Math.ceil(load / 50),
      R.values(this.carry)
    ))

    this._speed = Math.ceil((weightedCarryParts + otherParts) / moveParts)
  }
  return this._speed
}

Creep.prototype.getWorkCapacity = function getWorkCapacity() {
  if (this._workCapacity === undefined) {
    this._workCapacity = R.filter(R.propEq('type', 'work'), this.body).length
  }
  return this._workCapacity
}

Creep.prototype.isFull = function () {
  const capacity = this.carryCapacity
  const load = R.sum(R.values(this.carry))
  return (load >= capacity)
}

Creep.prototype.isEmpty = function () {
  const load = R.sum(R.values(this.carry))
  return load === 0
}

Creep.prototype.getCost = function () {
  return R.sum(this.body.map(part => BODYPART_COST[part.type]))
}

Creep.prototype.getUpgradeCapacity = Creep.prototype.getWorkCapacity
Creep.prototype.getRepairCapacity = Creep.prototype.getWorkCapacity
Creep.prototype.getDismantleCapacity = Creep.prototype.getWorkCapacity

Creep.prototype.getHarvestCapacity = function getHarvestCapacity() {
  return this.getWorkCapacity() * 2
}
Creep.prototype.getBuildCapacity = function getBuildCapacity() {
  return this.getWorkCapacity() * 5
}
Creep.prototype.getRepairCapacity = function getBuildCapacity() {
  return this.getWorkCapacity() * 100
}
