import Hapi from '@hapi/hapi'

import Server from './server'
import { fetchFiles, parseMarkdown } from '../files/files'
import { getPostUrlFromPath, PostDetail } from './posts'

const template = 'index'
const handleIndex = async (
  server: Server,
  request: Hapi.Request,
  h: Hapi.ResponseToolkit
): Promise<Hapi.ResponseObject> => {
  const title = 'Home'
  const max = 1
  const order = 'asc'
  const postsPath = `${server.options.dataPath}/posts`
  const postFiles = await fetchFiles(postsPath, max, order)
  const posts = postFiles.map(
    ({ file, path }): PostDetail => {
      const [, m] = parseMarkdown(file)
      const url = getPostUrlFromPath(path, postsPath, '/posts')
      return {
        summary: m.summary,
        title: m.title,
        url
      }
    }
  )
  return h.view(template, { title, posts })
}

export default handleIndex
