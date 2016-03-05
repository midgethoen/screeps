var tasks = {
    harvester: require('harvester'),
    guard: require('guard'),
}

module.exports.loop = function () {
    var creepStats

    // control creeps
	for(var name in Game.creeps) {
		var creep = Game.creeps[name];
        var task = tasks[creep.memory.role]



        if (task) task(creep)
        else console.log('No task available for creep with role: ' + creep.memory.role )
	}

	// strategy

}
