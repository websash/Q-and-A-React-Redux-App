// Fork of https://github.com/koajs/ratelimit

import Limiter from 'ratelimiter'
import ms from 'ms'
import thenify from 'thenify'

/**
 * Initialize ratelimit middleware with the given `opts`:
 *
 * - `duration` limit duration in milliseconds [1 hour]
 * - `max` max requests per `id` [2500]
 * - `db` database connection
 * - `id` id to compare requests [ip]
 * - `headers` custom header names
 *  - `remaining` remaining number of requests ['X-RateLimit-Remaining']
 *  - `reset` reset timestamp ['X-RateLimit-Reset']
 *  - `total` total number of requests ['X-RateLimit-Limit']
 *
 * @param {Object} opts
 * @return {Function}
 * @api public
 */

export default function ratelimit(opts = {}) {
  opts.headers = opts.headers || {}
  opts.headers.remaining = opts.headers.remaining || 'X-RateLimit-Remaining'
  opts.headers.reset = opts.headers.reset || 'X-RateLimit-Reset'
  opts.headers.total = opts.headers.total || 'X-RateLimit-Limit'

  return async function (ctx, next) {
    const id = opts.id ? opts.id(ctx) : ctx.ip

    if (id === false) return next()

    // initialize limiter
    const limiter = new Limiter({id, __proto__: opts})
    limiter.get = thenify(limiter.get)

    // check limit
    const limit = await limiter.get()

    // check if current call is legit
    const remaining = limit.remaining > 0 ? limit.remaining - 1 : 0

    // header fields
    const headers = {
      [opts.headers.remaining]: remaining,
      [opts.headers.reset]: limit.reset,
      [opts.headers.total]: limit.total
    }

    ctx.set(headers)

    if (limit.remaining) return next()

    const delta = (limit.reset * 1000) - Date.now() | 0
    const after = limit.reset - (Date.now() / 1000) | 0
    ctx.set('Retry-After', after)

    ctx.status = 429
    ctx.body = {
      message: 'Rate limit exceeded, retry in ' + ms(delta, {long: true})
    }

    if (opts.throw) ctx.throw(ctx.status, ctx.body, {headers})
  }
}
