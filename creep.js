var tasks = {
    harvester: require('harvest'),
    guard: require('guard'),
    builder: require('builder')
}

var P = require('position')

var road = require('roads')

module.exports = function(creep, spawn){
    spawn.renewCreep(creep)
    if (!P.equals(creep.pos, creep.memory.lastPos)){
        creep.memory.lastPos = creep.pos
        road.submitRoomPosition(creep)
    }
    tasks[creep.memory.role].apply(undefined, arguments)
}
