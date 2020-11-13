import run from './run'

const args = process.argv.slice(2)

process.on('unhandledRejection', (err) => {
  console.log(err)
  process.exit(1)
})

// eslint-disable-next-line @typescript-eslint/no-floating-promises
run(args)
