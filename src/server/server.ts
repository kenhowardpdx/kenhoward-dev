import Handlebars from 'handlebars'
import Hapi from '@hapi/hapi'
import Vision from '@hapi/vision'

import context from './context'
import configureRoutes from './routes'

interface server {
  start: () => Promise<void>
  stop: () => Promise<void>
}

interface Logger {
  info: (...args: string[]) => void
}

interface Options {
  postsPath: string
}

export default class Server implements server {
  #logger: Logger
  #server: Hapi.Server
  #routes: Hapi.ServerRoute[]
  #running = false
  #templatesPath: string
  #version: string
  options: Options = {
    postsPath: ''
  }

  constructor (port: number, version: string, templatesPath: string, postsPath: string, logger: Logger) {
    this.#logger = logger
    this.options.postsPath = postsPath
    this.#templatesPath = templatesPath
    this.#version = version
    this.#server = Hapi.server({
      port: port,
      host: '0.0.0.0'
    })
    this.#routes = configureRoutes(this)
  }

  start = async (): Promise<void> => {
    this.#running = true
    this.#logger.info('starting server')
    await this.#server.register(Vision)
    this.#server.route(this.#routes)
    this.#server.views({
      context: { ...context, version: this.#version },
      engines: { html: Handlebars },
      layout: 'default',
      layoutPath: `${this.#templatesPath}/layouts`,
      path: `${this.#templatesPath}`,
      relativeTo: __dirname
    })

    await this.#server.start()
    this.#logger.info('server running on %s', this.#server.info.uri)
  }

  stop = async (): Promise<void> => {
    if (this.#running) {
      this.#running = false
      this.#logger.info('stopping server')
      await this.#server.stop()
    }
  }
}
