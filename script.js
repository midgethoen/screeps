var R = require('ramda')

var pluckTypes = R.pluck('type')

exports.submitRoomPosition = function(creep){
    var types = pluckTypes(creep.room.lookAt(creep.pos))

    if (!R.contains('terrain', types)) return;

    var key = [creep.pos.roomName, creep.pos.x, creep.pos.y].join('_')
    if (!Memory.roadStats) Memory.roadStats = {}

    if (!Memory.roadStats[key]) Memory.roadStats[key] = 1
    else Memory.roadStats[key]++
}

exports.planRoads = function(spawn) {
    R.pipe(
        R.toPairs,
        R.sortBy(R.last),
        R.last,
        R.head,
        function (key) {
            // console.log(key)
            // return
            var arr = key.split('_')
            console.log(arr[1],arr[2], STRUCTURE_ROAD)
            var result = spawn.room.createConstructionSite(parseInt(arr[1]),parseInt(arr[2]), STRUCTURE_ROAD)
            delete Memory.roadStats[key]
            return result == 0
        }

    )(Memory.roadStats)
};
