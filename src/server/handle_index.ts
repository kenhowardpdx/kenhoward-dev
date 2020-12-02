import Hapi from '@hapi/hapi'

import Server from './server'

const template = 'index'
const handleIndex = (server: Server, request: Hapi.Request, h: Hapi.ResponseToolkit): Hapi.ResponseObject => {
  const title = 'Home'
  return h.view(template, { title })
}

export default handleIndex
