import Hapi from '@hapi/hapi'

import Server from './server'
import { fetchFile, parseMarkdown } from '../files/files'

const getPostPathFromUrl = (
  url: string,
  postsPath: string,
  prefix: string
): string => {
  const postPath = url
    .slice(prefix.length + 1)
    .split('/')
    .join('-')

  return `${postsPath}/${postPath}.md`
}

const template = 'post'
const handlePost = async (
  server: Server,
  request: Hapi.Request,
  h: Hapi.ResponseToolkit
): Promise<Hapi.ResponseObject> => {
  const postsPath = `${server.options.dataPath}/posts`
  const postPath = getPostPathFromUrl(request.path, postsPath, '/posts')
  const file = await fetchFile(postPath)
  const [body, m] = parseMarkdown(file)
  const { title } = m

  return h.view(template, { title, body })
}

export default handlePost
