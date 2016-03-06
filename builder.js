module.exports = function(creep, spawn){

    var result

    // console.log(creep.memory.task)

    switch (creep.memory.task) {
        case 'refill':
            result = spawn.transferEnergy(creep)
            if (result == ERR_NOT_IN_RANGE){
                creep.moveTo(spawn)
            }
            if (creep.energyAvailable == creep.energyCapacity){
                creep.memory.task = 'build'
            }
            break;

        case 'build':
            var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
            if (targets.length){
                result = creep.build(targets[0])
                if (result == ERR_NOT_IN_RANGE){
            		creep.moveTo(targets[0]);
                } else if (result ==  ERR_NOT_ENOUGH_RESOURCES){
            	    creep.memory.task = 'refill'
                }
            } else {
                creep.memory.task = 'upgrade_ctl'
            }
            break;

        case 'upgrade_ctl':
            var controller = creep.room.controller
            result = creep.upgradeController(controller)

            if (result == ERR_NOT_IN_RANGE){
        		creep.moveTo(controller);
            } else if (result ==  ERR_NOT_ENOUGH_RESOURCES){
        	    creep.memory.task = 'refill'
            }
            break;


        default:
            creep.memory.task = 'build'

    }
}
