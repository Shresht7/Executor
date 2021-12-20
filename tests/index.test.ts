//  Test
import { test } from './'
import * as assert from 'assert'

//  Library
import Executor from '../src'

//  CONSTRUCTOR
//  ===========

test('[addTask] Should create an instance of Executor', () => {
    const executor = new Executor()
    assert.equal(executor instanceof Executor, true)
})

//  ADD TASK
//  ========

test('[addTask] Should create a new task', () => {
    const executor = new Executor()
    const taskName = 'Task1'
    executor.addTask(taskName, () => console.log(`Executing ${taskName}`))
    assert.equal(executor.getTask(taskName)?.name, taskName)
})

test('[addTask] Should execute the callback function properly', () => {
    const executor = new Executor()
    const callback = () => 'Executing Task 2'
    executor.addTask('Task2', callback)
    assert.equal(executor.getTask('Task2')?.callback(), callback())
})

test('[addTask] Should create the dependencies array', () => {
    const executor = new Executor()
    const taskName = 'Task3'
    const dependencies = ['Task1', 'Task2']
    executor.addTask(taskName, () => console.log(`Executing ${taskName}`), dependencies)
    assert.deepEqual(executor.getTask(taskName)?.dependencies, dependencies)
})

test('[addTask] Should initialize the done parameter as false', () => {
    const executor = new Executor()
    const taskName = 'Task4'
    executor.addTask(taskName, () => console.log(`Executing ${taskName}`))
    assert.equal(executor.getTask(taskName)?.done, false)
})

test('[addTask] Should return self', () => {
    const executor = new Executor()
    const self = executor.addTask('Task5', () => 'Executing Task5')
    assert.equal(self instanceof Executor, true)
})

//  HAS TASK
//  ========

test('[hasTask] Should return true if task exists', () => {
    const executor = new Executor()
    const taskName = 'Task6'
    executor.addTask(taskName, () => console.log(`Executing ${taskName}`))
    assert.equal(executor.hasTask(taskName), true)
})

test('[hasTask] Should return false if task does not exist', () => {
    const executor = new Executor()
    const taskName = 'YOLO'
    assert.equal(executor.hasTask(taskName), false)
})

//  GET TASK
//  ========

test('[getTask] Should return a task if it exists', () => {
    const executor = new Executor()
    const taskName = 'Task7'
    const dependencies = ['Task3', 'Task5']
    executor.addTask(taskName, () => console.log(`Executing ${taskName}`), dependencies)
    const task = executor.getTask(taskName)
    assert.equal(task?.name, taskName)
    assert.equal(task?.dependencies, dependencies)
    assert.equal(task?.done, false)
})

test('[getTask] Should return null if a task does not exist', () => {
    const executor = new Executor()
    const taskName = 'YOLO'
    assert.equal(executor.getTask(taskName), null)
})

//  REMOVE TASK
//  ===========

test('[removeTask] Should return self', () => {
    const executor = new Executor()
    let self = executor.removeTask('YOLO')
    assert.equal(self instanceof Executor, true)
    executor.addTask('Task8', () => console.log('Executing Task8'))
    self = executor.removeTask('Task8')
    assert.equal(self instanceof Executor, true)
})

test('[removeTask] Should remove the given task from the list', () => {
    const executor = new Executor()
    const taskName = 'Task9'
    executor.addTask(taskName, () => console.log(`Executing ${taskName}`))
    assert.equal(executor.getTask(taskName)?.name, taskName, 'Failed to create task')
    executor.removeTask(taskName)
    assert.equal(executor.getTask(taskName), null)
})

//  EXECUTE
//  =======

test('[execute] Should execute all tasks if no arguments are provided', () => {
    const executor = new Executor()
    let counter = 0
    executor.addTask('Add1', () => counter = counter + 1)
    executor.addTask('Multiply3', () => counter = counter * 3)
    executor.addTask('Add7', () => counter = counter + 7)
    executor.execute().finally(() => assert.equal(counter, 10))
})

test('[execute] Should only execute given tasks', () => {
    const executor = new Executor()
    let counter = 0
    executor.addTask('Add1', () => counter = counter + 1)
    executor.addTask('Multiply3', () => counter = counter * 3)
    executor.addTask('Add7', () => counter = counter + 7)
    executor.execute('Multiply3', 'Add7').finally(() => assert.equal(counter, 7))
})

test('[execute] Should execute tasks in the order of specification', () => {
    const executor = new Executor()
    let counter = 0
    executor.addTask('Add1', () => counter = counter + 1)
    executor.addTask('Multiply3', () => counter = counter * 3)
    executor.addTask('Add7', () => counter = counter + 7)
    executor.execute('Add7', 'Multiply3').finally(() => assert.equal(counter, 21))
})