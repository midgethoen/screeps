var R = require('ramda')

var selectEnemy = R.pipe(
    R.filter(function(e){
        return e &&
        e.owner.username !== 'Source Keeper'
    }),
    R.head
)

module.exports = function(creep, spawn){
    var enemies = creep.room.find(FIND_HOSTILE_CREEPS)
    if (enemies){
        var enemy =  selectEnemy(enemies)
    }

    if (enemy){
        console.log('atack', creep.name, enemy)
        var result = creep.attack(enemy)
        if (result == ERR_NOT_IN_RANGE){
            creep.moveTo(enemy)
        } else if (result){
            console.log(creep.attack(enemy))
        }
    } else {
        creep.moveTo(Game.flags.post)
    }
}
