import mongoose from 'mongoose'
import bootstrap from './bootstrap'

mongoose.connect('mongodb://localhost:27017/q_and_a')

const db = mongoose.connection

db.once('open', bootstrap).on('error', err => {
  console.error(err)
  process.exit(1)
})

process.on('SIGINT', _ => {
  console.log(' closing...')

  db.close(_ => {
    console.log('done')
    process.exit(0)
  })
})
