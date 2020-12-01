import { createShutdownHandler } from '../shutdown'

describe('createShutdownHandler', (): void => {
  test('logs errors and stops server on shutdown', (): void => {
    expect.assertions(2)

    const want = /^some reason: bleep bloop error/
    const logger = { error: jest.fn() }
    const server = { stop: jest.fn() }
    const shutdownHandler = createShutdownHandler(server, logger, 0, true)

    shutdownHandler(1, 'some reason')(new Error('bleep bloop error'))
    expect(logger.error).toHaveBeenCalledWith(expect.stringMatching(want))
    expect(server.stop).toHaveBeenCalledTimes(1)
  })
})
