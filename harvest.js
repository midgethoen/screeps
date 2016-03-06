module.exports = function (creep) {
    switch (creep.memory.task) {
        case 'harvest':
            // code
            break;

        default:
            if (creep.carry.energy/2 > creep.carryCapacity){
                creep.memory.task = ''
            }
    }
  if(creep.carry.energy < creep.carryCapacity) {
    var sources = creep.room.find(FIND_SOURCES)
    var source = sources[parseInt(creep.id.substring(10,12), 36)%(sources.length)]
    if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
      creep.moveTo(source)
    }
  }
  else {
    if(creep.transfer(Game.spawns.Spawn1, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
      creep.moveTo(Game.spawns.Spawn1)
    }
  }

}
