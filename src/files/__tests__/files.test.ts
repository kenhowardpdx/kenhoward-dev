import { fetchFiles, fetchFile, parseMarkdown } from '../files'

describe('files', (): void => {
  describe('fetchFiles', (): void => {
    test('returns nursery rhymes in ascending order (newest to oldest)[default]', async (): Promise<void> => {
      expect.assertions(1)
      expect(await fetchFiles('testdata/posts')).toStrictEqual([
        {
          file: expect.any(String),
          path: 'testdata/posts/2020-12-14-little-bo-peep.md'
        },
        {
          file: expect.any(String),
          path: 'testdata/posts/2020-12-01-hey-diddle-diddle.md'
        }
      ])
    })
    test('returns nursery rhymes in descending order (oldest to newest)', async (): Promise<void> => {
      expect.assertions(1)
      expect(
        await fetchFiles('testdata/posts', undefined, 'desc')
      ).toStrictEqual([
        expect.objectContaining({
          path: 'testdata/posts/2020-12-01-hey-diddle-diddle.md'
        }),
        expect.objectContaining({
          path: 'testdata/posts/2020-12-14-little-bo-peep.md'
        })
      ])
    })
  })
  describe('fetchFile', (): void => {
    test('retrieve file from path', async (): Promise<void> => {
      expect.assertions(1)
      const path = 'testdata/posts/2020-12-01-hey-diddle-diddle.md'
      expect(await fetchFile(path)).toStrictEqual(expect.any(String))
    })
  })
  describe('parseMarkdown', (): void => {
    test('returns html and metadata', (): void => {
      expect.assertions(1)
      const content = `---
title: the quick brown fox
summary: a story about a quick brown fox
---
# The Quick Brown Fox

This is the story...
`
      expect(parseMarkdown(content)).toStrictEqual(
        expect.arrayContaining([
          expect.stringContaining('The Quick Brown Fox'),
          expect.objectContaining({
            title: 'the quick brown fox',
            summary: 'a story about a quick brown fox',
            ref: ''
          })
        ])
      )
    })
  })
})
