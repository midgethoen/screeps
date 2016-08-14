require('creep-behaviour')
require('creep-build')
require('creep-stats')
// require('creep-build')
// require('creep-build')
// require('creep-build')

require('room-helpers')

module.exports.loop = function () {
  for (var name in Game.creeps) {
    if (Game.creeps.hasOwnProperty(name)) {
      creep.loop()
    }
  }
}
