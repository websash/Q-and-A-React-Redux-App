import * as m from '../models'
import parse from 'co-body'
import jwt from 'koa-jwt'
import {JWT_KEY} from '../config'

export default ({api}) => {

  api.post('/auth', async ctx => {
    const body = await parse.json(ctx)
    try {
      if (!body.username) throw new Error('Username is required')
      if (!body.password) throw new Error('Password is required')

      const user = await m.User.findOne({_id: body.username})
      if (!user) ctx.throw(401, 'Wrong username or password. Login failed')

      const isValidPw = await user.checkPassword(body.password)
      if (!isValidPw) ctx.throw(401, 'Wrong username or password. Login failed')

      const usertoken = jwt.sign(
        {username: body.username, role: 'user'}, JWT_KEY, {expiresIn: '1h'}
      )

      ctx.status = 200
      ctx.body = {
        usertoken, username: body.username, exp: jwt.decode(usertoken).exp
      }
    } catch (err) {
      ctx.throw(400, err)
    }
  })

  return api
}
