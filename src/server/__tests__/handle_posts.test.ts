/* eslint-disable @typescript-eslint/no-explicit-any */
import handlePosts from '../handle_posts'

describe('handlePosts', (): void => {
  test('returns view', async (): Promise<void> => {
    expect.assertions(2)

    const want = expect.any(Object)
    const viewMock = jest.fn((): any => ({}))
    const h: any = {
      view: viewMock
    }
    const options = {
      postsPath: 'testdata/posts'
    }
    const got = await handlePosts({ options } as any, {} as any, h)

    expect(viewMock).toHaveBeenCalledWith('posts', expect.objectContaining({
      title: expect.stringContaining('Posts'),
      posts: expect.arrayContaining([
        expect.objectContaining({
          summary: expect.any(String),
          title: expect.any(String),
          url: expect.stringMatching(/^\/posts\/[a-z0-9-]*$/)
        })
      ])
    }))
    expect(got).toStrictEqual(want)
  })
})
