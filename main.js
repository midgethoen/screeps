var tasks = {
    harvester: require('harvest'),
    guard: require('guard'),
}
var creep = require('creep')
var R = require('ramda')
var lowest = R.pipe(
    R.toPairs,
    R.sortBy(R.last),
    R.head,
    R.head
)




module.exports.loop = function () {

    var creepStats = {}
    var spawn = Game.spawns.Spawn1


    // control creeps
	for(var name in Game.creeps) {
		var creep = Game.creeps[name];
        var role = creep.memory.role
        require('creep')(creep, spawn)

        if (creepStats[role]) {
            creepStats[role] ++
        } else{
            creepStats[role] = 1
        }
	}

	// strategy
	var spawn = Game.spawns.Spawn1

	var profiles = {
	    'harvester': {
	        prefix: 'h',
	        body: [WORK,CARRY, CARRY, CARRY,MOVE]

	    },
	    'builder': {
	        prefix: 'b',
	        body: [WORK,CARRY, CARRY, CARRY,MOVE]
	    }
	}
    function create(spawn, profileName){
        for (var i =1;i++;){
            var profile = profiles[profileName]
            var result = spawn.createCreep(
                profile.body,
                profile.prefix + i,
                { role: profileName }
            )
            if (result === ERR_NAME_EXISTS){
                continue
            }

            if (!result){
                console.log(profile + ' created')
            }
            break
        }
    }

	if (!creepStats.harvester){
	    create(spawn, 'harvester')
	}
	else if (!creepStats.builder){
	    create(spawn, 'builder')
	}
	else if (creepStats.harvester < 16){
	    create(spawn, 'harvester')
	}
	else if (!creepStats.builder < 8){
	    create(spawn, 'builder')
	}
	else {
	    create(spawn, lowest(creepStats))
	}
	if (spawn.room.find(FIND_CONSTRUCTION_SITES).length < 3){
	    require('roads').planRoads(spawn)
	}


    // warnings
    if (spawn.energy == spawn.energyCapacity){
        console.log(spawn.name+' energy saturated ('+spawn.energy+')')
    }
}
