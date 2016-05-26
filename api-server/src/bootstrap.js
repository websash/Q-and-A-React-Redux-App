import Koa from 'koa'
import Router from 'koa-router'
import {HOSTNAME, PORT, JWT_KEY} from './config'
import routes from './routes'
import cors from 'kcors'
import jwt from 'koa-jwt'
const convert = require('koa-convert')

const app = new Koa()
const api = new Router()
const auth = convert(jwt({secret: JWT_KEY}))

app.use(async function logger(ctx, next) {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

app.use(async function errorHandler(ctx, next) {
  try {
    await next()
  } catch (err) {
    ctx.status = err.status || 500
    ctx.body = {message: err.message, errors: err.errors}
    ctx.app.emit('error', err, ctx)
  }
})

app.use(cors({
  exposeHeaders: ['Link', 'Location']
}))

app.use(
  routes({api, auth})
)

app.use(api.allowedMethods())

export default () =>
  app.listen(PORT, () =>
    console.info(`👀  Q&A API server running at ${HOSTNAME}:${PORT}`))
