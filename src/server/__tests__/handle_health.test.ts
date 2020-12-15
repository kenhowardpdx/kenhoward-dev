/* eslint-disable @typescript-eslint/no-explicit-any */
import handleHealth from '../handle_health'

describe('handleHealth', (): void => {
  test('returns object', async (): Promise<void> => {
    expect.assertions(2)

    const want = expect.any(Object)
    const responseMock = jest.fn((): any => ({}))
    const h: any = {
      response: responseMock
    }
    const options = {
      postsPath: 'testdata/posts'
    }
    const got = await handleHealth(
      { options, version: '0.0.0' } as any,
      { path: '/health' } as any,
      h
    )

    expect(responseMock).toHaveBeenCalledWith(
      expect.objectContaining({
        version: '0.0.0'
      })
    )
    expect(got).toStrictEqual(want)
  })
})
