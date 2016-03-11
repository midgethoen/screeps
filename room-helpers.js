Room.prototype.getSpawns = function () {
  if (this._spawns === undefined) {
    this._spawns = this.room.find(Game.FIND_MY_SPAWNS)
  }
  return this._spawns
}

Room.prototype.getSpawn = function () {
  if (!this._spawn === undefined) {
    var spawns = this.getSpawns()
    this._spawn = (spawns && spawns.length) ? spawns[0] : null
  }
  return this._spawn
}

Room.prototype.getSources = function () {
  if (!this._sources) {
    this._sources = this.find(Game.FIND_SOURCES)
  }
  return this._sources
}

Room.prototype.getSources = function () {
  if (!this._constructionSites) {
    this._constructionSites = this.find(Game.FIND_CONSTRUCTION_SITES)
  }
  return this.__constructionSites}
