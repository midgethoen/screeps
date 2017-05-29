const R = require('./ramda')

require('./creep-behaviour')
require('./creep-stats')

require('./creep-build')
require('./creep-harvest')
require('./creep-upgrade')
require('./creep-store')

require('./room-helpers')

module.exports.loop = function loop() {
  R.values(Game.spawns).forEach(function (spawn) {
    if (spawn.energy === 300) {
      spawn.createCreep(['work', 'move', 'carry', 'work'])
    }
  })

  R.values(Game.creeps).map((creep) => {
    creep.loop()
  })
}
