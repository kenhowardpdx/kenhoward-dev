/* istanbul ignore file - not testing this file ... yet */
import FlagSet from './flags/flags'
import Server from './server/server'
import { createShutdownHandler } from './shutdown/shutdown'

const VERSION = process.env.VERSION !== undefined ? process.env.VERSION : '0.0.0'

const run = async (args: string[]): Promise<void> => {
  try {
    const flags = new FlagSet('kenhoward-dev', args, console)
    const port = flags.int('port', 8080, 'port used for starting the web server')
    const version = flags.str('version', VERSION, 'version for the running program')
    flags.parse()
    const srv = new Server(port, version, `${__dirname}/templates`, console)
    const shutdownHandler = createShutdownHandler(srv, console)
    await srv.start()
    // handle shutdown gracefully
    process.on('uncaughtException', shutdownHandler(1, 'Unexpected Error'))
    process.on('unhandledRejection', shutdownHandler(1, 'Unhandled Promise'))
    process.on('SIGTERM', shutdownHandler(0, 'SIGTERM'))
    process.on('SIGINT', shutdownHandler(0, 'SIGINT'))
  } catch (err) {
    // TODO: get a real logger
    console.error(err)
    /* istanbul ignore next - cannot use in testing environment */
    process.exit(1)
  }
}

export default run
