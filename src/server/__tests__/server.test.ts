/* eslint-disable @typescript-eslint/no-explicit-any */
import Server from '../server'

const mockConsole: Console = {
  info: (): void => {
    // noOp
  }
} as any

describe('server', (): void => {
  test('start and stop', async (): Promise<void> => {
    expect.assertions(1)
    const dataPath = 'testdata'

    const srv = new Server(0, '0.0.0', '../templates', dataPath, mockConsole)

    try {
      await srv.start()
      await srv.stop()
    } catch (err) {
      console.error('error starting & stopping server')
      throw new Error(err)
    }

    expect(true).toBeDefined()
  })
})
