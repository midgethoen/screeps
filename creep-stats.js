var R = require('ramda')

/**
 * Calculate movement speed of creep
 * inversely expressed as ticks/movement
 * @return {Number} speed of creep
 */
Creep.prototype.getSpeed = function () {
  if (!this._speed){
    var body = this.body
      , moveParts = R.filter(R.propEq('type', 'move'), body).length
      , carryParts = R.filter(R.propEq('type', 'carry'), body).length
      , otherParts = body.length - (moveParts + carryParts)-moveParts
      , weightedCarryParts = R.sum(R.map(
          load => Math.ceil(load/50),
          R.values(this.carry)))

    this._speed = Math.ceil((weightedCarryParts + otherParts)/moveParts)
  }
  return this._speed
}

Creep.prototype.getWorkCapacity = function () {
  if (this._workCapacity == undefined){
    this._workCapacity = R.filter(R.propEq('type', 'work', this.body))
  }
  return this._workCapacity
}
Creep.prototype.getUpgradeCapacity = this.proto.getWorkCapacity
Creep.prototype.getRepairCapacity = this.proto.getWorkCapacity
Creep.prototype.getDismantleCapacity = this.proto.getWorkCapacity

Creep.prototype.getHarvestCapacity = function () {
  return this.getWorkCapacity()*2
}
Creep.prototype.getBuildCapacity = function () {
  return this.getWorkCapacity()*5
}
