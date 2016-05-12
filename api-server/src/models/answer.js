import mongoose, {Schema} from 'mongoose'
import dateformat from 'dateformat'
import shortid from 'shortid'

export const AnswerSchema = new Schema({
  _id: {type: String, 'default': shortid.generate},
  user: {type: String, ref: 'User'},
  answer: {type: String, required: true}
}, {
  timestamps: true,
  toObject: {virtuals: true, getters: true},
  toJSON: {
    virtuals: true, getters: true,
    transform: function (doc, ret) {
      ret.id = ret._id
      delete ret._id
      delete ret.__v
      delete ret.updatedAt
    }
  }
})

const populateUser = function (next) {
  this.populate('user')
  next()
}

AnswerSchema.pre('findOne', populateUser)
            .pre('find', populateUser)

AnswerSchema.virtual('created').get(function () {
  return `${dateformat(this.createdAt, 'mmm d \'yy')}` +
         ' at ' + `${dateformat(this.createdAt, 'HH:MM')}`
})

export default mongoose.model('Answer', AnswerSchema)
