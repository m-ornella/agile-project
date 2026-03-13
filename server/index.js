import http from 'node:http'
import { config } from './config.js'
import { requestListener } from './http.js'

const server = http.createServer(requestListener)

server.listen(config.port, () => {
  console.log(`Server listening on http://localhost:${config.port}`)
})
