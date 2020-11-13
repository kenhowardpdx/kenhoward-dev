/* eslint-disable @typescript-eslint/no-explicit-any */
import handleIndex from '../handle_index'

describe('handleIndex', (): void => {
  test('returns view', (): void => {
    expect.assertions(2)

    const want = expect.any(Object)
    const viewMock = jest.fn((): any => ({}))
    const h: any = {
      view: viewMock
    }
    const got = handleIndex({} as any, h)

    expect(viewMock).toHaveBeenCalledWith('index', expect.objectContaining({ title: expect.any(String) }))
    expect(got).toStrictEqual(want)
  })
})
