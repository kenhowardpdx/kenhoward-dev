import Handlebars from 'handlebars'
import Hapi from '@hapi/hapi'
import Inert from '@hapi/inert'
import Vision from '@hapi/vision'

import context from './context'
import { configureRoutes, configureStaticRoutes } from './routes'

interface server {
  start: () => Promise<void>
  stop: () => Promise<void>
}

interface Logger {
  info: (...args: string[]) => void
}

interface Options {
  cssPath: string
  dataPath: string
  templatesPath: string
}

export default class Server implements server {
  #logger: Logger
  #server: Hapi.Server
  #routes: Hapi.ServerRoute[]
  #running = false
  version: string
  options: Options = {
    cssPath: '',
    dataPath: '',
    templatesPath: ''
  }

  constructor(
    port: number,
    version: string,
    cssPath: string,
    dataPath: string,
    templatesPath: string,
    logger: Logger
  ) {
    this.#logger = logger
    this.options.cssPath = cssPath
    this.options.dataPath = dataPath
    this.options.templatesPath = templatesPath
    this.version = version
    this.#server = Hapi.server({
      port: port,
      host: '0.0.0.0'
    })
    this.#routes = [...configureStaticRoutes(this), ...configureRoutes(this)]
  }

  start = async (): Promise<void> => {
    this.#running = true
    this.#logger.info('starting server')
    await this.#server.register(Vision)
    await this.#server.register(Inert)
    this.#server.route(this.#routes)
    this.#server.views({
      context: { ...context, version: this.version },
      engines: { html: Handlebars },
      layout: 'default',
      layoutPath: `${this.options.templatesPath}/layouts`,
      partialsPath: `${this.options.templatesPath}/partials`,
      path: `${this.options.templatesPath}`,
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
