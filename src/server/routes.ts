import Hapi from '@hapi/hapi'

import Server from './server'
import handleHealth from './handle_health'
import handleIndex from './handle_index'
import handlePages from './handle_pages'
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
    defineRoute(server, handlePages, 'GET', '/{page}'),
    defineRoute(server, handlePosts, 'GET', '/posts'),
    defineRoute(server, handlePosts, 'GET', '/posts/{date*}'),
    defineRoute(server, handlePost, 'GET', '/posts/{date*3}/{post}'),
    defineRoute(server, handleHealth, 'GET', '/health')
  ]
}

export default configureRoutes
