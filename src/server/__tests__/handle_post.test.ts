/* eslint-disable @typescript-eslint/no-explicit-any */
import handlePost from '../handle_post'

describe('handlePost', (): void => {
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
    const got = await handlePost(
      { options } as any,
      { path: '/posts/2020/12/01/hey-diddle-diddle' } as any,
      h
    )

    expect(viewMock).toHaveBeenCalledWith(
      'post',
      expect.objectContaining({
        body: expect.any(String),
        title: 'Hey Diddle Diddle'
      })
    )
    expect(got).toStrictEqual(want)
  })
})
