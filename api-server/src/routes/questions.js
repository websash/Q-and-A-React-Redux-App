import * as m from '../models'
import {API_ROOT} from '../config'
import parse from 'co-body'
import querystring from 'query-string'
import genSlug from 'slug'

export default ({api, auth}) => {

  api.get('/questions', async ctx => {
    let link = ''
    let endpoint = `${API_ROOT}questions`
    let lastPg

    const {answered, page, q} = ctx.query
    const n = +page || 1
    const pageSize = 20

    if (+page < 1) ctx.throw(400)

    const query =
      +answered === 1 ?
        q ?
          {ansCount: {$gt: 0}, title: {$regex: `${q}`, $options: 'i'}} :
          {ansCount: {$gt: 0}} :
      +answered === 0 ?
        q ?
          {ansCount: 0, title: {$regex: `${q}`, $options: 'i'}} :
          {ansCount: 0} :
      q ?
        {title: {$regex: `${q}`, $options: 'i'}} :
        {}

    const count = await m.Question.find(query).count()

    if (!count) {
      ctx.body = {meta: {count}, data: []}
      return
    }

    const curPage =
      n === 1
        ? await m.Question.find(query, {answers: false})
            .sort({createdAt: -1}).limit(pageSize)
        : await m.Question.find(query, {answers: false})
            .sort({createdAt: -1}).skip((n - 1) * pageSize).limit(pageSize)

    lastPg = Math.ceil(count / pageSize)

    if (n > lastPg) ctx.throw(400)

    ctx.body = {meta: {count}, data: curPage}

    if (n >= 2)
      link += `<${endpoint}?${querystring.stringify({q, answered, page: 1})}>; rel="first", `
    if (n > 1)
      link += `<${endpoint}?${querystring.stringify({q, answered, page: n - 1})}>; rel="prev", `
    if (n < lastPg)
      link += `<${endpoint}?${querystring.stringify({q, answered, page: n + 1})}>; rel="next", `
    if (n < lastPg)
      link += `<${endpoint}?${querystring.stringify({q, answered, page: lastPg})}>; rel="last"`

    link && ctx.set('Link', link)
  })

  api.get('/:username/questions', async ctx => {
    const {username} = ctx.params
    const {answered} = ctx.query

    if (+answered === 1)
      ctx.body = await m.Question.find({username, ans_count: {$gt: 0}})
    else if (+answered === 0)
      ctx.body = await m.Question.find({username, ans_count: 0})
    else
      ctx.body = await m.Question.find({username})
  })


  api.post('/questions', auth, async ctx => {
    const body = await parse.json(ctx)
    const {username} = ctx.state.user

    try {
      const slug = genSlug(body.title).toLowerCase()
      if (slug.length === 0)
        ctx.throw(400, 'Something is wrong with your question')

      const q = await m.Question.findOne({slug})
      if (q) ctx.throw(409, 'This question has already been asked')

      const created = await m.Question.create({user: username, ...body, slug})
      const question = await m.Question.findOne({_id: created._id})
      const count = await m.Question.find().count()

      ctx.status = 201
      ctx.body = {
        data: question,
        meta: {count}
      }
      ctx.set('Location', `${API_ROOT}questions/${slug}=${created._id}`)
    } catch (err) {
      ctx.throw(400, err)
    }
  })

  return api
}
