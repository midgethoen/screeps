const R = require('./ramda')

require('./creep-behaviour')
require('./creep-stats')

require('./creep-build')
require('./creep-harvest')
require('./creep-upgrade')
require('./creep-store')
require('./creep-repair')

require('./room-helpers')

const REVERSE_STATUSES = require('./reverseStatuses')

global.log = (arg) => console.log(JSON.stringify(arg, null, 2))

module.exports.loop = function loop() {
  const creepList = R.values(Game.creeps)

  // build units
  R.values(Game.spawns).forEach(function (spawn) {
    const sources = spawn.room.getSources()
    if (creepList.length < sources.length * 5) { // have not too many?
      const extensions = spawn.room.getExtensions()
      const totalEnergy =
        R.sum(R.pluck('energy', extensions)) +
        spawn.energy
      const totalEnergyCapacity =
        R.sum(R.pluck('energyCapacity', extensions)) +
        spawn.energyCapacity
      // log({ totalEnergy, totalEnergyCapacity })
      if (totalEnergy === totalEnergyCapacity) { // maxed out on energy?
        // compose bad-ass
        const body = []
        let energy = totalEnergy
        let partIdx = 0
        while (energy >= 50) {
          const part = BODYPARTS_ALL[partIdx % 3] // use only first 3 parts
          const cost = BODYPART_COST[part]
          if (cost <= energy) {
            body.push(part)
            energy -= cost
          }
          partIdx++
        }
        const result = spawn.createCreep(body)
        if (result !== OK) {
          console.log(`Error creating creep: ${REVERSE_STATUSES[result]}`)
        }
      }
    }
  })

  creepList
    .filter(c => !c.spawning)
    .forEach((creep) => {
      creep.loop()
    })
}
