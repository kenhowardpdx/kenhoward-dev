import Hapi from '@hapi/hapi'

import Server from './server'
import { getPostUrlFromPath, PostDetail } from './posts'
import { fetchFiles, parseMarkdown } from '../files/files'

const template = 'posts'
const handlePosts = async (
  server: Server,
  request: Hapi.Request,
  h: Hapi.ResponseToolkit
): Promise<Hapi.ResponseObject> => {
  const title = 'Posts'
  const postsPath = `${server.options.dataPath}/posts`
  const postFiles = await fetchFiles(postsPath)
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

export default handlePosts
