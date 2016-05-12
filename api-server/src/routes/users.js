import * as m from '../models'
import parse from 'co-body'

export default ({api}) => {

  api.get('/users', async (ctx, next) => {
    ctx.body = await m.User.find()
  })

  api.get('/users/:username', async (ctx, next) => {
    const {username} = ctx.params
    ctx.body = {
      data: await m.User.findOne({_id: username})
    }
  })

  api.post('/users', async (ctx, next) => {
    const body = await parse.json(ctx)
    try {
      const created = await m.User.create(body)
      ctx.status = 201
      ctx.body = {
        message: 'Resource Created',
        id: created._id
      }
    } catch (err) {
      ctx.throw(400, err)
    }
  })

  return api
}
