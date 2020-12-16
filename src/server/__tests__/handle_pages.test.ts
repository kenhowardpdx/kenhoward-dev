/* eslint-disable @typescript-eslint/no-explicit-any */
import handlePages from '../handle_pages'

describe('handlePages', (): void => {
  test('returns view', async (): Promise<void> => {
    expect.assertions(2)

    const want = expect.any(Object)
    const viewMock = jest.fn((): any => ({}))
    const h: any = {
      view: viewMock
    }
    const options = {
      dataPath: 'testdata'
    }
    const got = await handlePages(
      { options } as any,
      { path: '/about' } as any,
      h
    )

    expect(viewMock).toHaveBeenCalledWith(
      'page',
      expect.objectContaining({
        body: expect.any(String),
        title: 'About John Wick'
      })
    )
    expect(got).toStrictEqual(want)
  })
})
