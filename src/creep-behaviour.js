const R = require('./ramda')

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
Creep.prototype.loop = function loop() {
  if (this.memory.manual) {
    return
  }
  const task = this.getCurrentTask()
  if (task && task.type) {
    try {
      this[`perform_${task.type}`](task) // perform the task by calling the correponsing method
    } catch (e) {
      console.log(`${this.name}'s task ${task.type} failed: ${e.message}`)
      if (e.debug) {
        log(e.debug)
      }
      this.removeTask()
      this.say('@%$#!*')
      // throw e
    }
  } else {
    this.removeTask()
    this.say(':(')
  }
}

Creep.prototype.getCurrentTask = function getCurrentTask() {
  let task = null // this.getPrioritizedTask()
  if (!task) {
    if (this.memory.task) {
      // get task from memory
      task = this.memory.task
    } else {
      // start new task
      task = this.getNewTask()
      this.say(task.type)
      this.memory.task = task
    }
  }
  return task
}

let prioritizedTaskFunctions
Creep.prototype.getPrioritizedTask = function getPrioritizedTask() {
  // determine list of prioritize functions for entire class
  if (!prioritizedTaskFunctions) {
    prioritizedTaskFunctions =
      Object.keys(Object.getPrototypeOf(this))
      .filter((key) => /prioritize_[\w_]*/.test(key))
  }

  return prioritizedTaskFunctions.reduce(
    (task, key) => (task || this[key]())
  )
}

let taskWorthsFunctions
Creep.prototype.getNewTask = function getNewTask() {
  if (!taskWorthsFunctions) {
    taskWorthsFunctions =
    Object.keys(Object.getPrototypeOf(this))
      .filter(key => /[\w_]_worths*/.test(key))
  }
  const allTasks = []
  taskWorthsFunctions.forEach(fName => {
    const tasks = this[fName]()
    if (!_.isArray(tasks)) { // eslint-disable
      console.log(`Error: expected ${fName} to return an array`)
      log(tasks)
      return
    }
    tasks.forEach(task => {
      if (!task.type) {
        console.log(`Error: got task without type from ${fName} function, `)
        log(task)
        return
      } else if (task.worth !== 0 && !(task.worth > 0)) {
        console.log(`Error: got task with invalid worth from ${fName} function, `)
        log(task)
        return
      }
      allTasks.push(task)
    })
  })
  const tasks = R.flatten(
    taskWorthsFunctions.map(k => this[k]())
  )
  return this.pickTask(tasks)
}

/**
 * Pick a task from a list of possible tasks
 * 	a single task is picked based on worthyness and some entropy
 * @param  {array} tasks - Nested array of tasks
 * @return {Object}       task
 */
Creep.prototype.pickTask = function (tasks) {
  return R.pipe(
    R.map(R.over(
      R.lensProp('worth'),
      w => w * this.entropy()
    )),
    R.reduce(
      R.maxBy(R.prop('worth')), { worth: 0 }
    )
  )(tasks)
}

Creep.prototype.removeTask = function removeTask() {
  this.memory.task = null
}

Creep.prototype.getSpawns = function () {
  return this.room.getSpawns()
}

Creep.prototype.getSpawn = function () {
  return this.room.getSpawn()
}

Creep.prototype.entropy = function () {
  return (Math.random() * 0.4) + 0.8 // 20% devidation
}
