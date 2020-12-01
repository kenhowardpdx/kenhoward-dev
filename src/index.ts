/* istanbul ignore file - not testing this file */
import run from './run'

const args = process.argv.slice(2)

// eslint-disable-next-line @typescript-eslint/no-floating-promises
run(args)
