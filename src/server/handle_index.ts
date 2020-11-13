import Hapi from '@hapi/hapi'

const template = 'index'
const handleIndex: Hapi.Lifecycle.Method = (request: Hapi.Request, h: Hapi.ResponseToolkit): Hapi.ResponseObject => {
  const title = 'Home'
  return h.view(template, { title })
}

export default handleIndex
