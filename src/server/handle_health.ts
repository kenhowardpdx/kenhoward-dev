import Hapi from '@hapi/hapi'

import Server from './server'

const handleHealth = (
  server: Server,
  request: Hapi.Request,
  h: Hapi.ResponseToolkit
): Hapi.ResponseObject => {
  return h.response({ version: server.version })
}

export default handleHealth
