//  Test
import { test } from './'
import * as assert from 'assert'

//  Library
import Executor from '../src'

test('Should create an instance of Executor', () => {
    const executor = new Executor()
    assert.equal(executor instanceof Executor, true, 'Not an instance of Executor')
})