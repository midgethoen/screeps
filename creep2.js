Creep.prototype = function() {
    switch (expression) {
        case 'harvest':
            var sources = creep.room.find(FIND_SOURCES)
            result = creep.harvest(sources[0])
            if (result == ERR_NOT_IN_RANGE){
                creep.moveTo(sources[0])
            } else if (result == ERR_FULL){

            }
            break;

        case 'refill':
            // code
            break;
        case 'defend'
        default:
            // code
    }
  if(creep.carry.energy < creep.carryCapacity) {
    var sources = creep.room.find(FIND_SOURCES)
    if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
      creep.moveTo(sources[0])
    }
  }
  else {
    if(creep.transfer(Game.spawns.Spawn1, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
      creep.moveTo(Game.spawns.Spawn1)
    }
  }
};
