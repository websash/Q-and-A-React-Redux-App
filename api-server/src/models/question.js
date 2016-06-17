import mongoose from 'mongoose'
import dateformat from 'dateformat'
import shortid from 'shortid'

const QuestionSchema = new mongoose.Schema({
  _id: {type: String, 'default': shortid.generate},
  user: {type: String, ref: 'User'},
  title: {type: String, index: true},
  text: {type: String},
  slug: {type: String, index: true, unique: true, lowercase: true, trim: true},
  answers: [{
    type: String, ref: 'Answer'
  }],
  ansCount: {type: Number, default: 0}
}, {
  timestamps: true,
  toObject: {virtuals: true, getters: true},
  toJSON: {
    virtuals: true, getters: true,
    transform: function (doc, ret) {
      ret.id = ret._id
      delete ret._id
      delete ret.__v
      delete ret.slug
    }
  }
})

const populateUser = function (next) {
  this.populate('user')
  next()
}

QuestionSchema.pre('findOne', populateUser)
              .pre('find', populateUser)

QuestionSchema.virtual('created').get(function () {
  return `${dateformat(this.createdAt, 'mmm d \'yy')}` +
         ' at ' + `${dateformat(this.createdAt, 'HH:MM')}`
})

QuestionSchema.virtual('link').get(function () {
  return `/questions/${this.slug}=${this._id}`
})

export default mongoose.model('Question', QuestionSchema)
