import FlagSet from './flags/flags'
import Server from './server/server'

const run = async (args: string[]): Promise<void> => {
  const flags = new FlagSet('kenhoward-dev', args, console)
  const port = flags.int('port', 8080, 'port used for starting the web server')
  const version = flags.str('version', '0.0.0', 'version for the running program')
  flags.parse()
  const srv = new Server(port, version, `${__dirname}/templates`, console)

  await srv.start()

  // TODO: handle graceful shutdown when errors occur
  process.once('SIGINT', () => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    srv.stop()
  })
}

export default run
