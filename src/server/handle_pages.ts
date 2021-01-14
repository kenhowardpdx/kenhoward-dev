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
    const pagePath = `${server.options.dataPath}/pages/${request.path.slice(
      1
    )}.md`
    const file = await fetchFile(pagePath)
    const [body, m] = parseMarkdown(file)
    const { title } = m

    return h.view(template, { title, body })
  } catch (err) {
    if (typeof err === 'object' && err !== null && err.message !== undefined) {
      if (
        (err.message as string).includes('could not') ||
        (err.message as string).includes('no such file')
      ) {
        return h.view('not-found', {})
      }
    }
    throw err
  }
}

export default handlePages
