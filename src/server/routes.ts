import Hapi from '@hapi/hapi'

import handleIndex from './handle_index'

const routes: Hapi.ServerRoute[] = [
  {
    handler: handleIndex,
    method: 'GET',
    path: '/'
  }
]

export default routes
