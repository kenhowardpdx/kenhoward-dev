import Hapi from '@hapi/hapi'

import Server from './server'
import handleIndex from './handle_index'
import handlePosts from './handle_posts'
import handlePost from './handle_post'

const defineRoute = (
  server: Server,
  handler: (
    server: Server,
    req: Hapi.Request,
    h: Hapi.ResponseToolkit
  ) => Hapi.ResponseObject | Promise<Hapi.ResponseObject>,
  method: string,
  path: string
): Hapi.ServerRoute => {
  const serverHandler: Hapi.Lifecycle.Method = (
    req: Hapi.Request,
    h: Hapi.ResponseToolkit
  ): Hapi.ResponseObject | Promise<Hapi.ResponseObject> =>
    handler(server, req, h)
  return {
    handler: serverHandler,
    method,
    path
  }
}

const configureRoutes = (server: Server): Hapi.ServerRoute[] => {
  return [
    defineRoute(server, handleIndex, 'GET', '/'),
    defineRoute(server, handlePosts, 'GET', '/posts'),
    defineRoute(server, handlePost, 'GET', '/posts/{p*}')
  ]
}

export default configureRoutes
