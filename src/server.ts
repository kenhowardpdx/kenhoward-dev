import Hapi from '@hapi/hapi'

const init = async (): Promise<void> => {
  const server = Hapi.server({
    port: 8080,
    host: '0.0.0.0'
  })

  server.route({
    method: 'GET',
    path: '/',
    handler: (request, h) => 'Hello World! (w/ TypeScript)'
  })

  await server.start()
  console.log('Server running on %s', server.info.uri)
}

process.on('unhandledRejection', (err) => {
  console.log(err)
  process.exit(1)
})

// eslint-disable-next-line @typescript-eslint/no-floating-promises
init()
