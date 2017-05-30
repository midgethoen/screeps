Room.prototype.getSpawns = function () {
  if (!this._spawns) {
    this._spawns = this.find(FIND_MY_SPAWNS)
  }
  return this._spawns
}

Room.prototype.getSpawn = function () {
  if (this._spawn === undefined) {
    const spawns = this.getSpawns()
    this._spawn = spawns[0]
  }
  return this._spawn
}

Room.prototype.getSources = function () {
  if (!this._sources) {
    this._sources = this.find(FIND_SOURCES)
  }
  return this._sources
}

Room.prototype.getConstructionSites = function () {
  if (!this._constructionSites) {
    this._constructionSites = this.find(FIND_CONSTRUCTION_SITES)
  }
  return this._constructionSites
}

Room.prototype.getController = function () {
  if (!this._controller) {
    this._controller = this.find(
      FIND_STRUCTURES,
      { filter: { structureType: STRUCTURE_CONTROLLER } }
    )[0] || null
  }
  return this._controller
}

Room.prototype.getExtensions = function () {
  if (!this._extensions) {
    this._extensions = this.find(
      FIND_STRUCTURES,
      { filter: { structureType: STRUCTURE_EXTENSION } }
    )
  }
  return this._extensions
}
