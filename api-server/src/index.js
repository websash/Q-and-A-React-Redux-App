import mongoose from 'mongoose'
import bootstrap from './bootstrap'
import {MONGO_HOST} from './config'

mongoose.connect(`mongodb://${MONGO_HOST}:27017/q_and_a`)

const db = mongoose.connection

db.once('open', bootstrap).on('error', err => {
  console.error(err)
  process.exit(1)
})

const shutDown = () => {
  console.log('...shutting down')
  db.close(_ => {
    console.log('done')
    process.exit(0)
  })
}

process.on('SIGINT', shutDown)
process.on('SIGTERM', shutDown)
