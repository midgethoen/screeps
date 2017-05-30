const R = require('./ramda')

require('./creep-behaviour')
require('./creep-stats')

require('./creep-build')
require('./creep-harvest')
require('./creep-upgrade')
require('./creep-store')
require('./creep-repair')

require('./room-helpers')

module.exports.loop = function loop() {
  const creepList = R.values(Game.creeps)
  R.values(Game.spawns).forEach(function (spawn) {
    const sources = spawn.room.getSources()
    if (spawn.energy === 300 && creepList.length < sources.length * 5) {
      spawn.createCreep(['work', 'move', 'carry', 'work'])
    }
  })

  creepList.map((creep) => {
    creep.loop()
  })
}
