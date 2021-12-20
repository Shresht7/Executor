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
    hasTask = (name: string) => {
        return name in this._tasks
    }

    /**
     * Retrieve the task object
     * @param name Task's name
     */
    getTask = (name: string) => {
        return this.hasTask(name) ? this._tasks[name] : null
    }

    /**
     * Removes the task
     * @param name Task's name
     */
    removeTask = (name: string) => {
        if (!this.hasTask(name)) { return }
        delete this._tasks[name]
        return this
    }

}