import Hapi from '@hapi/hapi'

import Server from './server'
import { fetchFiles, parseMarkdown } from '../files/files'

interface PostDetail {
  summary: string
  title: string
  url: string
}

const getPostUrlFromPath = (
  path: string,
  postsPath: string,
  prefix: string
): string => {
  const [year, month, day, ...postPath] = path
    .slice(postsPath.length + 1, path.lastIndexOf('.'))
    .split('-')

  return `${prefix}/${year}/${month}/${day}/${postPath.join('-')}`
}

const template = 'posts'
const handlePosts = async (
  server: Server,
  request: Hapi.Request,
  h: Hapi.ResponseToolkit
): Promise<Hapi.ResponseObject> => {
  const title = 'Posts'
  const postFiles = await fetchFiles(server.options.postsPath)
  const posts = postFiles.map(
    ({ file, path }): PostDetail => {
      const [, m] = parseMarkdown(file)
      const url = getPostUrlFromPath(path, server.options.postsPath, '/posts')
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
