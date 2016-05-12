import mongoose from 'mongoose'
import bcrypt from 'bcrypt-then'

export const UserSchema = new mongoose.Schema({
  _id: {type: String},
  password: {type: String, required: true},
  name: {type: String},
  avatar: {type: String, match: /^https?:\/\//i}
}, {
  timestamps: true,
  toObject: {virtuals: true, getters: true},
  toJSON: {
    virtuals: true, getters: true,
    transform: function (doc, ret) {
      ret.id = ret._id
      delete ret._id
      delete ret.__v
      delete ret.password
      delete ret.createdAt
      delete ret.updatedAt
    }
  }
})

UserSchema.pre('save', function (next) {
  const user = this

  // only hash the password if it has been modified (or is new)
  if (!user.isModified('password')) return next()

  bcrypt.hash(user.password, 10).then(hash => {
    user.password = hash
    next()
  })
  .catch(err => next(err))
})

UserSchema.methods.checkPassword = function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password)
}

export default mongoose.model('User', UserSchema)
