var R = require('ramda')

/*
This file implements core behaviour of creep-agents
Creeps can be extended by describing tasks
every <task> extension should implement the following functions:
 - perform_<task>
    this implements how the task is to be performed
    when the task is complete: clear-task should be called
 - <task>_worhts
    Calculates the worths for executing this task.
    This value is used to pick a new task.
    The worth should be in the following format:
    ```
      {
        worth: Number,
        task: TaskDescription
      }
    ```
    a single-call can yield multiple task-worths if there are multiple possibilities
 - prioritize_<task>
    this enables a task to be prioritized over the task currently being performed
    If this function returns a new task, it will replace the current task
 */

/**
 * Main loop function, to be called for each creep
 * determines and executes task, base on collony needs
 */
Creep.prototype.loop = function () {
  var task = this.getCurrentTask()
  if (task){
    this[task.type](task) // perform the task by calling the correponsing method
  } else {
    this.say(':(')
  }
}

Creep.prototype.getCurrentTask = function () {
  var task = this.getPrioritizedTask()
  if (!task) {
    if (this.memory.task) {
      // get task from memory
      task = this.memory.task
    } else {
      // start new task
      task = this.getNewTask()
      this.memory.task = task
    }
  }
  return task
}

var prioritized_task_functions
Creep.prototype.getPrioritizedTask = function () {
  // determine list of prioritize functions for entire class
  if (!prioritized_task_functions) {
    prioritized_task_functions =
      Object.keys(this.prototype)
      .filter((key) => /prioritize_[\w_]*/.test(key))
  }

  return prioritized_task_functions.reduce(
    (task,key) => (task?task:this[key]())
  )
}

var task_worths_functions
Creep.prototype.getNewTask = function () {
  if (!task_worths_functions) {
    task_worths_functions =
      Object.keys(this.prototype)
      .filter(key => /[\w_]_worths*/.test(key))
  }
  return this.pickTask(
    task_worths_functions.map( k => this[k]() )
  )
}

/**
 * Pick a task from a list of possible tasks
 * 	a single task is picked based on worthyness and some entropy
 * @param  {array} tasks - Nested array of tasks
 * @return {Object}       task
 */
Creep.prototype.pickTask = R.pipe(
  R.flatten,
  R.map(R.over(
    R.lensProp('worth'), w => w * this.entropy()
  )),
  R.reduce(
    R.maxBy(R.prop('worth')), 0
  )
)

Creep.prototype.entropy = function () {
  return Math.random()*0.4+0.8 // 20% devidation
}

Creep.prototype.getSpawns = function () {
  return this.room.getSpawns()
}

Creep.prototype.getSpawn = function () {
  return this.room.getSpawn()
}
