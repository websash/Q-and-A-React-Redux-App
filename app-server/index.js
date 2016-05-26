require('babel-register')
require('./app-server.js')

const shutDown = () => {
  console.log('...shutting down')
  process.exit(0)
}

process.on('SIGINT', shutDown)
process.on('SIGTERM', shutDown)
