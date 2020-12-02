import { fetchFiles, fetchFile, parseMarkdown } from '../files'

describe('files', (): void => {
  describe('fetchFiles', (): void => {
    test('returns hey diddle diddle nursery rhyme', async (): Promise<void> => {
      expect.assertions(1)
      expect(await fetchFiles('testdata/posts')).toStrictEqual(expect.arrayContaining([
        {
          file: expect.any(String),
          path: 'testdata/posts/2020-12-01-hey-diddle-diddle.md'
        }
      ]))
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
      expect(parseMarkdown(content)).toStrictEqual(expect.arrayContaining([
        expect.stringContaining('The Quick Brown Fox'),
        expect.objectContaining({
          title: 'the quick brown fox',
          summary: 'a story about a quick brown fox',
          ref: ''
        })
      ]))
    })
  })
})
