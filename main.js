var tasks = {
    harvester: require('harvest'),
    guard: require('guard'),
}

var R = require('ramda')
var lowest = R.pipe(
    R.toPairs,
    R.sortBy(R.last),
    R.head,
    R.head
)


module.exports.loop = function () {

    var creepStats = {}

    // control creeps
	for(var name in Game.creeps) {
		var creep = Game.creeps[name];
        var role = creep.memory.role
        tasks[role](creep)

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
	        body: [WORK,CARRY,MOVE]

	    },
	    'guard': {
	        prefix: 'g',
	        body: [TOUGH, ATTACK, MOVE]
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
	else if (!creepStats.guard){
	    create(spawn, 'guard')
	}
	else {
	    create(spawn, lowest(creepStats))
	}


    // warnings
    if (spawn.energy == spawn.energyCapacity){
        console.log(spawn.name+' energy saturated ('+spawn.energy+')')
    }
}
