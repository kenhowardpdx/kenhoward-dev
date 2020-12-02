import Hapi from '@hapi/hapi'

import Server from './server'
import { fetchFiles, parseMarkdown } from '../files/files'

interface PostDetail {
  summary: string
  title: string
  url: string
}

const template = 'posts'
const handlePosts = async (server: Server, request: Hapi.Request, h: Hapi.ResponseToolkit): Promise<Hapi.ResponseObject> => {
  const title = 'Posts'
  const postFiles = await fetchFiles(server.options.postsPath)
  const posts = postFiles.map(({ file, path }): PostDetail => {
    const [, m] = parseMarkdown(file)
    return {
      summary: m.summary,
      title: m.title,
      url: `/posts/${path.slice(server.options.postsPath.length + 1, path.lastIndexOf('.'))}`
    }
  })
  return h.view(template, { title, posts })
}

export default handlePosts
