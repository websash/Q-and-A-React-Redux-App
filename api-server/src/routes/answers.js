import * as m from '../models'
import parse from 'co-body'

const idRe = /=([A-Za-z0-9-_]{7,})(\?.*)?$/

export default ({api, auth}) => {

  api.get('/questions/:slugId', async ctx => {
    let _id
    const {slugId} = ctx.params

    try {
      _id = slugId.match(idRe)[1]
    } catch (err) {
      ctx.throw(404, 'Not Found')
    }
    const question = await m.Question.findOne({_id}).populate('answers')

    if (!question) ctx.throw(404, 'Not Found')

    ctx.body = {
      data: question
    }
  })

  api.get('/answers/:id', async ctx => {
    ctx.body = {
      data: await m.Answer.find({_id: ctx.params.id})
    }
  })

  api.post('/questions/:slugId', auth, async ctx => {
    const {slugId} = ctx.params
    const {username} = ctx.state.user
    const body = await parse.json(ctx)

    let _id

    try {
      _id = slugId.match(idRe)[1]
    } catch (err) {
      console.error('slugId validation failed', err)
      ctx.throw(400, 'URL validation failed')
    }

    try {
      const answer = await m.Answer.create({user: username, answer: body.answer})
      const question = await m.Question.findOne({_id}).exec()

      question.answers.push(answer)
      question.ansCount += 1

      await question.save()

      ctx.status = 201
      ctx.body = {
        data: answer
      }
      ctx.set('Location', `http://localhost:4000/answers/${answer._id}`)
    } catch (err) {
      ctx.throw(400, err)
    }
  })

  return api
}
