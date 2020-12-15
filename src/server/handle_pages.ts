import Hapi from '@hapi/hapi'

import Server from './server'
import { fetchFile, parseMarkdown } from '../files/files'

const template = 'page'
const handlePages = async (
  server: Server,
  request: Hapi.Request,
  h: Hapi.ResponseToolkit
): Promise<Hapi.ResponseObject> => {
  try {
    const pagePath = `${server.options.pagesPath}/${request.path.slice(1)}.md`
    const file = await fetchFile(pagePath)
    const [body, m] = parseMarkdown(file)
    const { title } = m

    return h.view(template, { title, body })
  } catch (err) {
    console.error(err)
    return h.response().code(500)
  }
}

export default handlePages
