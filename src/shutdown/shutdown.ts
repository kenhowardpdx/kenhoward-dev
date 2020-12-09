interface Server {
  stop: () => unknown
}

interface Logger {
  error: (...args: string[]) => void
}

type ShutdownHandler = (
  exitCode: number,
  reason: string
) => (err: Error) => void

export const createShutdownHandler = (
  server: Server,
  logger: Logger,
  timeout = 500,
  preventExit = false
): ShutdownHandler => {
  /* istanbul ignore next - cannot use in testing environment */
  const exit = (exitCode: number): void => {
    if (preventExit) {
      return
    }
    process.exit(exitCode)
  }

  return (exitCode: number, reason: string) => (err: Error): void => {
    const msg = err?.message
    const stack = err.stack !== undefined ? err.stack : ''
    logger.error(`${reason}${msg !== undefined ? `: ${msg}\n` : '\n'}${stack}`)

    setTimeout(exit, timeout).unref()
    server.stop()
  }
}
