//TODO: Make this a separate repo and include as a submodule

//  Library
import * as fs from 'fs'
import * as path from 'path'

//  ==================
//  BEAR MINIMUM TESTS
//  ==================

type Test = { name: string, callback: () => void }

//  --------------------
const tests: Test[] = []
let successes: number = 0
//  --------------------

/**
 * Pushes the test function onto the stack
 * @param name Test description
 * @param callback Test callback function
 */
function _test(name: string, callback: () => void) {
    tests.push({ name, callback })
}

//  Aliases for the _test function
export const test = _test
export const it = _test

/**
 * Runs the given test and reports success or failure
 * @param test The test to run
 */
function run(test: Test) {
    //  Try to execute the tests
    try {

        test.callback()
        //  If the callback doesn't throw an exception, then return success
        console.log(`✅ ${test.name}`)

        successes++

    } catch (_e) {

        const e = _e as Error
        //  If exception, return failure
        console.error(`❌ ${test.name}`)
        //  Log error stack
        console.error(e.stack)

    }
}

//  ----
//  MAIN
//  ----

function main() {

    //  Recursively walk the current directory and require all .test.js files
    walkDir(process.cwd(), async (x) => {
        if (x.includes('.test.ts')) {
            require(x)
        }
    })

    //  Run all tests
    tests.forEach(run)

    //  Display Results
    console.log(`\n${successes} tests succeeded ✅ out of ${tests.length} total\n`)

}

main()

//  ================
//  HELPER FUNCTIONS
//  ================

/**
 * Walks the provided path and executes the callback function
 * @param dir Path to directory
 * @param callback Callback function to execute for every entry
 */
function walkDir(dir: string, callback: (x: string) => void) {
    fs.readdirSync(dir).forEach(f => {
        const dirPath = path.join(dir, f)
        const isDirectory = fs.statSync(dirPath).isDirectory()
        isDirectory
            ? walkDir(dirPath, callback)
            : callback(path.join(dir, f))
    })
}