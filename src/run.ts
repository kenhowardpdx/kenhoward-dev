import Server from './server/server'

const getPort = (args: string[]): number => {
  const index = args.indexOf('-port')
  if (index > -1) {
    return parseInt(args[index + 1])
  }
  return 8080
}

const run = async (args: string[]): Promise<void> => {
  // get args
  const port = getPort(args)
  const srv = new Server(port, `${__dirname}/templates`, console)

  await srv.start()

  process.once('SIGINT', () => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    srv.stop()
  })
}

export default run
