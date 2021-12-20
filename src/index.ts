//  Library
import { EventEmitter } from 'events'

//  Type Definitions
type callback = () => void
type task = { name: string, callback: callback, dependencies: string[], done: boolean }
type tasks = { [name: string]: task }

//  ========
//  EXECUTOR
//  ========

class Executor extends EventEmitter {

    private _tasks: tasks = {}
    private _isRunning = false

    constructor() {
        super()
    }

    /**
     * Registers a new task
     * @param name Task's name
     * @param callback Callback function to execute
     * @param dependencies Array of dependencies
     */
    addTask = (name: string, callback: callback, dependencies: string[] = []) => {
        this._tasks[name] = { name, callback, dependencies, done: false }
        return this
    }

    /**
     * Check if the executor already has a task
     * @param name Task's name
     * @returns Executor already has the task registered
     */
    hasTask = (name: string): boolean => {
        return name in this._tasks
    }

    /**
     * Retrieve the task object
     * @param name Task's name
     */
    getTask = (name: string): task | null => {
        return this.hasTask(name) ? this._tasks[name] : null
    }

    /**
     * Removes the task
     * @param name Task's name
     */
    removeTask = (name: string) => {
        if (!this.hasTask(name)) { return this }
        delete this._tasks[name]
        return this
    }

    private _runTask = (sequence: string[], taskNumber: number) => {

        //  Exit if tasks completed
        if (taskNumber >= sequence.length) {
            this._isRunning = false
            return this.emit('finish')
        }

        const task = this.getTask(sequence[taskNumber])

        //  If task does not exist then return
        if (!task) { return }   //? Maybe add additional error handling / logs for this

        this.emit('task::start', task.name)
        task.callback()
        task.done = true
        this.emit('task::done', task.name)

        return process.nextTick(() => this._runTask(sequence, taskNumber + 1))
    }

    execute = (...taskNames: string[]) => {
        if (this._isRunning) { return }     //  Short-circuit if already running

        this._isRunning = true
        const tasks: string[] = []

        //  Collect all tasks
        if (!taskNames || taskNames.length <= 0) {  //  If no arguments were passed in, run all tasks
            for (const task in this._tasks) {
                tasks.push(task)
            }
        } else {    //  Collect only specified tasks
            taskNames.forEach(task => tasks.push(task))
        }


        //TODO: Build taskQueue based on dependencies

        //  Start execution process
        this.emit('start')

        //  Initialize the task queue in the next tick. This ensures event listeners are registered before execution
        process.nextTick(() => this._runTask(tasks, 0))

        return this
    }

}

//  -------------------
export default Executor
//  -------------------