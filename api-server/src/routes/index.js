import compose from 'koa-compose'
import users from './users'
import questions from './questions'
import answers from './answers'
import auth from './auth'

const routes = conf => compose([
  users(conf).routes(),
  questions(conf).routes(),
  answers(conf).routes(),
  auth(conf).routes()
])

export default routes
